#!/usr/bin/env tsx
/**
 * 发布脚本
 *
 * 此脚本自动化创建和发布当前包版本的过程。
 *
 * 使用方法：
 *   pnpm tsx scripts/release.ts [version-type] [--alpha] [--no-git]
 *
 * version-type: 'major', 'minor', 'patch' 或特定版本（默认: 'patch'）
 * --alpha: 创建alpha版本
 * --no-git: 跳过git提交和标签
 */

// 导入Node.js子进程模块，用于执行命令
import { execSync } from 'node:child_process'
// 导入Node.js文件系统模块
import fs from 'node:fs'
// 导入Node.js路径模块
import path from 'node:path'

// 解析命令行参数
const args = process.argv.slice(2)
// 获取版本类型参数，默认为'patch'
const versionBumpArg = args.find(arg => !arg.startsWith('--')) || 'patch'
// 检查是否为alpha版本
const isAlpha = args.includes('--alpha')
// 检查是否跳过git操作
const skipGit = args.includes('--no-git')

// 获取项目根路径
const rootPath = path.resolve('.')

/**
 * 执行命令行指令
 * @param command 要执行的命令
 * @param cwd 工作目录
 */
function run(command: string, cwd: string) {
  console.log(`执行命令: ${command} 在目录 ${cwd}`)
  execSync(command, { stdio: 'inherit', cwd })
}

/**
 * 更新package.json中的版本号
 * @param pkgPath 包目录路径（项目根目录）
 * @param type 版本更新类型: 'major', 'minor', 'patch' 或特定版本
 * @param isAlpha 是否创建alpha版本
 * @returns 新版本号
 */
function bumpVersion(pkgPath: string, type: 'major' | 'minor' | 'patch' | string, isAlpha: boolean = false): string {
  // 构建package.json文件路径
  const pkgJsonPath = path.join(pkgPath, 'package.json')
  // 读取并解析package.json文件
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
  // 获取当前版本号
  const currentVersion = pkgJson.version
  let newVersion: string

  // 解析当前版本，检查是否已经是alpha版本
  const versionRegex = /^(\d+\.\d+\.\d+)(?:-alpha\.(\d+))?$/
  const match = currentVersion.match(versionRegex)

  if (!match) {
    throw new Error(`无效的版本格式: ${currentVersion}`)
  }

  let baseVersion = match[1]
  // 获取当前alpha版本号，如果不是alpha版本则为-1
  const currentAlphaVersion = match[2] ? Number.parseInt(match[2], 10) : -1

  // 处理版本更新
  if (type === 'major' || type === 'minor' || type === 'patch') {
    const [major, minor, patch] = baseVersion.split('.').map(Number)

    // 根据类型更新版本号
    if (type === 'major') {
      baseVersion = `${major + 1}.0.0`
    }
    else if (type === 'minor') {
      baseVersion = `${major}.${minor + 1}.0`
    }
    else { // patch
      baseVersion = `${major}.${minor}.${patch + 1}`
    }
  }
  else if (type.match(/^\d+\.\d+\.\d+$/)) {
    // 直接使用提供的版本字符串作为基础版本
    baseVersion = type
  }
  else {
    throw new Error(`无效的版本更新类型: ${type}。请使用 'major', 'minor', 'patch' 或特定版本如 '1.2.3'。`)
  }

  // 创建最终版本字符串
  if (isAlpha) {
    // 对于alpha版本，当基础版本更改时总是从alpha.0开始
    // 如果基础版本相同，则增加alpha版本号
    const alphaVersion = baseVersion === match[1] ? currentAlphaVersion + 1 : 0
    if (alphaVersion < 0) {
      throw new Error(`无法从非alpha版本 ${currentVersion} 创建alpha版本，除非更新基础版本（major, minor, patch 或特定版本）。`)
    }
    newVersion = `${baseVersion}-alpha.${alphaVersion}`
  }
  else {
    // 如果从alpha版本更新到稳定版本，使用当前或更新后的基础版本
    newVersion = baseVersion
  }

  // 更新package.json
  pkgJson.version = newVersion
  fs.writeFileSync(pkgJsonPath, `${JSON.stringify(pkgJson, null, 2)}\n`)

  console.log(`已将版本从 ${currentVersion} 更新到 ${newVersion} 在文件 ${pkgJsonPath}`)
  return newVersion
}

/**
 * 为发布创建git提交和标签
 * @param version 要标记的版本
 * @param isAlpha 是否为alpha版本
 */
function createGitCommitAndTag(version: string, isAlpha: boolean = false) {
  console.log('创建git提交和标签...')

  try {
    // 暂存package.json和其他更改
    run('git add package.json', rootPath) // 专门添加package.json
    // 可选：如果需要，添加其他特定文件，或者如果应包含所有更改，则使用 'git add .'

    // 创建带有版本消息的提交
    const commitMsg = isAlpha
      ? `chore: alpha release v${version}`
      : `chore: release v${version}`
    run(`git commit -m "${commitMsg}"`, rootPath)

    // 创建标签
    const tagMsg = isAlpha
      ? `Alpha Release v${version}`
      : `Release v${version}`
    run(`git tag -a v${version} -m "${tagMsg}"`, rootPath)

    // 将提交和标签推送到远程仓库
    console.log('推送提交和标签到远程仓库...')
    run('git push', rootPath)
    run('git push --tags', rootPath)

    console.log(`成功创建并推送git标签 v${version}`)
  }
  catch (error) {
    console.error('创建git提交和标签失败:', error)
    // 决定即使git失败是否继续发布
    // 目前，让我们抛出错误以停止进程
    throw error
  }
}

/**
 * 发布包的主函数
 */
async function publishPackage() {
  console.log(`🚀 开始${isAlpha ? 'alpha' : ''}发布流程...`)
  console.log(`📝 版本更新: ${versionBumpArg}`)

  // 首先构建包（假设package.json中存在构建脚本）
  console.log('🔨 构建包...')
  run('pnpm build', rootPath) // 使用package.json中的构建脚本

  // 更新根目录package.json中的版本号
  const newVersion = bumpVersion(rootPath, versionBumpArg, isAlpha)

  // 如果未跳过，则创建git提交和标签
  if (!skipGit) {
    createGitCommitAndTag(newVersion, isAlpha)
  }

  // 将包发布到npm
  console.log(`📤 正在发布 package@${newVersion} 到 npm...`)

  const publishCmd = isAlpha
    ? 'pnpm publish --tag alpha --no-git-checks --access public'
    : 'pnpm publish --no-git-checks --access public' // 如果git标记是手动的或单独的，通常需要--no-git-checks

  run(publishCmd, rootPath)

  console.log(`✅ 成功完成${isAlpha ? 'alpha' : ''}发布 v${newVersion}!`)
}

// 运行发布流程
publishPackage().catch((error) => {
  console.error('❌ 发布过程中出错:', error)
  process.exit(1)
})

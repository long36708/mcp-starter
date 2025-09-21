// 导入MCP工具上下文和工具类型
import type { McpToolContext, Tools } from './types'
// 导入Node.js文件系统模块
import fs from 'node:fs'
// 导入Node.js路径模块
import path from 'node:path'

/**
 * package.json文件接口
 * 定义package.json文件的基本结构
 */
interface PackageJson {
  name?: string     // 包名（可选）
  version: string   // 版本号（必需）
  [key: string]: any // 其他任意属性
}

/**
 * 获取并解析package.json文件
 * @returns 解析后的package.json对象，如果出错则返回null
 */
export function getPackageJson(): PackageJson | null {
  try {
    // 构建package.json文件的完整路径
    const packageJsonPath = path.resolve(process.cwd(), 'package.json')
    // 检查文件是否存在
    if (!fs.existsSync(packageJsonPath)) {
      console.error('错误：在以下路径未找到package.json文件', packageJsonPath)
      return null
    }
    // 读取文件内容
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8')
    // 解析JSON内容
    const packageJson: PackageJson = JSON.parse(packageJsonContent)

    // 检查是否包含必需的version字段
    if (!packageJson.version) {
      console.error('错误：package.json文件缺少必需的\'version\'字段。')
      return null
    }

    return packageJson
  }
  catch (error) {
    // 捕获并输出读取或解析过程中的错误
    console.error('读取或解析package.json文件时出错:', error)
    return null // 出错时返回null
  }
}

/**
 * 注册多个工具到MCP服务器
 * @param context MCP工具上下文，包含服务器实例
 * @param tools 要注册的工具函数数组
 */
export function registerTools(context: McpToolContext, tools: Tools[]): void {
  // 遍历所有工具函数并调用它们进行注册
  tools.forEach(register => register(context))
}

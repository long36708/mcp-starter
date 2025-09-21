#!/usr/bin/env node
// 导入类型定义
import type { McpToolContext } from './types'
// 导入命令行工具相关函数
import { runMain as _runMain, defineCommand } from 'citty'
// 导入版本信息
// @ts-ignore
import { version } from '../package.json'
// 导入服务器相关函数
import { createServer, startServer, stopServer } from './server'
// 导入自定义工具注册函数
import { registerMyTool } from './tools/mytool'

// 定义命令行接口
const cli = defineCommand({
  // 元数据信息
  meta: {
    name: 'mcp-longmo',
    version,
    description: 'Run the MCP starter with stdio, http, or sse transport',
  },
  // 命令行参数定义
  args: {
    http: { type: 'boolean', description: '使用HTTP传输协议运行' },
    sse: { type: 'boolean', description: '使用SSE传输协议运行' },
    stdio: { type: 'boolean', description: '使用stdio传输协议运行（默认）' },
    port: { type: 'string', description: 'HTTP/SSE端口号（默认3000）', default: '3000' },
    endpoint: { type: 'string', description: 'HTTP端点路径（默认/mcp）', default: '/mcp' },
  },
  // 命令执行逻辑
  async run({ args }) {
    // 根据参数确定运行模式，默认为stdio
    const mode = args.http ? 'http' : args.sse ? 'sse' : 'stdio'
    // 创建MCP服务器实例
    const mcp = createServer({ name: 'my-mcp-server', version })

    // 监听进程终止信号，优雅关闭服务器
    process.on('SIGTERM', () => stopServer(mcp))
    process.on('SIGINT', () => stopServer(mcp))

    // 注册自定义工具
    registerMyTool({ mcp } as McpToolContext)

    // 根据不同模式启动服务器
    if (mode === 'http') {
      // HTTP模式
      await startServer(mcp, { type: 'http', port: Number(args.port), endpoint: args.endpoint })
    }
    else if (mode === 'sse') {
      // SSE模式
      console.log('Starting SSE server...')
      await startServer(mcp, { type: 'sse', port: Number(args.port) })
    }
    else if (mode === 'stdio') {
      // stdio模式
      await startServer(mcp, { type: 'stdio' })
    }
  },
})

// 导出主函数
export const runMain = () => _runMain(cli)

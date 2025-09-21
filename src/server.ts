// 导入MCP服务器类型
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
// 导入Node.js HTTP服务器创建函数
import { createServer as createNodeServer } from 'node:http'
// 导入REST服务器传输层
import { RestServerTransport } from '@chatmcp/sdk/server/rest.js'
// 导入MCP服务器实现
import { McpServer as Server } from '@modelcontextprotocol/sdk/server/mcp.js'
// 导入SSE服务器传输层
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
// 导入stdio服务器传输层
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
// 导入h3框架相关函数
import { createApp, createRouter, defineEventHandler, getQuery, setResponseStatus, toNodeListener } from 'h3'

/** 创建基础的MCP服务器实例 */
export function createServer(options: { name: string, version: string }): McpServer {
  const { name, version } = options
  return new Server({ name, version })
}

// 定义stdio传输选项接口
interface StdioOptions { type: 'stdio' }
// 定义HTTP传输选项接口
interface HttpOptions { type: 'http', port?: number, endpoint?: string }
// 定义SSE传输选项接口
interface SseOptions { type: 'sse', port?: number }

// 定义启动选项类型，可以是以上三种传输方式之一
export type StartOptions = StdioOptions | HttpOptions | SseOptions

/**
 * 使用选定的传输协议启动给定的MCP服务器。
 * 当没有提供选项时，默认使用stdio传输方式。
 */
export async function startServer(
  server: McpServer,
  options: StartOptions = { type: 'stdio' },
): Promise<void> {
  // 处理stdio传输模式
  if (options.type === 'stdio') {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    return
  }

  // 处理HTTP传输模式
  if (options.type === 'http') {
    const port = options.port ?? 3000
    const endpoint = options.endpoint ?? '/mcp'
    const transport = new RestServerTransport({ port, endpoint })
    await server.connect(transport)
    await transport.startServer()
    console.log(`HTTP服务器监听中 → http://localhost:${port}${endpoint}`)
    return
  }

  // 处理SSE传输模式
  const port = options.port ?? 3000
  // 存储所有活跃的SSE传输连接
  const transports = new Map<string, SSEServerTransport>()

  // 创建h3应用和路由器
  const app = createApp()
  const router = createRouter()

  // SSE端点：建立SSE连接
  router.get('/sse', defineEventHandler(async (event) => {
    const res = event.node.res
    // 创建新的SSE传输实例
    const transport = new SSEServerTransport('/messages', res)
    // 存储传输实例，使用sessionId作为键
    transports.set(transport.sessionId, transport)
    // 当连接关闭时，从映射中删除传输实例
    res.on('close', () => transports.delete(transport.sessionId))
    await server.connect(transport)
  }))

  // 消息端点：处理客户端发送的消息
  router.post('/messages', defineEventHandler(async (event) => {
    // 从查询参数中获取sessionId
    const { sessionId } = getQuery(event) as { sessionId?: string }
    // 根据sessionId查找对应的传输实例
    const transport = sessionId ? transports.get(sessionId) : undefined
    if (transport) {
      // 如果找到传输实例，处理消息
      await transport.handlePostMessage(event.node.req, event.node.res)
    }
    else {
      // 如果未找到传输实例，返回400错误
      setResponseStatus(event, 400)
      return '未找到对应sessionId的传输实例'
    }
  }))

  // 将路由器添加到应用
  app.use(router)

  // 使用h3的Node适配器启动Node服务器
  const nodeServer = createNodeServer(toNodeListener(app))
  nodeServer.listen(port)
  console.log(`SSE服务器监听中 → http://localhost:${port}/sse`)
}

/**
 * 停止MCP服务器
 * @param server 要停止的MCP服务器实例
 */
export async function stopServer(server: McpServer) {
  try {
    // 尝试关闭服务器连接
    await server.close()
  }
  catch (error) {
    // 捕获并输出停止过程中的错误
    console.error('停止服务器时发生错误:', error)
  }
  finally {
    // 无论是否出错，都退出进程
    process.exit(0)
  }
}

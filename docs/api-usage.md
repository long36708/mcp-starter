# API 使用详情

## @modelcontextprotocol/sdk API 使用

### McpServer 类
**位置**: [`src/server.ts:10-13`](src/server.ts:10-13)
```typescript
export function createServer(options: { name: string, version: string }): McpServer {
  const { name, version } = options
  return new Server({ name, version })
}
```

### 传输连接
**位置**: [`src/server.ts:29-32`](src/server.ts:29-32)
```typescript
// Stdio 传输
const transport = new StdioServerTransport()
await server.connect(transport)

// HTTP 传输  
const transport = new RestServerTransport({ port, endpoint })
await server.connect(transport)

// SSE 传输
const transport = new SSEServerTransport('/messages', res)
await server.connect(transport)
```

### 服务器关闭
**位置**: [`src/server.ts:83-93`](src/server.ts:83-93)
```typescript
export async function stopServer(server: McpServer) {
  try {
    await server.close()
  } catch (error) {
    console.error('Error occurred during server stop:', error)
  } finally {
    process.exit(0)
  }
}
```

## @chatmcp/sdk API 使用

### REST 传输
**位置**: [`src/server.ts:35-43`](src/server.ts:35-43)
```typescript
if (options.type === 'http') {
  const port = options.port ?? 3000
  const endpoint = options.endpoint ?? '/mcp'
  const transport = new RestServerTransport({ port, endpoint })
  await server.connect(transport)
  await transport.startServer()
  console.log(`HTTP server listening → http://localhost:${port}${endpoint}`)
}
```

## h3 API 使用

### 应用和路由创建
**位置**: [`src/server.ts:49-51`](src/server.ts:49-51)
```typescript
// 创建 h3 应用和路由
const app = createApp()
const router = createRouter()
```

### 事件处理器定义
**位置**: [`src/server.ts:54-60`](src/server.ts:54-60)
```typescript
// SSE 端点
router.get('/sse', defineEventHandler(async (event) => {
  const res = event.node.res
  const transport = new SSEServerTransport('/messages', res)
  transports.set(transport.sessionId, transport)
  res.on('close', () => transports.delete(transport.sessionId))
  await server.connect(transport)
}))
```

### 消息处理端点
**位置**: [`src/server.ts:63-73`](src/server.ts:63-73)
```typescript
// 消息端点
router.post('/messages', defineEventHandler(async (event) => {
  const { sessionId } = getQuery(event) as { sessionId?: string }
  const transport = sessionId ? transports.get(sessionId) : undefined
  if (transport) {
    await transport.handlePostMessage(event.node.req, event.node.res)
  } else {
    setResponseStatus(event, 400)
    return 'No transport found for sessionId'
  }
}))
```

### 应用配置
**位置**: [`src/server.ts:75-81`](src/server.ts:75-81)
```typescript
app.use(router)

// 使用 h3 的 Node 适配器启动 Node 服务器
const nodeServer = createNodeServer(toNodeListener(app))
nodeServer.listen(port)
console.log(`SSE server listening → http://localhost:${port}/sse`)
```

## citty API 使用

### CLI 命令定义
**位置**: [`src/index.ts:8-21`](src/index.ts:8-21)
```typescript
const cli = defineCommand({
  meta: {
    name: 'mcp-longmo',
    version,
    description: 'Run the MCP starter with stdio, http, or sse transport',
  },
  args: {
    http: { type: 'boolean', description: 'Run with HTTP transport' },
    sse: { type: 'boolean', description: 'Run with SSE transport' },
    stdio: { type: 'boolean', description: 'Run with stdio transport (default)' },
    port: { type: 'string', description: 'Port for http/sse (default 3000)', default: '3000' },
    endpoint: { type: 'string', description: 'HTTP endpoint (default /mcp)', default: '/mcp' },
  },
  // ... run 方法
})
```

### 命令执行
**位置**: [`src/index.ts:21-40`](src/index.ts:21-40)
```typescript
async run({ args }) {
  const mode = args.http ? 'http' : args.sse ? 'sse' : 'stdio'
  const mcp = createServer({ name: 'my-mcp-server', version })
  
  // 信号处理
  process.on('SIGTERM', () => stopServer(mcp))
  process.on('SIGINT', () => stopServer(mcp))
  
  // 工具注册
  registerMyTool({ mcp } as McpToolContext)
  
  // 模式选择
  if (mode === 'http') {
    await startServer(mcp, { type: 'http', port: Number(args.port), endpoint: args.endpoint })
  } else if (mode === 'sse') {
    console.log('Starting SSE server...')
    await startServer(mcp, { type: 'sse', port: Number(args.port) })
  } else if (mode === 'stdio') {
    await startServer(mcp, { type: 'stdio' })
  }
}
```

## zod API 使用

### 参数验证模式
**位置**: [`src/tools/mytool.ts:12-14`](src/tools/mytool.ts:12-14)
```typescript
mcp.tool(
  'doSomething',
  'What is the capital of Austria?',
  {
    param1: z.string().describe('The name of the track to search for'),
    param2: z.string().describe('The name of the track to search for'),
  },
  // ... 处理函数
)
```

## dotenv API 使用

### 环境变量加载
**位置**: [`src/tools/mytool.ts:2,5`](src/tools/mytool.ts:2,5)
```typescript
import * as dotenv from 'dotenv'
dotenv.config()
```

## Node.js 内置模块使用

### HTTP 服务器
**位置**: [`src/server.ts:2,78`](src/server.ts:2,78)
```typescript
import { createServer as createNodeServer } from 'node:http'
const nodeServer = createNodeServer(toNodeListener(app))
```

### 文件系统操作
**位置**: [`src/utils.ts:2-3,11-32`](src/utils.ts:2-3,11-32)
```typescript
import fs from 'node:fs'
import path from 'node:path'

export function getPackageJson(): PackageJson | null {
  try {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json')
    if (!fs.existsSync(packageJsonPath)) {
      console.error('Error: package.json not found at', packageJsonPath)
      return null
    }
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8')
    const packageJson: PackageJson = JSON.parse(packageJsonContent)
    // ...
  } catch (error) {
    console.error('Error reading or parsing package.json:', error)
    return null
  }
}
```

## 工具注册模式

### 工具注册函数
**位置**: [`src/tools/mytool.ts:7-21`](src/tools/mytool.ts:7-21)
```typescript
export function registerMyTool({ mcp }: McpToolContext): void {
  mcp.tool(
    'doSomething', // 工具名称
    'What is the capital of Austria?', // 工具描述
    { // 参数模式
      param1: z.string().describe('The name of the track to search for'),
      param2: z.string().describe('The name of the track to search for'),
    },
    async ({ param1, param2 }) => { // 处理函数
      return {
        content: [{ type: 'text', text: `Hello ${param1} and ${param2}` }],
      }
    },
  )
}
```

### 工具注册调用
**位置**: [`src/index.ts:28`](src/index.ts:28)
```typescript
registerMyTool({ mcp } as McpToolContext)
```

## 类型定义

### MCP 工具上下文
**位置**: [`src/types.ts:3-5`](src/types.ts:3-5)
```typescript
export interface McpToolContext {
  mcp: McpServer
}
```

### 工具函数类型
**位置**: [`src/types.ts:13`](src/types.ts:13)
```typescript
export type Tools = (context: McpToolContext) => void
```

这个文档详细展示了项目中每个依赖库的API使用方式和具体实现位置。
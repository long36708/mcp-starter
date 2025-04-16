import type { McpToolContext } from './types'
import { version } from '../package.json'
import { createServer, startServer, stopServer } from './server'
import { registerMyTool } from './tools/mytool'

(async function main() {
  const mcp = createServer({
    name: 'my-mcp-server',
    version: version || '0.0.1',
  })

  process.on('SIGTERM', () => stopServer(mcp))
  process.on('SIGINT', () => stopServer(mcp))

  registerMyTool({ mcp } as McpToolContext)

  await startServer(mcp)
})()

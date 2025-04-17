#!/usr/bin/env node
import { defineCommand } from 'citty'
import { version } from '../package.json'
import { createServer, startServer } from './server'
import { registerMyTool } from './tools/mytool'

const cli = defineCommand({
  meta: {
    name: 'mcp-instruct',
    version,
    description: 'Run the MCP starter with stdio, http, or sse transport',
  },
  args: {
    http: { type: 'boolean', description: 'Run with HTTP transport' },
    sse: { type: 'boolean', description: 'Run with SSE transport' },
    stdio: { type: 'boolean', description: 'Run with stdio transport (default)' },
    port: { type: 'number', description: 'Port for http/sse (default 3000)', default: 3000 },
    endpoint: { type: 'string', description: 'HTTP endpoint (default /mcp)', default: '/mcp' },
  },
  async run({ args }) {
    // decide transport
    const mode = args.http ? 'http' : args.sse ? 'sse' : 'stdio'
    const mcp = createServer({ name: 'my-mcp-server', version })
    registerMyTool({ mcp } as any)

    if (mode === 'http')
      await startServer(mcp, { type: 'http', port: args.port, endpoint: args.endpoint })
    else if (mode === 'sse')
      await startServer(mcp, { type: 'sse', port: args.port })
    else
      await startServer(mcp, { type: 'stdio' })
  },
})

cli.run()

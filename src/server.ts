import type { McpServerOptions } from './types'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

export function createServer(options: McpServerOptions): McpServer {
  const { name, version } = options

  console.log('Creating server', name, version)

  const server = new McpServer(
    {
      name,
      version,
    },
  )

  return server
}

export async function startServer(
  server: McpServer,
): Promise<void> {
  const transport = new StdioServerTransport()
  try {
    await server.connect(transport)
    console.log(
      `MCP is server running 🚀`,
    )
  }
  catch (err) {
    console.error('Error starting server:', err)
  }
}

export async function stopServer(server: McpServer) {
  try {
    await server.close()
    console.log('Server closed 📍')
  }
  catch (error) {
    console.log(`Error occured`, error)
  }
  finally {
    process.exit(0)
  }
}

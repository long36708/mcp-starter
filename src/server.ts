import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServerOptions } from './types';

export function createServer(options: McpServerOptions): McpServer {
	const { name, version } = options;

	console.log('Creating server', name, version);

	const server = new McpServer(
		{
			name: name, 
			version: version
		}
	);

	return server;
}

export async function startServer(
  server: McpServer
): Promise<void> {
  const transport = new StdioServerTransport();
  try {
    await server.connect(transport);
    console.log(
      `MCP is server running 🚀`
    );
  } catch (err) {
    console.error("Error starting server:", err);
  }
}

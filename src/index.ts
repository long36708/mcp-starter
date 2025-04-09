import { createServer, startServer } from './server';
import { registerToolYoutubeMusic } from './tools/youtube';
import { getPackageJson } from './utils';
import { McpToolContext } from './types';
import { version } from '../package.json'

(async function main() {
  const packageJson = getPackageJson();

  const mcp = createServer({
    name: packageJson!.name || "my-mcp-server",
    version: packageJson!.version || "0.0.1",
  });

  registerToolYoutubeMusic({mcp} as McpToolContext);

  await startServer(mcp);
})();
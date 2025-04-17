# MCP Server Starter

![mcp starter](/public/banner.png)
<p>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat&colorA=18181B&colorB=28CF8D" alt="License">
  <!-- Add other relevant badges here, e.g., build status, stars -->
  <!-- <a href="YOUR_REPO_LINK/stargazers"><img src="https://img.shields.io/github/stars/YOUR_USERNAME/YOUR_REPO.svg?style=flat&colorA=18181B&colorB=28CF8D" alt="Stars"></a> -->
</p>

**Want to build your own MCP server?**

MCP Server Starter gives you a basic structure to run local tools with Cursor, Claude, and others using the MCP standard.

---

## Features

- 📦 **Minimal Setup** - Get started quickly with a basic server implementation.
- 🤖 **Cursor AI Integration** - Includes example `.cursor/mcp.json` configuration.
- ⌨️ **TypeScript** - Add type safety to your project.
- 📡 **Flexible Communication** - Supports multiple communication protocols between client and server, including standard I/O (`stdio`), HTTP, and Server-Sent Events (`sse`).

<!-- Add other features specific to your starter implementation -->



![mcp starter](/public/starter2.jpg)

## Supported Transport Options

### Stdio 
Recommend for local setups

#### Local development
```json
{
  "mcpServers": {
    "my-starter-mcp-stdio": {
      "command": "node",
      "args": ["./dist/index.mjs", "stdio"]
    }
  }
}
```

#### Published Package
```json
{
  "mcpServers": {
    "my-starter-mcp-stdio": {
      "command": "npx",
      "args": ["my-mcp-server", "stdio"]
    }
  }
}
```

### Streamable HTTP
Recommend for remote server usage

#### Local development
Use the `streamable http` transport
```json
{
  "mcpServers": {
    "my-starter-mcp-http": {
      "command": "node",
      "args": ["my-mcp-server", "http", "--port", "4001"]
      // "args": ["my-mcp-server", "sse", "--port", "4002"] (or deprecated sse usage)
    }
  }
}
```
#### Published Package
Use `npx` and your own published package name
```json
{
  "mcpServers": {
    "my-starter-mcp-http": {
      "command": "npx",
      "args": ["my-mcp-server", "http", "--port", "4001"]
      // "args": ["my-mcp-server", "sse", "--port", "4002"] (or deprecated sse usage)
    }
  }
}
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Specify version if necessary)
- An MCP-compatible client (e.g., [Cursor](https://cursor.com/))

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
    cd YOUR_REPO
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

3.  **Start Server**

    ```bash
    npm start
    # pnpm start
    # or yarn start
    ```

This command should start your MCP server, making its tools available to connected clients.

## Command-Line Options

The server can be configured to use different communication protocols via command-line arguments (exact flags depend on the implementation in `src/cli.ts`).

*   **Protocol Selection:**
    *   `stdio` (Default): Uses standard input/output for communication. Typically requires no extra flags.
    *   `http`: Uses HTTP REST protocol.
        *   `--port <number>`: Specifies the port (default: `3000`).
        *   `--endpoint <path>`: Specifies the API endpoint path (default: `/mcp`).
    *   `sse`: Uses Server-Sent Events.
        *   `--port <number>`: Specifies the port (default: `3000`).

*   **Example Usage (Illustrative):**
    ```bash
    # Run with default stdio
    node ./dist/index.mjs

    # Run with HTTP on port 4000
    node ./dist/index.mjs http --port 4000

    # Run with SSE on default port
    node ./dist/index.mjs sse
    ```

## Available Tools

*   `exampleTool`: Describe what your example tool does.
*   *(Add more tools as you implement them)*

**Develop**

This project provides a starting point. You'll likely want to:

*   Implement your own custom tools within the server logic.
*   Define the schema (parameters, description) for your tools.
*   Add error handling and logging.
*   Write tests for your tools.

Follow the contribution guidelines if you plan to contribute back to the starter project itself.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Links

- X/Twitter: [@kregenrek](https://x.com/kregenrek)
- Bluesky: [@kevinkern.dev](https://bsky.app/profile/kevinkern.dev)

## Courses
- Learn Cursor AI: [Ultimate Cursor Course](https://www.instructa.ai/en/cursor-ai)
- Learn to build software with AI: [instructa.ai](https://www.instructa.ai)

## See my other projects:

* [AI Prompts](https://github.com/instructa/ai-prompts/blob/main/README.md) - Curated AI Prompts for Cursor AI, Cline, Windsurf and Github Copilot
* [codefetch](https://github.com/regenrek/codefetch) - Turn code into Markdown for LLMs with one simple terminal command
* [aidex](https://github.com/regenrek/aidex) A CLI tool that provides detailed information about AI language models, helping developers choose the right model for their needs.# mcp-starter

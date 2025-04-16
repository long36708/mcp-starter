# MCP Starter Project

![mcp starter](/public/banner.png)
<p>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat&colorA=18181B&colorB=28CF8D" alt="License">
  <!-- Add other relevant badges here, e.g., build status, stars -->
  <!-- <a href="YOUR_REPO_LINK/stargazers"><img src="https://img.shields.io/github/stars/YOUR_USERNAME/YOUR_REPO.svg?style=flat&colorA=18181B&colorB=28CF8D" alt="Stars"></a> -->
</p>

**MCP Starter** - A foundation for building your own local Model Context Protocol (MCP) server.

This starter kit provides a basic structure and example setup for creating custom tools accessible via AI assistants like Cursor or Claude Desktop using the MCP standard.

---

## Features

- 🚀 **MCP Ready** - Easily integrate with MCP-compatible clients.
- 🔧 **Extensible Tooling** - Simple structure to add your own custom tools.
- 📦 **Minimal Setup** - Get started quickly with a basic server implementation.
- ↔️ **Based on Anthropic MCP** - Follows the specifications outlined by Anthropic.
- 🤖 **Cursor AI Integration** - Includes example `.cursor/mcp.json` configuration.
- ⌨️ **TypeScript Ready** - (Optional) Add type safety to your project.

<!-- Add other features specific to your starter implementation -->

## Usage

![mcp starter](/public/starter.png)

Local development

```
{
  "mcpServers": {
    "my-starter-mcp": {
      "command": "node",
      "args": ["./dist/index.mjs"]
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

3.  **Configure environment variables:**
    *   Create a `.env` file based on `.env.example`.
    *   Add any necessary API keys or configuration values required by your custom tools.

4.  **Add to your MCP client:**
    Add the following MCP configuration to your client (e.g., Cursor's `.cursor/mcp.json`):

    ```json
    {
      "mcpServers": {
        "my-custom-mcp": {
          "command": "node", // Or your chosen execution command
          "args": ["path/to/your/server/entrypoint.js"], // Adjust path as needed
          "env": {
            // Add any environment variables your server needs from the client side, if any
            // "EXAMPLE_API_KEY": "<INSERT_API_KEY_HERE>"
          }
        }
      }
    }
    ```
    *   Replace `"my-custom-mcp"` with a unique name for your server.
    *   Adjust the `"command"` and `"args"` to correctly point to and run your server's main script.
    *   Ensure any required `env` variables are configured either here or directly in your server's environment (e.g., via the `.env` file).

### Running the Server

```bash
npm start
# or yarn start
```

This command should start your MCP server, making its tools available to connected clients.

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

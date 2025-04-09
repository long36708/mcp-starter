# mcp-starter

[![npm version](https://badge.fury.io/js/mcp-starter.svg)](https://badge.fury.io/js/mcp-starter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Simple MCP Starter Package.

This package provides a basic template for getting started with the Model Context Protocol (MCP).

## Installation

```bash
npm install mcp-starter
# or
yarn add mcp-starter
# or
pnpm add mcp-starter
```

## Usage

The main export of this package is `./dist/index.mjs`. You can import it in your project like this:

```javascript
// ESM
import mcpStarter from 'mcp-starter';

// CJS (if your environment supports it)
// const mcpStarter = require('mcp-starter');

// Use the package functionalities here
```

(Please add specific usage examples based on your package's actual functionality)

## Development

To work on this package locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/instructa/mcp-starter.git
    cd mcp-starter
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install / pnpm install
    ```

3.  **Available Scripts:**

    *   `npm run build`: Build the package using `unbuild`.
    *   `npm run play`: Run the playground environment (`nr -C playground dev`).
    *   `npm run start`: Start the server using `nodemon` and `tsx`.
    *   `npm run dev:prepare`: Prepare the development environment by building the package.
    *   `npm run inspect`: Inspect the build output using the MCP inspector.
    *   `npm run dev`: Run build in stub mode and the inspector concurrently for development.

## Dependencies

*   [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk): ^1.0.3
*   [@smithery/sdk](https://www.npmjs.com/package/@smithery/sdk): latest

## Contributing

Contributions are welcome! Please refer to the repository issues or open a new one to discuss potential changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (assuming you have a LICENSE file, otherwise remove this link).

## Author

*   Kevin Kern ([kevin@instructa.org](mailto:kevin@instructa.org))

## Repository

*   [GitHub](https://github.com/instructa/mcp-starter)

## Homepage

*   [instructa.ai](https://instructa.ai)

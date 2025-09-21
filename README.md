# MCP 服务器启动器

![mcp starter](/public/banner.png)

<div align="center">
  <!-- <img alt="NPM Downloads" src="https://img.shields.io/npm/long36708/mcpn?style=flat-square&logo=npm">
  <img alt="jsDelivr hits (npm)" src="https://img.shields.io/jsdelivr/npm/long36708/mcpn?style=flat-square&logo=jsdeliver">
  <img alt="GitHub Sponsors" src="極img.shields.io/github/sponsors/long36708/mcpn?style=flat-square&logo=github">
  <br /> -->
  <strong>由</strong><br />
  <a href="https://twitter.com/kregenrek">
    <img src="https://img.shields.io/twitter/follow/kregenrek?style=social" alt="在 Twitter 上关注 @kregenrek">
  </a>
</div>

**想要构建自己的 MCP 服务器吗？**

MCP 服务器启动器为您提供了一个基础结构，可以使用 MCP 标准在 Cursor、Claude 和其他工具中运行本地工具。

---

<a href="https://glama.ai/mcp/servers/@long36708/mcp-starter">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@long36708/mcp-starter/badge" alt="Starter MCP server" />
</a>

## 特性

- 📡 **灵活的通信**
  - 支持客户端和服务器之间的多种通信协议，
  - `stdio`: 本地使用
  - `Streamable HTTP`: 远程和本地使用
  - `sse`: 远程和本地使用（已弃用）~~

- 📦 **最小化设置** - 快速开始使用基础的服务器实现。
- 🤖 **Cursor AI 集成** - 包含示例 `.cursor/mcp.json` 配置。
- ⌨️ **TypeScript** - 为您的项目添加类型安全。

## 待办事项

- [ ] 添加发布自己包的选项
- [ ] 更好的脚手架 CLI 支持
- [ ] 动态构建工具的提示

## 快速开始

### 先决条件

- [Node.js](https://nodejs.org/)（必要时指定版本）
- 兼容 MCP 的客户端（例如 [Cursor](https://cursor.com/)）

## 使用方法

### 支持的传输选项

模型上下文协议支持多种传输方法。

### stdio

![mcp starter](/public/stdio-mcp-starter.jpg)

推荐用于本地设置

#### 代码编辑器支持

添加以下代码片段

* Cursor: `.cursor/mcp.json`

**本地开发/测试**

如果您想在本地测试您的 MCP 服务器，请使用此配置

```json
{
  "mcpServers": {
    "my-starter-mcp-stdio": {
      "command": "node",
      "args": ["./bin/cli.mjs", "--stdio"]
    }
  }
}
```

**已发布的包**

当您在 npm 注册表中发布了您的包时使用此配置

```json
{
  "mcpServers": {
    "my-starter-mcp-stdio": {
      "command": "npx",
      "args": ["my-mcp-server", "--stdio"]
    }
  }
}
```

### Streamable HTTP

![mcp starter](/public/mcp-sse-starter.jpg)

>重要：Streamable HTTP 在 Cursor 中尚不支持

推荐用于远程服务器使用

**重要：** 与 stdio 不同，您还需要使用正确的标志运行服务器

**本地开发**
使用 `streamable http` 传输

1. 启动 MCP 服务器
   在终端中运行此命令
   ```bash
   node ./bin/cli.mjs --http --port 4200
   ```

   或者使用 mcp 检查器
   ```
   npm run dev-http
   # npm run dev-sse (已弃用)
   ```

   2. 将此添加到您的配置中
   ```json
   {
     "mcpServers": {
       "my-starter-mcp-http": {
         "command": "node",
         "args": ["./bin/cli.mjs", "--http", "--port", "4001"]
         // "args": ["./bin/cli.mjs", "--sse", "--port", "4002"] (或已弃用的 sse 用法)
       }
     }
   }
   ```

**已发布的包**

当您在 npm 注册表中发布了您的包时使用此配置

在终端中运行此命令
```bash
npx my-mcp-server --http --port 4200
# npx my-mcp-server --sse --port 4201 (已弃用)
```

```json
{
  "mcpServers": {
    "my-starter-mcp-http": {
      "url": "http://localhost:4200/mcp"
      // "url": "http://localhost:4201/sse"
    }
  }
}
```

## 使用检查器

使用 `inspect` 命令来调试您的 MCP 服务器

![mcp starter](/public/inspect.jpg)
![mcp starter](/public/streamable2.jpg)

## 命令行选项

### 协议选择

| 协议 | 描述 | 标志 | 备注 |
| :--- | :--- | :--- | :--- |
| `stdio` | 标准输入输出 | (无) | 默认 |
| `http` | HTTP REST | `--port <num>` (默认: 3000), `--endpoint <path>` (默认: `/mcp`) | |
| `sse` | 服务器发送事件 | `--port <num>` (默认: 3000) | 已弃用 |

## 许可证

本项目采用 MIT 许可证 - 有关详细信息，请参阅 LICENSE 文件。

---

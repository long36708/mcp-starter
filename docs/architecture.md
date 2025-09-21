# MCP 服务器架构图

## 项目概述

这是一个基于 Model Context Protocol (MCP) 的服务器启动器，提供灵活的通信协议支持，包括 stdio、HTTP 和 SSE 传输方式。

## 架构图

```mermaid
graph TB
    %% 客户端层
    subgraph ClientLayer [客户端层]
        Cursor[Cursor AI]
        Claude[Claude]
        Other[其他 MCP 客户端]
    end

    %% 传输协议层
    subgraph TransportLayer [传输协议层]
        Stdio[stdio 传输<br/>StdioServerTransport]
        HTTP[HTTP REST 传输<br/>RestServerTransport]
        SSE[SSE 传输<br/>SSEServerTransport]
    end

    %% 核心服务器层
    subgraph ServerLayer [核心服务器层]
        CLICmd[CLI 命令处理<br/>src/index.ts]
        MainServer[主服务器<br/>McpServer]
        ToolsMgr[工具管理器]
    end

    %% 工具层
    subgraph ToolsLayer [工具层]
        MyTool[示例工具<br/>doSomething]
        ToolReg[工具注册系统]
    end

    %% 工具实现层
    subgraph ImplementationLayer [工具实现层]
        Validator[参数验证<br/>Zod]
        EnvConfig[环境配置<br/>dotenv]
    end

    %% 依赖层
    subgraph DependenciesLayer [依赖层]
        MCP_SDK[@modelcontextprotocol/sdk]
        ChatMCP_SDK[@chatmcp/sdk]
        H3_FW[h3 框架]
        Citty_CLI[citty CLI]
    end

    %% 连接关系
    Cursor --> Stdio
    Cursor --> HTTP
    Cursor --> SSE
    Claude --> Stdio
    Claude --> HTTP
    Other --> Stdio
    Other --> HTTP

    Stdio --> MainServer
    HTTP --> MainServer
    SSE --> MainServer

    MainServer --> ToolsMgr
    ToolsMgr --> MyTool
    ToolsMgr --> ToolReg

    MyTool --> Validator
    MyTool --> EnvConfig

    CLICmd --> MainServer
    CLICmd --> ToolsMgr

    MainServer -.-> MCP_SDK
    Stdio -.-> MCP_SDK
    SSE -.-> MCP_SDK
    HTTP -.-> ChatMCP_SDK
    CLICmd -.-> Citty_CLI
    SSE -.-> H3_FW
```

## 架构组件说明

### 1. 客户端层 (ClientLayer)
- **Cursor AI**: 主要的 MCP 客户端
- **Claude**: 另一个支持的 MCP 客户端  
- **其他 MCP 客户端**: 兼容 MCP 协议的其他工具

### 2. 传输协议层 (TransportLayer)
- **stdio 传输**: 标准输入输出，用于本地开发
- **HTTP REST 传输**: HTTP 协议，支持远程连接
- **SSE 传输**: 服务器发送事件（已弃用）

### 3. 核心服务器层 (ServerLayer)
- **CLI 命令处理**: 命令行界面，处理启动参数和模式选择
- **主服务器**: MCP 服务器核心实例
- **工具管理器**: 管理和注册可用工具

### 4. 工具层 (ToolsLayer)
- **示例工具**: 包含 `doSomething` 工具示例
- **工具注册系统**: 动态工具注册机制

### 5. 工具实现层 (ImplementationLayer)
- **参数验证**: 使用 Zod 进行输入参数验证
- **环境配置**: dotenv 环境变量支持

### 6. 依赖层 (DependenciesLayer)
- **@modelcontextprotocol/sdk**: MCP 核心 SDK
- **@chatmcp/sdk**: HTTP REST 传输支持
- **h3 框架**: 轻量级 HTTP 框架
- **citty CLI**: 命令行界面框架

## 数据流说明

### 1. 客户端连接流程
```
客户端 → 选择传输协议 → 建立连接 → MCP 服务器 → 工具注册 → 工具执行
```

### 2. 工具执行流程
```
客户端请求 → 传输层接收 → 服务器路由 → 工具处理 → 参数验证 → 执行逻辑 → 返回结果
```

### 3. 服务器启动流程
```
CLI 解析参数 → 创建服务器实例 → 注册工具 → 选择传输协议 → 启动监听
```

## 关键文件结构

```
src/
├── index.ts          # CLI 入口和主程序
├── server.ts         # 服务器实现和传输协议
├── types.ts          # 类型定义
├── utils.ts          # 工具函数
└── tools/
    └── mytool.ts     # 示例工具实现

bin/
└── cli.mjs          # CLI 包装器

docs/
├── architecture.md  # 架构文档（本文档）
├── dependencies.md  # 依赖分析
└── api-usage.md     # API 使用详情
```

## 协议支持矩阵

| 协议 | 传输类 | 客户端支持 | 使用场景 |
|------|--------|------------|----------|
| stdio | `StdioServerTransport` | Cursor, Claude | 本地开发 |
| HTTP | `RestServerTransport` | Cursor, Claude | 远程服务器 |
| SSE | `SSEServerTransport` | 有限支持 | 已弃用 |

## 扩展性设计

1. **工具注册机制**: 通过 `registerMyTool` 模式轻松添加新工具
2. **传输协议抽象**: 支持多种通信协议，便于扩展
3. **类型安全**: 完整的 TypeScript 类型定义
4. **模块化设计**: 各组件职责清晰，便于维护和扩展

这个架构提供了灵活的基础设施，可以轻松添加新工具和扩展功能，同时保持与 MCP 标准的兼容性。
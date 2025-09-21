# 项目依赖分析

## 生产依赖 (dependencies)

### 1. @chatmcp/sdk (^1.0.6)
**作用**: 提供 REST 服务器传输功能，用于 HTTP 协议的 MCP 服务器通信
**使用的 API**:
- `RestServerTransport` - 创建 REST 传输实例
- `startServer()` - 启动 HTTP 服务器

**使用位置**: [`src/server.ts:38`](src/server.ts:38)
```typescript
import { RestServerTransport } from '@chatmcp/sdk/server/rest.js'
const transport = new RestServerTransport({ port, endpoint })
await transport.startServer()
```

### 2. @modelcontextprotocol/sdk (^1.9.0)
**作用**: MCP (Model Context Protocol) 核心 SDK，提供服务器和传输功能
**使用的 API**:
- `McpServer` - 主服务器类
- `SSEServerTransport` - SSE 服务器传输
- `StdioServerTransport` - 标准输入输出传输
- `server.connect()` - 连接传输
- `server.close()` - 关闭服务器

**使用位置**: 
- [`src/server.ts:1,4-6`](src/server.ts:1,4-6)
- [`src/types.ts:1`](src/types.ts:1)
- [`src/index.ts:22-39`](src/index.ts:22-39)

### 3. citty (^0.1.6)
**作用**: 命令行界面框架，用于构建 CLI 工具
**使用的 API**:
- `defineCommand` - 定义 CLI 命令
- `runMain` - 运行主程序

**使用位置**: [`src/index.ts:3`](src/index.ts:3)
```typescript
import { runMain as _runMain, defineCommand } from 'citty'
```

### 4. h3 (^1.15.1)
**作用**: 轻量级 HTTP 框架，用于 SSE 服务器的 HTTP 路由处理
**使用的 API**:
- `createApp` - 创建应用实例
- `createRouter` - 创建路由器
- `defineEventHandler` - 定义事件处理器
- `getQuery` - 获取查询参数
- `setResponseStatus` - 设置响应状态
- `toNodeListener` - 转换为 Node.js 监听器

**使用位置**: [`src/server.ts:7`](src/server.ts:7)
```typescript
import { createApp, createRouter, defineEventHandler, getQuery, setResponseStatus, toNodeListener } from 'h3'
```

### 5. ofetch (^1.4.1)
**作用**: 基于 fetch 的 HTTP 客户端（虽然代码中未直接使用，但可能用于工具实现）
**使用的 API**: 未在代码中直接使用

### 6. zod (^3.24.3)
**作用**: TypeScript 优先的模式声明和验证库
**使用的 API**:
- `z.string()` - 字符串验证
- `.describe()` - 参数描述

**使用位置**: [`src/tools/mytool.ts:3,12-14`](src/tools/mytool.ts:3,12-14)
```typescript
import { z } from 'zod'
{
  param1: z.string().describe('The name of the track to search for'),
  param2: z.string().describe('The name of the track to search for'),
}
```

## 开发依赖 (devDependencies)

### 1. @antfu/eslint-config (^4.12.0)
**作用**: ESLint 配置预设

### 2. @types/node (^22.14.1)
**作用**: Node.js 类型定义

### 3. dotenv (^16.5.0)
**作用**: 环境变量加载（虽然代码中已使用，但应归类为开发依赖）
**使用位置**: [`src/tools/mytool.ts:2,5`](src/tools/mytool.ts:2,5)
```typescript
import * as dotenv from 'dotenv'
dotenv.config()
```

### 4. esbuild (^0.25.2)
**作用**: JavaScript 打包工具

### 5. nodemon (^3.1.9)
**作用**: 开发时自动重启服务器
**使用位置**: [`package.json:40`](package.json:40)
```json
"start": "nodemon --exec 'tsx src/index.ts'"
```

### 6. tsx (^4.19.3)
**作用**: TypeScript 执行器
**使用位置**: [`package.json:40,52`](package.json:40,52)

### 7. typescript (^5.8.3)
**作用**: TypeScript 编译器

### 8. unbuild (^3.5.0)
**作用**: 通用构建系统
**使用位置**: [`build.config.ts:1`](build.config.ts:1)
```typescript
import { defineBuildConfig } from 'unbuild'
```

### 9. vite (^6.3.1)
**作用**: 前端构建工具
**使用位置**: [`vite.config.ts:1`](vite.config.ts:1)

### 10. vitest (^3.1.1)
**作用**: 测试框架
**使用位置**: [`tests/server.test.ts:1`](tests/server.test.ts:1)
```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
```

## 核心功能依赖关系

### MCP 服务器核心
- **@modelcontextprotocol/sdk**: 提供 MCP 服务器基础功能
- **@chatmcp/sdk**: 提供 HTTP REST 传输支持
- **h3**: 提供 SSE 服务器的 HTTP 路由功能

### 命令行界面
- **citty**: CLI 框架
- **dotenv**: 环境变量支持

### 工具和验证
- **zod**: 参数验证和模式定义
- **ofetch**: HTTP 客户端（潜在使用）

### 构建和开发
- **unbuild**: 项目构建
- **vitest**: 单元测试
- **typescript/tsx**: TypeScript 支持

## 建议改进

1. **依赖分类**: `dotenv` 应该从生产依赖移动到开发依赖
2. **文档完善**: 为每个工具函数添加详细的 JSDoc 注释
3. **测试覆盖**: 增加更多单元测试，特别是工具函数的测试
4. **错误处理**: 增强错误处理和日志记录
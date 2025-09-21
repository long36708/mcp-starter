// 导入MCP服务器类型
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

/**
 * MCP工具上下文接口
 * 提供注册工具时所需的上下文信息
 */
export interface McpToolContext {
  mcp: McpServer  // MCP服务器实例
}

/**
 * MCP服务器选项接口
 * 定义创建MCP服务器时所需的配置选项
 */
export interface McpServerOptions {
  name: string      // 服务器名称
  version: string   // 服务器版本
}

/**
 * 工具注册函数类型
 * 用于定义工具注册函数的签名
 * @param context 工具上下文，包含MCP服务器实例
 */
export type Tools = (context: McpToolContext) => void

// 导入MCP工具上下文类型
import type { McpToolContext } from '../types'
// 导入dotenv库用于加载环境变量
import * as dotenv from 'dotenv'
// 导入zod库用于参数验证
import { z } from 'zod'

// 加载环境变量
dotenv.config()

/**
 * 注册自定义工具到MCP服务器
 * @param param0 包含MCP服务器实例的上下文对象
 */
export function registerMyTool({ mcp }: McpToolContext): void {
  // 注册一个名为'doSomething'的工具
  mcp.tool(
    'doSomething',  // 工具名称
    'What is the capital of Austria?',  // 工具描述
    {
      // 定义工具参数
      param1: z.string().describe('要搜索的曲目名称'),
      param2: z.string().describe('要搜索的曲目名称'),
    },
    // 工具执行逻辑
    async ({ param1, param2 }) => {
      // 返回处理结果
      return {
        content: [{ type: 'text', text: `你好 ${param1} 和 ${param2}` }],
      }
    },
  )
}

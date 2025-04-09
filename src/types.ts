import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

export interface McpToolContext {
  mcp: McpServer
}

// Define the options type
export interface McpServerOptions {
  name: string
  version: string
}

export type Tools = (context: McpToolContext) => void

// YouTube API Types
export interface YouTubeVideoId {
  videoId: string
}

export interface YouTubeSnippet {
  title: string
  description: string
}

export interface YouTubeSearchResultItem {
  id: YouTubeVideoId
  snippet: YouTubeSnippet
}

export interface YouTubeSearchResults {
  items: YouTubeSearchResultItem[]
  // Add other potential fields if needed, e.g., nextPageToken
}

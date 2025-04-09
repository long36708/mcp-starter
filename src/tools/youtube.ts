import type { McpToolContext, YouTubeSearchResults, YouTubeSearchResultItem } from '../types'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js'
import * as dotenv from 'dotenv'
import { ofetch } from 'ofetch'
import { z } from 'zod'

dotenv.config()

const execPromise = promisify(exec)

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3'
const YOUTUBE_MUSIC_WATCH_URL_PREFIX = 'https://music.youtube.com/watch?v='

async function searchYoutubeVideo(
  apiKey: string,
  query: string,
  maxResults: number = 5,
): Promise<YouTubeSearchResultItem[]> {
  try {
    const searchResults = await ofetch<YouTubeSearchResults>('/search', {
      baseURL: YOUTUBE_API_BASE_URL,
      query: {
        key: apiKey,
        part: 'snippet',
        maxResults,
        type: 'video',
        q: query,
      },
    })
    return searchResults?.items ?? []
  }
  catch (error: unknown) {
    console.error('Error fetching YouTube search results:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during YouTube search'
    throw new McpError(ErrorCode.InternalError, `YouTube API search failed: ${errorMessage}`)
  }
}

async function openUrlInBrowser(url: string, platform: NodeJS.Platform = process.platform): Promise<void> {
  let command: string = ''

  try {
    if (platform === 'darwin') {
      const appleScript = `tell application "Google Chrome" to open location "${url}"`
      command = `osascript -e '${appleScript.replace(/'/g, "'\''")}'` // Keep existing escaping for robustness
      console.log(`Executing command for macOS: ${command}`)
      const { stderr } = await execPromise(command)
      if (stderr) {
        // Log stderr as warning, as osascript might output non-fatal messages here
        console.warn('osascript stderr:', stderr)
      }
    }
    else if (platform === 'win32') {
      command = `start "" "${url}"`
      console.log(`Executing command for Windows: ${command}`)
      await execPromise(command)
    }
    else {
      // Assume Linux/other POSIX-like
      command = `xdg-open "${url}"`
      console.log(`Executing command for Linux/Other: ${command}`)
      await execPromise(command)
    }
  }
  catch (execError: unknown) {
    console.error(`Error executing command "${command}":`, execError)
    const errorMsg = execError instanceof Error ? execError.message : 'Unknown execution error'
    throw new McpError(ErrorCode.InternalError, `Failed to open URL in browser: ${errorMsg}`)
  }
}

export function registerToolYoutubeMusic({ mcp }: McpToolContext): void {
  if (!YOUTUBE_API_KEY) {
    console.error('YOUTUBE_API_KEY environment variable is not set. YouTube tools will not be registered.')
    // Optionally, throw an error or prevent registration
    return
  }

  const apiKey = YOUTUBE_API_KEY // Make it const within the scope

  mcp.tool(
    'searchTrack',
    'Search for tracks on YouTube Music by name.',
    {
      trackName: z.string().describe('The name of the track to search for'),
    },
    async ({ trackName }) => {
      try {
        const searchResults = await searchYoutubeVideo(apiKey, trackName, 5)
        return {
          content: [
            { type: 'text', text: JSON.stringify(searchResults, null, 2) },
          ],
        }
      }
      catch (error: unknown) {
        console.error('Error in searchTrack tool:', error)
        const message = error instanceof McpError ? error.message : 'An unexpected error occurred during search.'
        return {
          content: [{ type: 'text', text: `Error searching YouTube: ${message}` }],
          isError: true,
        }
      }
    },
  )

  mcp.tool(
    'playTrack',
    'Search for a track on YouTube Music and open the top result in the default browser.',
    {
      trackName: z.string().describe('The name of the track to search for and play'),
    },
    async ({ trackName }) => {
      try {
        const searchResults = await searchYoutubeVideo(apiKey, trackName, 1)

        if (searchResults.length === 0) {
          return {
            content: [{ type: 'text', text: `No search results found for: ${trackName}` }],
          }
        }

        const topResult = searchResults[0]
        const videoId = topResult?.id?.videoId
        const title = topResult?.snippet?.title ?? 'Unknown Title'

        if (!videoId) {
          console.error('Could not find video ID in top search result:', topResult)
          throw new McpError(ErrorCode.InternalError, 'Could not extract video ID from YouTube search result.')
        }

        const youtubeMusicUrl = `${YOUTUBE_MUSIC_WATCH_URL_PREFIX}${videoId}`

        await openUrlInBrowser(youtubeMusicUrl)

        return {
          content: [{ type: 'text', text: `Attempting to play in browser: ${title} (${youtubeMusicUrl})` }],
        }
      }
      catch (error: unknown) {
        console.error('Error in playTrack tool:', error)
        if (error instanceof McpError && error.code === ErrorCode.InternalError) {
          // Propagate internal errors from helpers
          throw error
        }
        const message = error instanceof McpError
          ? error.message // Use message from McpError if available
          : error instanceof Error
            ? error.message
            : 'An unexpected error occurred during track playback.'

        // Return error information to the MCP client
        return {
          content: [{ type: 'text', text: `Error playing track: ${message}` }],
          isError: true,
        }
      }
    },
  )
}
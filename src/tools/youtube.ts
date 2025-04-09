import type { McpToolContext, YouTubeSearchResults } from '../types'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js'
import * as dotenv from 'dotenv'
import { ofetch } from 'ofetch'
import { z } from 'zod'

dotenv.config()

const execPromise = promisify(exec)

const API_KEY = process.env.YOUTUBE_API_KEY

export function registerToolYoutubeMusic({ mcp }: McpToolContext): void {
  console.log('API KEY', API_KEY ? 'Loaded' : 'Not Found')
  if (!API_KEY) {
    console.error('YOUTUBE_API_KEY environment variable is not set. YouTube tools will fail.')
  }

  mcp.tool(
    'searchTrack',
    'Search for a track on YouTube Music by name',
    {
      trackName: z.string().describe('The name of the track to search for'),
    },
    async ({ trackName }) => {
      if (!API_KEY) {
        return {
          content: [{ type: 'text', text: 'Error: YOUTUBE_API_KEY is not configured.' }],
          isError: true,
        }
      }
      try {
        const searchResults = await ofetch<YouTubeSearchResults>('/search', {
          baseURL: 'https://www.googleapis.com/youtube/v3',
          query: {
            key: API_KEY,
            part: 'snippet',
            maxResults: 5,
            type: 'video',
            q: trackName,
          },
        })

        console.log('YouTube Search Results:', searchResults)

        return {
          content: [
            { type: 'text', text: JSON.stringify(searchResults.items, null, 2) }, // Return only items array
          ],
        }
      }
      catch (error: unknown) {
        console.error('Error fetching YouTube search results:', error)
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
        return {
          content: [{ type: 'text', text: `Error searching YouTube: ${errorMessage}` }],
          isError: true,
        }
      }
    },
  )

  mcp.tool(
    'playTrack',
    'Search for a track on YouTube and play the top result on YouTube Music using Chrome',
    {
      trackName: z.string().describe('The name of the track to search for and play'),
    },
    async ({ trackName }) => {
      if (!API_KEY) {
        return {
          content: [{ type: 'text', text: 'Error: YOUTUBE_API_KEY is not configured.' }],
          isError: true,
        }
      }
      try {
        const searchResults = await ofetch<YouTubeSearchResults>('/search', {
          baseURL: 'https://www.googleapis.com/youtube/v3',
          query: {
            key: API_KEY,
            part: 'snippet',
            maxResults: 1,
            type: 'video',
            q: trackName,
          },
        })

        console.log('YouTube Search Result for Playing:', searchResults)

        if (!searchResults?.items || searchResults.items.length === 0) {
          return {
            content: [{ type: 'text', text: `No search results found for: ${trackName}` }],
          }
        }

        const topResult = searchResults.items[0]
        const videoId = topResult?.id?.videoId
        const title = topResult?.snippet?.title ?? 'Unknown Title'

        if (!videoId) {
          console.error('Could not find video ID in search results:', topResult)
          throw new McpError(ErrorCode.InternalError, 'Could not extract video ID from YouTube search result.')
        }

        const youtubeMusicUrl = `https://music.youtube.com/watch?v=${videoId}`

        // Note: This uses AppleScript and will only work on macOS with Google Chrome installed.
        const appleScript = `
          tell application "Google Chrome"
              activate
              open location "${youtubeMusicUrl}"
          end tell
        `

        try {
          console.log(`Executing AppleScript to open: ${youtubeMusicUrl}`)
          // Escape single quotes within the AppleScript string for the shell command
          const escapedAppleScript = appleScript.replace(/'/g, '\'\\\'\'')
          const { stdout, stderr } = await execPromise(`osascript -e '${escapedAppleScript}'`)

          if (stderr) {
            console.warn('AppleScript stderr:', stderr)
            // Depending on the error, you might want to throw or just log it
            // For example, if Chrome isn't running, stderr might report it, but the script could still succeed in launching it.
          }
          console.log('AppleScript stdout:', stdout)
          return {
            content: [{ type: 'text', text: `Attempting to play in Chrome: ${title} (${youtubeMusicUrl})` }],
          }
        }
        catch (execError: unknown) {
          console.error('Error executing AppleScript:', execError)
          const errorMsg = execError instanceof Error ? execError.message : 'Unknown error executing AppleScript'
          throw new McpError(ErrorCode.InternalError, `Error opening song in Chrome via AppleScript: ${errorMsg}`)
        }
      }
      catch (error: unknown) {
        // Handle errors from ofetch or McpErrors thrown above
        console.error('Error in playYoutubeMusicTrack tool:', error)
        if (error instanceof McpError) {
          // Re-throw McpError to be handled by the server framework
          throw error
        }
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during track playback setup.'
        // Return a generic error in MCP format for other unexpected errors
        return {
          content: [{ type: 'text', text: `Error playing track: ${errorMessage}` }],
          isError: true,
        }
      }
    },
  )

  console.log('Registered YouTube tools')
}

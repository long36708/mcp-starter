import { ofetch } from 'ofetch';
import { z } from 'zod';
import type { McpToolContext } from '../types';

const API_KEY = process.env.YOUTUBE_API_KEY;

export function registerToolYoutubeMusic({ mcp }: McpToolContext): void {
  mcp.tool(
    'searchYoutubeMusicTrack',
    'Search for a track on YouTube Music by name',
    {
      trackName: z.string().describe('The name of the track to search for'),
    },
    async ({ trackName }) => {
      const searchResults = await ofetch('/search', {
        baseURL: 'https://www.googleapis.com/youtube/v3',
        query: {
          key: API_KEY,
          part: 'snippet',
          maxResults: 5,
          type: 'video',
          q: trackName,
        },
      });

      console.log('YouTube Search Results:', searchResults);

      return searchResults;
    },
  );

  console.log('Registered tool YouTube');
}
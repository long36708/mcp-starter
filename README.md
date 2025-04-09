# YouTube Music MCP 🎵

[![smithery badge](https://smithery.ai/badge/@instructa/youtube-music-mcp)](https://smithery.ai/server/@instructa/youtube-music-mcp)

This is a simple MCP server that allows you to search for and play tracks on YouTube Music directly from your AI assistant like Cursor or Claude Desktop.

Built with:

- [YouTube Music](https://music.youtube.com/)
- [Anthropic MCP](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)
- [Cursor](https://cursor.so/)

## Features

- Search for tracks on YouTube Music by name.
- Play tracks directly by searching and opening them in your default browser.

**Cursor**

1.  Go to Cursor Settings -> MCP -> Add new MCP server
2.  Configure the server:
    - Name = `YouTube Music` (or choose your own)
    - Type = command
    - Command: `npx -y @instructa/youtube-music-mcp`

Now you can interact with your assistant (e.g., Cursor chat in Agent mode) and ask it to "search for [track name] on YouTube Music" or "play [track name] on YouTube Music".



**Cursor**

1.  Add the following MCP configuration to your Claude Desktop settings:

```json
{
  "mcpServers": {
    "youtube-music-mcp": {
      "command": "npx",
      "args": ["-y", "@instructa/youtube-music-mcp"]
    }
  }
}
```

2.  Interact with Cursor and ask it to search or play tracks on YouTube Music.

**Develop**

This MCP is typically run directly using `npx` and doesn't require local installation or building unless you intend to modify the source code. If you want to develop it locally, you would typically clone the source repository (if available) and follow its specific contribution guidelines.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Links

- X/Twitter: [@kregenrek](https://x.com/kregenrek)
- Bluesky: [@kevinkern.dev](https://bsky.app/profile/kevinkern.dev)

## Courses
- Learn Cursor AI: [Ultimate Cursor Course](https://www.instructa.ai/en/cursor-ai)
- Learn to build software with AI: [instructa.ai](https://www.instructa.ai)

## See my other projects:

* [AI Prompts](https://github.com/instructa/ai-prompts/blob/main/README.md) - Curated AI Prompts for Cursor AI, Cline, Windsurf and Github Copilot
* [codefetch](https://github.com/regenrek/codefetch) - Turn code into Markdown for LLMs with one simple terminal command
* [aidex](https://github.com/regenrek/aidex) A CLI tool that provides detailed information about AI language models, helping developers choose the right model for their needs.
* [codetie](https://github.com/codetie-ai/codetie) - XCode CLI
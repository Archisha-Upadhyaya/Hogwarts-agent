import { tool } from 'ai';
import { z } from 'zod';

// Tool execution functions
async function executeGoogleSearch(query: string) {
  // In a real implementation, you'd use Google Custom Search API
  // For now, return a formatted search URL and explanation
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  return {
    searchUrl,
    message: `I've prepared a Google search for "${query}". While I cannot directly browse the internet, I can guide you to search for this information at: ${searchUrl}`
  };
}

async function executeYouTubeSearch(query: string) {
  // In a real implementation, you'd use YouTube Data API
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  return {
    searchUrl,
    message: `I've prepared a YouTube search for "${query}". You can find relevant videos at: ${searchUrl}`
  };
}

async function executeScholarSearch(query: string) {
  const searchUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
  return {
    searchUrl,
    message: `I've prepared a Google Scholar search for "${query}". You can find academic papers and research at: ${searchUrl}`
  };
}

export const tools = {
  // Navigation tool for general application pages
  navigate_to_page: tool({
    description: "Navigate the user to a specific application page. Use this tool when the user explicitly requests to go to a particular page or section of the app. Do NOT use for study-specific pages, quizzes, or flashcards - use dedicated tools for those.",
    inputSchema: z.object({
      page_name: z.string().describe("The target page to navigate to. Must be one of the allowed pages."),
    })
  }),

  // Educational video search and recommendations
  search_educational_videos: tool({
    description: "Search for and recommend relevant educational YouTube videos on a specific topic. Use this when the user asks for video explanations, tutorials, or visual learning resources. The tool will find high-quality educational content.",
    inputSchema: z.object({
      topic: z.string().min(2).describe("The specific topic, concept, or subject to search videos for (e.g., 'quadratic equations', 'photosynthesis', 'object-oriented programming'). Be specific for better results."),
    }),
    execute: async ({ topic }) => {
      try {
          const searchQuery = encodeURIComponent(topic);
          const url = `https://www.youtube.com/results?search_query=${searchQuery}`;
        
          const res = await fetch(url, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                '(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
          });
        
          if (!res.ok) {
            throw new Error('Failed to fetch YouTube results');
          }
        
          const html = await res.text();
        
          const ytInitialDataMatch = html.match(/var ytInitialData = (.*?);\s*<\/script>/);
          if (!ytInitialDataMatch) {
            throw new Error('Failed to parse YouTube page');
          }
        
          const ytInitialData = JSON.parse(ytInitialDataMatch[1]);
        
          const contents =
            ytInitialData.contents?.twoColumnSearchResultsRenderer?.primaryContents
              ?.sectionListRenderer?.contents || [];
        
          const suggestions: any[] = [];
        
          for (const section of contents) {
            const items = section.itemSectionRenderer?.contents || [];
        
            for (const item of items) {
              const video = item.videoRenderer;
              if (
                video?.videoId &&
                video.title?.runs?.[0]?.text &&
                video.ownerText?.runs?.[0]?.text
              ) {
                suggestions.push({
                  videoId: video.videoId,
                  title: video.title.runs[0].text,
                  channel: video.ownerText.runs[0].text,
                  duration: video.lengthText?.simpleText ?? 'Live/Unknown',
                  url: `https://www.youtube.com/watch?v=${video.videoId}`,
                });
              }
            }
          }
        
        return { videoSuggestions: suggestions.slice(0, 5) };
      } catch (error) {
        console.error('Error fetching video suggestions:', error);
        return { error: 'An internal error occurred while fetching videos.' };
      }
    },
  }),

  googleSearch: tool({
    description: 'Search Google for information on any topic',
    inputSchema: z.object({
      query: z.string().describe('The search query to look up on Google'),
    }),
    execute: async ({ query }) => {
      return await executeGoogleSearch(query);
    }
  }),

  youtubeSearch: tool({
    description: 'Search YouTube for videos on any topic',
    inputSchema: z.object({
      query: z.string().describe('The search query to find videos on YouTube'),
    }),
    execute: async ({ query }) => {
      return await executeYouTubeSearch(query);
    }
  }),

  scholarSearch: tool({
    description: 'Search Google Scholar for academic papers and research',
    inputSchema: z.object({
      query: z.string().describe('The academic search query for scholarly articles'),
    }),
    execute: async ({ query }) => {
      return await executeScholarSearch(query);
    }
  }),
}
import { experimental_generateImage as generateImage, tool } from 'ai';
import { createFal } from '@ai-sdk/fal'
import { tavily } from '@tavily/core'
import { z } from 'zod';
import { TavilyExtractResponse,TavilySearchResponse } from '@/lib/tools/tavily';

const fal_apiKey = process.env.FAL_API_KEY
if (!fal_apiKey) {
    throw new Error('FAL_API_KEY is not set in environment variables')
}
const fal = createFal({
    apiKey: fal_apiKey,
})

const tavily_apiKey = process.env.TAVILY_API_KEY
if (!tavily_apiKey) {
    throw new Error('TAVILY_API_KEY is not set in environment variables')
}
const tavily_client = tavily({
    apiKey: tavily_apiKey,
})

const imgbb_apiKey = process.env.IMGBB_API_KEY
if (!imgbb_apiKey) {
    throw new Error('IMGBB_API_KEY is not set in environment variables')
}

export const tools = {
    // Navigation tool for general application pages
    navigate_to_page: tool({
        description: "Navigate the user to a specific url, should full https:// url",
        inputSchema: z.object({
            url: z.string().describe("The target url to navigate to."),
        })
    }),

    youtubeSearch: tool({
        description: 'Search YouTube for videos on any topic',
        inputSchema: z.object({
            query: z.string().describe('The search query to find videos on YouTube'),
        }),
        execute: async ({ query }) => {
            try {
                const searchQuery = encodeURIComponent(query);
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

    createImage: tool({
        description: 'Create an image based on the prompt',
        inputSchema: z.object({
            prompt: z.string().describe('The prompt to create an image based on'),
        }),
        execute: async ({ prompt }: { prompt: any }) => {
            try {
                // Generate image using FAL
                const result = await generateImage({
                    model: fal.image("fal-ai/flux/schnell"),
                    prompt,
                });
                
                // Upload to ImgBB using direct POST request
                console.log('Uploading image to ImgBB with prompt:', prompt);
                
                const formData = new FormData();
                formData.append('image', result.image.base64);
                
                const uploadResponse = await fetch(`https://api.imgbb.com/1/upload?expiration=600&key=${imgbb_apiKey}`, {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    throw new Error(`ImgBB upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
                }

                const uploadData = await uploadResponse.json();
                
                if (!uploadData.success) {
                    throw new Error(`ImgBB upload failed: ${uploadData.error?.message || 'Unknown error'}`);
                }

                console.log('Image uploaded successfully:', uploadData.data.url);

                return {
                    type: 'image',
                    url: uploadData.data.url,
                    prompt: prompt,
                    uploadInfo: {
                        id: uploadData.data.id,
                        title: uploadData.data.title,
                        size: uploadData.data.size
                    }
                };
            } catch (error) {
                console.error('Error generating or uploading image:', error);
                return {
                    type: 'error',
                    message: 'Failed to generate or upload image',
                    error: String(error)
                };
            }
        },
    }),

    search: tool({
        description:
            'Perform a comprehensive web search and get detailed results including optional images and AI-generated answers',
        inputSchema: z.object({
            query: z
                .string()
                .describe('The search query to find information about'),
            searchDepth: z
                .enum(['basic', 'advanced'])
                .optional()
                .describe(
                    'Depth of search - basic is faster, advanced is more thorough'
                ),
            topic: z
                .enum(['general', 'news'])
                .optional()
                .describe(
                    'Category of search - general for broad searches, news for recent events'
                ),
            days: z
                .number()
                .optional()
                .describe(
                    'Number of days back to search (only works with news topic, defaults to 3)'
                ),
            timeRange: z
                .enum(['day', 'week', 'month', 'year', 'd', 'w', 'm', 'y'])
                .optional()
                .describe('Time range for results - alternative to days parameter'),
            maxResults: z
                .number()
                .optional()
                .describe('Maximum number of results to return (default: 5)'),
            includeImages: z
                .boolean()
                .optional()
                .describe('Include related images in the response'),
            includeImageDescriptions: z
                .boolean()
                .optional()
                .describe(
                    'Add descriptive text for each image (requires includeImages)'
                ),
            includeAnswer: z
                .boolean()
                .optional()
                .describe(
                    'Include AI-generated answer to query - basic is quick, advanced is detailed'
                ),
            includeRawContent: z
                .union([z.literal("false"), z.literal("markdown"), z.literal("text")])
                .optional()
                .describe('Include raw content in the specified format: "false" to exclude, "markdown" or "text" for content format'),
            includeDomains: z
                .array(z.string())
                .optional()
                .describe('List of domains to specifically include in results'),
            excludeDomains: z
                .array(z.string())
                .optional()
                .describe('List of domains to exclude from results'),
        }),
        execute: async ({ query, ...options }) => {
            try {
                // The tool schema uses string values for serialization ("false"),
                // but the tavily client expects a boolean false. Convert here.
                const normalizedOptions = {
                    ...options,
                    includeRawContent:
                        (options as any).includeRawContent === "false"
                            ? false
                            : (options as any).includeRawContent,
                }

                return await tavily_client.search(query, normalizedOptions)
            } catch (error) {
                return { error: String(error) } as TavilySearchResponse
            }
        },
    }),

    extract_url: tool({
        description: 'Extract content and optionally images from a list of URLs',
        inputSchema: z.object({
            urls: z
                .array(z.string().url())
                .max(20)
                .describe('List of URLs to extract content from (maximum 20 URLs)'),
        }),
        execute: async ({ urls }) => {
            try {
                const response = await tavily_client.extract(urls)
                return {
                    results: response.results.map((result) => ({
                        url: result.url,
                        rawContent: result.rawContent,
                    })),
                } as TavilyExtractResponse
            } catch (error) {
                return {
                    results: [],
                    error: String(error),
                } as TavilyExtractResponse
            }
        },
    }),

}
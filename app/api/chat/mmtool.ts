import { experimental_generateImage as generateImage, tool } from 'ai';
import { createFal } from '@ai-sdk/fal'
import { tavily } from '@tavily/core'
import { z } from 'zod';

const fal_apiKey = process.env.FAL_API_KEY
if (!fal_apiKey) {
    throw new Error('FAL_API_KEY is not set in environment variables')
}
const fal = createFal({
    apiKey: fal_apiKey,
})

const imgbb_apiKey = process.env.IMGBB_API_KEY
if (!imgbb_apiKey) {
    throw new Error('IMGBB_API_KEY is not set in environment variables')
}

const multimedia_tools = {
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

    createVideo: tool({
        description: 'Create a video based on the prompt using FAL AI video generation',
        inputSchema: z.object({
            prompt: z.string().describe('The prompt to create a video based on'),
            aspect_ratio: z.enum(['16:9', '9:16', '1:1']).optional().default('16:9').describe('Video aspect ratio'),
        }),
        execute: async ({ prompt, aspect_ratio = '16:9' }) => {
            try {
                console.log('Creating video with prompt:', prompt);
                
                const requestBody = {
                    prompt,
                    negative_prompt: "worst quality, inconsistent motion, blurry, jittery, distorted",
                    resolution: "720p",
                    aspect_ratio,
                    num_frames: 121,
                    first_pass_num_inference_steps: 8,
                    second_pass_num_inference_steps: 8,
                    second_pass_skip_initial_steps: 5,
                    frame_rate: 24,
                    expand_prompt: false,
                    reverse_video: false,
                    enable_safety_checker: true,
                    enable_detail_pass: false,
                    temporal_adain_factor: 0.5,
                    tone_map_compression_ratio: 0
                };

                const response = await fetch('https://queue.fal.run/fal-ai/ltxv-13b-098-distilled', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Key ${fal_apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error(`FAL video generation failed: ${response.status} ${response.statusText}`);
                }

                const videoData = await response.json();
                console.log('FAL video generation response:', videoData);
                
                if (!videoData.video?.url) {
                    throw new Error('No video URL returned from FAL API');
                }

                console.log('Video created successfully:', videoData.video.url);

                return {
                    type: 'video',
                    url: videoData.video.url,
                    prompt: videoData.prompt || prompt,
                    videoInfo: {
                        resolution: '720p',
                        aspect_ratio,
                        num_frames: 121,
                        frame_rate: 24
                    }
                };
            } catch (error) {
                console.error('Error creating video:', error);
                return {
                    type: 'error',
                    message: 'Failed to create video',
                    error: String(error)
                };
            }
        },
    })
}

export { multimedia_tools };
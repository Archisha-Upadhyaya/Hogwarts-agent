import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, type UIMessage, stepCountIs, hasToolCall } from 'ai';
import { tools } from './tools';
import { PROFESSORS, systemPrompt } from './prompt';

export async function POST(req: Request) {
  const { messages, professor = 'dumbledore' }: { 
    messages: UIMessage[]; 
    professor?: keyof typeof PROFESSORS;
  } = await req.json();
  
  const selectedProfessor = PROFESSORS[professor] || PROFESSORS.dumbledore;
  console.log(`${selectedProfessor.name} has heard your plea!`);

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: `${selectedProfessor.personality}
    ${systemPrompt}
    Always stay in character as ${selectedProfessor.name}.`,

    messages: convertToModelMessages(messages),
    tools: tools,
    maxOutputTokens: 64000,
    maxRetries: 1,
    stopWhen: [stepCountIs(10)],
    onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
        console.log(`Step finished. Reason: ${finishReason}.`);
        if (toolCalls.length > 0) {
            const lastToolCall = toolCalls[toolCalls.length - 1];
            const lastToolResult = toolResults[toolResults.length - 1];
            console.log(`Last tool called: ${lastToolCall.toolName}`);
            
            // Debug: Log tool result for createImage
            if (lastToolCall.toolName === 'createImage') {
                console.log('CreateImage tool result:', JSON.stringify(lastToolResult, null, 2));
            }
        }
    },
});

  return result.toUIMessageStreamResponse({
    onFinish: async ({ messages: finalMessages }) => {
      console.log(`${selectedProfessor.name} responded with ${finalMessages.length} messages`);
    },
  });
}
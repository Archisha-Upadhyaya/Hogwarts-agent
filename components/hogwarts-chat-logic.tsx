'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Sparkles, Image as ImageIcon, ExternalLink, Loader2 } from 'lucide-react';
import { Professor, ProfessorKey, HogwartsChatProps, ToolCall } from '@/types/chat';
import { ToolCallDisplay } from './tool-call-display';

const TOOL_PURPOSES: Record<string, string> = {
  navigate_to_page: "Opening external webpage for research",
  createImage: "Generating visual content using AI",
  search: "Searching the web for information",
  youtubeSearch: "Finding relevant video content",
  webSearch: "Conducting comprehensive web research",
  urlContext: "Analyzing webpage content",
  imageAnalysis: "Analyzing uploaded images",
  videoGeneration: "Creating video content",
  dataVisualization: "Creating charts and graphs",
  documentAnalysis: "Processing and analyzing documents",
  translation: "Translating text between languages",
  codeGeneration: "Generating code solutions",
  textSummary: "Summarizing large text content",
  sentimentAnalysis: "Analyzing emotional tone of text"
};

const PROFESSORS: Record<ProfessorKey, Professor> = {
  dumbledore: {
    name: "Albus Dumbledore",
    title: "Headmaster",
    house: "Gryffindor",
    avatar: "🧙‍♂️",
    color: "bg-purple-100 text-purple-800",
    description: "Wise and whimsical, with a love for sherbet lemons",
  },
  mcgonagall: {
    name: "Minerva McGonagall",
    title: "Deputy Headmistress",
    house: "Gryffindor",
    avatar: "👩‍🏫",
    color: "bg-red-100 text-red-800",
    description: "Stern but fair, with no tolerance for foolishness",
  },
  snape: {
    name: "Severus Snape",
    title: "Potions Master",
    house: "Slytherin",
    avatar: "🦇",
    color: "bg-green-100 text-green-800",
    description: "Mysterious and sarcastic, master of the dark arts",
  },
  hagrid: {
    name: "Rubeus Hagrid",
    title: "Keeper of Keys and Grounds",
    house: "Gryffindor",
    avatar: "🐻",
    color: "bg-yellow-100 text-yellow-800",
    description: "Warm-hearted lover of magical creatures",
  },
  luna: {
    name: "Luna Lovegood",
    title: "Magical Wisdom Keeper",
    house: "Ravenclaw",
    avatar: "🌙",
    color: "bg-blue-100 text-blue-800",
    description: "Dreamy and ethereal, sees magic in everything",
  },
  archivist: {
  name: "Hogwarts Archivist",
  title: "Keeper of Records",
  house: "None",
  avatar: "📜",
  color: "bg-gray-100 text-gray-800",
  description: "Neutral and precise, provides plain and factual answers",
},
};

export default function HogwartsChat({ className }: HogwartsChatProps) {
  const [selectedProfessor, setSelectedProfessor] = useState<ProfessorKey>('dumbledore');
  const [input, setInput] = useState('');
  const [messageToolCalls, setMessageToolCalls] = useState<Record<string, ToolCall[]>>({});
  const [currentRequestToolCalls, setCurrentRequestToolCalls] = useState<ToolCall[]>([]);
  
  const { messages, sendMessage, error, status, addToolResult } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    async onToolCall({ toolCall }) {
      const toolPurpose = TOOL_PURPOSES[toolCall.toolName] || "Executing specialized research tool";
      
      // Handle navigate_to_page tool call immediately
      if (toolCall.toolName === 'navigate_to_page') {
        const url = (toolCall.input as any)?.url;
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }
      
      // Create tool call object
      const newToolCall: ToolCall = {
        id: toolCall.toolCallId,
        toolName: toolCall.toolName,
        args: toolCall.input,
        status: 'pending',
        purpose: toolPurpose,
        startTime: Date.now(),
      };

      // Add to current request tool calls
      setCurrentRequestToolCalls(prev => [
        ...prev.filter(tc => tc.id !== toolCall.toolCallId),
        newToolCall
      ]);

      // For client-side only tools, update status but keep in the list
      if (!toolCall.dynamic) {
        setTimeout(() => {
          const completedToolCall: ToolCall = {
            ...newToolCall,
            status: 'completed'
          };
          
          // Update the tool call status in current request
          setCurrentRequestToolCalls(prev => 
            prev.map(tc => 
              tc.id === toolCall.toolCallId ? completedToolCall : tc
            )
          );
        }, 2000);
      }
    },
  });

  const currentProfessor = PROFESSORS[selectedProfessor];
  const isLoading = status === 'streaming';

  // Automatically attach tool calls to the latest assistant message when it's complete
  useEffect(() => {
    if (!isLoading && currentRequestToolCalls.length > 0) {
      const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
      if (lastAssistantMessage && !messageToolCalls[lastAssistantMessage.id]) {
        // Check for tool results in message parts and update tool calls with results
        const toolCallsWithResults = currentRequestToolCalls.map(toolCall => {
          // Look for matching tool results in message parts
          const toolResult = lastAssistantMessage.parts?.find((part: any) => 
            (part.type === 'tool-result' && part.toolCallId === toolCall.id) ||
            (part.type === `tool-${toolCall.toolName}` && part.toolCallId === toolCall.id && part.state === 'output-available')
          );
          
          return {
            ...toolCall,
            status: toolResult ? 'completed' as const : toolCall.status,
            result: (toolResult as any)?.output || (toolResult as any)?.result,
            duration: toolCall.startTime ? Date.now() - toolCall.startTime : undefined
          };
        });
        
        setMessageToolCalls(prev => ({
          ...prev,
          [lastAssistantMessage.id]: toolCallsWithResults
        }));
        setCurrentRequestToolCalls([]);
      }
    }
  }, [isLoading, messages, currentRequestToolCalls, messageToolCalls]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      console.log('Sending message with professor:', selectedProfessor);
      
      // Pass the current professor in the request body (not hook-level)
      sendMessage(
        { text: input },
        {
          body: {
            professor: selectedProfessor,
          },
        }
      );
      setInput('');
    }
  }, [input, selectedProfessor, sendMessage]);

  const handleProfessorChange = useCallback((value: ProfessorKey) => {
    console.log('Professor changed to:', value);
    setSelectedProfessor(value);
  }, []);

  return (
    <div className={className}>
      {/* Professor Selection */}
      <Card className="mb-4 border-amber-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label className="font-semibold text-amber-800">Choose your Professor:</label>
            <Select
              value={selectedProfessor}
              onValueChange={handleProfessorChange}
            >
              <SelectTrigger className="w-full sm:w-80 border-amber-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROFESSORS).map(([key, prof]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{prof.avatar}</span>
                      <div>
                        <div className="font-medium">{prof.name}</div>
                        <div className="text-xs text-gray-500">{prof.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge className={`${currentProfessor.color} border-0`}>
              {currentProfessor.house}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="border-amber-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-2xl bg-amber-200">
                {currentProfessor.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-amber-800">{currentProfessor.name}</CardTitle>
              <p className="text-sm text-amber-600">{currentProfessor.title}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Messages */}
          <ScrollArea className="h-96 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-amber-400" />
                  <p className="text-lg font-medium text-amber-700">
                    Welcome to {currentProfessor.name}'s office!
                  </p>
                  <p className="text-sm text-amber-600 mt-2">
                    Start your research journey with AI-powered assistance, image generation, and comprehensive analysis!
                  </p>
                  <p className="text-xs text-amber-500 mt-1">
                    Try: "Create an image of a magical potion brewing" or "Search for Harry Potter facts"
                  </p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="text-sm bg-amber-200">
                        {currentProfessor.avatar}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg shadow-md ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-amber-50 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {/* Handle message parts */}
                    {message.parts?.map((part: any, index: number) => (
                      <div key={index}>
                        {part.type === 'text' && (
                          <div className="whitespace-pre-wrap">{part.text}</div>
                        )}
                        {part.type === 'image' && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2 mb-2 text-sm text-amber-600">
                              <ImageIcon className="h-4 w-4" />
                              <span>Generated Image</span>
                            </div>
                            <img
                              src={part.url || part.data}
                              alt="Generated by AI"
                              className="rounded-lg max-w-full h-auto shadow-md border border-amber-200"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {part.type === 'tool-result' && (
                          <div className="mt-2 p-2 bg-amber-100 rounded text-xs">
                            <div className="flex items-center gap-2 text-amber-700">
                              {part.toolName === 'navigate_to_page' && (
                                <>
                                  <ExternalLink className="h-3 w-3" />
                                  <span>Navigation triggered</span>
                                </>
                              )}
                              {part.toolName === 'createImage' && (
                                <>
                                  <ImageIcon className="h-3 w-3" />
                                  <span>Image generated</span>
                                </>
                              )}
                              {part.toolName === 'search' && (
                                <>
                                  <Sparkles className="h-3 w-3" />
                                  <span>Search completed</span>
                                </>
                              )}
                              {part.toolName === 'youtubeSearch' && (
                                <>
                                  <ExternalLink className="h-3 w-3" />
                                  <span>YouTube search</span>
                                </>
                              )}
                              {!['navigate_to_page', 'createImage', 'search', 'youtubeSearch'].includes(part.toolName) && (
                                <>
                                  <Loader2 className="h-3 w-3" />
                                  <span>{part.toolName}</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )) ?? (
                      /* Fallback for messages without parts */
                      <div className="whitespace-pre-wrap">
                        No content available
                      </div>
                    )}

                    {/* Display persistent tool calls for this message */}
                    {messageToolCalls[message.id]?.map((toolCall) => (
                      <ToolCallDisplay
                        key={toolCall.id}
                        toolName={toolCall.toolName}
                        purpose={toolCall.purpose || ''}
                        status={toolCall.status}
                        args={toolCall.args}
                        result={toolCall.result}
                        error={toolCall.error}
                        startTime={toolCall.startTime}
                        duration={toolCall.duration}
                      />
                    ))}

                    {/* Show current request tool calls for the last assistant message */}
                    {message.role === 'assistant' && 
                     message === messages.filter(m => m.role === 'assistant').pop() && 
                     currentRequestToolCalls.length > 0 &&
                     currentRequestToolCalls.map((toolCall) => (
                      <ToolCallDisplay
                        key={`current-${toolCall.id}`}
                        toolName={toolCall.toolName}
                        purpose={toolCall.purpose || ''}
                        status={toolCall.status}
                        args={toolCall.args}
                        result={toolCall.result}
                        error={toolCall.error}
                        startTime={toolCall.startTime}
                        duration={toolCall.startTime ? Date.now() - toolCall.startTime : undefined}
                      />
                    ))}
                  </div>
                  
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="text-sm bg-blue-200">
                        🧑‍🎓
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="text-sm bg-amber-200">
                      {currentProfessor.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-amber-50 text-amber-900 border border-amber-200 p-3 rounded-lg shadow-md min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{currentProfessor.name} is researching...</div>
                        <div className="text-xs text-amber-700 mt-1">Processing your request</div>
                      </div>
                    </div>
                    <div className="mt-2 h-1 bg-amber-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg">
                  <p className="font-medium">Something went wrong:</p>
                  <p className="text-sm">{error.message}</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-amber-200 p-4 bg-amber-25">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask ${currentProfessor.name} to research anything... Try "Create an image of..." "Analyze this URL..." or "Research..."`}
                className="flex-1 border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              <span>Research capabilities: URL analysis, image generation, web search, document processing, and more!</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

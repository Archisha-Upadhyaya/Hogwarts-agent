'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Sparkles, Image as ImageIcon, ExternalLink, Loader2, Wand2, Paperclip, X, FileText } from 'lucide-react';
import { Professor, ProfessorKey, HogwartsChatProps, ToolCall } from '@/types/chat';
import { ToolCallDisplay } from './tool-call-display';

const TOOL_PURPOSES: Record<string, string> = {
  navigate_to_page: "Opening external webpage for research",
  createImage: "Generating visual content using AI",
  search: "Searching the web for information",
  youtubeSearch: "Finding relevant video content",
  searchQNA: "Fetching direct answer via AI-optimized web search",
  githubSearch: "Searching GitHub repositories",
  webSearch: "Conducting comprehensive web research",
  urlContext: "Analyzing webpage content",
};

const PROFESSORS: Record<ProfessorKey, Professor> = {
  dumbledore: {
    name: "Albus Dumbledore",
    title: "Strategic Guide",
    house: "Gryffindor",
    avatar: "🧙‍♂️",
    color: "bg-purple-100 text-purple-800",
    description:
      "Calm and insightful, skilled in big-picture research, synthesis, and interdisciplinary strategy.",
    placeholder: "Ask for strategic research or interdisciplinary analysis...",
  },
  mcgonagall: {
    name: "Minerva McGonagall",
    title: "Academic Mentor",
    house: "Gryffindor",
    avatar: "👩‍🏫",
    color: "bg-red-100 text-red-800",
    description:
      "Stern and precise, excels in teaching, structured writing, and clear academic analysis.",
    placeholder: "Ask for help with teaching, writing, or structured analysis...",
  },
  snape: {
    name: "Severus Snape",
    title: "Technical Analyst",
    house: "Slytherin",
    avatar: "🦇",
    color: "bg-green-100 text-green-800",
    description:
      "Controlled and exacting, specializes in technical analysis, code review, and sharp troubleshooting.",
    placeholder: "Ask for technical analysis or code review...",
  },
  slughorn: {
    name: "Horace Slughorn",
    title: "Master Networker",
    house: "Slytherin",
    avatar: "🍷",
    color: "bg-pink-100 text-pink-800",
    description:
      "Warm and persuasive, adept at marketing, outreach, and connecting people with opportunities.",
    placeholder: "Ask for marketing ideas or outreach strategies...",
  },
  flitwick: {
    name: "Filius Flitwick",
    title: "Creative Enchanter",
    house: "Ravenclaw",
    avatar: "✨",
    color: "bg-blue-100 text-blue-800",
    description:
      "Energetic and inventive, skilled in creative content, visuals, data, and automation workflows.",
    placeholder: "Ask for creative content, visuals, or automation...",
  },
  archivist: {
    name: "Hogwarts Archivist",
    title: "Keeper of Records",
    house: "None",
    avatar: "📜",
    color: "bg-gray-100 text-gray-800",
    description:
      "Neutral and factual, provides plain, precise answers without flourish.",
    placeholder: "Ask for a direct, factual answer...",
  },
};

export default function HogwartsChat() {
  const searchParams = useSearchParams();
  const [selectedProfessor, setSelectedProfessor] = useState<ProfessorKey>('dumbledore');
  const [input, setInput] = useState('');
  const [messageToolCalls, setMessageToolCalls] = useState<Record<string, ToolCall[]>>({});
  const [currentRequestToolCalls, setCurrentRequestToolCalls] = useState<ToolCall[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set initial professor from URL parameter
  useEffect(() => {
    const professorParam = searchParams.get('professor') as ProfessorKey;
    if (professorParam && Object.keys(PROFESSORS).includes(professorParam)) {
      setSelectedProfessor(professorParam);
    }
  }, [searchParams]);
  
  const { messages, sendMessage, error, status, addToolResult } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onFinish() {
      setIsThinking(false);
    },
    onError() {
      setIsThinking(false);
    },
    async onToolCall({ toolCall }) {
      const toolPurpose = TOOL_PURPOSES[toolCall.toolName] || "Executing specialized research tool";
      
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

    // Handle navigate_to_page tool call immediately
    if (toolCall.toolName === 'navigate_to_page') {
        const url = (toolCall.input as any)?.url;
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
            const completedToolCall: ToolCall = {
                ...newToolCall,
                status: 'completed'
            };
            setCurrentRequestToolCalls(prev =>
                prev.map(tc =>
                    tc.id === toolCall.toolCallId ? completedToolCall : tc
                )
            );
        }
    }
    // For other client-side only tools, update status but keep in the list
    else if (!toolCall.dynamic) {
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
  const showThinking = isThinking || isLoading;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentRequestToolCalls, isLoading]);

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

  const handleProfessorChange = useCallback((value: ProfessorKey) => {
    console.log('Professor changed to:', value);
    setSelectedProfessor(value);
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Filter only allowed file types
      const allowedTypes = [
        'image/jpeg','image/jpg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain', 'text/csv', 'application/json'
      ];
      
      const validFiles = Array.from(files).filter(file => 
        allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB limit
      );
      
      if (validFiles.length > 0) {
        const fileList = new DataTransfer();
        validFiles.forEach(file => fileList.items.add(file));
        setSelectedFiles(fileList.files);
      } else {
        alert('Please select valid files (images, PDFs, or documents) under 10MB');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    if (selectedFiles) {
      const newFiles = new DataTransfer();
      Array.from(selectedFiles).forEach((file, i) => {
        if (i !== index) {
          newFiles.items.add(file);
        }
      });
      setSelectedFiles(newFiles.files.length > 0 ? newFiles.files : null);
      if (fileInputRef.current && newFiles.files.length === 0) {
        fileInputRef.current.value = '';
      }
    }
  }, [selectedFiles]);

  const clearFiles = useCallback(() => {
    setSelectedFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() || selectedFiles) {
      console.log('Sending message with professor:', selectedProfessor);
      
      // Show thinking state immediately
      setIsThinking(true);
      
      // Pass the current professor in the request body and files if selected
      sendMessage(
        { 
          text: input,
          files: selectedFiles || undefined
        },
        {
          body: {
            professor: selectedProfessor,
          },
        }
      );
      setInput('');
      clearFiles();
    }
  }, [input, selectedFiles, selectedProfessor, sendMessage, clearFiles]);

  return (
    <div className="bg-transparent h-full">
      {/* Chat Interface */}
      <Card className="border-amber-200 shadow-xl py-0 gap-0.5 h-full">
        <CardHeader className="pb-0 bg-gradient-to-r from-amber-50 to-amber-100 rounded-t-xl">
          {/* Main Title Section */}
          <div className="text-center mt-2 mb-0 border-b border-amber-200 pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wand2 className="h-6 w-6 text-amber-600" />
              <CardTitle className="text-2xl font-bold text-amber-800">
                Arcanum Research Console
              </CardTitle>
              <Sparkles className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-sm text-amber-700">
              Advanced AI research platform with web analysis, image generation, document processing, and comprehensive data insights
            </p>
          </div>
          
          {/* Professor Selection Section */}
          <div className="pt-2 pb-4 flex items-center justify-between">
            <Select
              value={selectedProfessor}
              onValueChange={handleProfessorChange}
            >
              <SelectTrigger className="flex items-center gap-3 border-0 bg-amber-50/50 p-3 h-auto hover:bg-amber-100/70 rounded-lg transition-all duration-200 hover:shadow-md">
                <Avatar className="h-12 w-12 ring-2 ring-amber-200">
                  <AvatarFallback className="text-xl bg-amber-200">
                    {currentProfessor.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left flex-1">
                  <div className="font-semibold text-amber-800 text-base">{currentProfessor.name}</div>
                  <p className="text-sm text-amber-600">{currentProfessor.title}</p>
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROFESSORS).map(([key, prof]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{prof.avatar}</span>
                      <div>
                        <div className="font-medium text-black">{prof.name}</div>
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
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="h-96 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-amber-400" />
                  <p className="text-lg font-medium text-amber-700">
                    Welcome to {currentProfessor.name}'s office!
                  </p>
                  <p className="text-sm text-amber-600 mt-2">
                    Advanced AI-powered research platform featuring web analysis, document processing, image generation, and comprehensive data insights!
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
                        {part.type === 'file' && (
                          <div className="mt-2">
                            {part.mediaType?.startsWith('image/') ? (
                              <div>
                                <div className="flex items-center gap-2 mb-2 text-sm text-amber-600">
                                  <ImageIcon className="h-4 w-4" />
                                  <span>{part.filename || 'Uploaded Image'}</span>
                                </div>
                                <img
                                  src={part.url}
                                  alt={part.filename || 'Uploaded image'}
                                  className="rounded-lg max-w-full h-auto shadow-md border border-amber-200"
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 p-2 bg-amber-100 rounded text-sm text-amber-700 border border-amber-200">
                                <FileText className="h-4 w-4" />
                                <span>{part.filename || 'Uploaded File'}</span>
                                <span className="text-xs text-amber-600">({part.mediaType})</span>
                              </div>
                            )}
                          </div>
                        )}

                        {part.type === 'tool-result' && (
                          <div className="mt-2 p-2 bg-amber-100 rounded text-xs">
                            <div className="flex items-center gap-2 text-amber-700">
                              {part.toolName === 'navigate_to_page' && null}
                              {part.toolName === 'createImage' && null}
                              {part.toolName === 'search' && null}
                              {part.toolName === 'youtubeSearch' && null}
                              {part.toolName === 'searchQNA' && (
                                <ExternalLink className="h-4 w-4 text-amber-600" />
                              )}
                              {part.toolName === 'githubSearch' && (
                                <ExternalLink className="h-4 w-4 text-amber-600" />
                              )}
                              {!['navigate_to_page', 'createImage', 'search', 'youtubeSearch', 'searchQNA', 'githubSearch'].includes(part.toolName) && (
                                <Loader2 className="h-3 w-3" />
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
              
              {showThinking && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="text-sm bg-amber-200">
                      {currentProfessor.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-amber-50 text-amber-900 border border-amber-200 p-3 rounded-lg shadow-md min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500 animate-[spin_3s_linear_infinite] drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{currentProfessor.name} is thinking...</div>
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
              
              {/* Invisible element for auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-amber-200 p-4 bg-amber-25">
            {/* Selected Files Display */}
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="mb-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-xs text-amber-700 mb-2 font-medium">
                  Attached Files ({selectedFiles.length}):
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(selectedFiles).map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-2 py-1 bg-white rounded border border-amber-300 text-xs"
                    >
                      {file.type.startsWith('image/') ? (
                        <ImageIcon className="h-3 w-3 text-amber-600" />
                      ) : (
                        <FileText className="h-3 w-3 text-amber-600" />
                      )}
                      <span className="max-w-24 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-amber-500 hover:text-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={currentProfessor.placeholder}
                  disabled={showThinking}
                />
                
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
                  className="hidden"
                />
                
                {/* File Upload Button */}
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={showThinking}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-3"
                  title="Attach files (Images, PDFs, Documents)"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                type="submit"
                disabled={showThinking || (!input.trim() && !selectedFiles)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              <span>Research capabilities: URL analysis, image generation, web search, document processing, file analysis, and more!</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

  );
}

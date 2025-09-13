'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Wand2, Send, Sparkles, Image as ImageIcon } from 'lucide-react';

const PROFESSORS = {
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
};

export default function HogwartsChat() {
  const [selectedProfessor, setSelectedProfessor] = useState<keyof typeof PROFESSORS>('dumbledore');
  const [input, setInput] = useState('');
  
  const { messages, sendMessage, error, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        professor: selectedProfessor,
      },
    }),
  });

  const currentProfessor = PROFESSORS[selectedProfessor];
  const isLoading = status === 'streaming';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-4 border-amber-200 shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-amber-100 to-amber-50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wand2 className="h-8 w-8 text-amber-600" />
              <CardTitle className="text-3xl font-bold text-amber-800">
                Hogwarts Professors Chat
              </CardTitle>
              <Sparkles className="h-8 w-8 text-amber-600" />
            </div>
            <p className="text-amber-700">
              Chat with your favorite Hogwarts professors and ask them to create magical images!
            </p>
          </CardHeader>
        </Card>

        {/* Professor Selection */}
        <Card className="mb-4 border-amber-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <label className="font-semibold text-amber-800">Choose your Professor:</label>
              <Select
                value={selectedProfessor}
                onValueChange={(value: keyof typeof PROFESSORS) => setSelectedProfessor(value)}
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
                      Ask questions, request magical knowledge, or ask for images to be created!
                    </p>
                    <p className="text-xs text-amber-500 mt-1">
                      Try: "Create an image of a magical potion brewing"
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
                                src={part.data}
                                alt="Generated by AI"
                                className="rounded-lg max-w-full h-auto shadow-md border border-amber-200"
                              />
                            </div>
                          )}
                        </div>
                      )) ?? (
                        // Fallback for messages without parts
                        <div className="whitespace-pre-wrap">
                          No content available
                        </div>
                      )}
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
                    <div className="bg-amber-50 text-amber-900 border border-amber-200 p-3 rounded-lg shadow-md">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-sm">{currentProfessor.name} is thinking...</span>
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
                  placeholder={`Ask ${currentProfessor.name} anything... Try "Create an image of..."`}
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
                <span>Tip: Ask to create, draw, or generate images for magical visual responses!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

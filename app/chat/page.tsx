import HogwartsChat from '@/components/hogwarts-chat-logic';
import { Wand2, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 h-min-screen">
      <div className="max-w-4xl mx-auto h-min-screen">
        {/* Chat Component */}
        <HogwartsChat />
      </div>
    </div>
  );
}

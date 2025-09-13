import HogwartsChat from '@/components/hogwarts-chat-logic';
import { Wand2, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChatPage() {
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

        {/* Chat Component */}
        <HogwartsChat />
      </div>
    </div>
  );
}

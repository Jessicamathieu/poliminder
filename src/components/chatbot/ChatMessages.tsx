import type { ChatMessage } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <ScrollArea className="h-80 w-full p-4 border-b">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-end space-x-2",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {message.role === 'assistant' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "max-w-xs rounded-lg px-3 py-2 text-sm shadow",
                message.role === 'user'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
                message.role === 'system_message'
                  ? "bg-yellow-100 text-yellow-700 border border-yellow-300 w-full text-center"
                  : ""
              )}
            >
              <p>{message.content}</p>
              {message.role !== 'system_message' && (
                <p className={cn(
                    "mt-1 text-xs",
                    message.role === 'user' ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70 text-left"
                  )}
                >
                  {format(new Date(message.timestamp), 'p')}
                </p>
              )}
            </div>
            {message.role === 'user' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
         {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
            <Bot size={48} className="mx-auto mb-2 opacity-50" />
            <p>Posez-moi toutes vos questions sur les services PoliMinder&nbsp;!</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

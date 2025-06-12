'use client';

import { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { Bot, MessageCircle, X } from 'lucide-react';
import { customerServiceChatbot, type CustomerServiceChatbotInput, type CustomerServiceChatbotOutput } from '@/ai/flows/customer-service-chatbot';
import { useToast } from '@/hooks/use-toast';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
       setMessages([{ id: 'welcome', role: 'system_message', content: 'Welcome to PoliMinder Support! How can I help you today?', timestamp: new Date() }]);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (messageContent: string) => {
    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const input: CustomerServiceChatbotInput = { message: messageContent };
      const response: CustomerServiceChatbotOutput = await customerServiceChatbot(input);
      
      const assistantMessage: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'system_message',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      toast({ title: "Chatbot Error", description: "Could not get a response from the chatbot.", variant: "destructive"});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="default"
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-xl w-16 h-16 p-0 z-50 bg-primary hover:bg-primary/90"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
      >
        <MessageCircle className="h-8 w-8 text-primary-foreground" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 gap-0 flex flex-col max-h-[80vh]">
          <DialogHeader className="p-4 border-b flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <DialogTitle className="font-headline">PoliMinder Assistant</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
              <X className="h-5 w-5" />
              <span className="sr-only">Close chat</span>
            </Button>
          </DialogHeader>
          <DialogDescription className="hidden">Chat with PoliMinder support.</DialogDescription>
          
          <div className="flex-1 overflow-hidden">
            <ChatMessages messages={messages} />
          </div>
          <div ref={messagesEndRef} /> {/* For scrolling to bottom */}
          
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </DialogContent>
      </Dialog>
    </>
  );
}

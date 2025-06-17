'use client';

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/common/input';
import { Button } from '@/components/common/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-4 border-t">
      <Input
        type="text"
        placeholder="Tapez votre message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isLoading}
        className="flex-1"
        aria-label="Saisie du message"
      />
      <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} aria-label="Envoyer le message">
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}

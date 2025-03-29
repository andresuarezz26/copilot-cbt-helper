
import { useState, FormEvent, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        className="min-h-12 resize-none rounded-xl border-gray-200 focus:border-copilot-primary focus:ring-1 focus:ring-copilot-primary"
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={isLoading || !message.trim()}
        className="h-12 w-12 rounded-full bg-copilot-primary hover:bg-copilot-dark transition-colors"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ChatInput;

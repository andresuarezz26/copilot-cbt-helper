
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isBot = message.role === 'assistant';

  return (
    <div 
      className={cn(
        "flex w-full mb-4 animate-fade-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div 
        className={cn(
          "flex max-w-[80%] md:max-w-[70%] rounded-2xl p-4",
          isBot 
            ? "bg-white border border-gray-200 shadow-sm" 
            : "bg-copilot-primary text-white"
        )}
      >
        <div className="flex items-start">
          <div className="mr-3 mt-1">
            <Avatar className={cn("h-8 w-8", isBot ? "bg-copilot-light" : "bg-copilot-dark")}>
              {isBot ? <Bot className="h-4 w-4 text-copilot-primary" /> : <User className="h-4 w-4" />}
            </Avatar>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold mb-1">
              {isBot ? 'CoPilot' : 'You'}
            </span>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            <span className="text-xs opacity-70 mt-2 self-end">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

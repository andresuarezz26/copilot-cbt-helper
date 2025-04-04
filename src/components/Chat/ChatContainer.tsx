
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Message, ChatState, Session } from '@/types/chat';
import { getChatCompletion, getOpenAIKey, setOpenAIKey } from '@/services/openai';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bot } from 'lucide-react';
import { 
  createSession, 
  getSessions, 
  updateSessionMessages,
  generateSessionTitle,
  updateSession
} from '@/services/sessions';

const WELCOME_MESSAGE: Message = {
  id: uuidv4(),
  content: "Hi, I'm CoPilot, your CBT therapy assistant. How are you feeling today?",
  role: 'assistant',
  timestamp: new Date()
};

interface ChatContainerProps {
  activeSession?: Session | null;
  onSessionUpdated?: (session: Session) => void;
  showSessionManagement?: boolean;
}

const ChatContainer = ({ 
  activeSession = null, 
  onSessionUpdated,
  showSessionManagement = false 
}: ChatContainerProps) => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: activeSession?.messages || [WELCOME_MESSAGE],
    isLoading: false,
    error: null
  });
  
  const [apiKey, setApiKey] = useState<string>(getOpenAIKey());
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(!!getOpenAIKey());
  const [currentSession, setCurrentSession] = useState<Session | null>(activeSession);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update messages when active session changes
  useEffect(() => {
    if (activeSession) {
      setChatState(prev => ({
        ...prev,
        messages: activeSession.messages.length > 0 ? activeSession.messages : [WELCOME_MESSAGE],
      }));
      setCurrentSession(activeSession);
    }
  }, [activeSession]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);
  
  // Save messages to session if we have one
  useEffect(() => {
    if (currentSession && chatState.messages.length > 0) {
      const updatedSession = updateSessionMessages(currentSession.id, chatState.messages);
      
      // If this is the second message (first user message), generate a title
      if (chatState.messages.length === 2 && chatState.messages[1].role === 'user') {
        const title = generateSessionTitle(chatState.messages);
        updateSession(currentSession.id, { title });
      }
      
      if (updatedSession && onSessionUpdated) {
        onSessionUpdated(updatedSession);
      }
    }
  }, [chatState.messages, currentSession]);

  const handleSendMessage = async (content: string) => {
    if (!isApiKeySet) {
      toast.error("Please set your OpenAI API key first");
      return;
    }

    // Create a session if we don't have one
    if (!currentSession) {
      const newSession = createSession();
      setCurrentSession(newSession);
      if (onSessionUpdated) {
        onSessionUpdated(newSession);
      }
    }

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }));

    try {
      // Get all messages for context
      const allMessages = [...chatState.messages, userMessage];
      const response = await getChatCompletion(allMessages);

      // Add assistant's response
      const assistantMessage: Message = {
        id: uuidv4(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage, assistantMessage],
        isLoading: false
      }));
    } catch (error) {
      console.error('Error getting chat completion:', error);
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
      
      toast.error("Failed to get a response. Please check your API key.");
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setOpenAIKey(apiKey.trim());
      setIsApiKeySet(true);
      toast.success("API key set successfully!");
    }
  };

  if (!isApiKeySet) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Bot className="h-5 w-5 text-copilot-primary" />
              Welcome to CoPilot
            </CardTitle>
            <CardDescription>
              To use the CoPilot therapy assistant, please enter your OpenAI API key.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleApiKeySubmit}>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Your API key is stored locally in your browser and is never sent to our servers.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">OpenAI API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-copilot-primary hover:bg-copilot-dark"
              >
                Start Using CoPilot
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="chat-container h-full flex flex-col">
      <div className="chat-messages flex-1 overflow-y-auto pb-4">
        {chatState.messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {chatState.isLoading && (
          <div className="flex justify-start mb-4 animate-pulse">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 max-w-[80%] md:max-w-[70%]">
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  <div className="h-8 w-8 rounded-full bg-copilot-light flex items-center justify-center">
                    <Bot className="h-4 w-4 text-copilot-primary" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold mb-1">CoPilot</span>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-area pt-2">
        <ChatInput onSendMessage={handleSendMessage} isLoading={chatState.isLoading} />
      </div>
    </div>
  );
};

export default ChatContainer;

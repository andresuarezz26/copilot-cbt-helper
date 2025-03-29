
import { Message } from '@/types/chat';

// This would be properly secured in a production environment
const OPENAI_API_KEY = ''; // Empty for now, will be entered by user

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

const SYSTEM_PROMPT = `
You are CoPilot, a compassionate AI therapy assistant specializing in Cognitive Behavioral Therapy (CBT).
Your goal is to help users identify negative thought patterns and develop healthier thinking habits.

Guidelines:
- Be supportive, warm, and empathetic in your responses
- Use evidence-based CBT techniques to help users challenge negative thoughts
- Ask thoughtful follow-up questions to encourage reflection
- Provide practical coping strategies and exercises when appropriate
- Keep responses concise and conversational
- Never claim to be a replacement for a licensed therapist
- If a user is in crisis, encourage them to contact a crisis hotline or professional help

Remember that your role is to provide support through CBT techniques, not to diagnose or treat clinical conditions.
`;

export const getChatCompletion = async (messages: Message[]): Promise<string> => {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not set");
  }

  try {
    // Format messages for OpenAI API
    const formattedMessages: OpenAIMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using the most cost-effective model
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from OpenAI');
    }

    const data = await response.json() as OpenAIResponse;
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

// Function to set API key dynamically
export const setOpenAIKey = (key: string): void => {
  (window as any).OPENAI_API_KEY = key;
  Object.defineProperty(globalThis, 'OPENAI_API_KEY', {
    value: key,
    writable: true,
    configurable: true
  });
};

// Function to get API key
export const getOpenAIKey = (): string => {
  return (window as any).OPENAI_API_KEY || '';
};

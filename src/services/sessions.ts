
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/types/chat';

// Define Session type
export interface Session {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

// Local storage key
const SESSIONS_STORAGE_KEY = 'copilot-sessions';

// Get sessions from local storage
export const getSessions = (): Session[] => {
  const sessionsJson = localStorage.getItem(SESSIONS_STORAGE_KEY);
  if (!sessionsJson) return [];
  
  try {
    const sessions = JSON.parse(sessionsJson);
    // Convert string dates back to Date objects
    return sessions.map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt)
    }));
  } catch (error) {
    console.error('Error parsing sessions from localStorage:', error);
    return [];
  }
};

// Save sessions to local storage
export const saveSessions = (sessions: Session[]): void => {
  localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
};

// Create a new session
export const createSession = (initialMessage?: Message): Session => {
  const newSession: Session = {
    id: uuidv4(),
    title: `Session ${new Date().toLocaleDateString()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: initialMessage ? [initialMessage] : []
  };
  
  const sessions = getSessions();
  saveSessions([newSession, ...sessions]);
  
  return newSession;
};

// Get a session by ID
export const getSessionById = (sessionId: string): Session | undefined => {
  const sessions = getSessions();
  return sessions.find(session => session.id === sessionId);
};

// Update a session
export const updateSession = (sessionId: string, updates: Partial<Session>): Session | undefined => {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex(session => session.id === sessionId);
  
  if (sessionIndex === -1) return undefined;
  
  const updatedSession = {
    ...sessions[sessionIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  sessions[sessionIndex] = updatedSession;
  saveSessions(sessions);
  
  return updatedSession;
};

// Update session messages
export const updateSessionMessages = (sessionId: string, messages: Message[]): Session | undefined => {
  return updateSession(sessionId, { messages });
};

// Generate a title for a session based on first few messages
export const generateSessionTitle = (messages: Message[]): string => {
  if (messages.length === 0) return `New Session ${new Date().toLocaleDateString()}`;
  
  // Find first user message
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  if (!firstUserMessage) return `New Session ${new Date().toLocaleDateString()}`;
  
  // Truncate to first 30 characters or first line
  const content = firstUserMessage.content;
  const firstLine = content.split('\n')[0].trim();
  const truncated = firstLine.length > 30 ? `${firstLine.substring(0, 27)}...` : firstLine;
  
  return truncated || `Session ${new Date().toLocaleDateString()}`;
};

// Delete a session
export const deleteSession = (sessionId: string): void => {
  const sessions = getSessions();
  const filteredSessions = sessions.filter(session => session.id !== sessionId);
  saveSessions(filteredSessions);
};

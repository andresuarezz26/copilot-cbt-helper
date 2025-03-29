
import { useState, useEffect } from 'react';
import { UserButton, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import ChatContainer from '@/components/Chat/ChatContainer';
import SessionList from '@/components/Sessions/SessionList';
import { getSessions, createSession } from '@/services/sessions';
import { Session } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare, SidebarOpen } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  
  // Check if user is logged in
  useEffect(() => {
    if (!isSignedIn) {
      navigate('/sign-in');
    }
  }, [isSignedIn, navigate]);
  
  // Load sessions from local storage
  useEffect(() => {
    const loadedSessions = getSessions();
    setSessions(loadedSessions);
    
    // Set active session to the first one or create a new one if none exist
    if (loadedSessions.length > 0) {
      setActiveSession(loadedSessions[0]);
    } else {
      const newSession = createSession({
        id: uuidv4(),
        content: "Hi, I'm CoPilot, your CBT therapy assistant. How are you feeling today?",
        role: 'assistant',
        timestamp: new Date()
      });
      setSessions([newSession]);
      setActiveSession(newSession);
    }
  }, []);
  
  const handleCreateNewSession = () => {
    const newSession = createSession({
      id: uuidv4(),
      content: "Hi, I'm CoPilot, your CBT therapy assistant. How are you feeling today?",
      role: 'assistant',
      timestamp: new Date()
    });
    setSessions([newSession, ...sessions]);
    setActiveSession(newSession);
  };
  
  const handleSessionUpdated = (updatedSession: Session) => {
    setSessions(prev => {
      const newSessions = prev.map(session => 
        session.id === updatedSession.id ? updatedSession : session
      );
      // Sort sessions by updatedAt, newest first
      return newSessions.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    });
  };
  
  const handleRestartSession = (session: Session) => {
    // Create a new session with the same title but only the welcome message
    const restartedSession = createSession({
      id: uuidv4(),
      content: "Hi, I'm CoPilot, your CBT therapy assistant. How are you feeling today?",
      role: 'assistant',
      timestamp: new Date()
    });
    // Update title to show it's a restart
    const newTitle = `${session.title} (Restarted)`;
    handleSessionUpdated({
      ...restartedSession,
      title: newTitle
    });
    setSessions([restartedSession, ...sessions]);
    setActiveSession(restartedSession);
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-copilot-background">
      <Header>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <SidebarOpen className="h-4 w-4" />
          </Button>
          <UserButton />
        </div>
      </Header>
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex gap-6 h-[calc(100vh-8rem)]">
          {/* Session sidebar */}
          <div 
            className={`${
              showSidebar ? 'block' : 'hidden'
            } md:block w-full md:w-72 lg:w-80 shrink-0 border-r pr-4`}
          >
            <SessionList 
              sessions={sessions}
              activeSessionId={activeSession?.id || null}
              onSelectSession={setActiveSession}
              onCreateNewSession={handleCreateNewSession}
              onRestartSession={handleRestartSession}
            />
          </div>
          
          {/* Chat area */}
          <div className="flex-1 bg-[#F8FAFC] rounded-xl border shadow-sm overflow-hidden relative">
            {!showSidebar && (
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 left-4 md:hidden flex items-center gap-1 z-10"
                onClick={() => setShowSidebar(true)}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Sessions</span>
              </Button>
            )}
            
            {activeSession ? (
              <div className="h-full flex flex-col">
                <div className="px-4 py-3 border-b">
                  <h2 className="font-medium truncate">{activeSession.title}</h2>
                  <div className="text-xs text-muted-foreground">
                    Created {new Date(activeSession.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ChatContainer 
                    activeSession={activeSession} 
                    onSessionUpdated={handleSessionUpdated}
                    showSessionManagement={true}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No active session</h3>
                  <p className="text-muted-foreground mb-4">Select a session or create a new one</p>
                  <Button onClick={handleCreateNewSession} className="bg-copilot-primary hover:bg-copilot-dark">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Session
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

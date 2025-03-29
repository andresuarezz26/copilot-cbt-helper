
import { useState } from 'react';
import { Session } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { deleteSession } from '@/services/sessions';
import { formatDistanceToNow } from 'date-fns';

interface SessionListProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (session: Session) => void;
  onCreateNewSession: () => void;
  onRestartSession: (session: Session) => void;
}

const SessionList = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateNewSession,
  onRestartSession
}: SessionListProps) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setConfirmDelete(sessionId);
  };

  const handleConfirmDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    deleteSession(sessionId);
    toast.success('Session deleted');
    setConfirmDelete(null);
    
    // If deleted session was active, create a new session
    if (sessionId === activeSessionId) {
      onCreateNewSession();
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(null);
  };

  const handleRestartClick = (e: React.MouseEvent, session: Session) => {
    e.stopPropagation();
    onRestartSession(session);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Your Sessions</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCreateNewSession}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New</span>
        </Button>
      </div>
      
      <div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No sessions yet</p>
            <Button 
              variant="link" 
              onClick={onCreateNewSession}
              className="mt-2"
            >
              Start a new conversation
            </Button>
          </div>
        ) : (
          sessions.map((session) => (
            <div 
              key={session.id}
              onClick={() => onSelectSession(session)}
              className={`p-3 rounded-md transition-colors cursor-pointer flex justify-between items-center group ${
                session.id === activeSessionId 
                  ? 'bg-copilot-light border border-copilot-primary/20' 
                  : 'hover:bg-muted border border-transparent'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{session.title}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
                  {' • '}
                  {session.messages.filter(m => m.role === 'user').length} messages
                </div>
              </div>
              
              <div className={`flex gap-1 ${session.id === activeSessionId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => handleRestartClick(e, session)}
                  title="Restart conversation"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                
                {confirmDelete === session.id ? (
                  <div className="flex items-center gap-1 bg-destructive/10 p-1 rounded">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => handleConfirmDelete(e, session.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={handleCancelDelete}
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => handleDeleteClick(e, session.id)}
                    title="Delete session"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionList;

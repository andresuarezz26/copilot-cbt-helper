
import Header from '@/components/Layout/Header';
import ChatContainer from '@/components/Chat/ChatContainer';
import { useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-copilot-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-copilot-text mb-2">Your CBT Therapy Assistant</h2>
            <p className="text-muted-foreground">
              Talk with CoPilot about your thoughts and feelings. I'm here to help you apply CBT techniques.
            </p>
            
            {!isSignedIn && (
              <div className="mt-4 space-x-4">
                <Button asChild className="bg-copilot-primary hover:bg-copilot-dark">
                  <Link to="/sign-up">Create a Free Account</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/sign-in">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
          <div className="bg-[#F8FAFC] rounded-xl border shadow-sm overflow-hidden">
            <ChatContainer />
          </div>
          <div className="mt-4 text-xs text-center text-muted-foreground">
            <p>CoPilot is an AI assistant and not a replacement for professional mental health care.</p>
            <p>If you're in crisis, please contact a crisis hotline or seek professional help immediately.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

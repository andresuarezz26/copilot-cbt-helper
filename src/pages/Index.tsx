
import Header from '@/components/Layout/Header';
import ChatContainer from '@/components/Chat/ChatContainer';

const Index = () => {
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

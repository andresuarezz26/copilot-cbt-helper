
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  const { isSignedIn } = useAuth();

  return (
    <header className={cn("border-b", className)}>
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-full bg-copilot-primary p-1">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold">CoPilot</h1>
          <span className="text-xs bg-copilot-light text-copilot-primary px-2 py-0.5 rounded-full">
            CBT Assistant
          </span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          {isSignedIn ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="default" className="bg-copilot-primary hover:bg-copilot-dark">Sign Up</Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

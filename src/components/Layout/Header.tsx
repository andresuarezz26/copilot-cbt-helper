
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn("border-b", className)}>
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-copilot-primary p-1">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold">CoPilot</h1>
          <span className="text-xs bg-copilot-light text-copilot-primary px-2 py-0.5 rounded-full">
            CBT Assistant
          </span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {/* Add user controls or menu here in the future */}
        </div>
      </div>
    </header>
  );
};

export default Header;

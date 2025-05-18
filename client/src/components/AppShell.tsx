import React from 'react';
import { useAuth } from '@/lib/auth';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Book, Globe, Search, User, ChevronRight } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Nav */}
      <header className="h-14 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center px-4">
        <div className="flex items-center">
          <Link href="/" className="font-bold text-xl text-[#2c4c3b] dark:text-[#94b49f] flex items-center gap-2">
            <Book className="h-5 w-5" />
            <span>Aurora Reader</span>
          </Link>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/reader">
              <Book className="h-4 w-4 mr-1" />
              Read
            </Link>
          </Button>
          
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4 mr-1" />
            Search
          </Button>
          
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile">
                <User className="h-4 w-4 mr-1" />
                Profile
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/api/login">
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
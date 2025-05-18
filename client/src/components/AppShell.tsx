import React from 'react';
import { TopNav } from './TopNav';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 min-h-screen">
      <TopNav />
      <div className="h-[calc(100vh-56px)]">
        {children}
      </div>
    </div>
  );
}
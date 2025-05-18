import React, { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  );
}
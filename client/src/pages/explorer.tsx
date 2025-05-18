import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TheologicalConceptExplorer } from '@/components/explorer/TheologicalConceptExplorer';
import { Toaster } from '@/components/ui/toaster';

export default function ExplorerPage() {
  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        <main className="flex-grow overflow-hidden">
          <TheologicalConceptExplorer />
        </main>
        <Toaster />
      </div>
    </MainLayout>
  );
}
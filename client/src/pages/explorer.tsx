import React from 'react';
import { TheologicalConceptExplorer } from '@/components/explorer/TheologicalConceptExplorer';
import { MainLayout } from '@/components/layout/MainLayout';

export default function ExplorerPage() {
  return (
    <MainLayout>
      <TheologicalConceptExplorer />
    </MainLayout>
  );
}
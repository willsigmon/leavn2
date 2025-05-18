
import React from 'react';
import { useParams } from 'wouter';
import { Reader } from '@/components/reader/Reader';
import { AppShell } from '@/components/AppShell';

export default function ReaderPage() {
  const params = useParams();
  
  // Default to Genesis 1 if not specified in params
  const book = params.book || 'Genesis';
  const chapter = parseInt(params.chapter || '1', 10);
  const verse = params.verse ? parseInt(params.verse, 10) : undefined;
  
  return (
    <AppShell>
      <div className="h-[calc(100vh-56px)] overflow-hidden">
        <Reader 
          book={book} 
          chapter={chapter} 
          initialVerse={verse}
          translation="web" 
        />
      </div>
    </AppShell>
  );
}

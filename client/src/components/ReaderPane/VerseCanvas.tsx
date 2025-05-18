import React from 'react';
import { cn } from '@/lib/utils';

interface Verse {
  id: string;
  verseNumber: number;
  text: string;
}

interface VerseCanvasProps {
  book: string;
  chapter: number;
  verses: Verse[];
  onSelect?: (refs: string[]) => void;
  className?: string;
}

export function VerseCanvas({
  book = 'Genesis',
  chapter = 1,
  verses = [],
  onSelect,
  className
}: VerseCanvasProps) {
  const handleVerseClick = (verseId: string) => {
    onSelect?.([verseId]);
  };

  return (
    <div className={cn('flex-1 overflow-y-auto p-6 bg-white dark:bg-stone-900', className)}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-serif font-medium mb-6 text-center">
          {book} {chapter}
        </h1>
        
        <div className="space-y-2 text-stone-800 dark:text-stone-200">
          {verses.length > 0 ? (
            verses.map(verse => (
              <p key={verse.id} className="leading-relaxed">
                <span
                  className="cursor-pointer group relative"
                  data-ref={`${book}-${chapter}-${verse.verseNumber}`}
                  tabIndex={0}
                  role="link"
                  aria-label={`${book} ${chapter} verse ${verse.verseNumber}`}
                  onClick={() => handleVerseClick(`${book}-${chapter}-${verse.verseNumber}`)}
                >
                  <span className="text-xs text-stone-400 dark:text-stone-500 mr-1 select-none">{verse.verseNumber}</span>
                  <span className="group-hover:text-[#2c4c3b] dark:group-hover:text-[#94b49f] transition-colors">
                    {verse.text}
                  </span>
                </span>
              </p>
            ))
          ) : (
            // Placeholder content when no verses
            Array.from({ length: 10 }).map((_, index) => (
              <p key={index} className="leading-relaxed">
                <span className="text-xs text-stone-400 dark:text-stone-500 mr-1 select-none">{index + 1}</span>
                <span>
                  {index === 0 ? 
                    "In the beginning God created the heaven and the earth." : 
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                </span>
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
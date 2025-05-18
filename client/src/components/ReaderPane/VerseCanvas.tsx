import React from 'react';
import { cn } from '@/lib/utils';

interface VerseProps {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  isSelected?: boolean;
  onClick?: () => void;
}

interface VerseCanvasProps {
  book: string;
  chapter: number;
  verses: Array<{
    verse: number;
    text: string;
  }>;
  selectedVerses?: number[];
  onSelect?: (refs: string[]) => void;
  className?: string;
  textMode?: 'original' | 'genz' | 'novelize' | 'kids';
}

// Individual verse component
function Verse({ book, chapter, verse, text, isSelected, onClick }: VerseProps) {
  return (
    <div 
      className={cn(
        "group flex mb-4", 
        isSelected && "bg-[#e8efe5] dark:bg-[#2c4c3b]/20 -mx-4 px-4 py-2 rounded-md"
      )}
      onClick={onClick}
    >
      <div className="w-8 flex-shrink-0 text-right mr-3">
        <span className="text-sm text-stone-400 dark:text-stone-600 font-medium">
          {verse}
        </span>
      </div>
      <div className="flex-1">
        <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}

// Main verse canvas
export function VerseCanvas({ 
  book, 
  chapter, 
  verses = [], 
  selectedVerses = [],
  onSelect,
  className,
  textMode = 'original'
}: VerseCanvasProps) {
  // Sample data for different text modes (in a real app, this would come from the API)
  const sampleGenZTexts = [
    "So God was like, \"Let there be light,\" and boom—there was light!",
    "God saw the light was fire, so he separated the light from the darkness.",
    "God called the light \"day\" and the darkness \"night.\" Evening and morning—that's day one, done!"
  ];
  
  const sampleNarrativeTexts = [
    "In the beginning, the Creator spoke into the empty void. The divine voice echoed across the nothingness with a simple command: \"Let there be light.\" And in that moment, brilliance flooded what had been void.",
    "The Creator beheld this first light—a pure, radiant energy unlike anything that would come after. Seeing its perfect goodness, the divine mind conceived a separation: light from darkness, creating the first duality of existence.",
    "And so it was that the Creator named these first elements: the light was called \"Day,\" and the darkness was called \"Night.\" As the first evening descended and the first morning arose, the initial day of creation was complete."
  ];
  
  const sampleKidsTexts = [
    "God said, \"Let's make light!\" And wow! Light appeared! God made light with His special words.",
    "God saw the light was super good! He put the light and dark in different places.",
    "God called the light \"Day\" and the dark \"Night.\" That was the end of the very first day ever!"
  ];
  
  // Function to get the appropriate text based on the mode
  const getVerseText = (index: number, originalText: string) => {
    switch(textMode) {
      case 'genz':
        return sampleGenZTexts[index % sampleGenZTexts.length];
      case 'novelize':
        return sampleNarrativeTexts[index % sampleNarrativeTexts.length];
      case 'kids':
        return sampleKidsTexts[index % sampleKidsTexts.length];
      default:
        return originalText;
    }
  };
  
  const handleVerseClick = (verse: number) => {
    const verseRef = `${book} ${chapter}:${verse}`;
    onSelect?.([verseRef]);
  };
  
  return (
    <div className={cn("overflow-y-auto p-4", className)}>
      {verses.length > 0 ? (
        verses.map((verse, index) => (
          <Verse
            key={`${book}-${chapter}-${verse.verse}`}
            book={book}
            chapter={chapter}
            verse={verse.verse}
            text={getVerseText(index, verse.text)}
            isSelected={selectedVerses.includes(verse.verse)}
            onClick={() => handleVerseClick(verse.verse)}
          />
        ))
      ) : (
        // Loading state and sample verses for preview
        <>
          <Verse book={book} chapter={chapter} verse={1} text={getVerseText(0, "In the beginning, God created the heavens and the earth.")} />
          <Verse book={book} chapter={chapter} verse={2} text={getVerseText(1, "The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.")} />
          <Verse book={book} chapter={chapter} verse={3} text={getVerseText(2, "And God said, \"Let there be light,\" and there was light.")} />
        </>
      )}
    </div>
  );
}
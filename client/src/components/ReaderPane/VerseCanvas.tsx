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
  typography?: {
    fontFamily?: string;
    fontSize?: string;
    lineSpacing?: string;
    textAlign?: string;
    margins?: string;
  };
}

interface VerseWithTypographyProps extends VerseProps {
  typography?: {
    fontFamily?: string;
    fontSize?: string;
    lineSpacing?: string;
    textAlign?: string;
    margins?: string;
  };
}

// Individual verse component
function Verse({ 
  book, 
  chapter, 
  verse, 
  text, 
  isSelected, 
  onClick, 
  typography 
}: VerseWithTypographyProps) {
  
  // Apply typography settings to verse text
  const getTypographyClasses = () => {
    const classes = ["text-stone-800 dark:text-stone-200"];
    
    // Font family
    if (typography?.fontFamily === 'serif') {
      classes.push("font-serif");
    } else if (typography?.fontFamily === 'sans') {
      classes.push("font-sans");
    } else if (typography?.fontFamily === 'mono') {
      classes.push("font-mono");
    } else if (typography?.fontFamily === 'dyslexic') {
      classes.push("font-sans"); // Fallback to sans, would use OpenDyslexic if available
    }
    
    // Font size
    if (typography?.fontSize === 'xs') {
      classes.push("text-xs");
    } else if (typography?.fontSize === 'sm') {
      classes.push("text-sm");
    } else if (typography?.fontSize === 'base') {
      classes.push("text-base");
    } else if (typography?.fontSize === 'lg') {
      classes.push("text-lg");
    } else if (typography?.fontSize === 'xl') {
      classes.push("text-xl");
    } else if (typography?.fontSize === '2xl') {
      classes.push("text-2xl");
    } else {
      classes.push("text-base"); // Default
    }
    
    // Line spacing
    if (typography?.lineSpacing === 'tight') {
      classes.push("leading-tight");
    } else if (typography?.lineSpacing === 'normal') {
      classes.push("leading-normal");
    } else if (typography?.lineSpacing === 'relaxed') {
      classes.push("leading-relaxed");
    } else if (typography?.lineSpacing === 'loose') {
      classes.push("leading-loose");
    } else {
      classes.push("leading-relaxed"); // Default
    }
    
    // Text alignment
    if (typography?.textAlign === 'left') {
      classes.push("text-left");
    } else if (typography?.textAlign === 'center') {
      classes.push("text-center");
    } else if (typography?.textAlign === 'justify') {
      classes.push("text-justify");
    } else {
      classes.push("text-left"); // Default
    }
    
    return classes.join(" ");
  };
  
  // Apply margins
  const getMarginClasses = () => {
    const classes = ["group flex mb-4"];
    
    if (isSelected) {
      classes.push("bg-[#e8efe5] dark:bg-[#2c4c3b]/20 -mx-4 px-4 py-2 rounded-md");
    }
    
    // Add margin settings
    if (typography?.margins === 'none') {
      classes.push("mx-0");
    } else if (typography?.margins === 'sm') {
      classes.push("mx-2");
    } else if (typography?.margins === 'md') {
      classes.push("mx-4");
    } else if (typography?.margins === 'lg') {
      classes.push("mx-8");
    } else if (typography?.margins === 'xl') {
      classes.push("mx-12");
    }
    
    return classes.join(" ");
  };
  
  return (
    <div 
      className={getMarginClasses()}
      onClick={onClick}
    >
      <div className="w-8 flex-shrink-0 text-right mr-3">
        <span className="text-sm text-stone-400 dark:text-stone-600 font-medium">
          {verse}
        </span>
      </div>
      <div className="flex-1">
        <p className={getTypographyClasses()}>
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
  textMode = 'original',
  typography
}: VerseCanvasProps) {
  // Sample data for different text modes (in a real app, this would come from the API)
  const sampleGenZTexts = [
    "So God was like, \"Let there be light,\" and boom—there was light! No cap, just vibes!",
    "God saw the light was straight fire, so he separated the light from the darkness. Major glow-up moment.",
    "God called the light \"day\" and the darkness \"night.\" Evening and morning—that's day one, done! First W secured."
  ];
  
  const sampleNarrativeTexts = [
    "Darkness. Complete and total darkness. Then, a voice breaks through. \"Let there be light.\" The voice is gentle yet powerful, resonating with authority. Suddenly, brilliance floods what was once void, as if the Creator's words themselves have substance. The light reveals nothing yet illuminates everything.",
    "The Creator stands at the edge of creation, His eyes reflecting the light He just called into being. With deliberate movements, His hands separate the light from darkness, creating rhythm and order from chaos. He steps back, observing with satisfaction as the two forces find their boundaries.",
    "\"The light will be called 'Day,'\" the Creator proclaims, His voice carrying through the cosmos, \"and the darkness 'Night.'\" He pauses, allowing the significance of these first names to settle into the fabric of creation. As the first evening's glow gives way to morning's fresh brilliance, the Creator's expression reveals the pleasure of a day's work well done."
  ];
  
  const sampleKidsTexts = [
    "God said, \"Let's make light!\" And POOF! Bright, shiny light appeared everywhere! God made it just by speaking His special words!",
    "God looked at the light and said, \"This light is AWESOME!\" Then He put the light and dark in their own special places so they wouldn't get mixed up.",
    "God gave special names to His creation. He called the light \"Day\" (that's when we play!) and the dark \"Night\" (that's when we sleep!). And that was the very first day God ever made!"
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
  
  // Sample verses for when API data isn't loaded yet
  const sampleVerses = [
    { verse: 1, text: "In the beginning, God created the heavens and the earth." },
    { verse: 2, text: "The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters." },
    { verse: 3, text: "And God said, \"Let there be light,\" and there was light." }
  ];
  
  // Use actual verses if available, otherwise use sample data
  const versesToRender = verses.length > 0 ? verses : sampleVerses;
  
  return (
    <div className={cn("overflow-y-auto p-4 reader-paper shadow-inner", className)}>
      {versesToRender.map((verse, index) => (
        <Verse
          key={`${book}-${chapter}-${verse.verse}`}
          book={book}
          chapter={chapter}
          verse={verse.verse}
          text={getVerseText(index, verse.text)}
          isSelected={selectedVerses.includes(verse.verse)}
          onClick={() => handleVerseClick(verse.verse)}
          typography={typography}
        />
      ))}
    </div>
  );
}
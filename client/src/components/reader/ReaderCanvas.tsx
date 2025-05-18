import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { useReaderStore } from '@/lib/readerStore';
import { cn } from '@/lib/utils';

interface ReaderCanvasProps {
  content: {
    text: string;
    verseNumber: number;
    id: string;
  }[];
  book: string;
  chapter: number;
  translation: string;
  onVerseClick?: (verseId: string, verseNumber: number) => void;
  onVerseLongPress?: (verseId: string, verseNumber: number, text: string, event: React.MouseEvent) => void;
}

export const ReaderCanvas: React.FC<ReaderCanvasProps> = ({
  content,
  book,
  chapter,
  translation,
  onVerseClick,
  onVerseLongPress
}) => {
  const {
    fontFamily,
    fontSize,
    lineSpacing,
    textAlignment,
    marginSize,
    currentVerse,
    highlights,
    setCurrentPosition
  } = useReaderStore();
  
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Detect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Get font size in rem
  const fontSizeMap = {
    'xs': '0.875rem',
    'sm': '1rem',
    'base': '1.125rem',
    'lg': '1.25rem',
    'xl': '1.375rem',
    '2xl': '1.5rem'
  };
  
  // Get line spacing
  const lineSpacingMap = {
    'tight': '1.2',
    'normal': '1.5',
    'relaxed': '1.8',
    'loose': '2'
  };
  
  // Get margin size
  const marginSizeMap = {
    'xs': '0.5rem',
    'sm': '1rem',
    'md': '1.5rem',
    'lg': '2rem',
    'xl': '3rem'
  };
  
  // Scroll to verse if currentVerse changes
  useEffect(() => {
    if (currentVerse && contentRef.current) {
      const verseElement = document.getElementById(`verse-${currentVerse}`);
      if (verseElement) {
        verseElement.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
      }
    }
  }, [currentVerse, prefersReducedMotion]);
  
  // Click/touch handlers for verses
  const handleMouseDown = (verseId: string, verseNumber: number, text: string, e: React.MouseEvent) => {
    if (longPressTimer) clearTimeout(longPressTimer);
    
    setIsLongPress(false);
    const timer = setTimeout(() => {
      setIsLongPress(true);
      if (onVerseLongPress) {
        onVerseLongPress(verseId, verseNumber, text, e);
      }
    }, 500);
    
    setLongPressTimer(timer);
  };
  
  const handleMouseUp = (verseId: string, verseNumber: number) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    if (!isLongPress && onVerseClick) {
      onVerseClick(verseId, verseNumber);
      setCurrentPosition({ book, chapter, verse: verseNumber });
    }
    
    setIsLongPress(false);
  };
  
  const handleMouseLeave = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setIsLongPress(false);
  };
  
  // Check if verse is highlighted
  const isVerseHighlighted = (verseId: string) => {
    return highlights.some(h => 
      h.bookId === verseId || 
      (h.book === book && h.chapter === chapter && h.verse === parseInt(verseId.split('-')[1]))
    );
  };
  
  // Get highlight color for a verse
  const getHighlightColor = (verseId: string) => {
    const highlight = highlights.find(h => 
      h.bookId === verseId || 
      (h.book === book && h.chapter === chapter && h.verse === parseInt(verseId.split('-')[1]))
    );
    
    if (!highlight) return null;
    
    const colorMap = {
      'yellow': 'bg-amber-100 dark:bg-amber-900/30',
      'green': 'bg-green-100 dark:bg-green-900/30',
      'blue': 'bg-blue-100 dark:bg-blue-900/30',
      'purple': 'bg-purple-100 dark:bg-purple-900/30',
      'pink': 'bg-pink-100 dark:bg-pink-900/30'
    };
    
    return colorMap[highlight.color];
  };
  
  // Animation for page transitions
  const fadeProps = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { 
      duration: prefersReducedMotion ? 100 : 300
    }
  });
  
  return (
    <animated.div 
      style={fadeProps}
      className={cn(
        'relative',
        {
          'font-serif': fontFamily === 'serif',
          'font-sans': fontFamily === 'sans',
          'font-mono': fontFamily === 'mono'
        }
      )}
      ref={contentRef}
    >
      <div 
        className={cn(
          'bible-text',
          {
            'text-left': textAlignment === 'left',
            'text-justify': textAlignment === 'justify',
            'text-center': textAlignment === 'center'
          }
        )}
        style={{
          fontSize: fontSizeMap[fontSize],
          lineHeight: lineSpacingMap[lineSpacing],
          padding: marginSizeMap[marginSize]
        }}
      >
        {content.map((verse) => (
          <span 
            key={verse.id}
            id={`verse-${verse.verseNumber}`}
            className={cn(
              'verse-container inline relative', 
              {
                'cursor-pointer': !!onVerseClick,
                'border-b border-dashed border-stone-300 dark:border-stone-700': verse.verseNumber === currentVerse,
              }
            )}
            onMouseDown={(e) => handleMouseDown(verse.id, verse.verseNumber, verse.text, e)}
            onMouseUp={() => handleMouseUp(verse.id, verse.verseNumber)}
            onMouseLeave={handleMouseLeave}
            onTouchStart={(e) => handleMouseDown(verse.id, verse.verseNumber, verse.text, e as unknown as React.MouseEvent)}
            onTouchEnd={() => handleMouseUp(verse.id, verse.verseNumber)}
            onTouchCancel={handleMouseLeave}
          >
            <sup className="text-[#2c4c3b] dark:text-[#94b49f] font-medium mr-1">
              {verse.verseNumber}
            </sup>
            <span
              className={cn(
                'verse-text',
                isVerseHighlighted(verse.id) ? getHighlightColor(verse.id) : '',
                verse.verseNumber === currentVerse ? 'font-medium' : ''
              )}
            >
              {verse.text}{' '}
            </span>
          </span>
        ))}
      </div>
    </animated.div>
  );
};

export default ReaderCanvas;
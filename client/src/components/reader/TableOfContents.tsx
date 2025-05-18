import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { bibleStructure, BibleSection, BibleBook } from '@/lib/bibleStructure';
import { ChevronRight, BookOpen, ScrollText, Book, BookText } from 'lucide-react';

interface TableOfContentsProps {
  onClose?: () => void;
  onBookSelect?: (book: string) => void;
  onChapterSelect?: (book: string, chapter: number) => void;
}

export function TableOfContents({ 
  onClose, 
  onBookSelect, 
  onChapterSelect 
}: TableOfContentsProps) {
  const [, navigate] = useLocation();
  const { book: currentBook, chapter: currentChapter } = useParams<{ book?: string; chapter?: string }>();
  
  // State for tracking expanded sections
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  // Auto-expand the testament section that contains the current book
  useEffect(() => {
    if (currentBook) {
      const testament = getTestamentForBook(currentBook);
      if (!expandedSections.includes(testament)) {
        setExpandedSections(prev => [...prev, testament]);
      }
    } else {
      // Default to showing Old Testament when no book is selected
      if (!expandedSections.includes('old-testament')) {
        setExpandedSections(prev => [...prev, 'old-testament']);
      }
    }
  }, [currentBook, expandedSections]);
  
  // Function to determine which testament a book belongs to
  function getTestamentForBook(bookId: string): string {
    const book = bibleStructure.books[bookId.toLowerCase()];
    return book?.testament === 'nt' ? 'new-testament' : 'old-testament';
  }

  // Handle book click
  const handleBookClick = (book: string) => {
    if (onBookSelect) {
      onBookSelect(book);
    } else {
      navigate(`/reader/${book}/1`);
      if (onClose) onClose();
    }
  };

  // Handle chapter click
  const handleChapterClick = (book: string, chapter: number) => {
    if (onChapterSelect) {
      onChapterSelect(book, chapter);
    } else {
      navigate(`/reader/${book}/${chapter}`);
      if (onClose) onClose();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 p-4 pb-2 border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900">
        <h2 className="text-xl font-semibold flex items-center text-stone-800 dark:text-stone-100">
          <BookOpen className="mr-2 h-5 w-5 text-[#2c4c3b] dark:text-[#3a6349]" />
          Table of Contents
        </h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100">
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 overflow-y-auto px-4">
        <Accordion 
          type="multiple" 
          value={expandedSections} 
          onValueChange={setExpandedSections}
          className="w-full"
        >
          {bibleStructure.sections.map((section: BibleSection) => (
            <AccordionItem 
              key={section.id} 
              value={section.id}
              className="border-b border-stone-200 dark:border-stone-700"
            >
              <AccordionTrigger className="hover:no-underline py-2 text-[#2c4c3b] dark:text-[#3a6349]">
                <div className="flex items-center text-left font-medium">
                  <BookText className="h-5 w-5 mr-2" />
                  <span className="text-lg">{section.name}</span>
                  {section.description && (
                    <span className="ml-2 text-xs text-stone-500 dark:text-stone-400 hidden md:inline">
                      ({section.description})
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-1 pb-2">
                  {section.books.map((book: BibleBook) => (
                    <div key={book.id} className="mb-2">
                      <button
                        onClick={() => handleBookClick(book.id)}
                        className={`w-full text-left py-1.5 px-2 rounded-md flex items-center hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${
                          currentBook?.toLowerCase() === book.id.toLowerCase()
                            ? 'bg-stone-200 dark:bg-stone-700 font-medium text-stone-900 dark:text-stone-100'
                            : 'text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <ScrollText className="h-3.5 w-3.5 mr-2 text-stone-500 dark:text-stone-400" />
                        <span>{book.name}</span>
                        {book.shortName && book.shortName !== book.name && (
                          <span className="ml-1 text-xs text-stone-500 dark:text-stone-400">
                            ({book.shortName})
                          </span>
                        )}
                      </button>
                      
                      {/* Show chapters when the book is selected */}
                      {currentBook?.toLowerCase() === book.id.toLowerCase() && (
                        <div className="grid grid-cols-4 gap-1 mt-1 pl-7">
                          {Array.from({ length: book.chapters }, (_, i) => i + 1).map((chapter) => (
                            <button
                              key={chapter}
                              onClick={() => handleChapterClick(book.id, chapter)}
                              className={`text-center py-1 px-1.5 text-sm rounded-md transition-colors ${
                                currentChapter === chapter.toString()
                                  ? 'bg-[#2c4c3b] text-white font-medium dark:bg-[#3a6349] dark:text-white'
                                  : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                              }`}
                            >
                              {chapter}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
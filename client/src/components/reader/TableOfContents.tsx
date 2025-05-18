import React, { useState } from 'react';
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
import { ChevronRight, BookOpen, ScrollText, Book } from 'lucide-react';

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
  const [expandedSections, setExpandedSections] = useState<string[]>([
    currentBook ? getTestamentForBook(currentBook) : 'old-testament'
  ]);
  
  // Function to determine which testament a book belongs to
  function getTestamentForBook(bookId: string): string {
    const book = bibleStructure.books[bookId.toLowerCase()];
    return book?.testament === 'new' ? 'new-testament' : 'old-testament';
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
          <BookOpen className="mr-2 h-5 w-5 text-amber-700 dark:text-amber-500" />
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
              <AccordionTrigger className="hover:no-underline py-2">
                <div className="flex items-center text-left font-medium">
                  <Book className="h-4 w-4 mr-2 text-stone-600 dark:text-stone-400" />
                  <span className="text-stone-800 dark:text-stone-200">{section.name}</span>
                  {section.description && (
                    <span className="ml-2 text-xs text-stone-500 dark:text-stone-400 hidden md:inline">
                      ({section.books.length} books)
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
                        className={`w-full text-left py-2 px-3 rounded-md flex items-center transition-all duration-300 relative overflow-hidden group ${
                          currentBook?.toLowerCase() === book.id.toLowerCase()
                            ? 'bg-amber-100 dark:bg-amber-900/40 font-medium text-amber-900 dark:text-amber-100 shadow-md border-l-4 border-amber-500 dark:border-amber-600 animate-highlight-fade'
                            : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:translate-x-1 hover:border-l-4 hover:border-amber-400/50 dark:hover:border-amber-500/50'
                        }`}
                      >
                        <div className="absolute inset-0 bg-amber-500/10 dark:bg-amber-500/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 rounded-md"></div>
                        <ScrollText className={`h-4 w-4 mr-2 transition-all duration-300 ${
                          currentBook?.toLowerCase() === book.id.toLowerCase()
                            ? 'text-amber-700 dark:text-amber-400 animate-pulse-short'
                            : 'text-stone-500 dark:text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-300 group-hover:scale-125'
                        }`} />
                        <span className={`relative z-10 ${
                          currentBook?.toLowerCase() === book.id.toLowerCase()
                            ? 'animate-slide-right'
                            : ''
                        }`}>{book.name}</span>
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
                              className={`text-center py-2 px-3 text-sm rounded-md relative overflow-hidden transition-all duration-300 ${
                                currentChapter === chapter.toString()
                                  ? 'bg-amber-600 text-white font-medium dark:bg-amber-700 dark:text-white shadow-md transform scale-110 border border-amber-300 dark:border-amber-500'
                                  : 'hover:bg-amber-500 dark:hover:bg-amber-600 hover:text-white dark:hover:text-white text-stone-700 dark:text-stone-300 hover:scale-125 active:scale-95 hover:shadow-md'
                              }`}
                            >
                              <span className={`relative z-10 ${
                                currentChapter === chapter.toString() 
                                  ? 'animate-pulse-short' 
                                  : ''
                              }`}>{chapter}</span>
                              <span className={`absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20 transform scale-0 transition-all duration-500 ${
                                currentChapter !== chapter.toString() ? 'hover:scale-100 hover:rotate-180' : ''
                              }`}></span>
                              {currentChapter === chapter.toString() && (
                                <span className="absolute inset-0 bg-amber-400/20 animate-pulse opacity-75 rounded-md"></span>
                              )}
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
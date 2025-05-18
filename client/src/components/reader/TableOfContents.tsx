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
import { bibleStructure } from '@/lib/bibleStructure';
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
  function getTestamentForBook(bookName: string): string {
    const lowercaseBook = bookName.toLowerCase();
    
    // Check if book is in New Testament
    const newTestamentBooks = bibleStructure.find(section => 
      section.id === 'new-testament'
    )?.books || [];
    
    const isNewTestament = newTestamentBooks.some(book => 
      book.id.toLowerCase() === lowercaseBook
    );
    
    return isNewTestament ? 'new-testament' : 'old-testament';
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
      <div className="flex items-center justify-between mb-4 p-4 pb-2 border-b">
        <h2 className="text-xl font-semibold flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Table of Contents
        </h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
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
          {bibleStructure.map((section) => (
            <AccordionItem 
              key={section.id} 
              value={section.id}
              className="border-b"
            >
              <AccordionTrigger className="hover:no-underline py-2">
                <div className="flex items-center text-left font-medium">
                  <Book className="h-4 w-4 mr-2 opacity-70" />
                  <span>{section.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-1 pb-2">
                  {section.books.map((book) => (
                    <div key={book.id} className="mb-2">
                      <button
                        onClick={() => handleBookClick(book.id)}
                        className={`w-full text-left py-1.5 px-2 rounded-md flex items-center hover:bg-primary/10 ${
                          currentBook?.toLowerCase() === book.id.toLowerCase()
                            ? 'bg-primary/15 font-medium'
                            : ''
                        }`}
                      >
                        <ScrollText className="h-3.5 w-3.5 mr-2 opacity-60" />
                        {book.name}
                      </button>
                      
                      {/* Show chapters when the book is selected */}
                      {currentBook?.toLowerCase() === book.id.toLowerCase() && (
                        <div className="grid grid-cols-4 gap-1 mt-1 pl-7">
                          {Array.from({ length: book.chapters }, (_, i) => i + 1).map((chapter) => (
                            <button
                              key={chapter}
                              onClick={() => handleChapterClick(book.id, chapter)}
                              className={`text-center py-1 px-1.5 text-sm rounded-md hover:bg-primary/10 ${
                                currentChapter === chapter.toString()
                                  ? 'bg-primary text-primary-foreground font-medium'
                                  : ''
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
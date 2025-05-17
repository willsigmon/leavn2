import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaChevronLeft, FaChevronRight, FaBookmark, FaShareAlt, FaCog } from "react-icons/fa";
import AuthorInfo from "./AuthorInfo";

interface BibleHeaderProps {
  book: string;
  chapter: number;
  totalChapters: number;
  translation: string;
}

export default function BibleHeader({ book, chapter, totalChapters, translation }: BibleHeaderProps) {
  const [, setLocation] = useLocation();
  
  const handlePrevChapter = () => {
    if (chapter > 1) {
      setLocation(`/bible/${book.toLowerCase()}/${chapter - 1}`);
    }
  };

  const handleNextChapter = () => {
    if (chapter < totalChapters) {
      setLocation(`/bible/${book.toLowerCase()}/${chapter + 1}`);
    }
  };
  
  const handleChapterChange = (value: string) => {
    setLocation(`/bible/${book.toLowerCase()}/${value.replace("Chapter ", "")}`);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">{book} {chapter}</h1>
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex space-x-1">
              <button 
                className={`text-muted-foreground hover:text-primary ${chapter <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handlePrevChapter}
                disabled={chapter <= 1}
              >
                <FaChevronLeft />
              </button>
              <button 
                className={`text-muted-foreground hover:text-primary ${chapter >= totalChapters ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleNextChapter}
                disabled={chapter >= totalChapters}
              >
                <FaChevronRight />
              </button>
            </div>
            <Select value={`Chapter ${chapter}`} onValueChange={handleChapterChange}>
              <SelectTrigger className="bg-background border-input rounded-md w-32 h-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: totalChapters }, (_, i) => (
                  <SelectItem key={i + 1} value={`Chapter ${i + 1}`}>Chapter {i + 1}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-muted-foreground text-sm hidden md:block">
              {translation}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 mb-4 md:mb-0">
          <Button variant="outline" size="sm" className="inline-flex items-center border-input hover:bg-accent hover:text-accent-foreground">
            <FaBookmark className="mr-1.5" />
            <span>Save</span>
          </Button>
          <Button variant="outline" size="sm" className="inline-flex items-center border-input hover:bg-accent hover:text-accent-foreground">
            <FaShareAlt className="mr-1.5" />
            <span>Share</span>
          </Button>
          <Button variant="outline" size="sm" className="inline-flex items-center border-input hover:bg-accent hover:text-accent-foreground">
            <FaCog className="mr-1.5" />
            <span>Settings</span>
          </Button>
        </div>
      </div>
      
      <AuthorInfo book={book} />
    </div>
  );
}

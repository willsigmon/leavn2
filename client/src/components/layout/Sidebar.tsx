import { Link } from "wouter";
import { FaCalendarDay, FaBookOpen, FaSeedling, FaTimes } from "react-icons/fa";
import { cn } from "@/lib/utils";
import useMobile from "@/hooks/use-mobile";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { bibleData } from "@/lib/bible";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentBook?: string;
}

export default function Sidebar({ isOpen, onClose, currentBook }: SidebarProps) {
  const isMobile = useMobile();
  const [expandedSections, setExpandedSections] = useState({
    old: true,
    new: true,
    apocrypha: false,
    pseudepigrapha: false
  });
  
  // Filter books by testament
  const oldTestamentBooks = bibleData.books
    .filter(book => book.testament === "old")
    .map(book => book.id);
  
  const newTestamentBooks = bibleData.books
    .filter(book => book.testament === "new")
    .map(book => book.id);
    
  const apocryphaBooks = bibleData.books
    .filter(book => book.testament === "apocrypha")
    .map(book => book.id);
    
  const pseudepigraphaBooks = bibleData.books
    .filter(book => book.testament === "pseudepigrapha")
    .map(book => book.id);
    
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatBookTitle = (bookId: string) => {
    const book = bibleData.books.find(b => b.id === bookId);
    return book ? book.title : bookId.charAt(0).toUpperCase() + bookId.slice(1);
  };

  return (
    <aside 
      className={cn(
        "bg-background border-r border-border overflow-y-auto",
        isMobile ? "fixed inset-y-0 left-0 z-40 w-64 transition-transform transform duration-300 ease-in-out" : "hidden md:block w-64",
        isMobile && !isOpen && "-translate-x-full",
        isMobile && isOpen && "translate-x-0"
      )}
    >
      {isMobile && (
        <div className="p-4 flex justify-end">
          <button onClick={onClose} className="text-muted-foreground hover:text-primary">
            <FaTimes className="text-xl" />
          </button>
        </div>
      )}
      
      <div className="px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-3">Reading Plans</h2>
          <ul className="space-y-1">
            <li>
              <Link href="/reading-plans" className="flex items-center px-2 py-2 text-sm rounded-lg hover:bg-muted">
                <FaCalendarDay className="w-5 text-primary mr-2" />
                <span>All Reading Plans</span>
              </Link>
            </li>
            <li>
              <Link href="/reading-plan/plan1" className="flex items-center px-2 py-2 text-sm rounded-lg hover:bg-muted">
                <FaBookOpen className="w-5 text-primary mr-2" />
                <span>Daily Devotional</span>
              </Link>
            </li>
            <li>
              <Link href="/reading-plan/plan2" className="flex items-center px-2 py-2 text-sm rounded-lg hover:bg-muted">
                <FaSeedling className="w-5 text-primary mr-2" />
                <span>New Testament in 90 Days</span>
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Old Testament Section */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('old')}
            className="flex items-center justify-between w-full text-xs uppercase font-bold text-muted-foreground tracking-wider mb-2 hover:text-primary"
          >
            <span>Old Testament</span>
            {expandedSections.old ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {expandedSections.old && (
            <ul className="space-y-1 ml-2">
              {oldTestamentBooks.map((book) => {
                const isActive = currentBook === book;
                
                return (
                  <li key={book}>
                    <Link 
                      href={`/bible/${book}/1`}
                      className={cn(
                        "flex items-center px-2 py-2 text-sm rounded-lg",
                        isActive 
                          ? "font-semibold text-primary bg-accent/10" 
                          : "hover:bg-muted"
                      )}
                    >
                      <span>{formatBookTitle(book)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        {/* New Testament Section */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('new')}
            className="flex items-center justify-between w-full text-xs uppercase font-bold text-muted-foreground tracking-wider mb-2 hover:text-primary"
          >
            <span>New Testament</span>
            {expandedSections.new ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {expandedSections.new && (
            <ul className="space-y-1 ml-2">
              {newTestamentBooks.map((book) => {
                const isActive = currentBook === book;
                
                return (
                  <li key={book}>
                    <Link 
                      href={`/bible/${book}/1`}
                      className={cn(
                        "flex items-center px-2 py-2 text-sm rounded-lg",
                        isActive 
                          ? "font-semibold text-primary bg-accent/10" 
                          : "hover:bg-muted"
                      )}
                    >
                      <span>{formatBookTitle(book)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        {/* Apocrypha/Deuterocanonical Section */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('apocrypha')}
            className="flex items-center justify-between w-full text-xs uppercase font-bold text-muted-foreground tracking-wider mb-2 hover:text-primary"
          >
            <span>Deuterocanonical</span>
            {expandedSections.apocrypha ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {expandedSections.apocrypha && (
            <ul className="space-y-1 ml-2">
              {apocryphaBooks.map((book) => {
                const isActive = currentBook === book;
                
                return (
                  <li key={book}>
                    <Link 
                      href={`/bible/${book}/1`}
                      className={cn(
                        "flex items-center px-2 py-2 text-sm rounded-lg",
                        isActive 
                          ? "font-semibold text-primary bg-accent/10" 
                          : "hover:bg-muted"
                      )}
                    >
                      <span>{formatBookTitle(book)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        {/* Pseudepigrapha Section */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('pseudepigrapha')}
            className="flex items-center justify-between w-full text-xs uppercase font-bold text-muted-foreground tracking-wider mb-2 hover:text-primary"
          >
            <span>Pseudepigrapha</span>
            {expandedSections.pseudepigrapha ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {expandedSections.pseudepigrapha && (
            <ul className="space-y-1 ml-2">
              {pseudepigraphaBooks.map((book) => {
                const isActive = currentBook === book;
                
                return (
                  <li key={book}>
                    <Link 
                      href={`/bible/${book}/1`}
                      className={cn(
                        "flex items-center px-2 py-2 text-sm rounded-lg",
                        isActive 
                          ? "font-semibold text-primary bg-accent/10" 
                          : "hover:bg-muted"
                      )}
                    >
                      <span>{formatBookTitle(book)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}

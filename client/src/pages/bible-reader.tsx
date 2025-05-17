import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import BibleHeader from "@/components/bible/BibleHeader";
import LensSelector from "@/components/bible/LensSelector";
import VerseContainer from "@/components/bible/VerseContainer";
import NotePanel from "@/components/bible/NotePanel";
import NoteModal from "@/components/bible/NoteModal";
import VerseComparison from "@/components/bible/VerseComparison";
import { Verse } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FaExchangeAlt } from "react-icons/fa";

export default function BibleReader() {
  const { book = "proverbs", chapter = "3" } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLens, setSelectedLens] = useState("standard");
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openNoteModal = (verseNum: number) => {
    setSelectedVerse(verseNum);
    setNoteModalOpen(true);
  };
  
  const { data: chapterData, isLoading } = useQuery({
    queryKey: [`/api/bible/${book}/${chapter}`],
    staleTime: Infinity,
  });

  const { data: notes } = useQuery({
    queryKey: [`/api/notes/${book}/${chapter}`],
    staleTime: 60000,
  });

  const bookTitle = book.charAt(0).toUpperCase() + book.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentBook={book} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 py-6 max-w-5xl">
            {isLoading ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-12 w-80" />
                  <Skeleton className="h-6 w-60" />
                </div>
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <div className="space-y-4">
                  {Array(8).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <BibleHeader 
                  book={bookTitle} 
                  chapter={parseInt(chapter)} 
                  totalChapters={chapterData?.totalChapters || 31} 
                  translation={chapterData?.translation || "English Standard Version"} 
                />
                
                <LensSelector selectedLens={selectedLens} onSelectLens={setSelectedLens} />
                
                <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                  <VerseContainer 
                    verses={chapterData?.verses || []} 
                    selectedLens={selectedLens}
                    notes={notes || []}
                    onOpenNoteModal={openNoteModal}
                  />
                  
                  <NotePanel 
                    notes={notes || []} 
                    book={book}
                    chapter={parseInt(chapter)}
                    onOpenNoteModal={openNoteModal}
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      
      {selectedVerse !== null && (
        <NoteModal 
          isOpen={noteModalOpen} 
          onClose={() => setNoteModalOpen(false)}
          verseNumber={selectedVerse}
          verseText={chapterData?.verses?.[selectedVerse - 1]?.text || ""}
          existingNote={notes?.find(note => note.verse === selectedVerse)}
          book={book}
          chapter={parseInt(chapter)}
        />
      )}
    </div>
  );
}

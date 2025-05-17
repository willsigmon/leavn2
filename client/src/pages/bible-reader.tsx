import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import BibleHeader from "@/components/bible/BibleHeader";
import VerseContainer from "@/components/bible/VerseContainer";
import NotePanel from "@/components/bible/NotePanel";
import NoteModal from "@/components/bible/NoteModal";
import NarrativeView from "@/components/bible/NarrativeView";
import DidYouKnowPopover from "@/components/bible/DidYouKnowPopover";
import ContextualQuestionPopover from "@/components/bible/ContextualQuestionPopover";
import SmartTagsDisplay from "@/components/bible/SmartTagsDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, BookText, SplitSquareVertical, LayoutGrid } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Import our new theological perspective components
import TheologicalLensSelector from "@/components/bible/TheologicalLensSelector";
import ReaderModeSelector from "@/components/bible/ReaderModeSelector";

// Define our types
type ViewMode = "verse" | "narrative";
type CompareMode = "single" | "compare";
type TheologicalLens = "standard" | "catholic" | "evangelical" | "jewish" | "atheist";
type ReaderMode = "standard" | "genz" | "kids" | "devotional" | "scholarly";

export default function BibleReader() {
  const { book = "proverbs", chapter = "3" } = useParams();
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  
  // Reader features
  const [viewMode, setViewMode] = useState<ViewMode>("verse");
  const [compareMode, setCompareMode] = useState<CompareMode>("single");
  const [selectedLens, setSelectedLens] = useState<TheologicalLens>("standard");
  const [readerMode, setReaderMode] = useState<ReaderMode>("standard");
  
  // Fetch chapter data
  const { data: chapterData, isLoading } = useQuery({
    queryKey: [`/api/bible/${book}/${chapter}`],
    staleTime: Infinity,
  });

  // Fetch notes
  const { data: notes } = useQuery({
    queryKey: [`/api/notes/${book}/${chapter}`],
    staleTime: 60000,
  });

  // Fetch author info
  const { data: authorInfo } = useQuery({
    queryKey: [`/api/author/${book}`],
    staleTime: Infinity,
  });

  // Handle UI interactions
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openNoteModal = (verseNum: number) => {
    setSelectedVerse(verseNum);
    setNoteModalOpen(true);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === "verse" ? "narrative" : "verse");
  };

  const toggleCompareMode = () => {
    setCompareMode(prev => prev === "single" ? "compare" : "single");
  };

  const handleSelectLens = (lens: string) => {
    setSelectedLens(lens as TheologicalLens);
  };

  const handleSelectReaderMode = (mode: string) => {
    setReaderMode(mode as ReaderMode);
  };

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
                
                {/* View mode selector */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-6">
                  <div className="flex items-center space-x-2">
                    <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                      <TabsList>
                        <TabsTrigger value="verse" className="flex items-center">
                          <BookText className="mr-2 h-4 w-4" />
                          Verse
                        </TabsTrigger>
                        <TabsTrigger value="narrative" className="flex items-center">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Narrative
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    {viewMode === "verse" && (
                      <Button 
                        variant={compareMode === "compare" ? "default" : "outline"} 
                        size="sm"
                        onClick={toggleCompareMode}
                        className="flex items-center"
                      >
                        {compareMode === "compare" ? (
                          <>
                            <LayoutGrid className="mr-2 h-4 w-4" />
                            Single View
                          </>
                        ) : (
                          <>
                            <SplitSquareVertical className="mr-2 h-4 w-4" />
                            Compare
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Narrative Mode */}
                {viewMode === "narrative" ? (
                  <NarrativeView 
                    book={book} 
                    chapter={parseInt(chapter)}
                    lens={selectedLens}
                    onToggleView={toggleViewMode} 
                  />
                ) : (
                  /* Verse Mode */
                  <>
                    <div className="space-y-6 mb-6">
                      {/* Theological lens selector */}
                      <TheologicalLensSelector 
                        selectedLens={selectedLens} 
                        onSelectLens={handleSelectLens}
                        compareMode={compareMode === "compare"}
                        onToggleCompareMode={toggleCompareMode}
                      />
                      
                      {/* Reader mode selector */}
                      <ReaderModeSelector 
                        selectedMode={readerMode} 
                        onSelectMode={handleSelectReaderMode} 
                      />
                    </div>
                    
                    {compareMode === "single" ? (
                      /* Single lens view */
                      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                        <div className="flex-1">
                          <VerseContainer 
                            verses={chapterData?.verses || []} 
                            selectedLens={selectedLens}
                            readerMode={readerMode}
                            notes={notes || []}
                            onOpenNoteModal={openNoteModal}
                          />
                        </div>
                        
                        <div className="md:w-80">
                          <NotePanel 
                            notes={notes || []} 
                            book={book}
                            chapter={parseInt(chapter)}
                            onOpenNoteModal={openNoteModal}
                          />
                        </div>
                      </div>
                    ) : (
                      /* Compare theological perspectives */
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="overflow-hidden">
                          <CardContent className="p-6">
                            <h3 className="text-lg font-serif font-semibold mb-4 text-primary">Catholic Perspective</h3>
                            {chapterData?.verses && (
                              <VerseContainer 
                                verses={chapterData.verses.slice(0, 3)} 
                                selectedLens="catholic"
                                readerMode={readerMode}
                                notes={[]}
                                onOpenNoteModal={openNoteModal}
                                compact={true}
                              />
                            )}
                          </CardContent>
                        </Card>
                        
                        <Card className="overflow-hidden">
                          <CardContent className="p-6">
                            <h3 className="text-lg font-serif font-semibold mb-4 text-primary">Evangelical Perspective</h3>
                            {chapterData?.verses && (
                              <VerseContainer 
                                verses={chapterData.verses.slice(0, 3)} 
                                selectedLens="evangelical"
                                readerMode={readerMode}
                                notes={[]}
                                onOpenNoteModal={openNoteModal}
                                compact={true}
                              />
                            )}
                          </CardContent>
                        </Card>
                        
                        <Card className="overflow-hidden">
                          <CardContent className="p-6">
                            <h3 className="text-lg font-serif font-semibold mb-4 text-primary">Jewish Perspective</h3>
                            {chapterData?.verses && (
                              <VerseContainer 
                                verses={chapterData.verses.slice(0, 3)} 
                                selectedLens="jewish"
                                readerMode={readerMode}
                                notes={[]}
                                onOpenNoteModal={openNoteModal}
                                compact={true}
                              />
                            )}
                          </CardContent>
                        </Card>
                        
                        <Card className="overflow-hidden">
                          <CardContent className="p-6">
                            <h3 className="text-lg font-serif font-semibold mb-4 text-primary">Secular Perspective</h3>
                            {chapterData?.verses && (
                              <VerseContainer 
                                verses={chapterData.verses.slice(0, 3)} 
                                selectedLens="atheist"
                                readerMode={readerMode}
                                notes={[]}
                                onOpenNoteModal={openNoteModal}
                                compact={true}
                              />
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>
      
      {/* Note modal */}
      {selectedVerse !== null && (
        <NoteModal 
          isOpen={noteModalOpen} 
          onClose={() => setNoteModalOpen(false)}
          verseNumber={selectedVerse}
          verseText={chapterData?.verses?.find(v => v.verseNumber === selectedVerse)?.text || ""}
          existingNote={notes?.find(note => note.verse === selectedVerse)}
          book={book}
          chapter={parseInt(chapter)}
        />
      )}
    </div>
  );
}

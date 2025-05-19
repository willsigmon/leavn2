import React from 'react';
import { useLocation } from 'wouter';
import ConceptGrid from '../components/explorer/ConceptGrid';
import { 
  Book, 
  ArrowLeftCircle, 
  Lightbulb,
  BookOpen 
} from 'lucide-react';

const ConceptExplorerPage = () => {
  const [, setLocation] = useLocation();

  const handleNavigateToVerse = (reference) => {
    // Parse the reference (e.g. "Genesis 1:1") into book, chapter, verse
    const parts = reference.split(' ');
    const book = parts[0];
    const chapterVerse = parts[1].split(':');
    const chapter = chapterVerse[0];
    const verse = chapterVerse[1];

    // Navigate to the reader with the appropriate reference
    setLocation(`/reader/${book}/${chapter}?verse=${verse}`);
  };

  return (
    <div className="concept-explorer-page">
      <header className="bg-[#2c4c3b] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            Theological Concept Explorer
          </h1>
          <button 
            onClick={() => setLocation('/reader')}
            className="flex items-center text-sm px-3 py-1 rounded-full bg-white text-[#2c4c3b] hover:bg-opacity-90 transition-all"
          >
            <BookOpen className="h-4 w-4 mr-1" />
            Return to Reader
          </button>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="mb-6 bg-muted/50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Exploring Biblical Concepts</h2>
          <p className="text-muted-foreground">
            This tool helps you discover and explore important theological concepts in the Bible. 
            Each concept is connected to relevant verses and related themes, allowing you to deepen 
            your understanding of Scripture's interconnected ideas.
          </p>
        </div>

        <ConceptGrid onNavigateToVerse={handleNavigateToVerse} />
      </main>

      <footer className="mt-8 py-4 border-t text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <p>Leavn Bible Study App • Theological Concept Explorer</p>
        </div>
      </footer>
    </div>
  );
};

export default ConceptExplorerPage;
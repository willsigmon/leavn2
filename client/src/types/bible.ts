// Bible verse structure
export interface BibleVerse {
  id: string;             // e.g., "Genesis 1:1"
  book: string;           // e.g., "Genesis"
  chapter: number;        // e.g., 1
  verse: number;          // e.g., 1
  text: {
    kjv: string;          // King James Version text
    web: string;          // World English Bible text
  };
  tags?: {                // Optional tags for the verse
    themes?: string[];
    figures?: string[];
    places?: string[];
    timeframe?: string[];
    symbols?: string[];
  };
}

// Chunk structure for embedding
export interface BibleChunk {
  id: string;              // Unique ID for the chunk
  content: string;         // The text content (100-300 words)
  embedding?: number[];    // Vector embedding
  references: {            // References to included verses
    verses: string[];      // List of verse IDs included in this chunk 
    book: string;
    startChapter: number;
    startVerse: number;
    endChapter: number;
    endVerse: number;
  };
  metadata: {
    tags: string[];        // Combined tags from all verses
    translation: string;   // "kjv" or "web"
  };
}
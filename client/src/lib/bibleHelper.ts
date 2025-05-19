// Bible helper utilities for verse retrieval and reader position tracking

interface BookData {
  name: string;
  chapters: string[][];
}

interface Books {
  [key: string]: BookData;
}

// This is a simplified structure - in a real app, we'd load the full Bible data
// For demo purposes, just including minimal Genesis data
const books: Books = {
  genesis: {
    name: 'Genesis',
    chapters: [
      // Chapter 1 (array of verses)
      [
        "In the beginning, God created the heavens and the earth.",
        "The earth was formless and empty. Darkness was on the surface of the deep and God's Spirit was hovering over the surface of the waters.",
        "God said, \"Let there be light,\" and there was light.",
        "God saw the light, and saw that it was good. God divided the light from the darkness.",
        "God called the light \"day\", and the darkness he called \"night\". There was evening and there was morning, the first day."
        // We'd have all verses here in a complete implementation
      ],
      // Chapter 2 (array of verses)
      [
        "The heavens, the earth, and all their vast array were finished.",
        "On the seventh day God finished his work which he had done; and he rested on the seventh day from all his work which he had done.",
        "God blessed the seventh day, and made it holy, because he rested in it from all his work of creation which he had done."
        // We'd have all verses here in a complete implementation
      ]
      // We'd have all chapters here in a complete implementation
    ]
  },
  exodus: {
    name: 'Exodus',
    chapters: [
      // Chapter 1 (array of verses)
      [
        "Now these are the names of the sons of Israel, who came into Egypt (every man and his household came with Jacob):",
        "Reuben, Simeon, Levi, and Judah,",
        "Issachar, Zebulun, and Benjamin,"
        // We'd have all verses here in a complete implementation
      ]
      // We'd have all chapters here in a complete implementation
    ]
  }
};

export interface VerseRange {
  book: string;
  displayName: string;
  chapter: number;
  verses: {
    number: number;
    text: string;
  }[];
}

export function getVerseRange(book: string, chapter: number, startVerse: number, endVerse: number): VerseRange | null {
  // Normalize book name to lowercase for consistent lookup
  const normalizedBook = book.toLowerCase();
  
  // Validate book exists
  if (!books[normalizedBook]) {
    console.error(`Book not found: ${book}`);
    return null;
  }
  
  // Get the chapter array (adjusting for 0-index)
  const chapterData = books[normalizedBook].chapters[chapter - 1];
  if (!chapterData) {
    console.error(`Chapter ${chapter} not found in ${book}`);
    return null;
  }
  
  // Extract the requested verses
  const verses = [];
  for (let i = startVerse; i <= endVerse; i++) {
    if (i <= chapterData.length) {
      verses.push({
        number: i,
        text: chapterData[i - 1]
      });
    }
  }
  
  return {
    book: normalizedBook,
    displayName: books[normalizedBook].name,
    chapter,
    verses
  };
}

// Reader class to prevent overwriting
export class BibleReader {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  
  constructor(id: string) {
    this.id = id;
    this.book = 'genesis';
    this.chapter = 1;
    this.verse = 1;
    this.loadState();
  }
  
  loadState() {
    const saved = localStorage.getItem(`reader_${this.id}`);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        this.book = state.book;
        this.chapter = state.chapter;
        this.verse = state.verse;
      } catch (e) {
        console.error('Failed to load reader state:', e);
        // Use default state if loading fails
        this.book = 'genesis';
        this.chapter = 1;
        this.verse = 1;
      }
    } else {
      // Default starting position
      this.book = 'genesis';
      this.chapter = 1;
      this.verse = 1;
    }
  }
  
  saveState() {
    localStorage.setItem(`reader_${this.id}`, JSON.stringify({
      book: this.book,
      chapter: this.chapter,
      verse: this.verse
    }));
  }
  
  navigate(book: string, chapter: number, verse: number) {
    this.book = book.toLowerCase();
    this.chapter = parseInt(chapter.toString());
    this.verse = parseInt(verse.toString());
    this.saveState();
    return this.getCurrentVerses();
  }
  
  getCurrentVerses(verseCount = 1): VerseRange | null {
    return getVerseRange(this.book, this.chapter, this.verse, this.verse + verseCount - 1);
  }
  
  nextVerse(): VerseRange | null {
    const bookData = books[this.book];
    
    // Safety check in case data isn't available
    if (!bookData || !bookData.chapters || !bookData.chapters[this.chapter - 1]) {
      return this.getCurrentVerses();
    }
    
    const currentChapter = bookData.chapters[this.chapter - 1];
    
    if (this.verse < currentChapter.length) {
      // Move to next verse
      this.verse++;
    } else if (this.chapter < bookData.chapters.length) {
      // Move to next chapter
      this.chapter++;
      this.verse = 1;
    } else {
      // Move to next book
      const bookKeys = Object.keys(books);
      const currentIndex = bookKeys.indexOf(this.book);
      
      if (currentIndex < bookKeys.length - 1) {
        this.book = bookKeys[currentIndex + 1];
        this.chapter = 1;
        this.verse = 1;
      }
    }
    
    this.saveState();
    return this.getCurrentVerses();
  }
  
  previousVerse(): VerseRange | null {
    if (this.verse > 1) {
      // Move to previous verse
      this.verse--;
    } else if (this.chapter > 1) {
      // Move to previous chapter
      this.chapter--;
      // Set to last verse of previous chapter
      const prevChapter = books[this.book].chapters[this.chapter - 1];
      this.verse = prevChapter.length;
    } else {
      // Move to previous book
      const bookKeys = Object.keys(books);
      const currentIndex = bookKeys.indexOf(this.book);
      
      if (currentIndex > 0) {
        this.book = bookKeys[currentIndex - 1];
        // Set to last chapter of previous book
        this.chapter = books[this.book].chapters.length;
        // Set to last verse of last chapter
        const lastChapter = books[this.book].chapters[this.chapter - 1];
        this.verse = lastChapter.length;
      }
    }
    
    this.saveState();
    return this.getCurrentVerses();
  }

  // Get next chapter
  nextChapter(): VerseRange | null {
    const bookData = books[this.book];
    
    if (this.chapter < bookData.chapters.length) {
      // Move to next chapter
      this.chapter++;
      this.verse = 1;
    } else {
      // Move to next book
      const bookKeys = Object.keys(books);
      const currentIndex = bookKeys.indexOf(this.book);
      
      if (currentIndex < bookKeys.length - 1) {
        this.book = bookKeys[currentIndex + 1];
        this.chapter = 1;
        this.verse = 1;
      }
    }
    
    this.saveState();
    return this.getCurrentVerses();
  }

  // Get previous chapter
  previousChapter(): VerseRange | null {
    if (this.chapter > 1) {
      // Move to previous chapter
      this.chapter--;
      this.verse = 1;
    } else {
      // Move to previous book
      const bookKeys = Object.keys(books);
      const currentIndex = bookKeys.indexOf(this.book);
      
      if (currentIndex > 0) {
        this.book = bookKeys[currentIndex - 1];
        // Set to last chapter of previous book
        this.chapter = books[this.book].chapters.length;
        this.verse = 1;
      }
    }
    
    this.saveState();
    return this.getCurrentVerses();
  }
}

// Helper function to get the verso counts for a book
export function getVerseCount(book: string, chapter: number): number {
  const normalizedBook = book.toLowerCase();
  
  // For Genesis specifically (to match existing data)
  if (normalizedBook === 'genesis') {
    const genesisVerseCount = {
      1: 31,  // Genesis 1 has 31 verses
      2: 25,  // Genesis 2 has 25 verses
      3: 24,  // Genesis 3 has 24 verses 
      4: 26,  // Genesis 4 has 26 verses
      5: 32,  // Genesis 5 has 32 verses
      6: 22,  // Genesis 6 has 22 verses
      7: 24,  // Genesis 7 has 24 verses
      8: 22,  // Genesis 8 has 22 verses
      9: 29,  // Genesis 9 has 29 verses
      10: 32, // Genesis 10 has 32 verses
      11: 32, // Genesis 11 has 32 verses
      12: 20, // Genesis 12 has 20 verses
      13: 18, // Genesis 13 has 18 verses
      14: 24, // Genesis 14 has 24 verses
      15: 21, // Genesis 15 has 21 verses
      16: 16, // Genesis 16 has 16 verses
      17: 27, // Genesis 17 has 27 verses
      18: 33, // Genesis 18 has 33 verses
      19: 38, // Genesis 19 has 38 verses
      20: 18, // Genesis 20 has 18 verses
      21: 34, // Genesis 21 has 34 verses
      22: 24, // Genesis 22 has 24 verses
      23: 20, // Genesis 23 has 20 verses
      24: 67, // Genesis 24 has 67 verses
      25: 34, // Genesis 25 has 34 verses
      26: 35, // Genesis 26 has 35 verses
      27: 46, // Genesis 27 has 46 verses
      28: 22, // Genesis 28 has 22 verses
      29: 35, // Genesis 29 has 35 verses
      30: 43, // Genesis 30 has 43 verses
      31: 55, // Genesis 31 has 55 verses
      32: 32, // Genesis 32 has 32 verses 
      33: 20, // Genesis 33 has 20 verses
      34: 31, // Genesis 34 has 31 verses
      35: 29, // Genesis 35 has 29 verses
      36: 43, // Genesis 36 has 43 verses
      37: 36, // Genesis 37 has 36 verses
      38: 30, // Genesis 38 has 30 verses
      39: 23, // Genesis 39 has 23 verses
      40: 23, // Genesis 40 has 23 verses
      41: 57, // Genesis 41 has 57 verses
      42: 38, // Genesis 42 has 38 verses
      43: 34, // Genesis 43 has 34 verses
      44: 34, // Genesis 44 has 34 verses
      45: 28, // Genesis 45 has 28 verses
      46: 34, // Genesis 46 has 34 verses
      47: 31, // Genesis 47 has 31 verses
      48: 22, // Genesis 48 has 22 verses
      49: 33, // Genesis 49 has 33 verses
      50: 26  // Genesis 50 has 26 verses
    };
    return genesisVerseCount[chapter] || 30; // Default to 30 if not found
  }
  
  // For other books, we'd ideally look up from our books data
  // But for now, return a reasonable default
  try {
    if (books[normalizedBook] && books[normalizedBook].chapters[chapter - 1]) {
      return books[normalizedBook].chapters[chapter - 1].length;
    }
  } catch (e) {
    console.error(`Error finding verse count for ${book} ${chapter}:`, e);
  }
  
  return 30; // Default verse count
}

// Export a singleton reader instance for app-wide use
export const globalBibleReader = new BibleReader('main');
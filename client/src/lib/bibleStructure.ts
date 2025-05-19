// Bible structure with proper chapter counts for all books

export interface BibleBook {
  id: string;        // Standardized ID (lowercase, no spaces)
  name: string;      // Display name
  chapters: number;  // Total number of chapters
  testament: 'old' | 'new';
  shortName?: string; // Optional short name for display
}

// Export a special structure that some existing code imports as BibleSection
export interface BibleSection {
  id: string;
  name: string;
  books: BibleBook[];
}

// Main bibleStructure object that's used by existing code
export const bibleStructure = {
  books: {} as Record<string, BibleBook>, // Map of bookId to book object
  oldTestament: [] as BibleBook[],
  newTestament: [] as BibleBook[],
  bookOrder: [] as string[], // Array of book IDs in order
  sections: [] as BibleSection[], // Sections for the table of contents
};

export const bibleBooks: BibleBook[] = [
  // Old Testament - 39 books
  { id: 'genesis', name: 'Genesis', chapters: 50, testament: 'old' },
  { id: 'exodus', name: 'Exodus', chapters: 40, testament: 'old' },
  { id: 'leviticus', name: 'Leviticus', chapters: 27, testament: 'old' },
  { id: 'numbers', name: 'Numbers', chapters: 36, testament: 'old' },
  { id: 'deuteronomy', name: 'Deuteronomy', chapters: 34, testament: 'old' },
  { id: 'joshua', name: 'Joshua', chapters: 24, testament: 'old' },
  { id: 'judges', name: 'Judges', chapters: 21, testament: 'old' },
  { id: 'ruth', name: 'Ruth', chapters: 4, testament: 'old' },
  { id: '1samuel', name: '1 Samuel', chapters: 31, testament: 'old' },
  { id: '2samuel', name: '2 Samuel', chapters: 24, testament: 'old' },
  { id: '1kings', name: '1 Kings', chapters: 22, testament: 'old' },
  { id: '2kings', name: '2 Kings', chapters: 25, testament: 'old' },
  { id: '1chronicles', name: '1 Chronicles', chapters: 29, testament: 'old' },
  { id: '2chronicles', name: '2 Chronicles', chapters: 36, testament: 'old' },
  { id: 'ezra', name: 'Ezra', chapters: 10, testament: 'old' },
  { id: 'nehemiah', name: 'Nehemiah', chapters: 13, testament: 'old' },
  { id: 'esther', name: 'Esther', chapters: 10, testament: 'old' },
  { id: 'job', name: 'Job', chapters: 42, testament: 'old' },
  { id: 'psalms', name: 'Psalms', chapters: 150, testament: 'old' },
  { id: 'proverbs', name: 'Proverbs', chapters: 31, testament: 'old' },
  { id: 'ecclesiastes', name: 'Ecclesiastes', chapters: 12, testament: 'old' },
  { id: 'songofsolomon', name: 'Song of Solomon', chapters: 8, testament: 'old' },
  { id: 'isaiah', name: 'Isaiah', chapters: 66, testament: 'old' },
  { id: 'jeremiah', name: 'Jeremiah', chapters: 52, testament: 'old' },
  { id: 'lamentations', name: 'Lamentations', chapters: 5, testament: 'old' },
  { id: 'ezekiel', name: 'Ezekiel', chapters: 48, testament: 'old' },
  { id: 'daniel', name: 'Daniel', chapters: 12, testament: 'old' },
  { id: 'hosea', name: 'Hosea', chapters: 14, testament: 'old' },
  { id: 'joel', name: 'Joel', chapters: 3, testament: 'old' },
  { id: 'amos', name: 'Amos', chapters: 9, testament: 'old' },
  { id: 'obadiah', name: 'Obadiah', chapters: 1, testament: 'old' },
  { id: 'jonah', name: 'Jonah', chapters: 4, testament: 'old' },
  { id: 'micah', name: 'Micah', chapters: 7, testament: 'old' },
  { id: 'nahum', name: 'Nahum', chapters: 3, testament: 'old' },
  { id: 'habakkuk', name: 'Habakkuk', chapters: 3, testament: 'old' },
  { id: 'zephaniah', name: 'Zephaniah', chapters: 3, testament: 'old' },
  { id: 'haggai', name: 'Haggai', chapters: 2, testament: 'old' },
  { id: 'zechariah', name: 'Zechariah', chapters: 14, testament: 'old' },
  { id: 'malachi', name: 'Malachi', chapters: 4, testament: 'old' },
  
  // New Testament - 27 books
  { id: 'matthew', name: 'Matthew', chapters: 28, testament: 'new' },
  { id: 'mark', name: 'Mark', chapters: 16, testament: 'new' },
  { id: 'luke', name: 'Luke', chapters: 24, testament: 'new' },
  { id: 'john', name: 'John', chapters: 21, testament: 'new' },
  { id: 'acts', name: 'Acts', chapters: 28, testament: 'new' },
  { id: 'romans', name: 'Romans', chapters: 16, testament: 'new' },
  { id: '1corinthians', name: '1 Corinthians', chapters: 16, testament: 'new' },
  { id: '2corinthians', name: '2 Corinthians', chapters: 13, testament: 'new' },
  { id: 'galatians', name: 'Galatians', chapters: 6, testament: 'new' },
  { id: 'ephesians', name: 'Ephesians', chapters: 6, testament: 'new' },
  { id: 'philippians', name: 'Philippians', chapters: 4, testament: 'new' },
  { id: 'colossians', name: 'Colossians', chapters: 4, testament: 'new' },
  { id: '1thessalonians', name: '1 Thessalonians', chapters: 5, testament: 'new' },
  { id: '2thessalonians', name: '2 Thessalonians', chapters: 3, testament: 'new' },
  { id: '1timothy', name: '1 Timothy', chapters: 6, testament: 'new' },
  { id: '2timothy', name: '2 Timothy', chapters: 4, testament: 'new' },
  { id: 'titus', name: 'Titus', chapters: 3, testament: 'new' },
  { id: 'philemon', name: 'Philemon', chapters: 1, testament: 'new' },
  { id: 'hebrews', name: 'Hebrews', chapters: 13, testament: 'new' },
  { id: 'james', name: 'James', chapters: 5, testament: 'new' },
  { id: '1peter', name: '1 Peter', chapters: 5, testament: 'new' },
  { id: '2peter', name: '2 Peter', chapters: 3, testament: 'new' },
  { id: '1john', name: '1 John', chapters: 5, testament: 'new' },
  { id: '2john', name: '2 John', chapters: 1, testament: 'new' },
  { id: '3john', name: '3 John', chapters: 1, testament: 'new' },
  { id: 'jude', name: 'Jude', chapters: 1, testament: 'new' },
  { id: 'revelation', name: 'Revelation', chapters: 22, testament: 'new' }
];

// Helper functions for Bible navigation

// Get book by ID
export function getBookById(bookId: string): BibleBook | undefined {
  return bibleBooks.find(book => book.id === bookId.toLowerCase());
}

// Get book's position in the Bible (1-66)
export function getBookPosition(bookId: string): number {
  const index = bibleBooks.findIndex(book => book.id === bookId.toLowerCase());
  return index >= 0 ? index + 1 : -1;
}

// Get total chapters for a book
export function getTotalChapters(bookId: string): number {
  const book = getBookById(bookId);
  return book ? book.chapters : 0;
}

// Get next chapter (possibly moving to next book)
export function getNextChapter(bookId: string, chapter: number): { bookId: string, chapter: number } {
  const book = getBookById(bookId);
  if (!book) return { bookId, chapter };
  
  if (chapter < book.chapters) {
    // Move to next chapter in same book
    return { bookId, chapter: chapter + 1 };
  } else {
    // Move to first chapter of next book
    const currentBookIndex = bibleBooks.findIndex(b => b.id === bookId.toLowerCase());
    if (currentBookIndex < bibleBooks.length - 1) {
      const nextBook = bibleBooks[currentBookIndex + 1];
      return { bookId: nextBook.id, chapter: 1 };
    }
  }
  
  // If we're at the last chapter of the last book, stay there
  return { bookId, chapter };
}

// Get previous chapter (possibly moving to previous book)
export function getPrevChapter(bookId: string, chapter: number): { bookId: string, chapter: number } {
  const book = getBookById(bookId);
  if (!book) return { bookId, chapter };
  
  if (chapter > 1) {
    // Move to previous chapter in same book
    return { bookId, chapter: chapter - 1 };
  } else {
    // Move to last chapter of previous book
    const currentBookIndex = bibleBooks.findIndex(b => b.id === bookId.toLowerCase());
    if (currentBookIndex > 0) {
      const prevBook = bibleBooks[currentBookIndex - 1];
      return { bookId: prevBook.id, chapter: prevBook.chapters };
    }
  }
  
  // If we're at the first chapter of the first book, stay there
  return { bookId, chapter };
}

// Get books by testament
export function getBooksByTestament(testament: 'old' | 'new'): BibleBook[] {
  return bibleBooks.filter(book => book.testament === testament);
}

// Old Testament books
export const oldTestamentBooks = getBooksByTestament('old');

// New Testament books
export const newTestamentBooks = getBooksByTestament('new');

// Export a special structure that some existing code imports as BibleSection
export interface BibleSection {
  id: string;
  name: string;
  books: BibleBook[];
}

// Initialize the bibleStructure object
// Create a book map for fast lookup
bibleBooks.forEach(book => {
  bibleStructure.books[book.id] = book;
});

// Set up bookOrder as an array of book IDs
bibleStructure.bookOrder = bibleBooks.map(book => book.id);

bibleStructure.oldTestament = oldTestamentBooks;
bibleStructure.newTestament = newTestamentBooks;

// Create sections for navigation
bibleStructure.sections = [
  {
    id: 'old-testament',
    name: 'Old Testament',
    books: oldTestamentBooks
  },
  {
    id: 'new-testament',
    name: 'New Testament',
    books: newTestamentBooks
  }
];
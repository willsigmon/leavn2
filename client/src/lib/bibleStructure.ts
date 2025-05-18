/**
 * Bible structure data for navigation and reference
 */

export interface BibleBook {
  id: string;
  name: string;
  testament: 'old' | 'new';
  chapters: number;
  abbreviation: string;
}

// Complete list of Bible books with metadata
export const bibleBooks: BibleBook[] = [
  // Old Testament
  { id: 'genesis', name: 'Genesis', testament: 'old', chapters: 50, abbreviation: 'Gen' },
  { id: 'exodus', name: 'Exodus', testament: 'old', chapters: 40, abbreviation: 'Exo' },
  { id: 'leviticus', name: 'Leviticus', testament: 'old', chapters: 27, abbreviation: 'Lev' },
  { id: 'numbers', name: 'Numbers', testament: 'old', chapters: 36, abbreviation: 'Num' },
  { id: 'deuteronomy', name: 'Deuteronomy', testament: 'old', chapters: 34, abbreviation: 'Deu' },
  { id: 'joshua', name: 'Joshua', testament: 'old', chapters: 24, abbreviation: 'Jos' },
  { id: 'judges', name: 'Judges', testament: 'old', chapters: 21, abbreviation: 'Jdg' },
  { id: 'ruth', name: 'Ruth', testament: 'old', chapters: 4, abbreviation: 'Rut' },
  { id: '1-samuel', name: '1 Samuel', testament: 'old', chapters: 31, abbreviation: '1Sa' },
  { id: '2-samuel', name: '2 Samuel', testament: 'old', chapters: 24, abbreviation: '2Sa' },
  { id: '1-kings', name: '1 Kings', testament: 'old', chapters: 22, abbreviation: '1Ki' },
  { id: '2-kings', name: '2 Kings', testament: 'old', chapters: 25, abbreviation: '2Ki' },
  { id: '1-chronicles', name: '1 Chronicles', testament: 'old', chapters: 29, abbreviation: '1Ch' },
  { id: '2-chronicles', name: '2 Chronicles', testament: 'old', chapters: 36, abbreviation: '2Ch' },
  { id: 'ezra', name: 'Ezra', testament: 'old', chapters: 10, abbreviation: 'Ezr' },
  { id: 'nehemiah', name: 'Nehemiah', testament: 'old', chapters: 13, abbreviation: 'Neh' },
  { id: 'esther', name: 'Esther', testament: 'old', chapters: 10, abbreviation: 'Est' },
  { id: 'job', name: 'Job', testament: 'old', chapters: 42, abbreviation: 'Job' },
  { id: 'psalms', name: 'Psalms', testament: 'old', chapters: 150, abbreviation: 'Psa' },
  { id: 'proverbs', name: 'Proverbs', testament: 'old', chapters: 31, abbreviation: 'Pro' },
  { id: 'ecclesiastes', name: 'Ecclesiastes', testament: 'old', chapters: 12, abbreviation: 'Ecc' },
  { id: 'song-of-solomon', name: 'Song of Solomon', testament: 'old', chapters: 8, abbreviation: 'SoS' },
  { id: 'isaiah', name: 'Isaiah', testament: 'old', chapters: 66, abbreviation: 'Isa' },
  { id: 'jeremiah', name: 'Jeremiah', testament: 'old', chapters: 52, abbreviation: 'Jer' },
  { id: 'lamentations', name: 'Lamentations', testament: 'old', chapters: 5, abbreviation: 'Lam' },
  { id: 'ezekiel', name: 'Ezekiel', testament: 'old', chapters: 48, abbreviation: 'Eze' },
  { id: 'daniel', name: 'Daniel', testament: 'old', chapters: 12, abbreviation: 'Dan' },
  { id: 'hosea', name: 'Hosea', testament: 'old', chapters: 14, abbreviation: 'Hos' },
  { id: 'joel', name: 'Joel', testament: 'old', chapters: 3, abbreviation: 'Joe' },
  { id: 'amos', name: 'Amos', testament: 'old', chapters: 9, abbreviation: 'Amo' },
  { id: 'obadiah', name: 'Obadiah', testament: 'old', chapters: 1, abbreviation: 'Oba' },
  { id: 'jonah', name: 'Jonah', testament: 'old', chapters: 4, abbreviation: 'Jon' },
  { id: 'micah', name: 'Micah', testament: 'old', chapters: 7, abbreviation: 'Mic' },
  { id: 'nahum', name: 'Nahum', testament: 'old', chapters: 3, abbreviation: 'Nah' },
  { id: 'habakkuk', name: 'Habakkuk', testament: 'old', chapters: 3, abbreviation: 'Hab' },
  { id: 'zephaniah', name: 'Zephaniah', testament: 'old', chapters: 3, abbreviation: 'Zep' },
  { id: 'haggai', name: 'Haggai', testament: 'old', chapters: 2, abbreviation: 'Hag' },
  { id: 'zechariah', name: 'Zechariah', testament: 'old', chapters: 14, abbreviation: 'Zec' },
  { id: 'malachi', name: 'Malachi', testament: 'old', chapters: 4, abbreviation: 'Mal' },
  
  // New Testament
  { id: 'matthew', name: 'Matthew', testament: 'new', chapters: 28, abbreviation: 'Mat' },
  { id: 'mark', name: 'Mark', testament: 'new', chapters: 16, abbreviation: 'Mar' },
  { id: 'luke', name: 'Luke', testament: 'new', chapters: 24, abbreviation: 'Luk' },
  { id: 'john', name: 'John', testament: 'new', chapters: 21, abbreviation: 'Jhn' },
  { id: 'acts', name: 'Acts', testament: 'new', chapters: 28, abbreviation: 'Act' },
  { id: 'romans', name: 'Romans', testament: 'new', chapters: 16, abbreviation: 'Rom' },
  { id: '1-corinthians', name: '1 Corinthians', testament: 'new', chapters: 16, abbreviation: '1Co' },
  { id: '2-corinthians', name: '2 Corinthians', testament: 'new', chapters: 13, abbreviation: '2Co' },
  { id: 'galatians', name: 'Galatians', testament: 'new', chapters: 6, abbreviation: 'Gal' },
  { id: 'ephesians', name: 'Ephesians', testament: 'new', chapters: 6, abbreviation: 'Eph' },
  { id: 'philippians', name: 'Philippians', testament: 'new', chapters: 4, abbreviation: 'Php' },
  { id: 'colossians', name: 'Colossians', testament: 'new', chapters: 4, abbreviation: 'Col' },
  { id: '1-thessalonians', name: '1 Thessalonians', testament: 'new', chapters: 5, abbreviation: '1Th' },
  { id: '2-thessalonians', name: '2 Thessalonians', testament: 'new', chapters: 3, abbreviation: '2Th' },
  { id: '1-timothy', name: '1 Timothy', testament: 'new', chapters: 6, abbreviation: '1Ti' },
  { id: '2-timothy', name: '2 Timothy', testament: 'new', chapters: 4, abbreviation: '2Ti' },
  { id: 'titus', name: 'Titus', testament: 'new', chapters: 3, abbreviation: 'Tit' },
  { id: 'philemon', name: 'Philemon', testament: 'new', chapters: 1, abbreviation: 'Phm' },
  { id: 'hebrews', name: 'Hebrews', testament: 'new', chapters: 13, abbreviation: 'Heb' },
  { id: 'james', name: 'James', testament: 'new', chapters: 5, abbreviation: 'Jas' },
  { id: '1-peter', name: '1 Peter', testament: 'new', chapters: 5, abbreviation: '1Pe' },
  { id: '2-peter', name: '2 Peter', testament: 'new', chapters: 3, abbreviation: '2Pe' },
  { id: '1-john', name: '1 John', testament: 'new', chapters: 5, abbreviation: '1Jn' },
  { id: '2-john', name: '2 John', testament: 'new', chapters: 1, abbreviation: '2Jn' },
  { id: '3-john', name: '3 John', testament: 'new', chapters: 1, abbreviation: '3Jn' },
  { id: 'jude', name: 'Jude', testament: 'new', chapters: 1, abbreviation: 'Jud' },
  { id: 'revelation', name: 'Revelation', testament: 'new', chapters: 22, abbreviation: 'Rev' },
];

/**
 * Get a book object by its ID
 */
export function getBookById(bookId: string): BibleBook | undefined {
  // Normalize the id for comparison
  const normalizedId = bookId.toLowerCase().replace(/\s+/g, '-');
  
  // First try exact match
  let book = bibleBooks.find(b => b.id === normalizedId);
  
  // If not found, try to match without hyphens (e.g. "1samuel" -> "1-samuel")
  if (!book) {
    // Handle cases like "1samuel" -> "1-samuel"
    for (const testBook of bibleBooks) {
      if (testBook.id.replace(/-/g, '') === normalizedId.replace(/-/g, '')) {
        book = testBook;
        break;
      }
    }
  }
  
  // If still not found, try case-insensitive match with name
  if (!book) {
    const lowerBookId = normalizedId.toLowerCase();
    book = bibleBooks.find(b => 
      b.name.toLowerCase() === lowerBookId ||
      b.name.toLowerCase().replace(/\s+/g, '-') === lowerBookId
    );
  }
  
  return book;
}

/**
 * Get next chapter in reading order
 */
export function getNextChapter(bookId: string, chapter: number): { book: string, chapter: number } | null {
  const book = getBookById(bookId);
  if (!book) return null;
  
  // Case 1: Not the last chapter of the current book
  if (chapter < book.chapters) {
    return { book: book.id, chapter: chapter + 1 };
  }
  
  // Case 2: Last chapter of current book, find the next book
  const currentBookIndex = bibleBooks.findIndex(b => b.id === book.id);
  if (currentBookIndex === -1 || currentBookIndex === bibleBooks.length - 1) {
    return null; // No next book available
  }
  
  const nextBook = bibleBooks[currentBookIndex + 1];
  return { book: nextBook.id, chapter: 1 };
}

/**
 * Get previous chapter in reading order
 */
export function getPrevChapter(bookId: string, chapter: number): { book: string, chapter: number } | null {
  const book = getBookById(bookId);
  if (!book) return null;
  
  // Case 1: Not the first chapter of the current book
  if (chapter > 1) {
    return { book: book.id, chapter: chapter - 1 };
  }
  
  // Case 2: First chapter of current book, find the previous book
  const currentBookIndex = bibleBooks.findIndex(b => b.id === book.id);
  if (currentBookIndex <= 0) {
    return null; // No previous book available
  }
  
  const prevBook = bibleBooks[currentBookIndex - 1];
  return { book: prevBook.id, chapter: prevBook.chapters };
}

/**
 * Get all books in a specific testament
 */
export function getBooksInTestament(testament: 'old' | 'new'): BibleBook[] {
  return bibleBooks.filter(book => book.testament === testament);
}

/**
 * Group books by categories for table of contents
 */
export function getBooksGroupedByCategory(): Record<string, BibleBook[]> {
  return {
    'Pentateuch': bibleBooks.slice(0, 5),
    'Historical Books': bibleBooks.slice(5, 17),
    'Wisdom Literature': bibleBooks.slice(17, 22),
    'Major Prophets': bibleBooks.slice(22, 27),
    'Minor Prophets': bibleBooks.slice(27, 39),
    'Gospels & Acts': bibleBooks.slice(39, 44),
    'Pauline Epistles': bibleBooks.slice(44, 57),
    'General Epistles': bibleBooks.slice(57, 64),
    'Apocalyptic': bibleBooks.slice(64)
  };
}

/**
 * Convert a book name to ID format
 */
export function bookNameToId(bookName: string): string {
  return bookName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Generate array of chapter numbers for a book
 */
export function getChaptersForBook(bookId: string): number[] {
  const book = getBookById(bookId);
  if (!book) return [];
  
  return Array.from({ length: book.chapters }, (_, i) => i + 1);
}
// Define the structure of the Bible with books and number of chapters
export interface BibleBook {
  id: string;
  name: string;
  chapters: number;
  type?: 'canonical' | 'deuterocanonical' | 'apocrypha';
  glyphType?: 'law' | 'history' | 'poetry' | 'prophecy' | 'gospel' | 'epistle' | 'apocalyptic';
}

export interface BibleTestament {
  id: string;
  name: string;
  books: BibleBook[];
}

// Bible structure with Old and New Testaments
export const bibleStructure: BibleTestament[] = [
  {
    id: 'old-testament',
    name: 'Old Testament',
    books: [
      // Torah (Law)
      { id: 'genesis', name: 'Genesis', chapters: 50, glyphType: 'law' },
      { id: 'exodus', name: 'Exodus', chapters: 40, glyphType: 'law' },
      { id: 'leviticus', name: 'Leviticus', chapters: 27, glyphType: 'law' },
      { id: 'numbers', name: 'Numbers', chapters: 36, glyphType: 'law' },
      { id: 'deuteronomy', name: 'Deuteronomy', chapters: 34, glyphType: 'law' },
      
      // Historical Books
      { id: 'joshua', name: 'Joshua', chapters: 24, glyphType: 'history' },
      { id: 'judges', name: 'Judges', chapters: 21, glyphType: 'history' },
      { id: 'ruth', name: 'Ruth', chapters: 4, glyphType: 'history' },
      { id: '1samuel', name: '1 Samuel', chapters: 31, glyphType: 'history' },
      { id: '2samuel', name: '2 Samuel', chapters: 24, glyphType: 'history' },
      { id: '1kings', name: '1 Kings', chapters: 22, glyphType: 'history' },
      { id: '2kings', name: '2 Kings', chapters: 25, glyphType: 'history' },
      { id: '1chronicles', name: '1 Chronicles', chapters: 29, glyphType: 'history' },
      { id: '2chronicles', name: '2 Chronicles', chapters: 36, glyphType: 'history' },
      { id: 'ezra', name: 'Ezra', chapters: 10, glyphType: 'history' },
      { id: 'nehemiah', name: 'Nehemiah', chapters: 13, glyphType: 'history' },
      { id: 'esther', name: 'Esther', chapters: 10, glyphType: 'history' },
      
      // Wisdom Literature
      { id: 'job', name: 'Job', chapters: 42, glyphType: 'poetry' },
      { id: 'psalms', name: 'Psalms', chapters: 150, glyphType: 'poetry' },
      { id: 'proverbs', name: 'Proverbs', chapters: 31, glyphType: 'poetry' },
      { id: 'ecclesiastes', name: 'Ecclesiastes', chapters: 12, glyphType: 'poetry' },
      { id: 'songofsolomon', name: 'Song of Solomon', chapters: 8, glyphType: 'poetry' },
      
      // Major Prophets
      { id: 'isaiah', name: 'Isaiah', chapters: 66, glyphType: 'prophecy' },
      { id: 'jeremiah', name: 'Jeremiah', chapters: 52, glyphType: 'prophecy' },
      { id: 'lamentations', name: 'Lamentations', chapters: 5, glyphType: 'poetry' },
      { id: 'ezekiel', name: 'Ezekiel', chapters: 48, glyphType: 'prophecy' },
      { id: 'daniel', name: 'Daniel', chapters: 12, glyphType: 'prophecy' },
      
      // Minor Prophets
      { id: 'hosea', name: 'Hosea', chapters: 14, glyphType: 'prophecy' },
      { id: 'joel', name: 'Joel', chapters: 3, glyphType: 'prophecy' },
      { id: 'amos', name: 'Amos', chapters: 9, glyphType: 'prophecy' },
      { id: 'obadiah', name: 'Obadiah', chapters: 1, glyphType: 'prophecy' },
      { id: 'jonah', name: 'Jonah', chapters: 4, glyphType: 'prophecy' },
      { id: 'micah', name: 'Micah', chapters: 7, glyphType: 'prophecy' },
      { id: 'nahum', name: 'Nahum', chapters: 3, glyphType: 'prophecy' },
      { id: 'habakkuk', name: 'Habakkuk', chapters: 3, glyphType: 'prophecy' },
      { id: 'zephaniah', name: 'Zephaniah', chapters: 3, glyphType: 'prophecy' },
      { id: 'haggai', name: 'Haggai', chapters: 2, glyphType: 'prophecy' },
      { id: 'zechariah', name: 'Zechariah', chapters: 14, glyphType: 'prophecy' },
      { id: 'malachi', name: 'Malachi', chapters: 4, glyphType: 'prophecy' }
    ]
  },
  {
    id: 'new-testament',
    name: 'New Testament',
    books: [
      // Gospels
      { id: 'matthew', name: 'Matthew', chapters: 28, glyphType: 'gospel' },
      { id: 'mark', name: 'Mark', chapters: 16, glyphType: 'gospel' },
      { id: 'luke', name: 'Luke', chapters: 24, glyphType: 'gospel' },
      { id: 'john', name: 'John', chapters: 21, glyphType: 'gospel' },
      
      // History
      { id: 'acts', name: 'Acts', chapters: 28, glyphType: 'history' },
      
      // Pauline Epistles
      { id: 'romans', name: 'Romans', chapters: 16, glyphType: 'epistle' },
      { id: '1corinthians', name: '1 Corinthians', chapters: 16, glyphType: 'epistle' },
      { id: '2corinthians', name: '2 Corinthians', chapters: 13, glyphType: 'epistle' },
      { id: 'galatians', name: 'Galatians', chapters: 6, glyphType: 'epistle' },
      { id: 'ephesians', name: 'Ephesians', chapters: 6, glyphType: 'epistle' },
      { id: 'philippians', name: 'Philippians', chapters: 4, glyphType: 'epistle' },
      { id: 'colossians', name: 'Colossians', chapters: 4, glyphType: 'epistle' },
      { id: '1thessalonians', name: '1 Thessalonians', chapters: 5, glyphType: 'epistle' },
      { id: '2thessalonians', name: '2 Thessalonians', chapters: 3, glyphType: 'epistle' },
      { id: '1timothy', name: '1 Timothy', chapters: 6, glyphType: 'epistle' },
      { id: '2timothy', name: '2 Timothy', chapters: 4, glyphType: 'epistle' },
      { id: 'titus', name: 'Titus', chapters: 3, glyphType: 'epistle' },
      { id: 'philemon', name: 'Philemon', chapters: 1, glyphType: 'epistle' },
      
      // General Epistles
      { id: 'hebrews', name: 'Hebrews', chapters: 13, glyphType: 'epistle' },
      { id: 'james', name: 'James', chapters: 5, glyphType: 'epistle' },
      { id: '1peter', name: '1 Peter', chapters: 5, glyphType: 'epistle' },
      { id: '2peter', name: '2 Peter', chapters: 3, glyphType: 'epistle' },
      { id: '1john', name: '1 John', chapters: 5, glyphType: 'epistle' },
      { id: '2john', name: '2 John', chapters: 1, glyphType: 'epistle' },
      { id: '3john', name: '3 John', chapters: 1, glyphType: 'epistle' },
      { id: 'jude', name: 'Jude', chapters: 1, glyphType: 'epistle' },
      
      // Apocalyptic
      { id: 'revelation', name: 'Revelation', chapters: 22, glyphType: 'apocalyptic' }
    ]
  },
  {
    id: 'deuterocanonical',
    name: 'Deuterocanonical Books',
    books: [
      { id: 'tobit', name: 'Tobit', chapters: 14, type: 'deuterocanonical' },
      { id: 'judith', name: 'Judith', chapters: 16, type: 'deuterocanonical' },
      { id: 'wisdom', name: 'Wisdom of Solomon', chapters: 19, type: 'deuterocanonical' },
      { id: 'sirach', name: 'Sirach (Ecclesiasticus)', chapters: 51, type: 'deuterocanonical' },
      { id: 'baruch', name: 'Baruch', chapters: 6, type: 'deuterocanonical' },
      { id: '1maccabees', name: '1 Maccabees', chapters: 16, type: 'deuterocanonical' },
      { id: '2maccabees', name: '2 Maccabees', chapters: 15, type: 'deuterocanonical' }
    ]
  },
  {
    id: 'apocrypha-other',
    name: 'Other Texts',
    books: [
      { id: 'enoch', name: 'Enoch', chapters: 108, type: 'apocrypha' },
      { id: 'jubilees', name: 'Jubilees', chapters: 50, type: 'apocrypha' },
      { id: '3maccabees', name: '3 Maccabees', chapters: 7, type: 'apocrypha' },
      { id: '4maccabees', name: '4 Maccabees', chapters: 18, type: 'apocrypha' }
    ]
  }
];

// Helper function to get a book by its ID
export function getBookById(bookId: string): BibleBook | undefined {
  const normalizedId = bookId.toLowerCase();
  
  for (const testament of bibleStructure) {
    const foundBook = testament.books.find(
      book => book.id.toLowerCase() === normalizedId
    );
    
    if (foundBook) {
      return foundBook;
    }
  }
  
  return undefined;
}

// Helper function to get next/previous books
export function getAdjacentBook(currentBookId: string, direction: 'next' | 'prev'): BibleBook | undefined {
  // Flatten all books into a single array
  const allBooks = bibleStructure.flatMap(testament => testament.books);
  
  // Find the index of the current book
  const currentIndex = allBooks.findIndex(
    book => book.id.toLowerCase() === currentBookId.toLowerCase()
  );
  
  if (currentIndex === -1) return undefined;
  
  // Calculate the adjacent index
  const adjacentIndex = direction === 'next' 
    ? (currentIndex + 1) % allBooks.length
    : (currentIndex - 1 + allBooks.length) % allBooks.length;
    
  return allBooks[adjacentIndex];
}

// Helper function to check if a chapter is valid for a book
export function isValidChapter(bookId: string, chapter: number): boolean {
  const book = getBookById(bookId);
  if (!book) return false;
  
  return chapter >= 1 && chapter <= book.chapters;
}

// Get the next chapter (potentially in the next book)
export function getNextChapter(bookId: string, chapter: number): { bookId: string; chapter: number } {
  const book = getBookById(bookId);
  if (!book) return { bookId, chapter };
  
  // If not the last chapter of the book, just increment the chapter
  if (chapter < book.chapters) {
    return { bookId, chapter: chapter + 1 };
  }
  
  // If it is the last chapter, go to the next book
  const nextBook = getAdjacentBook(bookId, 'next');
  if (!nextBook) return { bookId, chapter };
  
  return { bookId: nextBook.id, chapter: 1 };
}

// Get the previous chapter (potentially in the previous book)
export function getPrevChapter(bookId: string, chapter: number): { bookId: string; chapter: number } {
  const book = getBookById(bookId);
  if (!book) return { bookId, chapter };
  
  // If not the first chapter of the book, just decrement the chapter
  if (chapter > 1) {
    return { bookId, chapter: chapter - 1 };
  }
  
  // If it is the first chapter, go to the previous book
  const prevBook = getAdjacentBook(bookId, 'prev');
  if (!prevBook) return { bookId, chapter };
  
  return { bookId: prevBook.id, chapter: prevBook.chapters };
}
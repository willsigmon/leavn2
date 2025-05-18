import fs from 'fs';
import path from 'path';

interface BibleVerse {
  id: string;
  verse: number;
  text: {
    kjv: string;
    web: string;
  };
}

interface BibleChapter {
  book: string;
  bookName: string;
  chapter: number;
  totalChapters: number;
  verses: BibleVerse[];
}

// Load Bible data
let bibleData: any = null;
let isLoaded = false;

const loadBibleData = () => {
  if (isLoaded) return;

  try {
    const filePath = path.join(__dirname, '../data/bible_full.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    bibleData = JSON.parse(jsonData);
    console.log(`Loaded ${Object.keys(bibleData).length} books from Bible data.`);
    isLoaded = true;
  } catch (error) {
    console.error('Error loading Bible data:', error);
    throw error;
  }
};

// Get all verses for a chapter
export const getChapter = async (book: string, chapter: number): Promise<BibleChapter | null> => {
  if (!isLoaded) loadBibleData();

  const normalizedBook = book.charAt(0).toUpperCase() + book.slice(1).toLowerCase();

  if (!bibleData[normalizedBook]) {
    return null;
  }

  const bookData = bibleData[normalizedBook];
  const chapterData = bookData.chapters[chapter - 1]; // Chapters are 0-indexed in the data

  if (!chapterData) {
    return null;
  }

  // Return the complete chapter data without limiting verses
  return {
    book: normalizedBook,
    bookName: bookData.name || normalizedBook,
    chapter,
    totalChapters: bookData.chapters.length,
    verses: chapterData.verses.map((verse: any, index: number) => ({
      id: `${normalizedBook}:${chapter}:${index + 1}`,
      verse: index + 1,
      text: {
        kjv: verse.kjv,
        web: verse.web
      }
    }))
  };
};

// Get a specific verse
export const getVerse = async (book: string, chapter: number, verse: number): Promise<BibleVerse | null> => {
  if (!isLoaded) loadBibleData();

  const normalizedBook = book.charAt(0).toUpperCase() + book.slice(1).toLowerCase();

  if (!bibleData[normalizedBook]) {
    return null;
  }

  const bookData = bibleData[normalizedBook];
  const chapterData = bookData.chapters[chapter - 1]; // Chapters are 0-indexed in the data

  if (!chapterData || !chapterData.verses || verse > chapterData.verses.length) {
    return null;
  }

  const verseData = chapterData.verses[verse - 1]; // Verses are 0-indexed in the data

  return {
    id: `${normalizedBook}:${chapter}:${verse}`,
    verse,
    text: {
      kjv: verseData.kjv,
      web: verseData.web
    }
  };
};

// Get multiple verses
export const getVerses = async (
  book: string, 
  chapter: number, 
  startVerse: number, 
  endVerse: number
): Promise<BibleVerse[]> => {
  if (!isLoaded) loadBibleData();

  const normalizedBook = book.charAt(0).toUpperCase() + book.slice(1).toLowerCase();

  if (!bibleData[normalizedBook]) {
    return [];
  }

  const bookData = bibleData[normalizedBook];
  const chapterData = bookData.chapters[chapter - 1]; // Chapters are 0-indexed in the data

  if (!chapterData) {
    return [];
  }

  const verses: BibleVerse[] = [];

  for (let i = startVerse; i <= endVerse; i++) {
    if (i <= chapterData.verses.length) {
      const verseData = chapterData.verses[i - 1]; // Verses are 0-indexed in the data

      verses.push({
        id: `${normalizedBook}:${chapter}:${i}`,
        verse: i,
        text: {
          kjv: verseData.kjv,
          web: verseData.web
        }
      });
    }
  }

  return verses;
};

// Initialize the cache
loadBibleData();
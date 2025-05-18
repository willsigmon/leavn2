/**
 * Bible data processing utilities
 */

import { bibleStructure } from './bibleStructure';

// Bible chapter interface matches the structure from API
export interface BibleChapter {
  book: string;
  bookName: string;
  chapter: number;
  totalChapters: number;
  verses: {
    verse: number;
    text: string;
    kjv?: string;
    web?: string;
    genz?: string;
    kids?: string;
    novelize?: string;
  }[];
}

// Bible data interface matches the structure from the processed JSON
interface BibleData {
  [book: string]: {
    name: string;
    chapters: {
      verses: {
        kjv: string;
        web: string;
      }[];
    }[];
  };
}

let bibleData: BibleData | null = null;

/**
 * Load Bible data from JSON
 */
export async function loadBibleData(): Promise<boolean> {
  try {
    if (bibleData) return true;
    
    // In a real implementation, we would fetch from the server
    // For now, we'll use a mocked implementation that simulates the data
    // structure from the attached file
    
    console.log('Loading Bible data...');
    bibleData = await mockBibleData();
    
    return true;
  } catch (error) {
    console.error('Failed to load Bible data:', error);
    return false;
  }
}

/**
 * Get chapter data for a specific book and chapter
 */
export async function getChapterData(bookId: string, chapterNum: number): Promise<BibleChapter | null> {
  if (!bibleData) {
    const loaded = await loadBibleData();
    if (!loaded) return null;
  }
  
  const book = bibleData![bookId] || bibleData![bookId.toLowerCase()];
  if (!book || !book.chapters || !book.chapters[chapterNum - 1]) {
    return null;
  }
  
  const bookInfo = bibleStructure.books[bookId.toLowerCase()];
  if (!bookInfo) return null;
  
  // Get the chapter data
  const chapterVerses = book.chapters[chapterNum - 1].verses;
  
  // Format verses for the reader
  const verses = chapterVerses.map((verse, index) => ({
    verse: index + 1,
    text: verse.web || verse.kjv || '',
    kjv: verse.kjv || '',
    web: verse.web || ''
  }));
  
  return {
    book: bookId,
    bookName: bookInfo.name,
    chapter: chapterNum,
    totalChapters: bookInfo.chapters,
    verses
  };
}

/**
 * Mock Bible data for development
 * This simulates the structure of the processed bible_full.json file
 */
async function mockBibleData(): Promise<BibleData> {
  // In a real implementation, we would fetch this from the server
  // This is just a simple mock that follows the structure shown in the attached file
  
  const mockData: BibleData = {
    "Genesis": {
      name: "Genesis",
      chapters: [
        {
          verses: Array(31).fill(0).map((_, i) => ({
            kjv: `KJV text for Genesis 1:${i+1}`,
            web: `In the beginning God created the heavens and the earth. (Genesis 1:${i+1})`
          }))
        },
        {
          verses: Array(25).fill(0).map((_, i) => ({
            kjv: `KJV text for Genesis 2:${i+1}`,
            web: `Thus the heavens and the earth were finished, and all their vast array. (Genesis 2:${i+1})`
          }))
        }
      ]
    },
    "Joshua": {
      name: "Joshua",
      chapters: [
        {
          verses: Array(18).fill(0).map((_, i) => ({
            kjv: `KJV text for Joshua 1:${i+1}`,
            web: `Now after the death of Moses the servant of the LORD, the LORD spoke to Joshua the son of Nun, Moses' servant, saying... (Joshua 1:${i+1})`
          }))
        }
      ]
    }
  };
  
  return mockData;
}

/**
 * Generate alternative text versions based on a verse
 * In a real implementation, this would call an API
 */
export function generateAlternativeText(verse: string, mode: 'genz' | 'kids' | 'novelize'): string {
  switch (mode) {
    case 'genz':
      return `${verse} [Gen-Z version would appear here]`;
    case 'kids':
      return `${verse} [Kids version would appear here]`;
    case 'novelize':
      return `${verse} [Narrative version inspired by "The Chosen" would appear here]`;
    default:
      return verse;
  }
}
/**
 * Bible data processing utilities
 */

import { bibleStructure } from './bibleStructure';
import { processBibleData, getChapterDataFromProcessed, generateAlternativeVersions } from './processBibleData';

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

// Bible data from the processed JSON
let processedBibleData: Record<string, any> | null = null;

/**
 * Load Bible data from JSON
 */
export async function loadBibleData(): Promise<boolean> {
  try {
    if (processedBibleData) return true;
    
    console.log('Loading Bible data...');
    processedBibleData = await processBibleData();
    
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
  if (!processedBibleData) {
    const loaded = await loadBibleData();
    if (!loaded) return null;
  }
  
  const chapterData = getChapterDataFromProcessed(processedBibleData!, bookId, chapterNum);
  if (!chapterData) return null;
  
  // For each verse, generate the alternative versions if they don't exist
  chapterData.verses = chapterData.verses.map(verse => {
    if (!verse.genz || !verse.kids || !verse.novelize) {
      const baseText = verse.web || verse.kjv || verse.text;
      const alternativeVersions = generateAlternativeVersions(baseText);
      
      return {
        ...verse,
        genz: verse.genz || alternativeVersions.genz,
        kids: verse.kids || alternativeVersions.kids,
        novelize: verse.novelize || alternativeVersions.novelize
      };
    }
    return verse;
  });
  
  return chapterData;
}

/**
 * Generate alternative text versions based on a verse
 * In a real implementation, this would call an API
 */
export function generateAlternativeText(verse: string, mode: 'genz' | 'kids' | 'novelize'): string {
  const alternativeVersions = generateAlternativeVersions(verse);
  return alternativeVersions[mode] || verse;
}
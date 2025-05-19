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
    hasNote?: boolean;
    highlightColor?: string;
  }[];
}

/**
 * Load Bible data
 */
export async function loadBibleData(): Promise<boolean> {
  try {
    console.log('Bible data API ready');
    return true;
  } catch (error) {
    console.error('Failed to check Bible data API:', error);
    return false;
  }
}

/**
 * Get chapter data for a specific book and chapter
 */
export async function getChapterData(bookId: string, chapterNum: number): Promise<BibleChapter | null> {
  try {
    // Fetch from the server API
    const response = await fetch(`/api/reader/${bookId}/${chapterNum}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch chapter data: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Enhance the verses with alternative versions
    const enhancedVerses = data.verses.map(verse => ({
      ...verse,
      // Generate alternative versions if not already present
      genz: verse.genz || generateAlternativeText(verse.text || verse.kjv || verse.web || '', 'genz'),
      kids: verse.kids || generateAlternativeText(verse.text || verse.kjv || verse.web || '', 'kids'),
      novelize: verse.novelize || generateAlternativeText(verse.text || verse.kjv || verse.web || '', 'novelize')
    }));
    
    // Return the enhanced chapter data
    return {
      ...data,
      verses: enhancedVerses
    };
  } catch (error) {
    console.error('Error fetching chapter data:', error);
    
    // Fallback to using the Bible structure for basic information
    const bookInfo = bibleStructure.books[bookId.toLowerCase()];
    if (!bookInfo) return null;
    
    // Create minimal fallback data
    return {
      book: bookId,
      bookName: bookInfo.name,
      chapter: chapterNum,
      totalChapters: bookInfo.chapters,
      verses: Array(10).fill(0).map((_, i) => ({
        verse: i + 1,
        text: `Verse ${i + 1} text would appear here.`,
        kjv: `KJV: Verse ${i + 1} text would appear here.`,
        web: `WEB: Verse ${i + 1} text would appear here.`
      }))
    };
  }
}

/**
 * Generate alternative text versions based on a verse
 */
export function generateAlternativeText(verse: string, mode: 'genz' | 'kids' | 'novelize'): string {
  try {
    // In a production app, this would call the server API to get the alternative version
    // /api/reader/:book/:chapter/:verse/versions
    // For now, generate them on the fly
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
  } catch (error) {
    console.error(`Error generating ${mode} text:`, error);
    return verse;
  }
}

/**
 * Get theological commentary for a verse with the specified lens
 */
export async function getTheologicalCommentary(
  book: string, 
  chapter: number, 
  verse: number, 
  lens: string
): Promise<string> {
  try {
    // Fetch from the server API
    const response = await fetch(`/api/reader/${book}/${chapter}/${verse}/commentary/${lens}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch commentary: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error fetching commentary:', error);
    return `Commentary from a ${lens} perspective would appear here.`;
  }
}

/**
 * Get narrative version of a chapter
 */
export async function getNarrativeChapter(book: string, chapter: number): Promise<string> {
  try {
    // Fetch from the server API
    const response = await fetch(`/api/reader/${book}/${chapter}/narrative`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch narrative: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.narrative;
  } catch (error) {
    console.error('Error fetching narrative:', error);
    return `Narrative version of ${book} chapter ${chapter} would appear here.`;
  }
}
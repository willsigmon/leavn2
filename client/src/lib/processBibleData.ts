/**
 * Process Bible data from the hierarchical JSON format
 */

import { BibleChapter } from './bibleData';
import { bibleStructure } from './bibleStructure';

/**
 * Process Bible data from the hierarchical JSON format
 */
export async function processBibleData(filePath: string = '/data/bible_full.json'): Promise<Record<string, any>> {
  try {
    // In a real production app, we would fetch this from the server API
    // For now, we'll mock the format based on the provided script
    
    // Mock data format based on the provided script:
    const mockData = {
      "Genesis": {
        name: "Genesis",
        chapters: [
          {
            verses: Array(31).fill(0).map((_, i) => ({
              kjv: `In the beginning God created the heaven and the earth. (Genesis 1:${i+1})`,
              web: `In the beginning, God created the heavens and the earth. (Genesis 1:${i+1})`
            }))
          },
          {
            verses: Array(25).fill(0).map((_, i) => ({
              kjv: `Thus the heavens and the earth were finished, and all the host of them. (Genesis 2:${i+1})`,
              web: `The heavens, the earth, and all their vast array were finished. (Genesis 2:${i+1})`
            }))
          }
        ]
      },
      "Exodus": {
        name: "Exodus",
        chapters: [
          {
            verses: Array(22).fill(0).map((_, i) => ({
              kjv: `Now these are the names of the children of Israel, which came into Egypt... (Exodus 1:${i+1})`,
              web: `Now these are the names of the sons of Israel, who came into Egypt... (Exodus 1:${i+1})`
            }))
          }
        ]
      },
      "Psalms": {
        name: "Psalms",
        chapters: [
          {
            verses: Array(6).fill(0).map((_, i) => ({
              kjv: `Blessed is the man that walketh not in the counsel of the ungodly... (Psalms 1:${i+1})`,
              web: `Blessed is the man who doesn't walk in the counsel of the wicked... (Psalms 1:${i+1})`
            }))
          }
        ]
      },
      "Matthew": {
        name: "Matthew",
        chapters: [
          {
            verses: Array(25).fill(0).map((_, i) => ({
              kjv: `The book of the generation of Jesus Christ, the son of David, the son of Abraham. (Matthew 1:${i+1})`,
              web: `The book of the genealogy of Jesus Christ, the son of David, the son of Abraham. (Matthew 1:${i+1})`
            }))
          }
        ]
      },
      "John": {
        name: "John",
        chapters: [
          {
            verses: Array(51).fill(0).map((_, i) => ({
              kjv: `In the beginning was the Word, and the Word was with God, and the Word was God. (John 1:${i+1})`,
              web: `In the beginning was the Word, and the Word was with God, and the Word was God. (John 1:${i+1})`
            }))
          }
        ]
      }
    };
    
    return mockData;
  } catch (error) {
    console.error('Error processing Bible data:', error);
    return {};
  }
}

/**
 * Get chapter data for a specific book and chapter
 */
export function getChapterDataFromProcessed(
  data: Record<string, any>,
  bookId: string,
  chapterNum: number
): BibleChapter | null {
  try {
    const normalizedBookId = bookId.toLowerCase();
    const bookKey = Object.keys(data).find(
      key => key.toLowerCase() === normalizedBookId
    );
    
    if (!bookKey || !data[bookKey] || !data[bookKey].chapters || !data[bookKey].chapters[chapterNum - 1]) {
      console.error(`Chapter data not found for ${bookId} ${chapterNum}`);
      return null;
    }
    
    const bookInfo = bibleStructure.books[normalizedBookId];
    if (!bookInfo) {
      console.error(`Book info not found for ${bookId}`);
      return null;
    }
    
    // Get the chapter data
    const chapterData = data[bookKey].chapters[chapterNum - 1];
    
    // Format verses for the reader
    const verses = chapterData.verses.map((verse: any, index: number) => ({
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
  } catch (error) {
    console.error('Error getting chapter data:', error);
    return null;
  }
}

/**
 * Generate alternative text versions for a verse
 */
export function generateAlternativeVersions(text: string): {
  genz: string;
  kids: string;
  novelize: string;
} {
  return {
    genz: `${text} [Gen-Z translation would appear here]`,
    kids: `${text} [Kids version would appear here]`,
    novelize: `${text} [Narrative version would appear here]`
  };
}
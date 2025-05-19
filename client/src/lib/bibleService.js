/**
 * Bible text and features service
 * Handles retrieval, caching, and transformation of Bible text and related features
 */
import { fetchBibleChapter, fetchChapterContext, fetchCrossReferences } from './api';

// Local cache to avoid unnecessary API calls
const chapterCache = new Map();
const contextCache = new Map();
const crossReferenceCache = new Map();

/**
 * Fetch a Bible chapter with caching
 * @param {string} book - The book name
 * @param {number} chapter - The chapter number
 * @returns {Promise<Object>} - Chapter data with verses
 */
export async function getBibleChapter(book, chapter) {
  const cacheKey = `${book.toLowerCase()}_${chapter}`;
  
  if (chapterCache.has(cacheKey)) {
    return chapterCache.get(cacheKey);
  }
  
  try {
    const chapterData = await fetchBibleChapter(book, chapter);
    chapterCache.set(cacheKey, chapterData);
    return chapterData;
  } catch (error) {
    console.error('Error fetching Bible chapter:', error);
    throw error;
  }
}

/**
 * Fetch contextual information for a chapter with caching
 * @param {string} book - The book name
 * @param {number} chapter - The chapter number
 * @returns {Promise<Object>} - Contextual information
 */
export async function getChapterContext(book, chapter) {
  const cacheKey = `${book.toLowerCase()}_${chapter}`;
  
  if (contextCache.has(cacheKey)) {
    return contextCache.get(cacheKey);
  }
  
  try {
    const contextData = await fetchChapterContext(book, chapter);
    contextCache.set(cacheKey, contextData);
    return contextData;
  } catch (error) {
    console.error('Error fetching chapter context:', error);
    throw error;
  }
}

/**
 * Fetch cross references for a chapter with caching
 * @param {string} book - The book name
 * @param {number} chapter - The chapter number
 * @returns {Promise<Array>} - Cross references
 */
export async function getChapterCrossReferences(book, chapter) {
  const cacheKey = `${book.toLowerCase()}_${chapter}`;
  
  if (crossReferenceCache.has(cacheKey)) {
    return crossReferenceCache.get(cacheKey);
  }
  
  try {
    const crossRefs = await fetchCrossReferences(book, chapter);
    crossReferenceCache.set(cacheKey, crossRefs);
    return crossRefs;
  } catch (error) {
    console.error('Error fetching cross references:', error);
    throw error;
  }
}

/**
 * Get a specific verse from a chapter
 * @param {Object} chapterData - Full chapter data
 * @param {number} verseNumber - The verse number to retrieve
 * @returns {Object|null} - Verse data or null if not found
 */
export function getVerseFromChapter(chapterData, verseNumber) {
  if (!chapterData || !chapterData.verses) return null;
  return chapterData.verses.find(verse => verse.verse === verseNumber) || null;
}

/**
 * Get a range of verses from a chapter
 * @param {string} book - The book name
 * @param {number} chapter - The chapter number
 * @param {number} startVerse - Starting verse number
 * @param {number} endVerse - Ending verse number 
 * @returns {Promise<Array>} - Array of verses in the range
 */
export async function getVerseRange(book, chapter, startVerse, endVerse) {
  const chapterData = await getBibleChapter(book, chapter);
  if (!chapterData || !chapterData.verses) return [];
  
  return chapterData.verses.filter(
    verse => verse.verse >= startVerse && verse.verse <= endVerse
  );
}

/**
 * Format a Bible reference as a string
 * @param {string} book - The book name
 * @param {number} chapter - The chapter number
 * @param {number} verse - The verse number (optional)
 * @returns {string} - Formatted reference
 */
export function formatBibleReference(book, chapter, verse) {
  if (verse) {
    return `${book} ${chapter}:${verse}`;
  }
  return `${book} ${chapter}`;
}

/**
 * Parse a Bible reference string into components
 * @param {string} reference - Bible reference string (e.g., "Genesis 1:1")
 * @returns {Object} - Parsed components { book, chapter, verse }
 */
export function parseBibleReference(reference) {
  try {
    const [book, chapterVerse] = reference.split(' ');
    const [chapter, verse] = chapterVerse.split(':');
    
    return {
      book,
      chapter: parseInt(chapter, 10),
      verse: verse ? parseInt(verse, 10) : null
    };
  } catch (error) {
    console.error('Error parsing Bible reference:', error);
    return null;
  }
}

/**
 * Clear all caches
 */
export function clearBibleCaches() {
  chapterCache.clear();
  contextCache.clear();
  crossReferenceCache.clear();
}
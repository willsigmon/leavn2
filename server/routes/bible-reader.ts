import { Router, Request, Response } from 'express';
import { isAuthenticated } from '../simpleAuth';
import { storage } from '../storage';
import { bibleStructure } from '../../client/src/lib/bibleStructure';
import { loadBibleCache, getVerseFromBibleCache } from '../bible-cache';
import { generateCommentary, generateTranslation } from '../ai';
import { generateTheologicalCommentaryWithClaude, generateNarrativeWithClaude } from '../anthropic';

const router = Router();

// Load Bible cache
let bibleCache: any = null;
const initCache = async () => {
  if (!bibleCache) {
    try {
      bibleCache = loadBibleCache();
      console.log(`Bible cache loaded with ${Object.keys(bibleCache).length} entries`);
    } catch (error) {
      console.error('Error loading Bible cache:', error);
      bibleCache = {};
    }
  }
  return bibleCache;
};

// Helper to normalize book names
const normalizeBookName = (book: string): string => {
  // Convert to lowercase and remove spaces
  const normalized = book.toLowerCase().replace(/\s+/g, '');
  
  // Handle special cases like "1 Corinthians" -> "1corinthians"
  return normalized;
};

// Get Bible chapter data in the format expected by the client
router.get('/:book/:chapter', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { book, chapter } = req.params;
    const chapterNum = parseInt(chapter);
    
    if (isNaN(chapterNum)) {
      return res.status(400).json({ message: 'Invalid chapter number' });
    }
    
    // Get book info from bibleStructure
    const normalizedBookId = normalizeBookName(book);
    const bookInfo = bibleStructure.books[normalizedBookId];
    
    if (!bookInfo) {
      return res.status(404).json({ message: `Book '${book}' not found` });
    }
    
    if (chapterNum < 1 || chapterNum > bookInfo.chapters) {
      return res.status(404).json({ 
        message: `Chapter ${chapterNum} not found in ${bookInfo.name}. Valid range: 1-${bookInfo.chapters}` 
      });
    }
    
    // Initialize cache
    await initCache();
    
    // Get verses from storage for this chapter
    const dbVerses = await storage.getVerses(book, chapterNum);
    
    // Get user-specific data like highlights and notes
    const userId = (req.session as any)?.userId || 'user1';
    const notes = await storage.getNotes(userId, book, chapterNum);
    
    // Format verses in the structure expected by the client
    const verses = await Promise.all(dbVerses.map(async (dbVerse) => {
      // Get verse from cache if available
      const verseRef = `${book} ${chapterNum}:${dbVerse.verseNumber}`;
      const cachedVerse = getVerseFromBibleCache(verseRef);
      
      const userNote = notes.find(n => n.verse === dbVerse.verseNumber);
      
      // Enhanced verse object with text versions and user data
      return {
        verse: dbVerse.verseNumber,
        text: dbVerse.text,
        kjv: cachedVerse?.kjv || dbVerse.text,
        web: cachedVerse?.web || dbVerse.text,
        // Add user-specific data
        isBookmarked: !!userNote?.isBookmarked,
        hasNote: !!userNote?.content,
        highlightColor: userNote?.highlightColor
      };
    }));
    
    return res.json({
      book: normalizedBookId,
      bookName: bookInfo.name,
      chapter: chapterNum,
      totalChapters: bookInfo.chapters,
      verses
    });
  } catch (error) {
    console.error('Error fetching Bible chapter:', error);
    return res.status(500).json({ message: 'Failed to fetch Bible chapter' });
  }
});

// Get alternative text versions for a verse
router.get('/:book/:chapter/:verse/versions', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { book, chapter, verse } = req.params;
    const chapterNum = parseInt(chapter);
    const verseNum = parseInt(verse);
    
    if (isNaN(chapterNum) || isNaN(verseNum)) {
      return res.status(400).json({ message: 'Invalid chapter or verse number' });
    }
    
    // Get verse text from storage
    const dbVerses = await storage.getVerses(book, chapterNum);
    const verseData = dbVerses.find(v => v.verseNumber === verseNum);
    
    if (!verseData) {
      return res.status(404).json({ message: `Verse ${book} ${chapter}:${verse} not found` });
    }
    
    const verseText = verseData.text;
    
    // Generate alternative versions
    const [genzTranslation, narrativeVersion] = await Promise.all([
      generateTranslation(verseText).catch(err => ({ genz: verseText, kids: verseText })),
      generateNarrativeWithClaude(verseText, book, chapterNum).catch(() => verseText)
    ]);
    
    return res.json({
      original: verseText,
      genz: genzTranslation.genz,
      kids: genzTranslation.kids,
      novelize: narrativeVersion
    });
  } catch (error) {
    console.error('Error generating verse versions:', error);
    return res.status(500).json({ message: 'Failed to generate verse versions' });
  }
});

// Get commentary for a verse with specified theological lens
router.get('/:book/:chapter/:verse/commentary/:lens', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { book, chapter, verse, lens } = req.params;
    const chapterNum = parseInt(chapter);
    const verseNum = parseInt(verse);
    
    if (isNaN(chapterNum) || isNaN(verseNum)) {
      return res.status(400).json({ message: 'Invalid chapter or verse number' });
    }
    
    // Get verse text from storage
    const dbVerses = await storage.getVerses(book, chapterNum);
    const verseData = dbVerses.find(v => v.verseNumber === verseNum);
    
    if (!verseData) {
      return res.status(404).json({ message: `Verse ${book} ${chapter}:${verse} not found` });
    }
    
    const verseText = verseData.text;
    
    // Check if commentary exists in database
    const verseId = `${book} ${chapter}:${verse}`;
    let commentary = await storage.getCommentary(verseId, lens);
    
    // If not found, generate new commentary
    if (!commentary) {
      let commentaryText;
      
      if (process.env.ANTHROPIC_API_KEY) {
        // Use Claude if available
        commentaryText = await generateTheologicalCommentaryWithClaude(verseText, lens);
      } else {
        // Fallback to OpenAI
        commentaryText = await generateCommentary(verseText, lens);
      }
      
      // Store the generated commentary
      commentary = await storage.createCommentary({
        verseId,
        lens,
        content: commentaryText
      });
    }
    
    return res.json({
      verse: verseId,
      lens,
      content: commentary.content
    });
  } catch (error) {
    console.error('Error generating commentary:', error);
    return res.status(500).json({ message: 'Failed to generate commentary' });
  }
});

// Get narrative mode for an entire chapter
router.get('/:book/:chapter/narrative', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { book, chapter } = req.params;
    const chapterNum = parseInt(chapter);
    
    if (isNaN(chapterNum)) {
      return res.status(400).json({ message: 'Invalid chapter number' });
    }
    
    // Get all verses for the chapter
    const dbVerses = await storage.getVerses(book, chapterNum);
    const verseTexts = dbVerses.map(v => v.text);
    
    // Generate narrative version
    let narrativeText;
    
    if (process.env.ANTHROPIC_API_KEY) {
      // Use Claude if available
      narrativeText = await generateNarrativeWithClaude(
        verseTexts.join(' '),
        book,
        chapterNum
      );
    } else {
      // Mock narrative for development
      narrativeText = `Narrative version of ${book} chapter ${chapter} would appear here.`;
    }
    
    return res.json({
      book,
      chapter: chapterNum,
      narrative: narrativeText
    });
  } catch (error) {
    console.error('Error generating narrative:', error);
    return res.status(500).json({ message: 'Failed to generate narrative' });
  }
});

export default router;
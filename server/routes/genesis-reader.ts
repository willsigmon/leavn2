import { Router, Request, Response } from 'express';
import { isAuthenticated } from '../simpleAuth';
import fs from 'fs';
import path from 'path';

const router = Router();

// Get Genesis chapter data from our enriched files
router.get('/:chapter', async (req: Request, res: Response) => {
  try {
    const { chapter } = req.params;
    const chapterNum = parseInt(chapter);
    
    if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > 50) {
      return res.status(400).json({ 
        message: `Invalid chapter number. Genesis has 50 chapters.` 
      });
    }
    
    // Load the enriched chapter file
    const chapterPath = path.join(
      process.cwd(),
      'data',
      'genesis',
      'chapters',
      `genesis_${chapterNum}.json`
    );
    
    if (!fs.existsSync(chapterPath)) {
      return res.status(404).json({ 
        message: `Genesis chapter ${chapterNum} data file not found` 
      });
    }
    
    // Read and parse the file
    try {
      const fileData = fs.readFileSync(chapterPath, 'utf8');
      const chapterData = JSON.parse(fileData);
      
      // Debug logging
      console.log(`Loaded Genesis ${chapterNum}. Total verses: ${chapterData.verses?.length || 0}`);
      console.log('First verse data sample:', JSON.stringify(chapterData.verses?.[0] || 'No verses'));
      
      // Check if our verses array exists and has the expected structure
      if (!chapterData.verses || !Array.isArray(chapterData.verses)) {
        console.error('Genesis data is missing verses array');
        // Generate a simple set of mock verses for testing
        const mockVerses = [];
        for (let i = 1; i <= 31; i++) {
          mockVerses.push({
            verse: i,
            number: i,
            text: `Genesis 1:${i} text (web)`,
            textKjv: `Genesis 1:${i} text (kjv)`,
            textWeb: `Genesis 1:${i} text (web)`,
            isBookmarked: false,
            hasNote: false
          });
        }
        return res.json({
          book: 'genesis',
          bookName: 'Genesis',
          chapter: chapterNum,
          totalChapters: 50,
          verses: mockVerses
        });
      }
      
      // Determine how many verses should be in this chapter
      const verseCounts = {
        1: 31,  // Genesis 1 has 31 verses
        2: 25,  // Genesis 2 has 25 verses
        3: 24,  // Genesis 3 has 24 verses
        4: 26,  // Genesis 4 has 26 verses
        5: 32,  // Genesis 5 has 32 verses
      };
      
      // Get expected number of verses for this chapter
      const expectedVerseCount = verseCounts[chapterNum] || 30; // Default to 30 if unknown
      
      // Create a map of existing verses from the data
      const verseMap = new Map();
      chapterData.verses.forEach(verse => {
        const verseNumber = verse.verse_number || verse.number || verse.verse;
        verseMap.set(verseNumber, verse);
      });
      
      // Create the complete array of verses
      const verses = [];
      for (let i = 1; i <= expectedVerseCount; i++) {
        const existingVerse = verseMap.get(i);
        
        if (existingVerse) {
          // Get the verse data from our existing data
          // Detect the text format and extract appropriately
          let kjvText = '';
          let webText = '';
          
          // Check if there's a text field at all
          if (existingVerse.text) {
            try {
              // Handle format where text is an object with translations
              if (typeof existingVerse.text === 'object') {
                kjvText = existingVerse.text.kjv || '';
                webText = existingVerse.text.web || '';
              } else if (typeof existingVerse.text === 'string') {
                // If just a string, use it for both translations
                kjvText = existingVerse.text;
                webText = existingVerse.text;
              }
            } catch (err) {
              console.error(`Error extracting text for verse ${i}:`, err);
            }
          }
          
          verses.push({
            verse: i,
            number: i,
            text: webText || `Genesis ${chapterNum}:${i}`,
            textKjv: kjvText || `Genesis ${chapterNum}:${i} (KJV)`,  
            textWeb: webText || `Genesis ${chapterNum}:${i} (WEB)`,
            isBookmarked: existingVerse.isBookmarked || false,
            hasNote: existingVerse.hasNote || false,
            tags: existingVerse.tags || {}
          });
        } else {
          // Create a placeholder for missing verses
          verses.push({
            verse: i,
            number: i,
            text: `Genesis ${chapterNum}:${i}`,
            textKjv: `Genesis ${chapterNum}:${i} (KJV)`,  
            textWeb: `Genesis ${chapterNum}:${i} (WEB)`,
            isBookmarked: false,
            hasNote: false,
            tags: {}
          });
        }
      }
      
      // Debug logging for the first verse
      if (verses.length > 0) {
        console.log('First verse data:', JSON.stringify(verses[0]));
      }
      
      const response = {
        book: 'genesis',
        bookName: 'Genesis',
        chapter: chapterNum,
        totalChapters: 50,
        title: chapterData.title || '',
        summary: chapterData.summary || '',
        themes: chapterData.themes || [],
        people: chapterData.people || [],
        places: chapterData.places || [],
        symbols: chapterData.symbols || [],
        timeframe: chapterData.timeframe || '',
        narrative: chapterData.narrative || '',
        verses
      };
      
      return res.json(response);
    } catch (err) {
      console.error(`Error reading Genesis chapter file:`, err);
      return res.status(500).json({ message: 'Error processing chapter data' });
    }
  } catch (error) {
    console.error('Error in Genesis reader route:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
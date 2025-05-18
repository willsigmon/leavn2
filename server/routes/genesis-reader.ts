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
      
      // Format the response in the structure expected by the reader
      const verses = chapterData.verses.map(verse => {
        // Check the structure and adapt to our expected format
        const verseNumber = verse.verse_number || verse.number || verse.verse;
        
        console.log('Processing verse:', verseNumber);
        
        return {
          verse: verseNumber,
          number: verseNumber,
          text: verse.text?.web || (typeof verse.text === 'object' ? verse.text.web : verse.text) || `Genesis ${chapterNum}:${verseNumber}`,
          textKjv: verse.text?.kjv || (typeof verse.text === 'object' ? verse.text.kjv : null) || `Genesis ${chapterNum}:${verseNumber} (KJV)`,  
          textWeb: verse.text?.web || (typeof verse.text === 'object' ? verse.text.web : null) || `Genesis ${chapterNum}:${verseNumber} (WEB)`,
          isBookmarked: false,
          hasNote: false,
          tags: verse.tags || {}
        };
      });
      
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
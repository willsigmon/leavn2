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
      
      // Format the response in the structure expected by the reader
      const response = {
        book: 'genesis',
        bookName: 'Genesis',
        chapter: chapterNum,
        totalChapters: 50,
        title: chapterData.title,
        summary: chapterData.summary,
        themes: chapterData.themes,
        people: chapterData.people,
        places: chapterData.places,
        symbols: chapterData.symbols,
        timeframe: chapterData.timeframe,
        narrative: chapterData.narrative,
        verses: chapterData.verses.map(verse => ({
          verse: verse.verse_number,
          text: verse.text.web, // Use web translation as default
          textKjv: verse.text.kjv,
          textWeb: verse.text.web,
          isBookmarked: false,
          hasNote: false,
          tags: verse.tags || {}
        }))
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
import { Router, Request, Response } from 'express';
import { isAuthenticated } from '../simpleAuth';
import fs from 'fs';
import path from 'path';

const router = Router();

interface GenesisVerse {
  verse: number;
  number: number;
  text: string;
  textKjv: string;
  textWeb: string;
  isBookmarked: boolean;
  hasNote: boolean;
  tags: Record<string, any>;
}

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
        return res.status(500).json({ message: 'Invalid chapter data structure' });
      }
      
      console.log(`Loaded ${chapterData.verses.length} verses from data file for Genesis ${chapterNum}`);
      
      // Complete verse counts for all Genesis chapters
      const verseCounts = {
        1: 31,  // Genesis 1 has 31 verses
        2: 25,  // Genesis 2 has 25 verses
        3: 24,  // Genesis 3 has 24 verses 
        4: 26,  // Genesis 4 has 26 verses
        5: 32,  // Genesis 5 has 32 verses
        6: 22,  // Genesis 6 has 22 verses
        7: 24,  // Genesis 7 has 24 verses
        8: 22,  // Genesis 8 has 22 verses
        9: 29,  // Genesis 9 has 29 verses
        10: 32, // Genesis 10 has 32 verses
        11: 32, // Genesis 11 has 32 verses
        12: 20, // Genesis 12 has 20 verses
        13: 18, // Genesis 13 has 18 verses
        14: 24, // Genesis 14 has 24 verses
        15: 21, // Genesis 15 has 21 verses
        16: 16, // Genesis 16 has 16 verses
        17: 27, // Genesis 17 has 27 verses
        18: 33, // Genesis 18 has 33 verses
        19: 38, // Genesis 19 has 38 verses
        20: 18, // Genesis 20 has 18 verses
        21: 34, // Genesis 21 has 34 verses
        22: 24, // Genesis 22 has 24 verses
        23: 20, // Genesis 23 has 20 verses
        24: 67, // Genesis 24 has 67 verses
        25: 34, // Genesis 25 has 34 verses
        26: 35, // Genesis 26 has 35 verses
        27: 46, // Genesis 27 has 46 verses
        28: 22, // Genesis 28 has 22 verses
        29: 35, // Genesis 29 has 35 verses
        30: 43, // Genesis 30 has 43 verses
        31: 55, // Genesis 31 has 55 verses
        32: 32, // Genesis 32 has 32 verses 
        33: 20, // Genesis 33 has 20 verses
        34: 31, // Genesis 34 has 31 verses
        35: 29, // Genesis 35 has 29 verses
        36: 43, // Genesis 36 has 43 verses
        37: 36, // Genesis 37 has 36 verses
        38: 30, // Genesis 38 has 30 verses
        39: 23, // Genesis 39 has 23 verses
        40: 23, // Genesis 40 has 23 verses
        41: 57, // Genesis 41 has 57 verses
        42: 38, // Genesis 42 has 38 verses
        43: 34, // Genesis 43 has 34 verses
        44: 34, // Genesis 44 has 34 verses
        45: 28, // Genesis 45 has 28 verses
        46: 34, // Genesis 46 has 34 verses
        47: 31, // Genesis 47 has 31 verses
        48: 22, // Genesis 48 has 22 verses
        49: 33, // Genesis 49 has 33 verses
        50: 26  // Genesis 50 has 26 verses
      };
      
      // Get expected number of verses for this chapter
      const expectedVerseCount = verseCounts[chapterNum] || 30; // Default to 30 if unknown
      
      // Create a map of existing verses from the data
      const verseMap = new Map();
      chapterData.verses.forEach(verse => {
        const verseNumber = verse.verse_number || verse.number || verse.verse;
        verseMap.set(verseNumber, verse);
      });
      
      console.log(`Got ${verseMap.size} verses from the data file. Expected count: ${expectedVerseCount}`);
      
      // Check if we have a complete text file for this chapter
      const fullTextPath = path.join(
        process.cwd(),
        'data',
        'genesis',
        'bible_text',
        `genesis_${chapterNum}_complete.json`
      );
      
      // If we have a full text file, use it to get the actual verse texts
      let fullTextData = null;
      if (fs.existsSync(fullTextPath)) {
        try {
          const fileData = fs.readFileSync(fullTextPath, 'utf8');
          fullTextData = JSON.parse(fileData);
          console.log(`Loaded complete Bible text for Genesis ${chapterNum} with ${fullTextData.verses.length} verses`);
        } catch (err) {
          console.error(`Error loading complete Bible text for Genesis ${chapterNum}:`, err);
        }
      }
      
      // Create the complete array of verses
      const verses: GenesisVerse[] = [];
      
      // Create a map of full text verses if available
      const fullTextMap = new Map();
      if (fullTextData && Array.isArray(fullTextData.verses)) {
        fullTextData.verses.forEach(verse => {
          if (verse.verse && verse.text) {
            fullTextMap.set(verse.verse, verse);
          }
        });
        console.log(`Loaded ${fullTextMap.size} verses from complete text file`);
      } else {
        console.log('No full text data available or format is incorrect:', fullTextData);
        console.log('Bible text path:', fullTextPath);
        console.log('Directory exists:', fs.existsSync(path.dirname(fullTextPath)));
      }
      
      for (let i = 1; i <= expectedVerseCount; i++) {
        const existingVerse = verseMap.get(i);
        const fullTextVerse = fullTextMap.get(i);
        
        // Get the texts - prioritize the full text data if available
        let kjvText = '';
        let webText = '';
        
        if (fullTextVerse && fullTextVerse.text) {
          // Use the complete text from our full text file
          kjvText = fullTextVerse.text.kjv || '';
          webText = fullTextVerse.text.web || '';
          console.log(`Using full text for verse ${i}`);
        } else if (existingVerse && existingVerse.text) {
          // Fall back to the existing data if full text not available
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
        
        // Use the metadata from existing verse or create default metadata
        const metadata = existingVerse || {};
        
        verses.push({
          verse: i,
          number: i,
          text: webText || `Genesis ${chapterNum}:${i}`,
          textKjv: kjvText || `Genesis ${chapterNum}:${i} (KJV)`,  
          textWeb: webText || `Genesis ${chapterNum}:${i} (WEB)`,
          isBookmarked: metadata.isBookmarked || false,
          hasNote: metadata.hasNote || false,
          tags: metadata.tags || {}
        });
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
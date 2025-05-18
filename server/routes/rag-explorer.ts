import { Router, Request, Response } from 'express';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { isAuthenticated } from '../simpleAuth';
import { db } from '../db';
import { tags, verseTags } from '../../shared/schema';
import { eq, sql } from 'drizzle-orm';

const router = Router();

// Get the RAG index for a specific book
router.get('/:book', async (req: Request, res: Response) => {
  try {
    const { book } = req.params;
    const bookLower = book.toLowerCase();
    
    // For now, we only have Genesis implemented
    if (bookLower !== 'genesis') {
      return res.status(404).json({ error: 'Book not available for RAG exploration yet' });
    }
    
    try {
      // Load RAG index
      const indexPath = join(process.cwd(), 'data', 'genesis', 'genesis_rag_index.json');
      const data = await readFile(indexPath, 'utf8');
      return res.json(JSON.parse(data));
    } catch (err) {
      console.error(`Error loading RAG index for ${book}:`, err);
      return res.status(404).json({ 
        error: 'RAG index not found',
        message: 'The structured data for this book is not available yet.'
      });
    }
  } catch (error) {
    console.error('Error fetching RAG index:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Find verses by tag type and value
router.get('/tag/:book/:type/:value', async (req: Request, res: Response) => {
  try {
    const { book, type, value } = req.params;
    const bookLower = book.toLowerCase();
    
    // For now, only support Genesis
    if (bookLower !== 'genesis') {
      return res.status(404).json({ error: 'Book not available for tag search yet' });
    }
    
    // Convert type to database field
    let tagField = '';
    switch (type) {
      case 'theme':
        tagField = 'themes';
        break;
      case 'person':
        tagField = 'people';
        break;
      case 'place':
        tagField = 'places';
        break;
      case 'symbol':
        tagField = 'symbols';
        break;
      case 'cross-ref':
        tagField = 'cross_refs';
        break;
      default:
        return res.status(400).json({ error: 'Invalid tag type' });
    }
    
    // Look through the Genesis chapters data directly for now
    try {
      const chapters = [];
      
      // We'll check the first 12 chapters of Genesis in our current implementation
      for (let chapterNum = 1; chapterNum <= 12; chapterNum++) {
        try {
          const chapterPath = join(
            process.cwd(), 
            'data', 
            'genesis', 
            'chapters', 
            `genesis_${chapterNum}.json`
          );
          
          const chapterData = JSON.parse(await readFile(chapterPath, 'utf8'));
          chapters.push(chapterData);
        } catch (err) {
          // Skip chapters that don't exist
          continue;
        }
      }
      
      // Find verses that contain this tag
      const matchingVerses = [];
      
      for (const chapter of chapters) {
        for (const verse of chapter.verses) {
          if (verse.tags && verse.tags[tagField] && verse.tags[tagField].includes(value)) {
            matchingVerses.push({
              reference: `Genesis ${chapter.chapter_number}:${verse.verse_number}`,
              text: verse.text.kjv,
              is_key_verse: verse.is_key_verse
            });
          }
        }
      }
      
      return res.json({ 
        verses: matchingVerses,
        count: matchingVerses.length,
        tag: { type, value }
      });
    } catch (err) {
      console.error(`Error searching for tag in ${book}:`, err);
      return res.status(500).json({ error: 'Error searching for verses with this tag' });
    }
  } catch (error) {
    console.error('Error in tag search endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all tags for a specific verse
router.get('/verse-tags/:book/:chapter/:verse', async (req: Request, res: Response) => {
  try {
    const { book, chapter, verse } = req.params;
    const bookLower = book.toLowerCase();
    const chapterNum = parseInt(chapter);
    const verseNum = parseInt(verse);
    
    // For now, only support Genesis
    if (bookLower !== 'genesis') {
      return res.status(404).json({ error: 'Book not available for verse tag lookup yet' });
    }
    
    try {
      const chapterPath = join(
        process.cwd(), 
        'data', 
        'genesis', 
        'chapters', 
        `genesis_${chapterNum}.json`
      );
      
      const chapterData = JSON.parse(await readFile(chapterPath, 'utf8'));
      
      // Find the specific verse
      const verseData = chapterData.verses.find(v => v.verse_number === verseNum);
      
      if (!verseData) {
        return res.status(404).json({ error: 'Verse not found' });
      }
      
      // Return the verse tags
      return res.json({
        reference: `Genesis ${chapterNum}:${verseNum}`,
        tags: verseData.tags || {},
        is_key_verse: verseData.is_key_verse
      });
    } catch (err) {
      console.error(`Error fetching verse tags for Genesis ${chapter}:${verse}:`, err);
      return res.status(404).json({ error: 'Verse or chapter not found' });
    }
  } catch (error) {
    console.error('Error in verse tags endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get related verses based on common tags
router.get('/related/:book/:chapter/:verse', async (req: Request, res: Response) => {
  try {
    const { book, chapter, verse } = req.params;
    const bookLower = book.toLowerCase();
    const chapterNum = parseInt(chapter);
    const verseNum = parseInt(verse);
    
    // For now, only support Genesis
    if (bookLower !== 'genesis') {
      return res.status(404).json({ error: 'Book not available for related verses yet' });
    }
    
    try {
      // Get the tags for this verse
      const chapterPath = join(
        process.cwd(), 
        'data', 
        'genesis', 
        'chapters', 
        `genesis_${chapterNum}.json`
      );
      
      const chapterData = JSON.parse(await readFile(chapterPath, 'utf8'));
      const verseData = chapterData.verses.find(v => v.verse_number === verseNum);
      
      if (!verseData) {
        return res.status(404).json({ error: 'Verse not found' });
      }
      
      // Get the verse tags
      const verseTags = verseData.tags || {};
      
      // Collect all themes, people, places, etc.
      const themesToMatch = verseTags.themes || [];
      const peopleToMatch = verseTags.people || [];
      const placesToMatch = verseTags.places || [];
      const symbolsToMatch = verseTags.symbols || [];
      
      // Find verses that share these tags
      const relatedVerses = [];
      const chaptersToSearch = [];
      
      // Get nearby chapters (for context)
      for (let c = Math.max(1, chapterNum - 2); c <= Math.min(50, chapterNum + 2); c++) {
        try {
          const path = join(process.cwd(), 'data', 'genesis', 'chapters', `genesis_${c}.json`);
          const data = JSON.parse(await readFile(path, 'utf8'));
          chaptersToSearch.push(data);
        } catch (err) {
          // Skip chapters that don't exist
          continue;
        }
      }
      
      // Avoid comparing to self
      const selfRef = `Genesis ${chapterNum}:${verseNum}`;
      
      // Build related verses with similarity scores
      for (const chapter of chaptersToSearch) {
        for (const v of chapter.verses) {
          const vRef = `Genesis ${chapter.chapter_number}:${v.verse_number}`;
          
          // Skip self-comparison
          if (vRef === selfRef) continue;
          
          const vTags = v.tags || {};
          
          // Calculate similarity score
          let similarityScore = 0;
          
          // Check for theme matches
          for (const theme of themesToMatch) {
            if (vTags.themes && vTags.themes.includes(theme)) {
              similarityScore += 3; // Themes are important
            }
          }
          
          // Check for people matches
          for (const person of peopleToMatch) {
            if (vTags.people && vTags.people.includes(person)) {
              similarityScore += 2;
            }
          }
          
          // Check for place matches
          for (const place of placesToMatch) {
            if (vTags.places && vTags.places.includes(place)) {
              similarityScore += 2;
            }
          }
          
          // Check for symbol matches
          for (const symbol of symbolsToMatch) {
            if (vTags.symbols && vTags.symbols.includes(symbol)) {
              similarityScore += 1;
            }
          }
          
          // Only include verses with some similarity
          if (similarityScore > 1) {
            relatedVerses.push({
              reference: vRef,
              text: v.text.kjv,
              similarity_score: similarityScore,
              is_key_verse: v.is_key_verse
            });
          }
        }
      }
      
      // Sort by similarity score
      relatedVerses.sort((a, b) => b.similarity_score - a.similarity_score);
      
      // Return top 5 related verses
      return res.json({
        source: selfRef,
        related_verses: relatedVerses.slice(0, 5),
        total_found: relatedVerses.length
      });
    } catch (err) {
      console.error(`Error finding related verses for Genesis ${chapter}:${verse}:`, err);
      return res.status(500).json({ error: 'Error finding related verses' });
    }
  } catch (error) {
    console.error('Error in related verses endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get visualization data for concept map
router.get('/concept-map/:book/:chapter?', async (req: Request, res: Response) => {
  try {
    const { book, chapter } = req.params;
    const bookLower = book.toLowerCase();
    
    // For now, only support Genesis
    if (bookLower !== 'genesis') {
      return res.status(404).json({ error: 'Book not available for concept map yet' });
    }
    
    try {
      // Load the RAG index
      const indexPath = join(process.cwd(), 'data', 'genesis', 'genesis_rag_index.json');
      const ragIndex = JSON.parse(await readFile(indexPath, 'utf8'));
      
      // Build concept map nodes and edges
      const nodes = [];
      const edges = [];
      
      // Add theme nodes
      ragIndex.themes.forEach((theme, idx) => {
        nodes.push({
          id: `theme-${idx}`,
          label: theme,
          type: 'theme',
          color: '#3b82f6' // blue
        });
      });
      
      // Add people nodes
      ragIndex.people.forEach((person, idx) => {
        nodes.push({
          id: `person-${idx}`,
          label: person,
          type: 'person',
          color: '#10b981' // green
        });
      });
      
      // Add place nodes
      ragIndex.places.forEach((place, idx) => {
        nodes.push({
          id: `place-${idx}`,
          label: place,
          type: 'place',
          color: '#f59e0b' // amber
        });
      });
      
      // If a specific chapter is selected, add connections
      if (chapter) {
        const chapterNum = parseInt(chapter);
        
        try {
          const chapterPath = join(
            process.cwd(), 
            'data', 
            'genesis', 
            'chapters', 
            `genesis_${chapterNum}.json`
          );
          
          const chapterData = JSON.parse(await readFile(chapterPath, 'utf8'));
          
          // Add chapter node as central node
          nodes.push({
            id: 'chapter',
            label: `Genesis ${chapterNum}: ${chapterData.title}`,
            type: 'chapter',
            color: '#2c4c3b', // forest green
            size: 25
          });
          
          // Link chapter to its tags
          chapterData.themes.forEach((theme, idx) => {
            const themeNode = nodes.find(n => n.label === theme && n.type === 'theme');
            if (themeNode) {
              edges.push({
                id: `edge-chapter-theme-${idx}`,
                source: 'chapter',
                target: themeNode.id,
                label: 'has theme'
              });
            }
          });
          
          chapterData.people.forEach((person, idx) => {
            const personNode = nodes.find(n => n.label === person && n.type === 'person');
            if (personNode) {
              edges.push({
                id: `edge-chapter-person-${idx}`,
                source: 'chapter',
                target: personNode.id,
                label: 'mentions'
              });
            }
          });
          
          chapterData.places.forEach((place, idx) => {
            const placeNode = nodes.find(n => n.label === place && n.type === 'place');
            if (placeNode) {
              edges.push({
                id: `edge-chapter-place-${idx}`,
                source: 'chapter',
                target: placeNode.id,
                label: 'located at'
              });
            }
          });
        } catch (err) {
          console.error(`Error loading chapter ${chapter} for concept map:`, err);
          // Continue without chapter data
        }
      }
      
      return res.json({
        nodes,
        edges
      });
    } catch (err) {
      console.error(`Error generating concept map for ${book}:`, err);
      return res.status(500).json({ error: 'Error generating concept map' });
    }
  } catch (error) {
    console.error('Error in concept map endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
import express from 'express';
import { generateNarrativeWithClaude } from '../anthropic.js';
import * as fs from 'fs/promises';
import * as path from 'path';

const router = express.Router();

// Cache for narrative content to reduce API calls
const narrativeCache = new Map();

/**
 * Generate a narrative version of a Bible chapter in a specific style
 * @route GET /:book/:chapter/:style
 */
router.get('/:book/:chapter/:style?', async (req, res) => {
  try {
    const { book, chapter } = req.params;
    const style = req.params.style || 'chosen';
    
    // Create a cache key from the parameters
    const cacheKey = `${book}-${chapter}-${style}`;
    
    // Check if we have this narrative cached already
    if (narrativeCache.has(cacheKey)) {
      console.log(`Returning cached narrative for ${cacheKey}`);
      return res.json(narrativeCache.get(cacheKey));
    }
    
    // Generate the narrative content
    const narrative = await generateNarrativeWithClaude(book, chapter, style);
    
    // Cache the result for future requests
    narrativeCache.set(cacheKey, narrative);
    
    res.json(narrative);
  } catch (error) {
    console.error('Error generating narrative:', error);
    res.status(500).json({ 
      error: 'Failed to generate narrative content',
      message: error.message
    });
  }
});

/**
 * Clear narrative cache for testing/development
 * @route POST /clear-cache
 */
router.post('/clear-cache', (req, res) => {
  narrativeCache.clear();
  res.json({ message: 'Narrative cache cleared successfully' });
});

module.exports = router;
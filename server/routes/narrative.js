const express = require('express');
const router = express.Router();
const { generateNarrativeWithClaude } = require('../anthropic');

// Cache to store generated narratives
const narrativeCache = new Map();

/**
 * Generate a narrative version of a scripture passage in a specific style
 * @route GET /api/ai/narrative/:passage/:style
 */
router.get('/:passage/:style', async (req, res) => {
  try {
    const { passage, style } = req.params;
    
    // Use cache if available to avoid regenerating content
    const cacheKey = `${passage}-${style}`;
    if (narrativeCache.has(cacheKey)) {
      return res.json(narrativeCache.get(cacheKey));
    }
    
    // Parse passage reference (e.g., "Genesis 1" or "John 3:16")
    const parts = passage.split(' ');
    const book = parts[0];
    const chapterParts = parts[1]?.split(':') || [];
    const chapter = chapterParts[0];
    
    // Generate narrative content based on passage and style
    const narrativeContent = await generateNarrativeWithClaude(book, chapter, style);
    
    // Add to cache
    narrativeCache.set(cacheKey, narrativeContent);
    
    res.json(narrativeContent);
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
 * @route POST /api/ai/narrative/clear-cache
 */
router.post('/clear-cache', (req, res) => {
  narrativeCache.clear();
  res.json({ success: true, message: 'Narrative cache cleared' });
});

module.exports = router;
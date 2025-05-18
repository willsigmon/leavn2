import { Router, Request, Response } from 'express';
import { isAuthenticated } from '../simpleAuth';
import { loadBibleCache, getVerseFromBibleCache } from '../bible-cache';

const router = Router();

// Cross-reference types
interface CrossReference {
  id: string;          // Unique ID for this cross-reference
  fromRef: string;     // Origin reference (e.g., "John 3:16")
  toRef: string;       // Destination reference (e.g., "Romans 5:8")
  toText: string;      // Text of the cross-referenced verse
  connection: string;  // Type of connection (e.g., "thematic", "quotation", "fulfillment")
  relevance: number;   // Relevance score (0-100)
  explanation: string; // Brief explanation of the connection
  tags: string[];      // Topical tags for this connection
}

// Cross-reference relationship database (simplified for demonstration)
// In a real implementation, this would be stored in the database
const crossReferenceDB: Record<string, string[]> = {
  // Genesis connections
  'Genesis 1:1': ['John 1:1', 'Hebrews 11:3', 'Psalm 33:6', 'Colossians 1:16', 'Isaiah 40:26'],
  'Genesis 1:2': ['Psalm 104:30', 'Isaiah 45:18', 'Jeremiah 4:23'],
  'Genesis 1:3': ['Psalm 33:9', '2 Corinthians 4:6', 'Isaiah 45:7'],
  'Genesis 1:26': ['Genesis 9:6', 'Psalm 8:5-8', 'James 3:9', 'Colossians 3:10'],
  'Genesis 2:7': ['1 Corinthians 15:45', 'Job 33:4', 'Ecclesiastes 12:7'],
  
  // John connections
  'John 1:1': ['Genesis 1:1', 'Philippians 2:6', '1 John 1:1-2', 'Revelation 19:13'],
  'John 1:14': ['Galatians 4:4', 'Philippians 2:7-8', 'Colossians 1:19', '1 Timothy 3:16'],
  'John 3:16': ['Romans 5:8', '1 John 4:9-10', 'Romans 8:32', 'Ephesians 2:4-5'],
  
  // Psalms connections
  'Psalm 23:1': ['Isaiah 40:11', 'Ezekiel 34:11-12', 'John 10:11', '1 Peter 2:25'],
  
  // Fallback for testing
  'default': ['John 3:16', 'Romans 5:8', 'Psalm 23:1', 'Genesis 1:1', 'Isaiah 53:5']
};

// Connection types based on patterns
const connectionTypes: Record<string, string[]> = {
  'thematic': ['Genesis 1:1 -> John 1:1', 'John 3:16 -> Romans 5:8', 'Psalm 23:1 -> John 10:11'],
  'quotation': ['Isaiah 53:5 -> 1 Peter 2:24', 'Genesis 2:24 -> Matthew 19:5'],
  'fulfillment': ['Isaiah 7:14 -> Matthew 1:22-23', 'Micah 5:2 -> Matthew 2:5-6'],
  'parallel': ['Matthew 24:30 -> Revelation 1:7', 'Genesis 1:3 -> Psalm 33:9'],
  'contrast': ['Romans 5:12 -> Romans 5:15', 'Genesis 3:17-19 -> Romans 8:1']
};

// Sample explanations for connections
const explanations: Record<string, string> = {
  'Genesis 1:1 -> John 1:1': 'Both verses refer to "the beginning," with Genesis describing physical creation and John describing the eternal Word.',
  'John 3:16 -> Romans 5:8': 'Both passages emphasize God\'s love demonstrated through the sacrifice of Christ.',
  'Genesis 1:3 -> 2 Corinthians 4:6': 'Paul draws a parallel between God creating physical light and spiritual illumination.',
  'Psalm 23:1 -> John 10:11': 'The shepherd metaphor in Psalm 23 finds its fulfillment in Jesus as the Good Shepherd.',
  'default': 'These passages share related concepts, themes, or language.'
};

// Tags for cross-references
const tags: Record<string, string[]> = {
  'Genesis 1:1': ['creation', 'beginning', 'God', 'heaven', 'earth'],
  'John 1:1': ['Word', 'beginning', 'deity of Christ', 'Trinity'],
  'John 3:16': ['love', 'salvation', 'eternal life', 'faith'],
  'Romans 5:8': ['love', 'sacrifice', 'sin', 'reconciliation'],
  'Psalm 23:1': ['shepherd', 'provision', 'guidance', 'comfort'],
  'default': ['scripture', 'connection', 'reference']
};

// Get cross-references for a specific verse
router.get('/:book/:chapter/:verse', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { book, chapter, verse } = req.params;
    const chapterNum = parseInt(chapter);
    const verseNum = parseInt(verse);
    
    if (isNaN(chapterNum) || isNaN(verseNum)) {
      return res.status(400).json({ message: 'Invalid chapter or verse number' });
    }
    
    // Construct verse reference
    const fromRef = `${book} ${chapter}:${verse}`;
    
    // Get related references from the DB (or use default for testing)
    const relatedRefs = crossReferenceDB[fromRef] || crossReferenceDB['default'];
    
    // Load Bible cache for verse texts
    let bibleCache;
    try {
      bibleCache = loadBibleCache();
    } catch (error) {
      console.error('Error loading Bible cache:', error);
      bibleCache = {};
    }
    
    // Generate cross-reference objects
    const crossRefs: CrossReference[] = await Promise.all(relatedRefs.map(async (toRef, index) => {
      // Parse reference parts
      const parts = toRef.split(' ');
      const refChapterVerse = parts.pop() || '';
      const [refChapter, refVerse] = refChapterVerse.split(':');
      const refBook = parts.join(' ');
      
      // Try to get verse text from cache
      const verse = getVerseFromBibleCache(toRef) || { kjv: '', web: '' };
      const toText = verse.kjv || verse.web || `Text for ${toRef}`;
      
      // Determine connection type
      let connection = 'thematic'; // default
      for (const [type, patterns] of Object.entries(connectionTypes)) {
        if (patterns.includes(`${fromRef} -> ${toRef}`)) {
          connection = type;
          break;
        }
      }
      
      // Get explanation
      const explanation = explanations[`${fromRef} -> ${toRef}`] || explanations['default'];
      
      // Get tags
      const refTags = tags[toRef] || tags['default'];
      
      // Calculate a relevance score (this would be more sophisticated in a real implementation)
      const relevance = Math.floor(Math.random() * 30) + 70; // 70-100
      
      return {
        id: `${fromRef}->${toRef}`,
        fromRef,
        toRef,
        toText,
        connection,
        relevance,
        explanation,
        tags: refTags
      };
    }));
    
    return res.json(crossRefs);
  } catch (error) {
    console.error('Error getting cross-references:', error);
    return res.status(500).json({ message: 'Failed to get cross-references' });
  }
});

// Get detailed information about a specific cross-reference
router.get('/detail/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Parse the ID to get the references
    const [fromRef, toRef] = id.split('->');
    
    if (!fromRef || !toRef) {
      return res.status(400).json({ message: 'Invalid cross-reference ID' });
    }
    
    // Get Bible texts
    let bibleCache;
    try {
      bibleCache = loadBibleCache();
    } catch (error) {
      console.error('Error loading Bible cache:', error);
      bibleCache = {};
    }
    
    const fromVerse = getVerseFromBibleCache(fromRef) || { kjv: '', web: '' };
    const toVerse = getVerseFromBibleCache(toRef) || { kjv: '', web: '' };
    
    // Determine connection type
    let connection = 'thematic'; // default
    for (const [type, patterns] of Object.entries(connectionTypes)) {
      if (patterns.includes(`${fromRef} -> ${toRef}`)) {
        connection = type;
        break;
      }
    }
    
    // Get explanation
    const explanation = explanations[`${fromRef} -> ${toRef}`] || explanations['default'];
    
    // Get tags
    const refTags = tags[toRef] || tags['default'];
    
    // Calculate a relevance score
    const relevance = Math.floor(Math.random() * 30) + 70; // 70-100
    
    const detail = {
      id,
      fromRef,
      toRef,
      fromText: fromVerse.kjv || fromVerse.web || `Text for ${fromRef}`,
      toText: toVerse.kjv || toVerse.web || `Text for ${toRef}`,
      connection,
      relevance,
      explanation,
      tags: refTags,
      
      // Additional detailed information
      connectionExplanation: getDetailedExplanation(connection, fromRef, toRef),
      commonThemes: getCommonThemes(fromRef, toRef),
      historicalContext: getHistoricalContext(fromRef, toRef)
    };
    
    return res.json(detail);
  } catch (error) {
    console.error('Error getting cross-reference detail:', error);
    return res.status(500).json({ message: 'Failed to get cross-reference detail' });
  }
});

// Helper: Get detailed explanation for a connection type
function getDetailedExplanation(connectionType: string, fromRef: string, toRef: string): string {
  const explanations: Record<string, string> = {
    'thematic': `These passages share common theological themes, concepts, or imagery. The connection is based on similar subject matter rather than direct quotation or fulfillment of prophecy.`,
    'quotation': `This is a direct quotation where the New Testament author is explicitly citing an Old Testament passage. Such quotations often begin with phrases like "it is written" or "as the prophet said."`,
    'fulfillment': `This represents a prophetic fulfillment where an earlier scriptural promise or prediction is shown to be fulfilled in a later passage, often in the ministry of Jesus Christ.`,
    'parallel': `These passages describe similar events, teachings, or narratives that mirror each other in structure or content, allowing for deeper interpretation through comparison.`,
    'contrast': `These passages are intentionally contrasted to highlight differences between theological concepts, covenants, or historical situations.`
  };
  
  return explanations[connectionType] || 'These passages are connected through biblical themes and concepts.';
}

// Helper: Get common themes between references
function getCommonThemes(fromRef: string, toRef: string): string[] {
  // In a real implementation, this would use NLP or a knowledge graph
  // For demonstration, we'll return sample themes
  const allThemes = [
    'creation', 'redemption', 'covenant', 'sacrifice', 'faith',
    'love', 'judgment', 'mercy', 'wisdom', 'holiness', 
    'righteousness', 'salvation', 'kingdom', 'worship'
  ];
  
  // Return 2-4 random themes
  const numThemes = Math.floor(Math.random() * 3) + 2; // 2-4
  const selectedThemes = [];
  
  for (let i = 0; i < numThemes; i++) {
    const theme = allThemes[Math.floor(Math.random() * allThemes.length)];
    if (!selectedThemes.includes(theme)) {
      selectedThemes.push(theme);
    }
  }
  
  return selectedThemes;
}

// Helper: Get historical context
function getHistoricalContext(fromRef: string, toRef: string): string {
  // Extract books for simple context
  const fromBook = fromRef.split(' ')[0];
  const toBook = toRef.split(' ')[0];
  
  const contexts: Record<string, string> = {
    'Genesis': 'Written by Moses around 1400 BC, recording creation through the time of Joseph.',
    'Exodus': 'Written by Moses around 1400 BC, describing Israel\'s deliverance from Egypt.',
    'Leviticus': 'Written by Moses around 1400 BC, containing ceremonial and moral laws.',
    'John': 'Written by the Apostle John around 85-95 AD, emphasizing Jesus\' deity.',
    'Romans': 'Written by Paul around 57 AD to the church in Rome, systematically explaining the gospel.',
    'Hebrews': 'Written around 65-70 AD, showing Christ\'s superiority to Old Testament institutions.',
    'Psalms': 'Written over a period of about 1,000 years by multiple authors including David and Asaph.',
    'Isaiah': 'Written by Isaiah around 700 BC, containing numerous Messianic prophecies.',
    'Revelation': 'Written by John around 95 AD, describing the consummation of God\'s plan.'
  };
  
  return `${contexts[fromBook] || `${fromBook} is an important biblical book.`} ${contexts[toBook] || `${toBook} is an important biblical book.`}`;
}

export default router;
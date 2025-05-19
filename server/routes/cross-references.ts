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

// Function to generate mock cross-references data for development
function generateMockCrossReferences(reference: string): CrossReference[] {
  const connectionTypes = ['thematic', 'quotation', 'fulfillment', 'parallel', 'contrast'];
  const referenceText: Record<string, string> = {
    'Genesis 1:1': 'In the beginning God created the heaven and the earth.',
    'John 1:1': 'In the beginning was the Word, and the Word was with God, and the Word was God.',
    'Hebrews 11:3': 'Through faith we understand that the worlds were framed by the word of God.',
    'Psalm 33:6': 'By the word of the LORD were the heavens made; and all the host of them by the breath of his mouth.',
    'Romans 5:8': 'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.',
    'John 3:16': 'For God so loved the world, that he gave his only begotten Son.',
    'Colossians 1:16': 'For by him were all things created, that are in heaven, and that are in earth.',
    'Isaiah 40:26': 'Lift up your eyes on high, and behold who hath created these things.',
    'Revelation 4:11': 'Thou art worthy, O Lord, to receive glory and honour and power: for thou hast created all things.',
    'Matthew 11:28': 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
    'Psalm 23:1': 'The LORD is my shepherd; I shall not want.',
  };
  
  const possibleRefs = Object.keys(referenceText).filter(ref => ref !== reference);
  const limit = 3; // Default number of references to generate
  const selectedRefs = possibleRefs.sort(() => Math.random() - 0.5).slice(0, limit);
  
  return selectedRefs.map((toRef, index) => {
    // Get random connection type and relevance
    const connection = connectionTypes[Math.floor(Math.random() * connectionTypes.length)];
    const relevance = Math.floor(Math.random() * 30) + 70; // 70-100
    
    // Generate explanation based on connection type
    let explanation = '';
    switch (connection) {
      case 'thematic':
        explanation = `Both verses address the theme of ${['creation', 'redemption', 'faithfulness', 'judgment'][Math.floor(Math.random() * 4)]}.`;
        break;
      case 'quotation':
        explanation = 'This passage directly quotes or alludes to the source text.';
        break;
      case 'fulfillment':
        explanation = 'This passage shows the fulfillment of the promise or prophecy.';
        break;
      case 'parallel':
        explanation = 'These passages describe similar events or teachings.';
        break;
      case 'contrast':
        explanation = 'These passages present contrasting perspectives or requirements.';
        break;
    }
    
    // Generate tags
    const allTags = ['creation', 'word', 'beginning', 'faith', 'power', 'love', 'redemption', 'glory', 'wisdom'];
    const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 tags
    const tags: string[] = [];
    for (let i = 0; i < numTags; i++) {
      const tag = allTags[Math.floor(Math.random() * allTags.length)];
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
    
    return {
      id: `${reference.replace(/\s+/g, '-')}-${index}`,
      fromRef: reference,
      toRef: toRef,
      toText: referenceText[toRef] || 'Verse text would appear here.',
      connection,
      relevance,
      explanation,
      tags
    };
  });
}
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

// Get cross-references for an entire chapter
router.get('/chapter/:book/:chapter', async (req: Request, res: Response) => {
  try {
    const { book, chapter } = req.params;
    const chapterNum = parseInt(chapter);
    
    // In a production app, this would query the database for all cross-references
    // where either fromRef or toRef is in this chapter
    const crossRefs: CrossReference[] = [];
    
    // Create a few cross-references for the chapter
    const bookName = book.charAt(0).toUpperCase() + book.slice(1).toLowerCase();
    
    // Generate for just a few verses to avoid overwhelming the display
    for (let verse = 1; verse <= 20; verse++) {
      // Only create references for every third verse
      if (verse % 3 === 0) {
        const verseRef = `${bookName} ${chapter}:${verse}`;
        const mockRefs = generateMockCrossReferences(verseRef);
        crossRefs.push(...mockRefs);
      }
    }
    
    return res.json(crossRefs);
  } catch (error) {
    console.error('Error fetching chapter cross-references:', error);
    return res.status(500).json({ error: 'Failed to fetch cross-references' });
  }
});

// Get cross-references for a specific verse
router.get('/:book/:chapter/:verse', async (req: Request, res: Response) => {
  try {
    const { book, chapter, verse } = req.params;
    const chapterNum = parseInt(chapter);
    const verseNum = parseInt(verse);
    
    if (isNaN(chapterNum) || isNaN(verseNum)) {
      return res.status(400).json({ message: 'Invalid chapter or verse number' });
    }
    
    // Normalize book name to match the format used in the chapter route
    const bookName = book.charAt(0).toUpperCase() + book.slice(1).toLowerCase();
    // Construct verse reference
    const fromRef = `${bookName} ${chapter}:${verse}`;
    
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
  const selectedThemes: string[] = [];
  
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
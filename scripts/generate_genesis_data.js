/**
 * Script to generate enhanced Genesis data with rich metadata
 * This will create a comprehensive dataset for Genesis with themes, people, places, etc.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name from the file URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load existing Bible data
let fullBibleData;
try {
  fullBibleData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bible_full.json'), 'utf8'));
} catch (error) {
  console.error('Error loading bible_full.json:', error);
  process.exit(1);
}

// Filter only Genesis verses
const genesisVerses = fullBibleData.filter(verse => verse.book === 'Genesis');

// Sort by chapter and verse
genesisVerses.sort((a, b) => {
  if (a.chapter !== b.chapter) {
    return a.chapter - b.chapter;
  }
  return a.verse - b.verse;
});

console.log(`Found ${genesisVerses.length} verses in Genesis`);

// Define metadata for Genesis
const genesisMetadata = {
  book: {
    name: 'Genesis',
    meaning: 'Beginning',
    author: 'Moses (traditional attribution)',
    date: 'circa 1440-1400 BCE (traditional dating)',
    canonicity: 'Canonical in Judaism, Christianity, and Islam',
    languages: ['Hebrew', 'Aramaic'],
    majorThemes: ['Creation', 'Fall', 'Flood', 'Covenant', 'Patriarchs'],
    structure: ['Primeval History (1-11)', 'Patriarchal History (12-50)']
  },
  // Detailed metadata for each chapter
  chapters: {
    1: {
      title: 'Creation',
      summary: 'God creates the universe, earth, plants, animals, and humans in six days and rests on the seventh.',
      themes: ['Creation', 'Divine order', 'Human dignity', 'Stewardship'],
      keyVerses: [1, 26, 27, 28, 31],
      people: ['God', 'Adam', 'Eve'],
      places: ['Heaven', 'Earth', 'Eden'],
      timeframe: 'Beginning of creation',
      symbols: ['Light', 'Darkness', 'Water', 'Land', 'Animals', 'Humanity'],
      connections: [
        { id: 'John 1:1-3', type: 'parallel', theme: 'Creation through the Word' },
        { id: 'Psalm 33:6', type: 'thematic', theme: 'Creation by God\'s word' },
        { id: 'Colossians 1:16', type: 'thematic', theme: 'Christ as creator' }
      ]
    },
    2: {
      title: 'Garden of Eden',
      summary: 'God creates Adam and Eve, places them in the Garden of Eden, and institutes the first marriage.',
      themes: ['Creation of humanity', 'Garden of Eden', 'Marriage', 'Work', 'First command'],
      keyVerses: [7, 18, 24],
      people: ['God', 'Adam', 'Eve'],
      places: ['Garden of Eden', 'Four rivers'],
      timeframe: 'Sixth day of creation and following',
      symbols: ['Dust', 'Breath of life', 'Tree of life', 'Tree of knowledge', 'Rivers', 'Helper'],
      connections: [
        { id: '1 Corinthians 15:45', type: 'thematic', theme: 'First Adam vs. Last Adam' },
        { id: 'Matthew 19:4-6', type: 'quotation', theme: 'Institution of marriage' },
        { id: 'Revelation 22:1-2', type: 'parallel', theme: 'Tree of life' }
      ]
    },
    3: {
      title: 'The Fall',
      summary: 'The serpent tempts Eve, leading to the first sin and expulsion from Eden.',
      themes: ['Temptation', 'Sin', 'Fall', 'Judgment', 'Promise'],
      keyVerses: [6, 15, 19, 24],
      people: ['God', 'Adam', 'Eve', 'Serpent'],
      places: ['Garden of Eden'],
      timeframe: 'After creation, before expulsion',
      symbols: ['Serpent', 'Fruit', 'Nakedness', 'Clothing', 'Flaming sword'],
      connections: [
        { id: 'Romans 5:12', type: 'thematic', theme: 'Sin entering the world' },
        { id: 'Revelation 12:9', type: 'interpretation', theme: 'Identity of the serpent' },
        { id: 'Hebrews 2:14', type: 'fulfillment', theme: 'Crushing the serpent' }
      ]
    },
    4: {
      title: 'Cain and Abel',
      summary: 'The first murder occurs when Cain kills his brother Abel out of jealousy.',
      themes: ['Sacrifice', 'Jealousy', 'Murder', 'Judgment', 'Wandering'],
      keyVerses: [4, 8, 10, 15],
      people: ['Cain', 'Abel', 'God'],
      places: ['East of Eden', 'Land of Nod'],
      timeframe: 'First generation after Eden',
      symbols: ['Offering', 'Blood', 'Mark', 'Ground'],
      connections: [
        { id: 'Hebrews 11:4', type: 'commentary', theme: 'Abel\'s faith' },
        { id: '1 John 3:12', type: 'moral lesson', theme: 'Warning against hatred' },
        { id: 'Jude 1:11', type: 'warning', theme: 'Way of Cain' }
      ]
    },
    // Add more chapters as needed
  }
};

// Function to enrich Genesis verses with metadata
function enrichGenesisVerses(verses, metadata) {
  return verses.map(verse => {
    const chapterMetadata = metadata.chapters[verse.chapter] || {};
    
    // Get verse-specific metadata
    let verseMetadata = {};
    
    // Determine themes for this specific verse
    const verseThemes = [];
    // Add chapter themes by default
    if (chapterMetadata.themes) {
      verseThemes.push(...chapterMetadata.themes);
    }
    
    // Detect people mentioned
    const people = [...(chapterMetadata.people || [])];
    
    // Detect places mentioned
    const places = [...(chapterMetadata.places || [])];
    
    // Detect symbols present
    const symbols = [];
    if (chapterMetadata.symbols) {
      // Only include symbols that are actually mentioned in the verse
      chapterMetadata.symbols.forEach(symbol => {
        const lowerCaseText = verse.text.kjv.toLowerCase();
        if (lowerCaseText.includes(symbol.toLowerCase())) {
          symbols.push(symbol);
        }
      });
    }
    
    // Find cross-references for this verse
    const crossReferences = [];
    if (chapterMetadata.connections) {
      chapterMetadata.connections.forEach(connection => {
        // For now, we'll simply adopt chapter connections for key verses
        if (chapterMetadata.keyVerses && chapterMetadata.keyVerses.includes(verse.verse)) {
          crossReferences.push(connection);
        }
      });
    }
    
    // Add emotion detection (simplistic version)
    const emotions = detectEmotions(verse.text.kjv);
    
    // Return enriched verse
    return {
      ...verse,
      tags: {
        themes: verseThemes,
        people,
        places,
        symbols,
        emotions,
        timeframe: chapterMetadata.timeframe ? [chapterMetadata.timeframe] : [],
        cross_refs: crossReferences.map(ref => ref.id)
      },
      metadata: {
        isKeyVerse: chapterMetadata.keyVerses ? chapterMetadata.keyVerses.includes(verse.verse) : false,
        chapterTitle: chapterMetadata.title || '',
        chapterSummary: chapterMetadata.summary || '',
        crossReferences: crossReferences
      }
    };
  });
}

// Simple emotion detection function
function detectEmotions(text) {
  const emotionKeywords = {
    joy: ['joy', 'rejoice', 'glad', 'happy', 'delight', 'pleasure', 'blessed'],
    sorrow: ['sorrow', 'grief', 'mourn', 'weep', 'sad', 'afflicted', 'distressed'],
    fear: ['fear', 'afraid', 'terror', 'dread', 'trembled', 'frightened'],
    anger: ['anger', 'wrath', 'fury', 'indignation', 'rage', 'angry'],
    shame: ['shame', 'ashamed', 'disgrace', 'humiliated', 'embarrassed'],
    peace: ['peace', 'calm', 'rest', 'quiet', 'tranquil'],
    hope: ['hope', 'expect', 'anticipation', 'await', 'look forward'],
    love: ['love', 'beloved', 'affection', 'cherish', 'compassion'],
    guilt: ['guilt', 'guilty', 'condemn', 'blame', 'fault', 'sin']
  };
  
  const lowerText = text.toLowerCase();
  const detectedEmotions = [];
  
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        detectedEmotions.push(emotion);
        break; // Found one keyword for this emotion, no need to check others
      }
    }
  }
  
  return detectedEmotions;
}

// Enrich Genesis verses with metadata
const enrichedGenesisVerses = enrichGenesisVerses(genesisVerses, genesisMetadata);

// Save to data folder
const outputPath = path.join(__dirname, '../data/genesis_enriched.json');
fs.writeFileSync(outputPath, JSON.stringify(enrichedGenesisVerses, null, 2));

console.log(`Generated enriched Genesis data with ${enrichedGenesisVerses.length} verses. Saved to ${outputPath}`);

// Create chapter summaries file
const chapterSummaries = {};
Object.entries(genesisMetadata.chapters).forEach(([chapter, metadata]) => {
  chapterSummaries[chapter] = {
    title: metadata.title,
    summary: metadata.summary,
    themes: metadata.themes || [],
    people: metadata.people || [],
    places: metadata.places || []
  };
});

const summariesPath = path.join(__dirname, '../data/genesis_chapter_summaries.json');
fs.writeFileSync(summariesPath, JSON.stringify(chapterSummaries, null, 2));

console.log(`Generated Genesis chapter summaries. Saved to ${summariesPath}`);
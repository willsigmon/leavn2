#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * Script to generate enhanced Genesis data with rich metadata
 * This will create a comprehensive dataset for Genesis with themes, people, places, etc.
 */

const GENESIS_METADATA = {
  1: {
    title: 'Creation',
    summary: 'God creates the universe, the earth, plants, animals, and humans.',
    people: ['God', 'Adam', 'Eve'],
    places: ['Garden of Eden', 'Earth', 'Heaven'],
    themes: ['Creation', 'Order from chaos', 'Divine power', 'Purpose'],
    symbols: ['Light', 'Darkness', 'Water', 'Land', 'Stars'],
    emotions: ['Wonder', 'Peace', 'Completion']
  },
  2: {
    title: 'Garden of Eden',
    summary: 'God creates Adam and Eve and places them in the Garden of Eden.',
    people: ['God', 'Adam', 'Eve'],
    places: ['Garden of Eden', 'Rivers of Eden'],
    themes: ['Creation of humanity', 'Paradise', 'Marriage', 'Stewardship'],
    symbols: ['Tree of Life', 'Tree of Knowledge', 'Rivers', 'Dust'],
    emotions: ['Contentment', 'Wonder', 'Companionship']
  },
  3: {
    title: 'The Fall',
    summary: 'Adam and Eve are tempted by the serpent and disobey God.',
    people: ['God', 'Adam', 'Eve', 'Serpent'],
    places: ['Garden of Eden'],
    themes: ['Sin', 'Temptation', 'Disobedience', 'Consequences', 'Promise'],
    symbols: ['Serpent', 'Fruit', 'Nakedness', 'Clothing'],
    emotions: ['Guilt', 'Fear', 'Shame', 'Regret', 'Hope']
  }
};

// Sample Genesis chapter data (simplified for this example)
const GENESIS_SAMPLE = {
  'genesis': {
    name: 'Genesis',
    chapters: [
      {
        verses: [
          { kjv: 'In the beginning God created the heaven and the earth.', web: 'In the beginning, God created the heavens and the earth.' },
          { kjv: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.', web: 'The earth was formless and empty. Darkness was on the surface of the deep and God\'s Spirit was hovering over the surface of the waters.' },
          { kjv: 'And God said, Let there be light: and there was light.', web: 'God said, "Let there be light," and there was light.' },
          { kjv: 'And God saw the light, that it was good: and God divided the light from the darkness.', web: 'God saw the light, and saw that it was good. God divided the light from the darkness.' },
          { kjv: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.', web: 'God called the light "day", and the darkness he called "night". There was evening and there was morning, the first day.' }
        ]
      }
    ]
  }
};

/**
 * Enrich Genesis verses with metadata
 */
function enrichGenesisVerses(verses, metadata) {
  return verses.map((verse, index) => {
    const enriched = { ...verse };
    
    // Add metadata based on verse content and context
    enriched.metadata = {
      title: `${metadata.title} - Verse ${index + 1}`,
      summary: index === 0 ? metadata.summary : `Part of ${metadata.title}`,
      people: metadata.people,
      places: metadata.places,
      themes: metadata.themes,
      symbols: metadata.symbols,
      emotions: detectEmotions(verse.kjv || verse.web, metadata.emotions),
      importance: index === 0 ? 'high' : 'medium', // First verse usually more significant
      cross_references: []
    };
    
    // Add tags for search and classification
    enriched.tags = {
      themes: metadata.themes,
      figures: metadata.people,
      places: metadata.places,
      timeframe: ['Creation', 'Beginning'],
      symbols: metadata.symbols,
      emotions: metadata.emotions
    };
    
    return enriched;
  });
}

/**
 * Detect emotions in text based on predefined emotion sets
 */
function detectEmotions(text, availableEmotions) {
  // For demo purposes, just return the first 2 emotions
  // In a real implementation, this would use NLP to analyze the text
  return availableEmotions.slice(0, 2);
}

// Main function to generate enriched Genesis data
function generateEnrichedGenesisData() {
  const dataDir = path.join(process.cwd(), 'data');
  
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('📂 Created data directory');
  }
  
  const outputPath = path.join(dataDir, 'genesis_enriched.json');
  
  // Deep copy the sample data
  const enrichedData = JSON.parse(JSON.stringify(GENESIS_SAMPLE));
  
  // Enrich verses with metadata for each available chapter
  Object.keys(GENESIS_METADATA).forEach(chapterNum => {
    const chapNum = parseInt(chapterNum, 10) - 1;
    
    // Skip if chapter doesn't exist in our sample data
    if (!enrichedData.genesis.chapters[chapNum]) {
      console.log(`⚠️ Chapter ${chapterNum} not found in sample data, skipping`);
      return;
    }
    
    // Enrich the verses with metadata
    enrichedData.genesis.chapters[chapNum].verses = 
      enrichGenesisVerses(
        enrichedData.genesis.chapters[chapNum].verses, 
        GENESIS_METADATA[chapterNum]
      );
    
    console.log(`✅ Enhanced Genesis chapter ${chapterNum} with rich metadata`);
  });
  
  // Write the enriched data to file
  fs.writeFileSync(outputPath, JSON.stringify(enrichedData, null, 2));
  console.log(`📝 Wrote enriched Genesis data to ${outputPath}`);
  
  return enrichedData;
}

// Run the generator if executed directly
if (process.argv[1] === import.meta.url.substring(7)) {
  generateEnrichedGenesisData();
}

export default generateEnrichedGenesisData;
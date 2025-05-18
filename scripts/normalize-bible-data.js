#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, rmSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Normalizes Bible data into a consistent format
 * - Takes raw verse data and structures it by book and chapter
 * - Cleans up any redundant vector data
 */
async function normalizeBibleData() {
  const dataDir = join(process.cwd(), 'data');
  const path = join(dataDir, 'bible_full.json');
  
  if (!existsSync(dataDir)) {
    console.log('📂 Creating data directory');
    const fs = await import('node:fs/promises');
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  if (!existsSync(path)) {
    console.log('❌ No bible_full.json found to normalize');
    return;
  }

  const rawData = JSON.parse(readFileSync(path, 'utf8'));
  
  // If already normalized (not an array), skip
  if (!Array.isArray(rawData)) {
    console.log('✅ Bible data already normalized');
    return;
  }
  
  // Normalize raw verse array into book/chapter structure
  const normalizedData = {};
  
  for (const verse of rawData) {
    if (!verse.book || !verse.chapter || !verse.verse || !verse.text) {
      console.log(`⚠️ Skipping invalid verse entry: ${JSON.stringify(verse)}`);
      continue;
    }
    
    // Initialize book entry if not exists
    if (!normalizedData[verse.book]) {
      normalizedData[verse.book] = {
        name: verse.book,
        chapters: []
      };
    }
    
    const bookEntry = normalizedData[verse.book];
    
    // Make sure we have enough chapter entries
    while (bookEntry.chapters.length < verse.chapter) {
      bookEntry.chapters.push({ verses: [] });
    }
    
    // Add verse to appropriate chapter
    const chapterIndex = verse.chapter - 1;
    const verseIndex = verse.verse - 1;
    
    // Initialize verses array if needed and ensure it's large enough
    const chapter = bookEntry.chapters[chapterIndex];
    while (chapter.verses.length <= verseIndex) {
      chapter.verses.push(null);
    }
    
    // Store verse text
    chapter.verses[verseIndex] = {
      kjv: verse.text.kjv || "",
      web: verse.text.web || ""
    };
    
    // Copy any additional metadata if present
    if (verse.metadata) {
      chapter.verses[verseIndex].metadata = verse.metadata;
    }
    
    if (verse.tags) {
      chapter.verses[verseIndex].tags = verse.tags;
    }
  }
  
  // Write normalized data back to file
  writeFileSync(path, JSON.stringify(normalizedData, null, 2));
  console.log('✅ Normalized bible_full.json');
  
  // Clean up any vector data (which can be regenerated)
  const vectorFiles = [
    'bible_chunks_kjv.json', 
    'bible_chunks_web.json', 
    'bible_embeddings_kjv.json', 
    'bible_embeddings_web.json'
  ];
  
  vectorFiles.forEach(file => {
    const filePath = join(dataDir, file);
    if (existsSync(filePath)) {
      rmSync(filePath);
      console.log(`✅ Removed ${file} (will be regenerated when needed)`);
    }
  });
}

// Execute if run directly
if (process.argv[1] === import.meta.url.substring(7)) {
  normalizeBibleData().catch(error => {
    console.error('Error normalizing Bible data:', error);
    process.exit(1);
  });
}

export default normalizeBibleData;
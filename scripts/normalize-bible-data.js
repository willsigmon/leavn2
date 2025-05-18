import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';

/**
 * Normalizes Bible data into a consistent format
 * - Takes raw verse data and structures it by book and chapter
 * - Cleans up any redundant vector data
 */
function normalizeBibleData() {
  const path = 'data/bible_full.json';
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
      kjv: verse.text.kjv,
      web: verse.text.web
    };
  }
  
  // Write normalized data back to file
  writeFileSync(path, JSON.stringify(normalizedData, null, 2));
  console.log('✅ Normalized bible_full.json');
  
  // Clean up any vector data (which can be regenerated)
  ['data/bible_chunks_kjv.json', 'data/bible_chunks_web.json', 
   'data/bible_embeddings_kjv.json', 'data/bible_embeddings_web.json'].forEach(file => {
    if (existsSync(file)) {
      rmSync(file);
      console.log(`✅ Removed ${file} (will be regenerated when needed)`);
    }
  });
}

// Execute if run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  normalizeBibleData();
}

export default normalizeBibleData;
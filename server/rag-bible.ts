import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { db } from './db';
import { verses } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Initialize OpenAI client
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Bible cache structure for full text
export interface BibleVerse {
  id: string;             // e.g., "Genesis 1:1"
  book: string;           // e.g., "Genesis"
  chapter: number;        // e.g., 1
  verse: number;          // e.g., 1
  text: {
    kjv: string;          // King James Version text
    web: string;          // World English Bible text
  };
  tags?: {                // Optional tags for the verse
    themes?: string[];
    figures?: string[];
    places?: string[];
    timeframe?: string[];
    symbols?: string[];
  };
}

// Chunk structure for embedding
export interface BibleChunk {
  id: string;              // Unique ID for the chunk
  content: string;         // The text content (100-300 words)
  embedding?: number[];    // Vector embedding
  references: {            // References to included verses
    verses: string[];      // List of verse IDs included in this chunk 
    book: string;
    startChapter: number;
    startVerse: number;
    endChapter: number;
    endVerse: number;
  };
  metadata: {
    tags: string[];        // Combined tags from all verses
    translation: string;   // "kjv" or "web"
  };
}

// File paths
const DATA_DIR = path.join(__dirname, '../data');
const BIBLE_CACHE_PATH = path.join(DATA_DIR, 'bible_full.json');
const CHUNKS_PATH = path.join(DATA_DIR, 'bible_chunks.json');
const EMBEDDINGS_PATH = path.join(DATA_DIR, 'bible_embeddings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory caches
let bibleCache: BibleVerse[] = [];
let bibleChunks: BibleChunk[] = [];
let embeddingsLoaded = false;

/**
 * Download and cache the Bible text
 */
export async function downloadAndCacheBible() {
  console.log('Downloading and caching Bible text...');
  
  // This would normally fetch from an API, but for this implementation
  // we'll use the database and add some sample verses
  
  try {
    // Get verses from database
    const dbVerses = await db.select().from(verses);
    
    if (dbVerses.length === 0) {
      console.log('No verses found in database. Adding sample verses...');
      // Sample verses would be added here
      return [];
    }
    
    // Convert to our cache format
    bibleCache = dbVerses.map(verse => ({
      id: `${verse.book} ${verse.chapter}:${verse.verseNumber}`,
      book: verse.book,
      chapter: verse.chapter,
      verse: verse.verseNumber,
      text: {
        kjv: verse.text, // For now, using the same text for both
        web: verse.text,
      }
    }));
    
    // Save to file
    fs.writeFileSync(BIBLE_CACHE_PATH, JSON.stringify(bibleCache, null, 2));
    console.log(`Cached ${bibleCache.length} Bible verses.`);
    
    return bibleCache;
  } catch (error) {
    console.error('Error downloading Bible:', error);
    return [];
  }
}

/**
 * Load Bible cache from file if it exists
 */
export function loadBibleCache(): BibleVerse[] {
  try {
    if (fs.existsSync(BIBLE_CACHE_PATH)) {
      const data = fs.readFileSync(BIBLE_CACHE_PATH, 'utf-8');
      bibleCache = JSON.parse(data);
      console.log(`Loaded ${bibleCache.length} verses from cache.`);
    } else {
      console.log('Bible cache not found. Will need to download.');
      bibleCache = [];
    }
    return bibleCache;
  } catch (error) {
    console.error('Error loading Bible cache:', error);
    return [];
  }
}

/**
 * Create chunks of 100-300 words from Bible verses
 */
export function createBibleChunks(translation: 'kjv' | 'web' = 'kjv'): BibleChunk[] {
  console.log(`Creating ${translation.toUpperCase()} Bible chunks...`);
  
  if (bibleCache.length === 0) {
    console.log('Bible cache is empty. Load or download the Bible first.');
    return [];
  }
  
  const chunks: BibleChunk[] = [];
  let currentChunk: string[] = [];
  let currentWordCount = 0;
  let chunkReferences: string[] = [];
  let currentBook = '';
  let startChapter = 0, startVerse = 0;
  let endChapter = 0, endVerse = 0;
  let chunkId = 1;
  let allTags: Set<string> = new Set();
  
  // Group by book and chapter for logical chunking
  const versesByBookChapter: Record<string, BibleVerse[]> = {};
  
  bibleCache.forEach(verse => {
    const key = `${verse.book}-${verse.chapter}`;
    if (!versesByBookChapter[key]) {
      versesByBookChapter[key] = [];
    }
    versesByBookChapter[key].push(verse);
  });
  
  // Process each book/chapter group
  Object.keys(versesByBookChapter).forEach(key => {
    const verses = versesByBookChapter[key].sort((a, b) => a.verse - b.verse);
    
    verses.forEach(verse => {
      const verseText = translation === 'kjv' ? verse.text.kjv : verse.text.web;
      const words = verseText.split(/\s+/).length;
      
      // Start a new chunk if this is a new book/chapter or if adding would exceed target size
      if (
        currentBook !== verse.book || 
        currentWordCount + words > 300 ||
        currentChunk.length === 0
      ) {
        // Save the current chunk if it's not empty
        if (currentChunk.length > 0) {
          chunks.push({
            id: `chunk-${chunkId++}`,
            content: currentChunk.join(' '),
            references: {
              verses: chunkReferences,
              book: currentBook,
              startChapter,
              startVerse,
              endChapter,
              endVerse
            },
            metadata: {
              tags: Array.from(allTags),
              translation
            }
          });
        }
        
        // Start a new chunk
        currentChunk = [verseText];
        currentWordCount = words;
        chunkReferences = [verse.id];
        currentBook = verse.book;
        startChapter = verse.chapter;
        startVerse = verse.verse;
        endChapter = verse.chapter;
        endVerse = verse.verse;
        allTags = new Set();
        
        // Add tags from this verse
        if (verse.tags) {
          Object.values(verse.tags).forEach(tagArray => {
            if (tagArray) {
              tagArray.forEach(tag => allTags.add(tag));
            }
          });
        }
      } else {
        // Add to current chunk
        currentChunk.push(verseText);
        currentWordCount += words;
        chunkReferences.push(verse.id);
        endChapter = verse.chapter;
        endVerse = verse.verse;
        
        // Add tags from this verse
        if (verse.tags) {
          Object.values(verse.tags).forEach(tagArray => {
            if (tagArray) {
              tagArray.forEach(tag => allTags.add(tag));
            }
          });
        }
      }
    });
  });
  
  // Add the last chunk if there's anything left
  if (currentChunk.length > 0) {
    chunks.push({
      id: `chunk-${chunkId}`,
      content: currentChunk.join(' '),
      references: {
        verses: chunkReferences,
        book: currentBook,
        startChapter,
        startVerse,
        endChapter,
        endVerse
      },
      metadata: {
        tags: Array.from(allTags),
        translation
      }
    });
  }
  
  // Save chunks to file
  fs.writeFileSync(
    CHUNKS_PATH.replace('.json', `_${translation}.json`),
    JSON.stringify(chunks, null, 2)
  );
  
  console.log(`Created ${chunks.length} chunks for ${translation.toUpperCase()}.`);
  return chunks;
}

/**
 * Load Bible chunks from file
 */
export function loadBibleChunks(translation: 'kjv' | 'web' = 'kjv'): BibleChunk[] {
  const filePath = CHUNKS_PATH.replace('.json', `_${translation}.json`);
  
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const chunks = JSON.parse(data);
      console.log(`Loaded ${chunks.length} chunks for ${translation.toUpperCase()}.`);
      return chunks;
    } else {
      console.log(`${translation.toUpperCase()} chunks not found. Will need to create them.`);
      return [];
    }
  } catch (error) {
    console.error(`Error loading ${translation.toUpperCase()} chunks:`, error);
    return [];
  }
}

/**
 * Create embeddings for Bible chunks
 */
export async function createEmbeddings(translation: 'kjv' | 'web' = 'kjv') {
  console.log(`Creating embeddings for ${translation.toUpperCase()} chunks...`);
  
  // Load or create chunks
  let chunks = loadBibleChunks(translation);
  if (chunks.length === 0) {
    chunks = createBibleChunks(translation);
  }
  
  const embeddingsPath = EMBEDDINGS_PATH.replace('.json', `_${translation}.json`);
  
  // Check if embeddings already exist
  if (fs.existsSync(embeddingsPath)) {
    console.log(`Embeddings for ${translation.toUpperCase()} already exist.`);
    return;
  }
  
  try {
    // Process chunks in batches to avoid rate limits
    const batchSize = 10;
    let processedCount = 0;
    
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      
      // Process batch in parallel
      await Promise.all(batch.map(async (chunk) => {
        try {
          const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: chunk.content,
            encoding_format: "float",
          });
          
          chunk.embedding = response.data[0].embedding;
          processedCount++;
          
          if (processedCount % 10 === 0) {
            console.log(`Processed ${processedCount}/${chunks.length} embeddings...`);
          }
        } catch (error) {
          console.error(`Error creating embedding for chunk ${chunk.id}:`, error);
        }
      }));
      
      // Save progress periodically
      if ((i + batchSize) % 50 === 0 || i + batchSize >= chunks.length) {
        fs.writeFileSync(embeddingsPath, JSON.stringify(chunks, null, 2));
        console.log(`Saved progress: ${Math.min(i + batchSize, chunks.length)}/${chunks.length} embeddings.`);
      }
    }
    
    // Final save
    fs.writeFileSync(embeddingsPath, JSON.stringify(chunks, null, 2));
    console.log(`Created and saved embeddings for ${chunks.length} chunks.`);
  } catch (error) {
    console.error('Error creating embeddings:', error);
  }
}

/**
 * Load embeddings from file
 */
export function loadEmbeddings(translation: 'kjv' | 'web' = 'kjv'): BibleChunk[] {
  const embeddingsPath = EMBEDDINGS_PATH.replace('.json', `_${translation}.json`);
  
  try {
    if (fs.existsSync(embeddingsPath)) {
      const data = fs.readFileSync(embeddingsPath, 'utf-8');
      const chunks = JSON.parse(data);
      console.log(`Loaded ${chunks.length} embeddings for ${translation.toUpperCase()}.`);
      bibleChunks = chunks;
      embeddingsLoaded = true;
      return chunks;
    } else {
      console.log(`${translation.toUpperCase()} embeddings not found.`);
      return [];
    }
  } catch (error) {
    console.error(`Error loading ${translation.toUpperCase()} embeddings:`, error);
    return [];
  }
}

/**
 * Find similar chunks using vector search
 */
export async function findSimilarChunks(
  query: string,
  translation: 'kjv' | 'web' = 'kjv',
  topK: number = 5
): Promise<BibleChunk[]> {
  console.log(`Finding similar chunks for query: "${query}"`);
  
  // Load embeddings if not already loaded
  if (!embeddingsLoaded || bibleChunks.length === 0) {
    bibleChunks = loadEmbeddings(translation);
    
    if (bibleChunks.length === 0) {
      console.log('No embeddings found. Creating them first...');
      await createEmbeddings(translation);
      bibleChunks = loadEmbeddings(translation);
    }
  }
  
  try {
    // Generate embedding for the query
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
      encoding_format: "float",
    });
    
    const queryEmbedding = response.data[0].embedding;
    
    // Calculate similarity scores using cosine similarity
    const results = bibleChunks
      .filter(chunk => chunk.embedding && chunk.embedding.length > 0)
      .map(chunk => {
        const similarity = cosineSimilarity(queryEmbedding, chunk.embedding!);
        return { chunk, similarity };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
    
    console.log(`Found ${results.length} similar chunks.`);
    return results.map(r => r.chunk);
  } catch (error) {
    console.error('Error finding similar chunks:', error);
    return [];
  }
}

/**
 * Get complete context for RAG from similar chunks
 */
export async function getRAGContext(
  query: string, 
  translation: 'kjv' | 'web' = 'kjv',
  topK: number = 5
): Promise<string> {
  const similarChunks = await findSimilarChunks(query, translation, topK);
  
  if (similarChunks.length === 0) {
    return 'No similar Bible passages found.';
  }
  
  // Format chunks for RAG context
  const context = similarChunks.map(chunk => {
    const reference = `${chunk.references.book} ${chunk.references.startChapter}:${chunk.references.startVerse}-${chunk.references.endChapter}:${chunk.references.endVerse}`;
    return `[${reference}]: ${chunk.content}`;
  }).join('\n\n');
  
  return context;
}

/**
 * Cosine similarity calculation
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Initialize the Bible RAG system
 */
export async function initBibleRAG() {
  // First, ensure we have the Bible text
  let bible = loadBibleCache();
  if (bible.length === 0) {
    bible = await downloadAndCacheBible();
  }
  
  // Then, ensure we have chunks and embeddings for each translation
  const translations: ('kjv' | 'web')[] = ['kjv', 'web'];
  
  for (const translation of translations) {
    let chunks = loadBibleChunks(translation);
    if (chunks.length === 0) {
      chunks = createBibleChunks(translation);
    }
    
    const embeddingsPath = EMBEDDINGS_PATH.replace('.json', `_${translation}.json`);
    if (!fs.existsSync(embeddingsPath)) {
      await createEmbeddings(translation);
    }
  }
  
  console.log('Bible RAG system initialized successfully.');
}
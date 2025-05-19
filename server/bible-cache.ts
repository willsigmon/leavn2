import fs from 'fs';
import path from 'path';
import { db } from './db';
import { tags, verses, verseTags } from '@shared/schema';
import { eq, and, inArray, not, sql } from 'drizzle-orm';
import crypto from 'crypto';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Define structure for cached Bible
interface BibleVerse {
  web: string;
  kjv: string;
}

interface BibleCache {
  [reference: string]: BibleVerse;
}

// Structure for verse tags
interface VerseTagsData {
  themes: string[];
  figures: string[];
  places: string[];
  timeframe: string[];
  symbols: string[];
  emotions: string[];
  cross_refs: string[];
}

// Path for cached Bible data
// In ESM modules, we need to create our own path resolution
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CACHE_DIR = join(__dirname, '../data');
const BIBLE_CACHE_PATH = join(CACHE_DIR, 'bible_cache.json');
const TAGS_CACHE_PATH = join(CACHE_DIR, 'tags_cache.json');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Initialize empty cache
let bibleCache: BibleCache = {};
let tagsCache: Record<string, VerseTagsData> = {};

// Load Bible cache if exists
export function loadBibleCache(): BibleCache {
  if (fs.existsSync(BIBLE_CACHE_PATH)) {
    const data = fs.readFileSync(BIBLE_CACHE_PATH, 'utf-8');
    bibleCache = JSON.parse(data);
    console.log(`Loaded ${Object.keys(bibleCache).length} verses from cache.`);
  } else {
    console.log('Bible cache not found, creating a new one.');
    bibleCache = {};
  }
  return bibleCache;
}

// Save Bible cache
export function saveBibleCache() {
  fs.writeFileSync(BIBLE_CACHE_PATH, JSON.stringify(bibleCache, null, 2));
  console.log(`Saved ${Object.keys(bibleCache).length} verses to cache.`);
}

// Load tags cache if exists
export function loadTagsCache(): Record<string, VerseTagsData> {
  if (fs.existsSync(TAGS_CACHE_PATH)) {
    const data = fs.readFileSync(TAGS_CACHE_PATH, 'utf-8');
    tagsCache = JSON.parse(data);
    console.log(`Loaded tags for ${Object.keys(tagsCache).length} verses from cache.`);
  } else {
    console.log('Tags cache not found, creating a new one.');
    tagsCache = {};
  }
  return tagsCache;
}

// Save tags cache
export function saveTagsCache() {
  fs.writeFileSync(TAGS_CACHE_PATH, JSON.stringify(tagsCache, null, 2));
  console.log(`Saved tags for ${Object.keys(tagsCache).length} verses to cache.`);
}

// Add a verse to Bible cache
export function addVerseToBibleCache(reference: string, webText: string, kjvText: string) {
  bibleCache[reference] = {
    web: webText,
    kjv: kjvText
  };
}

// Get verse from Bible cache
export function getVerseFromBibleCache(reference: string): BibleVerse | null {
  return bibleCache[reference] || null;
}

// Generate tags for a verse using AI
export async function generateTagsForVerse(reference: string, verseText: string): Promise<VerseTagsData> {
  // Check if we have tags cached already
  if (tagsCache[reference]) {
    return tagsCache[reference];
  }

  try {
    // The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a biblical scholar and theologian specializing in tagging and categorizing Bible verses.
Extract and categorize elements from the provided Bible verse into the following categories:
- themes: Spiritual themes present in the verse (e.g., Creation, Covenant, Salvation)
- figures: Named or implied people/beings in the verse (e.g., Jesus, Moses, God)
- places: Physical locations mentioned (e.g., Jerusalem, Garden of Eden)
- timeframe: Time periods or events (e.g., Passover, End Times, Creation)
- symbols: Symbolic elements (e.g., Light, Water, Bread)
- emotions: Emotional elements conveyed (e.g., Joy, Fear, Trust)
- cross_refs: References to other Bible verses that closely relate to this one (provide 2-3 max)

Format your response as a JSON object with these categories as keys, each with an array of relevant tags.
Be concise, specific, and focus only on elements clearly present or strongly implied.`
        },
        {
          role: "user",
          content: `Reference: ${reference}\nVerse: ${verseText}\n\nExtract tags from this verse.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const tags = JSON.parse(response.choices[0].message.content) as VerseTagsData;
    
    // Cache the result
    tagsCache[reference] = tags;
    
    // Save the updated cache periodically (consider adding batching for production)
    saveTagsCache();
    
    return tags;
  } catch (error) {
    console.error('Error generating tags for verse:', error);
    // Return empty tags object if there's an error
    return {
      themes: [],
      figures: [],
      places: [],
      timeframe: [],
      symbols: [],
      emotions: [],
      cross_refs: []
    };
  }
}

// Save tags to database
export async function saveTagsToDatabase(reference: string, tagsData: VerseTagsData) {
  try {
    // Get the verse ID from the reference
    const [verse] = await db.select().from(verses).where(
      eq(verses.id, reference)
    );

    if (!verse) {
      console.error(`Verse with reference ${reference} not found in database`);
      return;
    }

    // Process each tag category
    const categories = [
      { name: 'themes', tags: tagsData.themes },
      { name: 'figures', tags: tagsData.figures },
      { name: 'places', tags: tagsData.places },
      { name: 'timeframe', tags: tagsData.timeframe },
      { name: 'symbols', tags: tagsData.symbols },
      { name: 'emotions', tags: tagsData.emotions }
    ];

    for (const category of categories) {
      for (const tagName of category.tags) {
        // Check if tag exists
        let [existingTag] = await db.select().from(tags).where(
          eq(tags.name, tagName)
        );

        // If tag doesn't exist, create it
        if (!existingTag) {
          const [newTag] = await db.insert(tags).values({
            id: crypto.randomUUID(),
            name: tagName,
            category: category.name,
            createdAt: new Date(),
          }).returning();
          
          existingTag = newTag;
        }

        // Check if verse-tag relationship exists
        const [existingVerseTag] = await db
          .select()
          .from(verseTags)
          .where(
            and(
              eq(verseTags.verseReference, verse.id),
              eq(verseTags.tagId, existingTag.id)
            )
          );

        // If relationship doesn't exist, create it
        if (!existingVerseTag) {
          await db.insert(verseTags).values({
            id: crypto.randomUUID(),
            verseReference: verse.id,
            tagId: existingTag.id,
            createdAt: new Date(),
          });
        }
      }
    }

    console.log(`Saved tags for ${reference} to database`);
  } catch (error) {
    console.error('Error saving tags to database:', error);
  }
}

// Get random featured tags for a verse
export async function getFeaturedTagsForVerse(verseReference: string, count: number = 3): Promise<string[]> {
  try {
    // Get all tags for this verse
    const verseTags = await db
      .select({
        tagName: tags.name,
      })
      .from(verseTags)
      .innerJoin(tags, eq(verseTags.tagId, tags.id))
      .where(eq(verseTags.verseReference, verseReference));
    
    // If we have more tags than requested count, randomly select some
    if (verseTags.length > count) {
      const shuffled = [...verseTags].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count).map(t => t.tagName);
    }
    
    // Otherwise return all tags
    return verseTags.map(t => t.tagName);
  } catch (error) {
    console.error('Error getting featured tags:', error);
    return [];
  }
}

// Search for verses by tag
export async function findVersesByTag(tagName: string, limit: number = 10): Promise<string[]> {
  try {
    const [tag] = await db.select().from(tags).where(eq(tags.name, tagName));
    
    if (!tag) return [];
    
    const relatedVerses = await db
      .select({
        verseReference: verseTags.verseReference,
      })
      .from(verseTags)
      .where(eq(verseTags.tagId, tag.id))
      .limit(limit);

    return relatedVerses.map(v => v.verseReference);
  } catch (error) {
    console.error('Error finding verses by tag:', error);
    return [];
  }
}

// Search for related verses based on common tags
export async function findRelatedVerses(verseReference: string, limit: number = 5): Promise<string[]> {
  try {
    // Get all tags for this verse
    const vTags = await db
      .select({
        tagId: verseTags.tagId,
      })
      .from(verseTags)
      .where(eq(verseTags.verseReference, verseReference));
    
    if (vTags.length === 0) return [];
    
    const tagIds = vTags.map(t => t.tagId);
    
    // Find verses that share these tags but aren't the source verse
    const relatedVerses = await db
      .select({
        verseReference: verseTags.verseReference,
        // Count how many matching tags each verse has
        count: () => {
          return { name: "tag_count" };
        },
      })
      .from(verseTags)
      .where(
        and(
          inArray(verseTags.tagId, tagIds),
          not(eq(verseTags.verseReference, verseReference))
        )
      )
      .groupBy(verseTags.verseReference)
      .orderBy(sql`count(*) desc`)
      .limit(limit);
    
    return relatedVerses.map(v => v.verseReference);
  } catch (error) {
    console.error('Error finding related verses:', error);
    return [];
  }
}

// Initialize both caches
export function initializeCaches() {
  loadBibleCache();
  loadTagsCache();
}
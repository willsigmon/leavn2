import { Router } from 'express';
import { db } from '../db';
import { eq, and, inArray, not, sql } from 'drizzle-orm';
import crypto from 'crypto';
import { isAuthenticated } from '../replitAuth';
import { verseTags, tags } from '@shared/schema';

const router = Router();

// Get tags for a specific verse
router.get('/api/tags/:book/:chapter/:verse', async (req, res) => {
  try {
    const { book, chapter, verse } = req.params;
    const verseReference = `${book} ${chapter}:${verse}`;
    
    // Get tags for the verse (both public and user-specific if logged in)
    const userId = req.user?.claims?.sub;
    
    const query = db
      .select({
        id: tags.id,
        name: tags.name,
        category: tags.category,
      })
      .from(tags)
      .innerJoin(verseTags, eq(tags.id, verseTags.tagId))
      .where(eq(verseTags.verseReference, verseReference));
    
    // If user is logged in, also get their personal tags
    if (userId) {
      query.where(
        and(
          eq(verseTags.verseReference, verseReference),
          sql`(${verseTags.userId} IS NULL OR ${verseTags.userId} = ${userId})`
        )
      );
    } else {
      // Only get public tags for non-authenticated users
      query.where(
        and(
          eq(verseTags.verseReference, verseReference),
          sql`${verseTags.userId} IS NULL`
        )
      );
    }
    
    const result = await query;
    
    res.json({
      reference: verseReference,
      tags: result,
    });
  } catch (error) {
    console.error('Error fetching verse tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Add a tag to a verse
router.post('/api/tags/:book/:chapter/:verse', isAuthenticated, async (req, res) => {
  try {
    const { book, chapter, verse } = req.params;
    const { tag, isPersonal = false } = req.body;
    
    if (!tag || typeof tag !== 'string') {
      return res.status(400).json({ error: 'Invalid tag' });
    }
    
    const verseReference = `${book} ${chapter}:${verse}`;
    const userId = (req.user as any).claims.sub;
    
    // Check if the tag already exists in the tags table
    let existingTag = await db
      .select()
      .from(tags)
      .where(eq(tags.name, tag.toLowerCase()))
      .limit(1);
    
    let tagId;
    
    if (existingTag.length === 0) {
      // Create the tag if it doesn't exist
      const newTag = await db
        .insert(tags)
        .values({
          id: crypto.randomUUID(),
          name: tag.toLowerCase(),
          category: req.body.category || 'custom',
          createdAt: new Date(),
        })
        .returning();
      
      tagId = newTag[0].id;
    } else {
      tagId = existingTag[0].id;
    }
    
    // Check if the verse-tag association already exists
    const existingVerseTag = await db
      .select()
      .from(verseTags)
      .where(
        and(
          eq(verseTags.verseReference, verseReference),
          eq(verseTags.tagId, tagId),
          isPersonal ? eq(verseTags.userId, userId) : sql`${verseTags.userId} IS NULL`
        )
      )
      .limit(1);
    
    if (existingVerseTag.length === 0) {
      // Create the verse-tag association
      await db.insert(verseTags).values({
        id: crypto.randomUUID(),
        verseReference,
        tagId,
        userId: isPersonal ? userId : null,
        createdAt: new Date(),
      });
    }
    
    res.json({
      success: true,
      reference: verseReference,
      tag,
    });
  } catch (error) {
    console.error('Error adding tag to verse:', error);
    res.status(500).json({ error: 'Failed to add tag' });
  }
});

// Remove a tag from a verse
router.delete('/api/tags/:book/:chapter/:verse/:tagName', isAuthenticated, async (req, res) => {
  try {
    const { book, chapter, verse, tagName } = req.params;
    const verseReference = `${book} ${chapter}:${verse}`;
    const userId = (req.user as any).claims.sub;
    
    // Find the tag ID
    const existingTag = await db
      .select()
      .from(tags)
      .where(eq(tags.name, tagName.toLowerCase()))
      .limit(1);
    
    if (existingTag.length === 0) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    const tagId = existingTag[0].id;
    
    // Delete the verse-tag association
    await db
      .delete(verseTags)
      .where(
        and(
          eq(verseTags.verseReference, verseReference),
          eq(verseTags.tagId, tagId),
          sql`(${verseTags.userId} = ${userId} OR ${verseTags.userId} IS NULL)`
        )
      );
    
    res.json({
      success: true,
      reference: verseReference,
      tag: tagName,
    });
  } catch (error) {
    console.error('Error removing tag from verse:', error);
    res.status(500).json({ error: 'Failed to remove tag' });
  }
});

// Get tag recommendations for a verse
router.get('/api/tags/:book/:chapter/:verse/recommend', async (req, res) => {
  try {
    const { book, chapter, verse } = req.params;
    const verseReference = `${book} ${chapter}:${verse}`;
    
    // For now, we'll use a simple algorithm that recommends the most common
    // tags used in the same chapter
    const chapterPrefix = `${book} ${chapter}:`;
    
    const recommendedTags = await db
      .select({
        name: tags.name,
        count: sql<number>`count(*)`.as('tag_count'),
      })
      .from(verseTags)
      .innerJoin(tags, eq(verseTags.tagId, tags.id))
      .where(sql`${verseTags.verseReference} LIKE ${chapterPrefix + '%'}`)
      .groupBy(tags.name)
      .orderBy(sql`tag_count desc`)
      .limit(10);
    
    res.json({
      reference: verseReference,
      tags: recommendedTags.map(t => t.name),
    });
  } catch (error) {
    console.error('Error getting tag recommendations:', error);
    res.status(500).json({ error: 'Failed to get tag recommendations' });
  }
});

// Search for verses by tag
router.get('/api/tags/search', async (req, res) => {
  try {
    const { tag, limit = 20 } = req.query;
    
    if (!tag || typeof tag !== 'string') {
      return res.status(400).json({ error: 'Invalid tag' });
    }
    
    // Search for verses with the specified tag
    const taggedVerses = await db
      .select({
        reference: verseTags.verseReference,
      })
      .from(verseTags)
      .innerJoin(tags, eq(verseTags.tagId, tags.id))
      .where(eq(tags.name, tag.toLowerCase()))
      .limit(Number(limit));
    
    res.json({
      tag,
      verses: taggedVerses.map(v => v.reference),
    });
  } catch (error) {
    console.error('Error searching verses by tag:', error);
    res.status(500).json({ error: 'Failed to search verses by tag' });
  }
});

// Get all available tags
router.get('/api/tags', async (req, res) => {
  try {
    const allTags = await db
      .select({
        id: tags.id,
        name: tags.name,
        category: tags.category,
        count: sql<number>`count(${verseTags.id})`.as('usage_count'),
      })
      .from(tags)
      .leftJoin(verseTags, eq(tags.id, verseTags.tagId))
      .groupBy(tags.id, tags.name, tags.category)
      .orderBy(sql`usage_count desc`);
    
    // Group tags by category
    const tagsByCategory = allTags.reduce((acc, tag) => {
      const category = tag.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        id: tag.id,
        name: tag.name,
        count: tag.count,
      });
      return acc;
    }, {} as Record<string, any[]>);
    
    res.json(tagsByCategory);
  } catch (error) {
    console.error('Error fetching all tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

export default router;
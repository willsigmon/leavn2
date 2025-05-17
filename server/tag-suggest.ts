import { db } from './db';
import { tags } from '@shared/schema';
import { like, sql } from 'drizzle-orm';

/**
 * Get tag suggestions based on a search term
 */
export async function getSuggestedTags(searchTerm: string, limit: number = 10) {
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }

  try {
    // Search for tags that match the search term
    const suggestedTags = await db
      .select({
        id: tags.id,
        name: tags.name,
        // Count how many verses use this tag
        count: sql<number>`COUNT(${tags.id})`.as('use_count'),
      })
      .from(tags)
      .where(like(tags.name, `%${searchTerm}%`))
      .groupBy(tags.id, tags.name)
      .orderBy(sql`use_count DESC`)
      .limit(limit);

    return suggestedTags;
  } catch (error) {
    console.error('Error getting tag suggestions:', error);
    return [];
  }
}
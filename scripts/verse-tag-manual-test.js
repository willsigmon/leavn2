#!/usr/bin/env node

/**
 * Manual test to verify duplicate verse-tag pairs are not created.
 * This script simulates inserting the same tag for a verse twice and
 * checks that only one association is stored.
 */

const verseTags = [];

function addTagToVerse(verseId, tagId) {
  const existing = verseTags.find(vt => vt.verseId === verseId && vt.tagId === tagId);
  if (!existing) {
    verseTags.push({ verseId, tagId });
  }
}

// Add the same pair twice
addTagToVerse('v1', 't1');
addTagToVerse('v1', 't1');

// Expect only one entry
const result = verseTags.filter(vt => vt.verseId === 'v1' && vt.tagId === 't1');
console.log('Associations found:', result.length);
console.log(result);


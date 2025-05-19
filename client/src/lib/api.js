/**
 * API service module for fetching Bible reader data
 */

/**
 * Fetch all reading plans
 * @returns {Promise<Array>} Array of reading plans
 */
export async function fetchReadingPlans() {
  const response = await fetch('/api/reading-plans');
  if (!response.ok) {
    throw new Error('Failed to fetch reading plans');
  }
  return response.json();
}

/**
 * Fetch a specific reading plan by ID
 * @param {string} planId - The ID of the reading plan
 * @returns {Promise<Object>} Reading plan data
 */
export async function fetchReadingPlanById(planId) {
  const response = await fetch(`/api/reading-plans/${planId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch reading plan with ID: ${planId}`);
  }
  return response.json();
}

/**
 * Update reading plan progress
 * @param {string} planId - The ID of the reading plan
 * @param {Object} progress - The progress data to update
 * @returns {Promise<Object>} Updated progress data
 */
export async function updateReadingPlanProgress(planId, progress) {
  const response = await fetch(`/api/reading-plans/${planId}/progress`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(progress),
  });
  if (!response.ok) {
    throw new Error('Failed to update reading plan progress');
  }
  return response.json();
}

/**
 * Fetch Bible chapter content
 * @param {string} book - The book name
 * @param {number} chapter - The chapter number
 * @returns {Promise<Object>} Chapter content with verses
 */
export async function fetchBibleChapter(book, chapter) {
  const response = await fetch(`/api/reader/${book.toLowerCase()}/${chapter}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${book} chapter ${chapter}`);
  }
  return response.json();
}

/**
 * Fetch contextual information for a Bible chapter
 * @param {string} book - The book name
 * @param {number} chapter - The chapter number
 * @returns {Promise<Object>} Contextual information for the chapter
 */
export async function fetchChapterContext(book, chapter) {
  const response = await fetch(`/api/reader/context/${book.toLowerCase()}/${chapter}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch context for ${book} chapter ${chapter}`);
  }
  return response.json();
}

/**
 * Fetch cross references for a Bible chapter
 * @param {string} book - The book name
 * @param {number} chapter - The chapter number
 * @returns {Promise<Array>} Array of cross references
 */
export async function fetchCrossReferences(book, chapter) {
  const response = await fetch(`/api/reader/cross-references/chapter/${book.toLowerCase()}/${chapter}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch cross references for ${book} chapter ${chapter}`);
  }
  return response.json();
}

/**
 * Generate narrative mode for a Bible chapter
 * @param {string} book - The book name
 * @param {number} chapter - The chapter number
 * @returns {Promise<Object>} Narrative version of the chapter
 */
export async function generateNarrativeMode(book, chapter) {
  const response = await fetch(`/api/ai/narrative/${book.toLowerCase()}/${chapter}`);
  if (!response.ok) {
    throw new Error(`Failed to generate narrative mode for ${book} chapter ${chapter}`);
  }
  return response.json();
}

/**
 * Save a reading note
 * @param {Object} note - The note data to save
 * @returns {Promise<Object>} Saved note data
 */
export async function saveReadingNote(note) {
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });
  if (!response.ok) {
    throw new Error('Failed to save reading note');
  }
  return response.json();
}

/**
 * Fetch reading notes for a specific chapter
 * @param {string} book - The book name
 * @param {number} chapter - The chapter number
 * @returns {Promise<Array>} Array of reading notes
 */
export async function fetchReadingNotes(book, chapter) {
  const response = await fetch(`/api/notes/${book.toLowerCase()}/${chapter}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch notes for ${book} chapter ${chapter}`);
  }
  return response.json();
}
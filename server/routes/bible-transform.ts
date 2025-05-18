import { Request, Response } from 'express';
import { storage } from '../storage';
import * as anthropic from '../anthropic';
import * as ai from '../ai';
import { isAuthenticated } from '../replitAuth';

// Process text transformations for a Bible chapter
export async function transformChapterText(req: Request, res: Response) {
  try {
    const { book, chapter } = req.params;
    const { mode } = req.query;
    
    // Get the original text
    const chapterData = await storage.getChapter(book, parseInt(chapter));
    
    if (!chapterData) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    
    // Extract verses
    const verses = chapterData.verses;
    const verseTexts = verses.map(v => v.kjv);
    
    // Check transformation mode
    switch (mode) {
      case 'genz':
        // Transform to Gen-Z style
        const genzTranslation = await ai.generateTranslation(verseTexts.join('\n\n'));
        return res.json({
          genz: verses.map((_, i) => genzTranslation.genz[i] || '')
        });
        
      case 'kids':
        // Transform to kids-friendly language
        const kidsTranslation = await ai.generateTranslation(verseTexts.join('\n\n'));
        return res.json({
          kids: verses.map((_, i) => kidsTranslation.kids[i] || '')
        });
        
      case 'novelize':
        // Transform to narrative style inspired by "The Chosen"
        const narrative = await anthropic.generateNarrativeWithClaude(
          verseTexts,
          { book, chapter: parseInt(chapter) }
        );
        return res.json({
          narrative: narrative.split('\n\n')
        });
        
      case 'scholarly':
        // Transform to scholarly theological perspective
        const scholarly = await anthropic.generateTheologicalCommentaryWithClaude(
          verseTexts.join('\n\n'),
          'academic'
        );
        return res.json({
          scholarly: scholarly.split('\n\n')
        });
        
      default:
        return res.status(400).json({ message: 'Invalid transformation mode' });
    }
  } catch (error) {
    console.error('Error transforming chapter text:', error);
    return res.status(500).json({ 
      message: 'Failed to transform text',
      error: error.message
    });
  }
}

// Get commentaries from different theological perspectives
export async function getCommentaries(req: Request, res: Response) {
  try {
    const { book, chapter, verse } = req.params;
    const { lens } = req.query;
    
    if (!lens) {
      return res.status(400).json({ message: 'Lens parameter is required' });
    }
    
    // Get the verse text
    const verseData = await storage.getVerse(book, parseInt(chapter), parseInt(verse));
    
    if (!verseData) {
      return res.status(404).json({ message: 'Verse not found' });
    }
    
    // Check for cached commentary
    const cachedCommentary = await storage.getCommentary(
      book, 
      parseInt(chapter), 
      parseInt(verse), 
      lens as string
    );
    
    if (cachedCommentary) {
      return res.json({ content: cachedCommentary.content });
    }
    
    // Generate commentary from AI
    const commentary = await anthropic.generateTheologicalCommentaryWithClaude(
      verseData.kjv,
      lens as string
    );
    
    // Cache the result
    if (req.user) {
      await storage.saveCommentary(
        book,
        parseInt(chapter),
        parseInt(verse),
        lens as string,
        commentary,
        req.user.claims?.sub
      );
    }
    
    return res.json({ content: commentary });
  } catch (error) {
    console.error('Error generating commentary:', error);
    return res.status(500).json({ 
      message: 'Failed to generate commentary',
      error: error.message
    });
  }
}

// Get "Did You Know" facts about a verse
export async function getDidYouKnow(req: Request, res: Response) {
  try {
    const { book, chapter, verse } = req.params;
    
    // Get the verse text
    const verseData = await storage.getVerse(book, parseInt(chapter), parseInt(verse));
    
    if (!verseData) {
      return res.status(404).json({ message: 'Verse not found' });
    }
    
    // Check for cached facts
    const cachedFacts = await storage.getDidYouKnow(
      book, 
      parseInt(chapter), 
      parseInt(verse)
    );
    
    if (cachedFacts) {
      return res.json({ content: cachedFacts.content });
    }
    
    // Generate facts from AI
    const facts = await ai.generateDidYouKnow(
      verseData.kjv,
      book,
      parseInt(chapter),
      parseInt(verse)
    );
    
    // Cache the result
    if (req.user) {
      await storage.saveDidYouKnow(
        book,
        parseInt(chapter),
        parseInt(verse),
        facts
      );
    }
    
    return res.json({ content: facts });
  } catch (error) {
    console.error('Error generating did-you-know facts:', error);
    return res.status(500).json({ 
      message: 'Failed to generate facts',
      error: error.message
    });
  }
}

// Answer contextual questions about a verse
export async function answerContextualQuestion(req: Request, res: Response) {
  try {
    const { book, chapter, verse } = req.params;
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }
    
    // Get the verse text
    const verseData = await storage.getVerse(book, parseInt(chapter), parseInt(verse));
    
    if (!verseData) {
      return res.status(404).json({ message: 'Verse not found' });
    }
    
    // Generate answer from AI
    const answer = await anthropic.generateContextualAnswerWithClaude(
      verseData.kjv,
      question
    );
    
    return res.json({ content: answer });
  } catch (error) {
    console.error('Error answering contextual question:', error);
    return res.status(500).json({ 
      message: 'Failed to answer question',
      error: error.message
    });
  }
}

// Generate artwork for a chapter
export async function generateArtwork(req: Request, res: Response) {
  try {
    const { book, chapter } = req.params;
    
    // Get the chapter summary
    const chapterData = await storage.getChapter(book, parseInt(chapter));
    
    if (!chapterData) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    
    // Check for cached artwork
    const cachedArtwork = await storage.getArtwork(book, parseInt(chapter));
    
    if (cachedArtwork) {
      return res.json({ url: cachedArtwork.url });
    }
    
    // Generate summary for art prompt
    const verses = chapterData.verses.map(v => v.kjv);
    const chapterSummary = await ai.generateNarrativeMode(
      verses,
      { book, chapter: parseInt(chapter) }
    );
    
    // Generate artwork from AI
    const artwork = await ai.generateArtwork(chapterSummary);
    
    // Cache the result
    if (req.user) {
      await storage.saveArtwork(
        book,
        parseInt(chapter),
        artwork.url
      );
    }
    
    return res.json({ url: artwork.url });
  } catch (error) {
    console.error('Error generating artwork:', error);
    return res.status(500).json({ 
      message: 'Failed to generate artwork',
      error: error.message
    });
  }
}

// Register routes
export function registerBibleTransformRoutes(app) {
  app.get('/api/bible/:book/:chapter/transform', transformChapterText);
  app.get('/api/bible/:book/:chapter/:verse/commentary', getCommentaries);
  app.get('/api/bible/:book/:chapter/:verse/didyouknow', getDidYouKnow);
  app.post('/api/bible/:book/:chapter/:verse/question', answerContextualQuestion);
  app.get('/api/bible/:book/:chapter/artwork', isAuthenticated, generateArtwork);
}
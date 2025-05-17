import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateCommentary, generateTranslation, searchVerses } from "./ai";
import { z } from "zod";
import { insertNoteSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  await setupAuth(app);

  // Helper to get the current user ID from the session
  const getUserId = (req: Request): string => {
    if (req.user && (req.user as any).claims && (req.user as any).claims.sub) {
      return (req.user as any).claims.sub;
    }
    // Fallback to mock user ID for development
    return "user1";
  };

  // Get user info endpoint
  app.get("/api/auth/user", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get bible chapter - protected by authentication
  app.get("/api/bible/:book/:chapter", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { book, chapter } = req.params;
      const chapterNum = parseInt(chapter);
      
      if (isNaN(chapterNum)) {
        return res.status(400).json({ message: "Invalid chapter number" });
      }
      
      let verses = await storage.getVerses(book, chapterNum);
      
      // Get highlights for the user
      const userId = getUserId(req);
      const notes = await storage.getNotes(userId, book, chapterNum);
      
      // Enhance verses with highlight info and commentary
      verses = verses.map(verse => {
        const note = notes.find(n => n.verse === verse.verseNumber);
        
        return {
          ...verse,
          highlighted: note?.highlight || false,
          hasCommentary: verse.verseNumber === 3 || verse.verseNumber === 6,
          commentary: verse.verseNumber === 3 ? 
            "This verse emphasizes the internalization of virtues. The metaphor of binding them \"around your neck\" suggests wearing them as ornaments—visible to others—while writing them \"on the tablet of your heart\" speaks to making them part of your inner character." : 
            undefined
        };
      });
      
      return res.json({
        book,
        chapter: chapterNum,
        totalChapters: 31, // For Proverbs
        translation: "English Standard Version",
        verses
      });
    } catch (error) {
      console.error("Error fetching bible chapter:", error);
      return res.status(500).json({ message: "Failed to fetch bible chapter" });
    }
  });
  
  // Get author information
  app.get("/api/author/:book", async (req: Request, res: Response) => {
    try {
      const { book } = req.params;
      const authorInfo = await storage.getAuthorInfo(book);
      
      if (!authorInfo) {
        return res.status(404).json({ message: "Author information not found" });
      }
      
      return res.json(authorInfo);
    } catch (error) {
      console.error("Error fetching author info:", error);
      return res.status(500).json({ message: "Failed to fetch author information" });
    }
  });
  
  // Get notes for a chapter - protected by authentication
  app.get("/api/notes/:book/:chapter", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { book, chapter } = req.params;
      const chapterNum = parseInt(chapter);
      
      if (isNaN(chapterNum)) {
        return res.status(400).json({ message: "Invalid chapter number" });
      }
      
      const userId = getUserId(req);
      const notes = await storage.getNotes(userId, book, chapterNum);
      return res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      return res.status(500).json({ message: "Failed to fetch notes" });
    }
  });
  
  // Create a note - protected by authentication
  app.post("/api/notes", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const noteData = insertNoteSchema.parse({
        ...req.body,
        userId: getUserId(req)
      });
      
      const note = await storage.createNote(noteData);
      return res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      
      console.error("Error creating note:", error);
      return res.status(500).json({ message: "Failed to create note" });
    }
  });
  
  // Update a note - protected by authentication
  app.patch("/api/notes/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      
      if (typeof content !== 'string') {
        return res.status(400).json({ message: "Invalid content" });
      }
      
      const note = await storage.getNote(id);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      if (note.userId !== getUserId(req)) {
        return res.status(403).json({ message: "Not authorized to update this note" });
      }
      
      const updatedNote = await storage.updateNote(id, content);
      return res.json(updatedNote);
    } catch (error) {
      console.error("Error updating note:", error);
      return res.status(500).json({ message: "Failed to update note" });
    }
  });
  
  // Delete a note - protected by authentication
  app.delete("/api/notes/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const note = await storage.getNote(id);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      if (note.userId !== getUserId(req)) {
        return res.status(403).json({ message: "Not authorized to delete this note" });
      }
      
      const success = await storage.deleteNote(id);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to delete note" });
      }
      
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting note:", error);
      return res.status(500).json({ message: "Failed to delete note" });
    }
  });
  
  // Toggle highlight for a verse
  app.post("/api/highlights/:book/:chapter/:verse", async (req: Request, res: Response) => {
    try {
      const { book, chapter, verse } = req.params;
      const { highlighted } = req.body;
      
      const chapterNum = parseInt(chapter);
      const verseNum = parseInt(verse);
      
      if (isNaN(chapterNum) || isNaN(verseNum)) {
        return res.status(400).json({ message: "Invalid chapter or verse number" });
      }
      
      if (typeof highlighted !== 'boolean') {
        return res.status(400).json({ message: "Invalid highlight value" });
      }
      
      const success = await storage.toggleHighlight(MOCK_USER_ID, book, chapterNum, verseNum, highlighted);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to toggle highlight" });
      }
      
      return res.json({ success: true });
    } catch (error) {
      console.error("Error toggling highlight:", error);
      return res.status(500).json({ message: "Failed to toggle highlight" });
    }
  });
  
  // Get AI-generated commentary
  app.get("/api/ai/commentary/:book/:chapter/:verse", async (req: Request, res: Response) => {
    try {
      const { book, chapter, verse } = req.params;
      const { lens = "standard" } = req.query;
      
      const chapterNum = parseInt(chapter);
      const verseNum = parseInt(verse);
      
      if (isNaN(chapterNum) || isNaN(verseNum) || typeof lens !== 'string') {
        return res.status(400).json({ message: "Invalid parameters" });
      }
      
      // Get the verse
      const verseData = await storage.getVerse(book, chapterNum, verseNum);
      
      if (!verseData) {
        return res.status(404).json({ message: "Verse not found" });
      }
      
      // Check if we have cached commentary
      const cachedCommentary = await storage.getCommentary(verseData.id, lens);
      
      if (cachedCommentary) {
        return res.json({ content: cachedCommentary.content });
      }
      
      // Generate commentary using the best available AI model
      let commentary = "";
      if (process.env.ANTHROPIC_API_KEY) {
        // Use Anthropic Claude for deeper theological insights
        const { generateTheologicalCommentaryWithClaude } = await import('./anthropic');
        commentary = await generateTheologicalCommentaryWithClaude(verseData.text, lens);
      } else {
        // Fall back to OpenAI
        const { generateCommentary } = await import('./ai');
        commentary = await generateCommentary(verseData.text, lens);
      }
      
      // Cache the commentary
      await storage.createCommentary({
        verseId: verseData.id,
        lens,
        content: commentary
      });
      
      return res.json({ content: commentary });
    } catch (error) {
      console.error("Error generating commentary:", error);
      return res.status(500).json({ message: "Failed to generate commentary" });
    }
  });
  
  // Get AI-generated translations
  app.get("/api/ai/translate/:book/:chapter/:verse", async (req: Request, res: Response) => {
    try {
      const { book, chapter, verse } = req.params;
      
      const chapterNum = parseInt(chapter);
      const verseNum = parseInt(verse);
      
      if (isNaN(chapterNum) || isNaN(verseNum)) {
        return res.status(400).json({ message: "Invalid parameters" });
      }
      
      // Get the verse
      const verseData = await storage.getVerse(book, chapterNum, verseNum);
      
      if (!verseData) {
        return res.status(404).json({ message: "Verse not found" });
      }
      
      // Mock translations for now - in production this would call the AI service
      if (verseNum === 5) {
        return res.json({
          genz: "No cap, trust God completely and don't just rely on your own vibes;",
          kids: "Trust God with your whole heart and don't just use your own brain to figure things out;"
        });
      }
      
      // For other verses, generate translations
      const translations = await generateTranslation(verseData.text);
      
      return res.json(translations);
    } catch (error) {
      console.error("Error generating translations:", error);
      return res.status(500).json({ message: "Failed to generate translations" });
    }
  });
  
  // Get tags for a verse
  app.get("/api/tags/:book/:chapter/:verse", async (req: Request, res: Response) => {
    try {
      const { book, chapter, verse } = req.params;
      
      const chapterNum = parseInt(chapter);
      const verseNum = parseInt(verse);
      
      if (isNaN(chapterNum) || isNaN(verseNum)) {
        return res.status(400).json({ message: "Invalid parameters" });
      }
      
      // Get the verse
      const verseData = await storage.getVerse(book, chapterNum, verseNum);
      
      if (!verseData) {
        return res.status(404).json({ message: "Verse not found" });
      }
      
      // For simplicity, return hardcoded tags for verse 5
      if (verseNum === 5) {
        return res.json([
          { 
            id: "t1", 
            name: "Trust", 
            category: "theological", 
            title: "Trust in Scripture", 
            description: "The Hebrew word for trust (בָּטַח, batach) implies complete reliance and confidence. This theme appears 80+ times in Psalms and Proverbs." 
          },
          { 
            id: "t2", 
            name: "Heart", 
            category: "theological", 
            title: "Heart in Hebrew Thought", 
            description: "In Hebrew, \"heart\" (לֵב, lev) represents the core of a person - including mind, emotions, and will - not just feelings as in Western culture." 
          }
        ]);
      }
      
      // Get tags for the verse
      const tags = await storage.getTagsForVerse(verseData.id);
      return res.json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      return res.status(500).json({ message: "Failed to fetch tags" });
    }
  });
  
  // Get "Did you know" facts
  app.get("/api/did-you-know/:book/:chapter/:verse", async (req: Request, res: Response) => {
    try {
      const { book, chapter, verse } = req.params;
      
      const chapterNum = parseInt(chapter);
      const verseNum = parseInt(verse);
      
      if (isNaN(chapterNum) || isNaN(verseNum)) {
        return res.status(400).json({ message: "Invalid parameters" });
      }
      
      // Get the verse
      const verseData = await storage.getVerse(book, chapterNum, verseNum);
      
      if (!verseData) {
        return res.status(404).json({ message: "Verse not found" });
      }
      
      // For verse 5, return a hardcoded fact
      if (verseNum === 5) {
        return res.json({
          content: "This verse and the next (Proverbs 3:5-6) are among the most memorized and quoted verses from the entire Book of Proverbs."
        });
      }
      
      // Get "Did you know" fact for the verse
      const fact = await storage.getDidYouKnow(verseData.id);
      
      if (!fact) {
        return res.status(404).json({ message: "No facts found for this verse" });
      }
      
      return res.json({ content: fact.content });
    } catch (error) {
      console.error("Error fetching 'Did you know' fact:", error);
      return res.status(500).json({ message: "Failed to fetch fact" });
    }
  });
  
  // Search verses
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const { query } = req.query;
      
      if (typeof query !== 'string' || !query.trim()) {
        return res.status(400).json({ message: "Invalid search query" });
      }
      
      // Search for verses
      const results = await searchVerses(query);
      return res.json(results);
    } catch (error) {
      console.error("Error searching verses:", error);
      return res.status(500).json({ message: "Failed to search verses" });
    }
  });
  
  // Get narrative mode for chapter
  app.get("/api/ai/narrative/:book/:chapter", async (req: Request, res: Response) => {
    try {
      const { book, chapter } = req.params;
      const lens = req.query.lens as string || "standard";
      const chapterNum = parseInt(chapter);
      
      if (isNaN(chapterNum)) {
        return res.status(400).json({ message: "Invalid chapter number" });
      }
      
      // Get all verses for the chapter
      const verses = await storage.getVerses(book, chapterNum);
      
      if (!verses || verses.length === 0) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      
      // Extract text from verses
      const verseTexts = verses.map(verse => verse.text);
      
      // Choose AI provider based on available API keys
      let narrative = "";
      if (process.env.ANTHROPIC_API_KEY) {
        // Use Anthropic Claude for better narrative generation
        const { generateNarrativeWithClaude } = await import('./anthropic');
        narrative = await generateNarrativeWithClaude(verseTexts, { book, chapter: chapterNum }, lens);
      } else {
        // Fall back to OpenAI
        const { generateNarrativeMode } = await import('./ai');
        narrative = await generateNarrativeMode(verseTexts, { book, chapter: chapterNum });
      }
      
      return res.json({ content: narrative });
    } catch (error) {
      console.error("Error generating narrative mode:", error);
      return res.status(500).json({ message: "Failed to generate narrative mode" });
    }
  });
  
  // Generate AI artwork for chapter
  app.get("/api/ai/artwork/:book/:chapter", async (req: Request, res: Response) => {
    try {
      const { book, chapter } = req.params;
      const chapterNum = parseInt(chapter);
      
      if (isNaN(chapterNum)) {
        return res.status(400).json({ message: "Invalid chapter number" });
      }
      
      // Get all verses for the chapter
      const verses = await storage.getVerses(book, chapterNum);
      
      if (!verses || verses.length === 0) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      
      // Create a simple summary for the artwork prompt
      const firstFewVerses = verses.slice(0, Math.min(5, verses.length)).map(v => v.text).join(" ");
      
      // Generate artwork
      const { generateArtwork } = await import('./ai');
      const artwork = await generateArtwork(firstFewVerses);
      
      return res.json(artwork);
    } catch (error) {
      console.error("Error generating artwork:", error);
      return res.status(500).json({ message: "Failed to generate artwork" });
    }
  });
  
  // Answer contextual questions
  app.post("/api/ai/contextual-question", async (req: Request, res: Response) => {
    try {
      const { verseText, question } = req.body;
      
      if (!verseText || !question) {
        return res.status(400).json({ message: "Verse text and question are required" });
      }
      
      // Generate contextual answer using the best available AI model
      let answer = "";
      if (process.env.ANTHROPIC_API_KEY) {
        // Use Anthropic Claude for deeper theological insights
        const { generateContextualAnswerWithClaude } = await import('./anthropic');
        answer = await generateContextualAnswerWithClaude(verseText, question);
      } else {
        // Fall back to OpenAI
        const { generateContextualAnswer } = await import('./ai');
        answer = await generateContextualAnswer(verseText, question);
      }
      
      return res.json({ content: answer });
    } catch (error) {
      console.error("Error generating contextual answer:", error);
      return res.status(500).json({ message: "Failed to generate answer" });
    }
  });
  
  // Get all reading plans
  app.get("/api/reading-plans", async (req: Request, res: Response) => {
    try {
      const plans = [
        {
          id: "plan1",
          title: "Daily Devotional",
          description: "Start each day with a short passage to reflect on throughout the day",
          days: 30,
          image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&auto=format",
          entries: [
            { day: 1, book: "proverbs", chapter: 3, startVerse: 1, endVerse: 8 },
            { day: 2, book: "john", chapter: 3, startVerse: 1, endVerse: 8 },
            { day: 3, book: "genesis", chapter: 1, startVerse: 1, endVerse: 8 }
          ]
        },
        {
          id: "plan2",
          title: "New Testament in 90 Days",
          description: "Read through the entire New Testament in just three months",
          days: 90,
          image: "https://images.unsplash.com/photo-1507692812060-98338d07aca3?w=400&auto=format",
          entries: [
            { day: 1, book: "matthew", chapter: 1, startVerse: 1, endVerse: null },
            { day: 2, book: "matthew", chapter: 2, startVerse: 1, endVerse: null },
            { day: 3, book: "john", chapter: 3, startVerse: 1, endVerse: null }
          ]
        },
        {
          id: "plan3",
          title: "Faith Foundations",
          description: "Explore key passages that explain core Christian beliefs and principles",
          days: 21,
          image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format",
          entries: [
            { day: 1, book: "john", chapter: 3, startVerse: 16, endVerse: 16 },
            { day: 2, book: "proverbs", chapter: 3, startVerse: 5, endVerse: 6 },
            { day: 3, book: "genesis", chapter: 1, startVerse: 1, endVerse: 5 }
          ]
        }
      ];
      
      return res.json(plans);
    } catch (error) {
      console.error("Error fetching reading plans:", error);
      return res.status(500).json({ message: "Failed to fetch reading plans" });
    }
  });
  
  // Get reading plan by ID
  app.get("/api/reading-plans/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Mock response for now
      if (id === "plan1") {
        return res.json({
          id: "plan1",
          title: "Daily Devotional",
          description: "Start each day with a short passage to reflect on throughout the day",
          days: 30,
          image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&auto=format",
          entries: [
            { day: 1, book: "proverbs", chapter: 3, startVerse: 1, endVerse: 8 },
            { day: 2, book: "john", chapter: 3, startVerse: 1, endVerse: 8 },
            { day: 3, book: "genesis", chapter: 1, startVerse: 1, endVerse: 8 }
          ]
        });
      }
      
      return res.status(404).json({ message: "Reading plan not found" });
    } catch (error) {
      console.error("Error fetching reading plan:", error);
      return res.status(500).json({ message: "Failed to fetch reading plan" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

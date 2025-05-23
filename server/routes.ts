import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateCommentary, generateTranslation, searchVerses } from "./ai";
import { z } from "zod";
import { insertNoteSchema } from "@shared/schema";
import { isAuthenticated, handleLogin, handleLogout, getUserData } from "./simpleAuth";
import { 
  initBibleRAG, 
  findSimilarChunks, 
  getRAGContext, 
  loadBibleCache 
} from "./rag-bible";
import { getSuggestedTags } from "./tag-suggest";
import { db } from "./db";
import bibleReaderRouter from "./routes/bible-reader";
import crossReferencesRouter from "./routes/cross-references";
import ragExplorerRouter from "./routes/rag-explorer";
import genesisReaderRouter from "./routes/genesis-reader";
import { explorerRouter } from "./routes/explorer";
import contextRoutes from "./routes/context";
import verseTagsRouter from "./routes/verse-tags";
import { registerReadingPlanRoutes } from "./routes/reading-plans";

export async function registerRoutes(app: Express): Promise<Server> {

  // Add authentication routes
  app.get("/api/login", handleLogin);
  app.get("/api/logout", handleLogout);
  app.get("/api/auth/user", getUserData);
  
  // Register the enhanced Bible reader routes
  app.use("/api/reader", bibleReaderRouter);
  
  // Register cross-references routes
  app.use("/api/reader/cross-references", crossReferencesRouter);
  
  // Register RAG explorer routes
  app.use("/api/reader/rag", ragExplorerRouter);
  
  // Register special Genesis reader routes with rich content
  app.use("/api/reader/genesis", genesisReaderRouter);
  
  // Register theological concept explorer routes
  app.use("/api/explorer", explorerRouter);
  
  // Register contextual study companion routes
  app.use("/api/reader/context", contextRoutes);
  
  // Register verse tagging routes
  app.use(verseTagsRouter);
  
  // Register reading plans routes
  registerReadingPlanRoutes(app);
  
  
  // User preferences endpoints
  app.get("/api/preferences", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences || {});
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });

  app.post("/api/preferences", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const preferences = req.body;
      const updatedPreferences = await storage.saveUserPreferences(userId, preferences);
      res.json(updatedPreferences);
    } catch (error) {
      console.error("Error saving user preferences:", error);
      res.status(500).json({ message: "Failed to save user preferences" });
    }
  });

  // Helper to get the current user ID from the session
  const getUserId = (req: Request): string => {
    if (req.session && (req.session as any).userId) {
      return (req.session as any).userId;
    }
    // Fallback to mock user ID for development
    return "user1";
  };

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
  
  // Toggle highlight for a verse - protected by authentication
  app.post("/api/highlights/:book/:chapter/:verse", isAuthenticated, async (req: Request, res: Response) => {
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
      
      const userId = getUserId(req);
      const success = await storage.toggleHighlight(userId, book, chapterNum, verseNum, highlighted);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to toggle highlight" });
      }
      
      return res.json({ success: true });
    } catch (error) {
      console.error("Error toggling highlight:", error);
      return res.status(500).json({ message: "Failed to toggle highlight" });
    }
  });
  
  // Get AI-generated commentary - protected by authentication
  app.get("/api/ai/commentary/:book/:chapter/:verse", isAuthenticated, async (req: Request, res: Response) => {
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
        // Extract verse text from various possible formats
        const extractedText = typeof verseData.text === 'string' 
          ? verseData.text 
          : verseData.textKjv || 
            (typeof verseData.text === 'object' ? verseData.text.kjv : undefined) || 
            "Verse text unavailable";
            
        // Use Anthropic Claude for deeper theological insights
        const { generateTheologicalCommentaryWithClaude } = await import('./anthropic');
        commentary = await generateTheologicalCommentaryWithClaude(extractedText, lens);
      } else {
        // Extract verse text from various possible formats
        const extractedText = typeof verseData.text === 'string' 
          ? verseData.text 
          : verseData.textKjv || 
            (typeof verseData.text === 'object' ? verseData.text.kjv : undefined) || 
            "Verse text unavailable";
            
        // Fall back to OpenAI
        const { generateCommentary } = await import('./ai');
        commentary = await generateCommentary(extractedText, lens);
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
  
  // Get AI-generated translations - protected by authentication
  app.get("/api/ai/translate/:book/:chapter/:verse", isAuthenticated, async (req: Request, res: Response) => {
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
      
      // Extract verse text from various possible formats
      const extractedText = typeof verseData.text === 'string' 
        ? verseData.text 
        : verseData.textKjv || 
          (typeof verseData.text === 'object' ? verseData.text.kjv : undefined) || 
          "Verse text unavailable";
      
      // Mock translations for now - in production this would call the AI service
      if (verseNum === 5 || verseNum % 5 === 0) {
        return res.json({
          genz: `No cap, ${extractedText.substring(0, 100)}...`,
          kids: `In simple words, ${extractedText.substring(0, 100)}...`
        });
      }
      
      // For other verses, generate translations
      const { generateTranslation } = await import('./ai');
      const translations = await generateTranslation(extractedText);
      
      return res.json(translations);
    } catch (error) {
      console.error("Error generating translations:", error);
      return res.status(500).json({ message: "Failed to generate translations" });
    }
  });
  
  // Get tags for a verse - protected by authentication
  app.get("/api/tags/:book/:chapter/:verse", isAuthenticated, async (req: Request, res: Response) => {
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
  
  // Get "Did you know" facts - protected by authentication
  app.get("/api/did-you-know/:book/:chapter/:verse", isAuthenticated, async (req: Request, res: Response) => {
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
  
  // Search verses - protected by authentication
  app.get("/api/search", isAuthenticated, async (req: Request, res: Response) => {
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
  
  // Get verse comparison data between translations - public endpoint (no auth required)
  app.get("/api/bible/verse/:book/:chapter/:verse/compare", (req: Request, res: Response) => {
    try {
      const book = req.params.book.toLowerCase();
      const chapter = parseInt(req.params.chapter);
      const verse = parseInt(req.params.verse);
      
      if (isNaN(chapter) || isNaN(verse)) {
        return res.status(400).json({ error: "Invalid chapter or verse number" });
      }
      
      // For John 3:16
      if (book === "john" && chapter === 3 && verse === 16) {
        return res.json({
          kjv: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
          web: "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life."
        });
      }
      
      // For Genesis 1:1
      if (book === "genesis" && chapter === 1 && verse === 1) {
        return res.json({
          kjv: "In the beginning God created the heaven and the earth.",
          web: "In the beginning, God created the heavens and the earth."
        });
      }
      
      // For Proverbs 3:5-6
      if (book === "proverbs" && chapter === 3 && verse === 5) {
        return res.json({
          kjv: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
          web: "Trust in Yahweh with all your heart, and don't lean on your own understanding."
        });
      }
      
      if (book === "proverbs" && chapter === 3 && verse === 6) {
        return res.json({
          kjv: "In all thy ways acknowledge him, and he shall direct thy paths.",
          web: "In all your ways acknowledge him, and he will make your paths straight."
        });
      }
      
      // For Psalms 23:1
      if (book === "psalms" && chapter === 23 && verse === 1) {
        return res.json({
          kjv: "The LORD is my shepherd; I shall not want.",
          web: "Yahweh is my shepherd; I shall lack nothing."
        });
      }
      
      // Default response for other verses
      return res.json({
        kjv: `${req.params.book} ${chapter}:${verse} - KJV translation would appear here`,
        web: `${req.params.book} ${chapter}:${verse} - WEB translation would appear here`
      });
    } catch (error) {
      console.error("Error fetching verse comparison:", error);
      res.status(500).json({ error: "Failed to fetch verse comparison" });
    }
  });
  
  // RAG-powered semantic search endpoint - public endpoint
  app.get("/api/bible/rag/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.query as string;
      const translation = (req.query.translation as string) || 'kjv';
      
      if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
      }
      
      if (translation !== 'kjv' && translation !== 'web') {
        return res.status(400).json({ error: "Translation must be 'kjv' or 'web'" });
      }
      
      // Use the RAG system to find relevant chunks
      const results = await findSimilarChunks(query, translation as 'kjv' | 'web', 5);
      
      res.json(results);
    } catch (error) {
      console.error("Error performing semantic search:", error);
      res.status(500).json({ error: "Failed to perform semantic search" });
    }
  });
  
  // Get narrative mode for chapter - protected by authentication
  app.get("/api/ai/narrative/:book/:chapter", isAuthenticated, async (req: Request, res: Response) => {
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
      const verseTexts = verses.filter(Boolean).map(v => v.textKjv);
      
      // Choose AI provider based on available API keys
      let narrative = "";
      if (process.env.ANTHROPIC_API_KEY) {
        // Use Anthropic Claude for better narrative generation
        const { generateNarrativeWithClaude } = await import('./anthropic');
        narrative = await generateNarrativeWithClaude(book, String(chapterNum), lens);
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
  
  // Generate AI artwork for chapter - protected by authentication
  app.get("/api/ai/artwork/:book/:chapter", isAuthenticated, async (req: Request, res: Response) => {
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
  
  // Answer contextual questions - protected by authentication
  app.post("/api/ai/contextual-question", isAuthenticated, async (req: Request, res: Response) => {
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
  

  const httpServer = createServer(app);
  return httpServer;
}

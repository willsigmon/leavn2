import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateCommentary, generateTranslation, searchVerses } from "./ai";
import { z } from "zod";
import { insertNoteSchema } from "@shared/schema";
import { setupSession, isAuthenticated, handleLogin, handleLogout, getUserData } from "./simpleAuth";
import { 
  initBibleRAG, 
  findSimilarChunks, 
  getRAGContext, 
  loadBibleCache 
} from "./rag-bible";
import { getSuggestedTags } from "./tag-suggest";
import { db } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  setupSession(app);

  // Add authentication routes
  app.get("/api/login", handleLogin);
  app.get("/api/logout", handleLogout);
  app.get("/api/auth/user", getUserData);
  
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

  // Get bible chapter - public access
  app.get("/api/bible/:book/:chapter", async (req: Request, res: Response) => {
    try {
      const { book, chapter } = req.params;
      const chapterNum = parseInt(chapter);
      
      if (isNaN(chapterNum)) {
        return res.status(400).json({ message: "Invalid chapter number" });
      }
      
      try {
        // Get verses from storage
        let verses = await storage.getVerses(book, chapterNum);
        
        // If no verses found, provide sample data for testing
        if (!verses || verses.length === 0) {
          // Generate sample verses for Genesis chapter 1
          if (book.toLowerCase() === 'genesis' && chapterNum === 1) {
            verses = [];
            const genesisText = [
              "In the beginning God created the heavens and the earth.",
              "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
              "And God said, \"Let there be light,\" and there was light.",
              "God saw that the light was good, and he separated the light from the darkness.",
              "God called the light \"day,\" and the darkness he called \"night.\" And there was evening, and there was morning—the first day.",
              "And God said, \"Let there be a vault between the waters to separate water from water.\"",
              "So God made the vault and separated the water under the vault from the water above it. And it was so.",
              "God called the vault \"sky.\" And there was evening, and there was morning—the second day.",
              "And God said, \"Let the water under the sky be gathered to one place, and let dry ground appear.\" And it was so.",
              "God called the dry ground \"land,\" and the gathered waters he called \"seas.\" And God saw that it was good."
            ];
            
            for (let i = 0; i < genesisText.length; i++) {
              verses.push({
                id: `genesis-1-${i+1}`,
                book: "Genesis",
                chapter: 1,
                verseNumber: i + 1,
                kjv: genesisText[i],
                web: genesisText[i],
                textKjv: genesisText[i],
                textWeb: genesisText[i]
              });
            }
          }
        }
        
        // Get notes and highlights if user is authenticated
        let notes = [];
        try {
          if (req.isAuthenticated && req.isAuthenticated()) {
            const userId = getUserId(req);
            notes = await storage.getNotes(userId, book, chapterNum);
          }
        } catch (err) {
          console.log("User not authenticated for notes/highlights");
        }
        
        // Determine correct total chapters for each book
        let totalChapters = 31; // Default
        const bibleBooks = {
          "genesis": 50, "exodus": 40, "leviticus": 27, "numbers": 36, "deuteronomy": 34,
          "joshua": 24, "judges": 21, "ruth": 4, "1 samuel": 31, "2 samuel": 24,
          "1 kings": 22, "2 kings": 25, "1 chronicles": 29, "2 chronicles": 36,
          "ezra": 10, "nehemiah": 13, "esther": 10, "job": 42, "psalms": 150,
          "proverbs": 31, "ecclesiastes": 12, "song of solomon": 8, "isaiah": 66,
          "jeremiah": 52, "lamentations": 5, "ezekiel": 48, "daniel": 12,
          "hosea": 14, "joel": 3, "amos": 9, "obadiah": 1, "jonah": 4,
          "micah": 7, "nahum": 3, "habakkuk": 3, "zephaniah": 3, "haggai": 2,
          "zechariah": 14, "malachi": 4, "matthew": 28, "mark": 16,
          "luke": 24, "john": 21, "acts": 28, "romans": 16, "1 corinthians": 16,
          "2 corinthians": 13, "galatians": 6, "ephesians": 6, "philippians": 4,
          "colossians": 4, "1 thessalonians": 5, "2 thessalonians": 3, "1 timothy": 6,
          "2 timothy": 4, "titus": 3, "philemon": 1, "hebrews": 13, "james": 5,
          "1 peter": 5, "2 peter": 3, "1 john": 5, "2 john": 1, "3 john": 1,
          "jude": 1, "revelation": 22
        };
        
        totalChapters = bibleBooks[book.toLowerCase()] || 31;
        
        // Sample theme data for Genesis 1 for testing the theme coloring feature
        const sampleThemes = {
          1: ['creation', 'historical'],
          2: ['creation', 'covenant'],
          3: ['creation', 'wisdom'],
          4: ['creation', 'historical'],
          5: ['creation', 'commandment'],
          6: ['creation', 'historical'],
          7: ['creation', 'historical'],
          8: ['creation', 'historical'],
          9: ['creation', 'covenant'],
          10: ['creation', 'faith'],
          11: ['creation', 'wisdom'],
          12: ['creation', 'praise'],
          13: ['creation', 'historical'],
          14: ['creation', 'historical'],
          15: ['creation', 'covenant'],
          16: ['creation', 'commandment'],
          17: ['creation', 'historical'],
          18: ['creation', 'historical'],
          19: ['creation', 'historical'],
          20: ['creation', 'praise'],
          21: ['creation', 'historical'],
          22: ['creation', 'covenant'],
          23: ['creation', 'historical'],
          24: ['creation', 'historical'],
          25: ['creation', 'historical'],
          26: ['creation', 'covenant'],
          27: ['creation', 'historical'],
          28: ['creation', 'commandment'],
          29: ['creation', 'covenant'],
          30: ['creation', 'praise'],
          31: ['creation', 'covenant']
        };
        
        // Enhance verses with highlight info and format for the frontend
        const enhancedVerses = verses.map(verse => {
          const note = notes.find(n => n.verse === verse.verseNumber);
          const verseNum = verse.verseNumber;
          
          // Include theme data for testing the theme coloring feature
          // In production, this would come from the database
          const themes = book.toLowerCase() === 'genesis' && chapterNum === 1 
            ? sampleThemes[verseNum] || []
            : [];
          
          return {
            verse: verse.verseNumber,
            text: verse.textKjv || verse.kjv || "Verse text unavailable",
            kjv: verse.textKjv || verse.kjv || "Verse text unavailable",
            web: verse.textWeb || verse.web || "Verse text unavailable",
            highlightColor: note?.highlightColor || null,
            hasNote: !!note?.content,
            isBookmarked: false, // To be implemented with real bookmark data
            themes: themes // Add themes array to verse data
          };
        });
        
        // Create a formatted book name with proper capitalization
        const formatBookName = (name) => {
          return name.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        };
        
        return res.json({
          book,
          bookName: formatBookName(book),
          chapter: chapterNum,
          totalChapters: totalChapters,
          translation: "KJV",
          verses: enhancedVerses
        });
      } catch (verseError) {
        console.error("Error processing verses:", verseError);
        return res.status(500).json({ message: "Failed to process verses" });
      }
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

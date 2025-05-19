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
  
  // Narrative mode routes with mock data for development
  app.get("/api/ai/narrative/:book/:chapter/:style?", async (req: Request, res: Response) => {
    try {
      const { book, chapter, style = 'chosen' } = req.params;
      
      // Define style names for display
      const styleNames = {
        'chosen': 'The Chosen Style',
        'firstperson': 'First Person',
        'modern': 'Modern Retelling',
        'cinematic': 'Cinematic',
        'novelization': 'Literary Novel'
      };
      
      // Create mock narrative content
      let narrativeContent = '';
      let title = '';
      let characters = [];
      
      if (book.toLowerCase() === 'genesis' && chapter === '1') {
        title = "The Creation of All Things";
        narrativeContent = `In the vast emptiness before time began, God's Spirit hovered over the formless deep. "Let there be light," He commanded, His voice resonating through the void. Instantly, brilliant light burst forth, pushing back the darkness. God smiled at this beginning, this separation of light and shadow, and called the light "day" and the darkness "night."

On the second day, God's hands stretched out across the expanse, dividing the waters above from the waters below, creating space between them—the sky, a brilliant blue canvas stretching in all directions.

"Let the waters gather together," God declared on the third day. The seas roared and churned, drawing back to reveal dry ground. From this newly formed earth, God brought forth vegetation: tender grass sprouted from the soil, trees stretched their branches toward the heavens, flowers of every color unfurled their petals. Each plant contained seeds within itself, carrying the miracle of ongoing life.

On the fourth day, God adorned the heavens. With careful placement, He set the sun, a blazing orb of gold, to rule the day. The moon, silver and serene, He positioned to govern the night, surrounded by countless stars that sparkled like diamonds against the velvet sky.

The fifth day dawned with God's voice calling to the waters: "Bring forth living creatures." The seas suddenly teemed with life—sleek fish darting through coral, massive creatures breaching the surface, sending spray into the air. Above, birds of every kind soared through the sky, their wings catching the sunlight, their songs filling the air with melody.`;
        characters = ["God", "Light", "Waters", "Earth", "Sun", "Moon", "Living Creatures"];
      } else if (book.toLowerCase() === 'genesis' && chapter === '2') {
        title = "The Garden and Its Caretakers";
        narrativeContent = `As the sixth day of creation unfolded, God shaped clay from the earth with meticulous care, forming it into the figure of a man. With gentle hands, He sculpted every detail—fingers that could build, shoulders that could bear, a mind that could think. Then, leaning close, God breathed the breath of life into the man's nostrils. Adam's chest rose, his eyes opened, and he gazed upon his Creator for the first time.

God led Adam through the lush garden He had planted in Eden. "This is your home," God told him, His arm sweeping across the vibrant landscape. "Tend it, care for it, enjoy its fruits." Adam's eyes widened as he took in the beauty around him—trees laden with sweet fruits, flowers of every hue, gentle streams of crystal water carving paths through the garden.

"You may eat freely from every tree," God continued, His voice both gentle and firm, "except one." He guided Adam to the center of the garden where two special trees grew—the Tree of Life and the Tree of the Knowledge of Good and Evil. Their branches stretched toward the heavens, leaves shimmering in the golden light. "This tree," God said, indicating the second tree, "is forbidden to you. On the day you eat from it, you will surely die."

As Adam walked through Eden, he began naming the animals God had created—the powerful lion with its golden mane, the gentle lamb with its soft wool, birds that soared through the air with graceful wings. Yet among all these creatures, Adam found no companion for himself.

God caused a deep sleep to fall upon Adam, and while he slept, God took one of his ribs and formed woman. When Adam awoke, he beheld Eve standing before him, radiant in the garden light. "At last!" Adam exclaimed, joy filling his voice. "Bone of my bone and flesh of my flesh. She shall be called Woman, for from Man she was taken."

God blessed them both, saying, "Be fruitful and multiply. Fill the earth and govern it." As the sun set on the sixth day, Adam and Eve walked hand in hand through their garden home, caretakers of creation, image-bearers of God Himself.`;
        characters = ["God", "Adam", "Eve", "Animals"];
      } else if (book.toLowerCase() === 'john' && chapter === '3') {
        title = "The Rabbi's Midnight Visitor";
        narrativeContent = `The streets of Jerusalem had grown quiet as night settled over the city. Nicodemus, a respected member of the Sanhedrin, pulled his cloak closer as he made his way through narrow alleyways, careful not to be seen. His heart pounded not from the exertion but from what he was about to do—seek out the controversial teacher from Galilee.

Jesus sat with his disciples in the flickering lamplight of their borrowed room when a soft knock came at the door. The disciples exchanged glances—visitors at this hour often meant trouble. But Jesus nodded calmly, and when the door opened, Nicodemus stood there, his ornate robes partially hidden beneath a simple traveler's cloak.

"Rabbi," Nicodemus began, his voice low and measured as he stepped inside, "we know you are a teacher sent from God. No one could perform the signs you do unless God were with him." His eyes met Jesus', searching, questioning.

Jesus smiled slightly, seeing past the carefully constructed question to the heart of the man. "Truly I tell you," He replied, His voice gentle yet firm, "no one can see the kingdom of God unless they are born again."

Confusion crossed Nicodemus' face. "Born again? How can someone be born when they are old?" he asked, leaning forward. "Surely one cannot enter a second time into their mother's womb!"

Jesus' eyes held compassion as He explained, "Flesh gives birth to flesh, but the Spirit gives birth to spirit. The wind blows wherever it pleases—you hear its sound, but you cannot tell where it comes from or where it is going. So it is with everyone born of the Spirit."

Nicodemus' brow furrowed deeply. "How can this be?" he whispered, decades of theological training suddenly insufficient for this moment.

Jesus leaned forward, the lamplight illuminating His face. "You are Israel's teacher, and you do not understand these things?" There was no mockery in His tone, only gentle challenge. "I speak of what I know and testify to what I have seen, yet people do not accept our testimony."

Then Jesus' voice softened as He spoke words that would echo through centuries to come: "For God so loved the world that He gave His one and only Son, that whoever believes in Him shall not perish but have eternal life."

Nicodemus sat in stunned silence, the words washing over him like water on parched ground. Jesus continued, His words both invitation and warning, "This is the verdict: Light has come into the world, but people loved darkness instead of light because their deeds were evil."

As the night deepened around them, Jesus spoke of truth and light, of heaven and earth, of judgment and salvation. And something began to shift within the heart of the Pharisee who had come seeking answers in the darkness but found himself confronted by the Light.`;
        characters = ["Jesus", "Nicodemus", "Disciples"];
      } else {
        title = `${book} ${chapter} Narrative`;
        narrativeContent = `This is a narrative retelling of ${book} chapter ${chapter} in the style similar to "The Chosen" TV series. The text would be transformed into an immersive story with dialogue, sensory details, and character development while maintaining complete theological accuracy.

In this narrative version, you would experience the events of ${book} ${chapter} as if you were there witnessing them firsthand, with rich descriptions of the settings, emotions of the characters, and the cultural context of the time period.

The storytelling approach would help make the scripture more accessible while preserving its spiritual significance and theological meaning.`;
        characters = ["Various Biblical Figures"];
      }
      
      // Style-specific modifications
      if (style === 'firstperson') {
        title = `${title} - First Person Perspective`;
        narrativeContent = narrativeContent.replace(/\bGod\b/g, 'the LORD').replace(/\bhe\b/gi, 'I').replace(/\bhis\b/gi, 'my');
      } else if (style === 'modern') {
        title = `${title} - Modern Retelling`;
        narrativeContent = narrativeContent.replace(/garden/g, 'sanctuary').replace(/commanded/g, 'instructed').replace(/heaven/g, 'the spiritual realm');
      }
      
      // Create the narrative object
      const narrative = {
        title: title,
        content: narrativeContent,
        characters: characters,
        style: style,
        styleName: styleNames[style] || style,
        notes: `This is a narrative retelling of ${book} ${chapter} in the ${styleNames[style] || style} format.`
      };
      
      res.json(narrative);
    } catch (error: any) {
      console.error('Error generating narrative:', error);
      res.status(500).json({ 
        error: 'Failed to generate narrative content',
        message: error?.message || 'Unknown error' 
      });
    }
  });
  
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

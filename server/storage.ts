import { 
  User, Note, InsertNote, InsertVerse, 
  Commentary, InsertCommentary, Tag, InsertTag,
  Author, InsertAuthor, DidYouKnow, InsertDidYouKnow,
  UpsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";
import * as schema from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Bible
  getVerse(book: string, chapter: number, verse: number): Promise<schema.Verse | undefined>;
  getVerses(book: string, chapter: number): Promise<schema.Verse[]>;
  
  // Notes
  getNotes(userId: string, book: string, chapter: number): Promise<Note[]>;
  getNote(id: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, content: string): Promise<Note | undefined>;
  deleteNote(id: string): Promise<boolean>;
  
  // Highlights
  toggleHighlight(userId: string, book: string, chapter: number, verse: number, highlight: boolean): Promise<boolean>;
  
  // Commentary
  getCommentary(verseId: string, lens: string): Promise<Commentary | undefined>;
  createCommentary(commentary: InsertCommentary): Promise<Commentary>;
  
  // Tags
  getTagsForVerse(verseId: string): Promise<Tag[]>;
  
  // Author info
  getAuthorInfo(book: string): Promise<Author | undefined>;
  
  // Did you know
  getDidYouKnow(verseId: string): Promise<DidYouKnow | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // In our updated schema we don't have username anymore
    // Just return undefined since we're using OpenID for auth
    return undefined;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(schema.users)
      .values({ ...userData, id: userData.id || uuidv4() })
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(schema.users)
      .values(userData)
      .onConflictDoUpdate({
        target: schema.users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  async getVerse(book: string, chapter: number, verse: number): Promise<schema.Verse | undefined> {
    const [result] = await db
      .select()
      .from(schema.verses)
      .where(
        and(
          eq(schema.verses.book, book.toLowerCase()),
          eq(schema.verses.chapter, chapter),
          eq(schema.verses.verseNumber, verse)
        )
      );
    return result;
  }
  
  async getVerses(book: string, chapter: number): Promise<schema.Verse[]> {
    return await db
      .select()
      .from(schema.verses)
      .where(
        and(
          eq(schema.verses.book, book.toLowerCase()),
          eq(schema.verses.chapter, chapter)
        )
      )
      .orderBy(schema.verses.verseNumber);
  }
  
  async getNotes(userId: string, book: string, chapter: number): Promise<Note[]> {
    return await db
      .select()
      .from(schema.notes)
      .where(
        and(
          eq(schema.notes.userId, userId),
          eq(schema.notes.book, book.toLowerCase()),
          eq(schema.notes.chapter, chapter)
        )
      )
      .orderBy(schema.notes.verse);
  }
  
  async getNote(id: string): Promise<Note | undefined> {
    const [note] = await db
      .select()
      .from(schema.notes)
      .where(eq(schema.notes.id, id));
    return note;
  }
  
  async createNote(note: InsertNote): Promise<Note> {
    const [createdNote] = await db
      .insert(schema.notes)
      .values({ ...note, id: uuidv4() })
      .returning();
    return createdNote;
  }
  
  async updateNote(id: string, content: string): Promise<Note | undefined> {
    const [updatedNote] = await db
      .update(schema.notes)
      .set({ 
        content, 
        updatedAt: new Date() 
      })
      .where(eq(schema.notes.id, id))
      .returning();
    return updatedNote;
  }
  
  async deleteNote(id: string): Promise<boolean> {
    const [deletedNote] = await db
      .delete(schema.notes)
      .where(eq(schema.notes.id, id))
      .returning();
    return !!deletedNote;
  }
  
  async toggleHighlight(userId: string, book: string, chapter: number, verse: number, highlight: boolean): Promise<boolean> {
    // Check if note exists
    const [existingNote] = await db
      .select()
      .from(schema.notes)
      .where(
        and(
          eq(schema.notes.userId, userId),
          eq(schema.notes.book, book.toLowerCase()),
          eq(schema.notes.chapter, chapter),
          eq(schema.notes.verse, verse)
        )
      );
    
    if (existingNote) {
      // Update existing note
      await db
        .update(schema.notes)
        .set({ 
          highlight, 
          updatedAt: new Date() 
        })
        .where(eq(schema.notes.id, existingNote.id));
      return true;
    } else {
      // Create new note with highlight
      await db
        .insert(schema.notes)
        .values({
          id: uuidv4(),
          userId,
          book: book.toLowerCase(),
          chapter,
          verse,
          highlight,
          content: null
        });
      return true;
    }
  }
  
  async getCommentary(verseId: string, lens: string): Promise<Commentary | undefined> {
    const [commentary] = await db
      .select()
      .from(schema.commentaries)
      .where(
        and(
          eq(schema.commentaries.verseId, verseId),
          eq(schema.commentaries.lens, lens)
        )
      );
    return commentary;
  }
  
  async createCommentary(commentary: InsertCommentary): Promise<Commentary> {
    const [createdCommentary] = await db
      .insert(schema.commentaries)
      .values({ ...commentary, id: uuidv4() })
      .returning();
    return createdCommentary;
  }
  
  async getTagsForVerse(verseId: string): Promise<Tag[]> {
    const verseTags = await db
      .select()
      .from(schema.verseTags)
      .where(eq(schema.verseTags.verseId, verseId));
    
    const tagIds = verseTags.map(vt => vt.tagId);
    
    if (tagIds.length === 0) return [];
    
    const tags = await db
      .select()
      .from(schema.tags)
      .where(
        // Use SQL where clause with IN for compatible operation
        sql`${schema.tags.id} IN (${tagIds.join(',')})`
      );
    
    return tags;
  }
  
  async getAuthorInfo(book: string): Promise<Author | undefined> {
    const [author] = await db
      .select()
      .from(schema.authors)
      .where(eq(schema.authors.book, book.toLowerCase()));
    return author;
  }
  
  async getDidYouKnow(verseId: string): Promise<DidYouKnow | undefined> {
    const [fact] = await db
      .select()
      .from(schema.didYouKnow)
      .where(eq(schema.didYouKnow.verseId, verseId));
    return fact;
  }
}

export class MemStorage implements IStorage {
  private users = new Map<string, User>();
  private verses = new Map<string, schema.Verse>();
  private notes = new Map<string, Note>();
  private commentaries = new Map<string, Commentary>();
  private tags = new Map<string, Tag>();
  private verseTags = new Map<string, string[]>();
  private authors = new Map<string, Author>();
  private didYouKnow = new Map<string, DidYouKnow>();
  
  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }
  
  private initializeSampleData() {
    // Sample user with updated schema fields
    const sampleUser: User = {
      id: "user1",
      email: "user@example.com",
      firstName: "Test",
      lastName: "User",
      profileImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(sampleUser.id, sampleUser);
    
    // Sample verses for Proverbs 3
    const proverbsVerses = [
      { id: "prov3v1", book: "proverbs", chapter: 3, verseNumber: 1, text: "My son, do not forget my teaching, but keep my commands in your heart,", embedding: null },
      { id: "prov3v2", book: "proverbs", chapter: 3, verseNumber: 2, text: "for they will prolong your life many years and bring you peace and prosperity.", embedding: null },
      { id: "prov3v3", book: "proverbs", chapter: 3, verseNumber: 3, text: "Let love and faithfulness never leave you; bind them around your neck, write them on the tablet of your heart.", embedding: null },
      { id: "prov3v4", book: "proverbs", chapter: 3, verseNumber: 4, text: "Then you will win favor and a good name in the sight of God and man.", embedding: null },
      { id: "prov3v5", book: "proverbs", chapter: 3, verseNumber: 5, text: "Trust in the LORD with all your heart and lean not on your own understanding;", embedding: null },
      { id: "prov3v6", book: "proverbs", chapter: 3, verseNumber: 6, text: "in all your ways submit to him, and he will make your paths straight.", embedding: null },
      { id: "prov3v7", book: "proverbs", chapter: 3, verseNumber: 7, text: "Do not be wise in your own eyes; fear the LORD and shun evil.", embedding: null },
      { id: "prov3v8", book: "proverbs", chapter: 3, verseNumber: 8, text: "This will bring health to your body and nourishment to your bones.", embedding: null }
    ];
    
    // Sample verses for Genesis 1
    const genesisVerses = [
      { id: "gen1v1", book: "genesis", chapter: 1, verseNumber: 1, text: "In the beginning God created the heavens and the earth.", embedding: null },
      { id: "gen1v2", book: "genesis", chapter: 1, verseNumber: 2, text: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.", embedding: null },
      { id: "gen1v3", book: "genesis", chapter: 1, verseNumber: 3, text: "And God said, 'Let there be light,' and there was light.", embedding: null },
      { id: "gen1v4", book: "genesis", chapter: 1, verseNumber: 4, text: "God saw that the light was good, and he separated the light from the darkness.", embedding: null },
      { id: "gen1v5", book: "genesis", chapter: 1, verseNumber: 5, text: "God called the light 'day,' and the darkness he called 'night.' And there was evening, and there was morning—the first day.", embedding: null },
      { id: "gen1v6", book: "genesis", chapter: 1, verseNumber: 6, text: "And God said, 'Let there be a vault between the waters to separate water from water.'", embedding: null },
      { id: "gen1v7", book: "genesis", chapter: 1, verseNumber: 7, text: "So God made the vault and separated the water under the vault from the water above it. And it was so.", embedding: null },
      { id: "gen1v8", book: "genesis", chapter: 1, verseNumber: 8, text: "God called the vault 'sky.' And there was evening, and there was morning—the second day.", embedding: null }
    ];
    
    // Sample verses for John 3
    const johnVerses = [
      { id: "john3v1", book: "john", chapter: 3, verseNumber: 1, text: "Now there was a Pharisee, a man named Nicodemus who was a member of the Jewish ruling council.", embedding: null },
      { id: "john3v2", book: "john", chapter: 3, verseNumber: 2, text: "He came to Jesus at night and said, 'Rabbi, we know that you are a teacher who has come from God. For no one could perform the signs you are doing if God were not with him.'", embedding: null },
      { id: "john3v3", book: "john", chapter: 3, verseNumber: 3, text: "Jesus replied, 'Very truly I tell you, no one can see the kingdom of God unless they are born again.'", embedding: null },
      { id: "john3v4", book: "john", chapter: 3, verseNumber: 4, text: "'How can someone be born when they are old?' Nicodemus asked. 'Surely they cannot enter a second time into their mother's womb to be born!'", embedding: null },
      { id: "john3v5", book: "john", chapter: 3, verseNumber: 5, text: "Jesus answered, 'Very truly I tell you, no one can enter the kingdom of God unless they are born of water and the Spirit.'", embedding: null },
      { id: "john3v6", book: "john", chapter: 3, verseNumber: 6, text: "Flesh gives birth to flesh, but the Spirit gives birth to spirit.", embedding: null },
      { id: "john3v7", book: "john", chapter: 3, verseNumber: 7, text: "You should not be surprised at my saying, 'You must be born again.'", embedding: null },
      { id: "john3v8", book: "john", chapter: 3, verseNumber: 8, text: "The wind blows wherever it pleases. You hear its sound, but you cannot tell where it comes from or where it is going. So it is with everyone born of the Spirit.", embedding: null },
      { id: "john3v16", book: "john", chapter: 3, verseNumber: 16, text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", embedding: null }
    ];
    
    // Combine all verses
    const verses = [...proverbsVerses, ...genesisVerses, ...johnVerses];
    
    verses.forEach(verse => {
      this.verses.set(verse.id, verse);
    });
    
    // Sample commentaries
    const commentaries: Commentary[] = [
      { 
        id: "c1", 
        verseId: "v3", 
        lens: "standard", 
        content: "This verse emphasizes the internalization of virtues. The metaphor of binding them \"around your neck\" suggests wearing them as ornaments—visible to others—while writing them \"on the tablet of your heart\" speaks to making them part of your inner character.", 
        createdAt: new Date() 
      },
      { 
        id: "c2", 
        verseId: "v6", 
        lens: "catholic", 
        content: "Catholic tradition sees this verse as emphasizing God's providence and guidance. The Church teaches that submitting to God means following His will as revealed through Scripture, Tradition, and the Magisterium, leading to a righteous path.", 
        createdAt: new Date() 
      },
      { 
        id: "c3", 
        verseId: "v6", 
        lens: "evangelical", 
        content: "Evangelical interpretation emphasizes personal relationship with Christ and direct guidance through prayer and Bible study. \"Making paths straight\" is seen as God removing obstacles and directing the believer's life decisions.", 
        createdAt: new Date() 
      }
    ];
    
    commentaries.forEach(commentary => {
      this.commentaries.set(commentary.id, commentary);
    });
    
    // Sample tags
    const tags: Tag[] = [
      { id: "t1", name: "Trust", category: "theological", title: "Trust in Scripture", description: "The Hebrew word for trust (בָּטַח, batach) implies complete reliance and confidence. This theme appears 80+ times in Psalms and Proverbs." },
      { id: "t2", name: "Heart", category: "theological", title: "Heart in Hebrew Thought", description: "In Hebrew, \"heart\" (לֵב, lev) represents the core of a person - including mind, emotions, and will - not just feelings as in Western culture." }
    ];
    
    tags.forEach(tag => {
      this.tags.set(tag.id, tag);
    });
    
    // Sample verse-tag relationships
    this.verseTags.set("v5", ["t1", "t2"]);
    
    // Sample notes
    const notes: Note[] = [
      { 
        id: "n1", 
        userId: "user1", 
        book: "proverbs", 
        chapter: 3, 
        verse: 5, 
        content: "This is one of my favorite verses to remember during difficult times. When things don't make sense, trusting God completely is the answer.", 
        highlight: true, 
        createdAt: new Date("2023-06-12"), 
        updatedAt: new Date("2023-06-12") 
      }
    ];
    
    notes.forEach(note => {
      this.notes.set(note.id, note);
    });
    
    // Sample author info
    const proverbsAuthor: Author = {
      id: "a1",
      book: "proverbs",
      name: "King Solomon",
      description: "Written primarily by King Solomon around 900 BC, Proverbs is a collection of wisdom sayings covering practical living, relationships, and the fear of the Lord. Solomon was known as the wisest man who ever lived.",
      imageUrl: "https://pixabay.com/get/g2c2c7f3c50dfbd784104f9b97b564c4cbf780ebd69b05b7443732707c150c390ae074942de59fafc2eb0a7609db1d1101a844b586f6db041b712bea21d467096_1280.jpg"
    };
    
    const genesisAuthor: Author = {
      id: "a2",
      book: "genesis",
      name: "Moses",
      description: "Traditionally attributed to Moses, Genesis is the first book of the Bible and covers creation, the fall of mankind, the flood, and the patriarchs Abraham, Isaac, Jacob, and Joseph. It spans approximately 2,000 years of human history.",
      imageUrl: "https://pixabay.com/get/g055bc4e5f89ae0b254f6b72f19ac6cd4dff2ffbfdf0ad33c851f6a31c49e64e79b80caa43c01d1c1c6c4264e20c4d7add9aecb01b3ab54a18fc55e80ffa3a95c_1280.jpg"
    };
    
    const johnAuthor: Author = {
      id: "a3",
      book: "john",
      name: "John the Apostle",
      description: "John was one of Jesus' closest disciples, often referred to as 'the disciple whom Jesus loved.' His gospel, written around 90-95 AD, emphasizes the deity of Christ and contains many unique stories and teachings not found in the other gospels.",
      imageUrl: "https://pixabay.com/get/g8e52e16dae5c7fb8be1acc9d03f0c0e61ed1cc5c10b09ebdf1dcc9f2b5b0c6bd8293ef39c1d9d87ead73da4fa8e3ec5acb7809e23f33d77c3a1752cf1f4c172f_1280.jpg"
    };
    
    this.authors.set(proverbsAuthor.book, proverbsAuthor);
    this.authors.set(genesisAuthor.book, genesisAuthor);
    this.authors.set(johnAuthor.book, johnAuthor);
    
    // Sample "Did you know" facts
    const didYouKnowFacts: DidYouKnow[] = [
      {
        id: "dyk1",
        verseId: "prov3v5",
        content: "This verse and the next (Proverbs 3:5-6) are among the most memorized and quoted verses from the entire Book of Proverbs."
      },
      {
        id: "dyk2",
        verseId: "gen1v1",
        content: "Genesis 1:1 is one of the most translated verses in the Bible. The Hebrew word 'bara' (created) is used exclusively for God's creative activity and never for human creativity."
      },
      {
        id: "dyk3",
        verseId: "john3v16",
        content: "John 3:16 is often called 'the gospel in a nutshell' because it summarizes the core Christian message in a single verse. It has been translated into more than 1,100 languages."
      },
      {
        id: "dyk4",
        verseId: "gen1v3",
        content: "The phrase 'let there be light' (Genesis 1:3) has become iconic in popular culture, appearing in numerous books, films, and songs as a metaphor for sudden illumination or understanding."
      },
      {
        id: "dyk5",
        verseId: "john3v5",
        content: "The phrase 'born of water and the Spirit' has been interpreted in various ways throughout church history, including references to physical birth, baptism, spiritual renewal, or the Word of God."
      }
    ];
    
    didYouKnowFacts.forEach(fact => {
      this.didYouKnow.set(fact.verseId, fact);
    });
  }
  
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // In our updated schema we don't have username anymore
    // Just return undefined since we're using OpenID for auth
    return undefined;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const id = userData.id || uuidv4();
    const now = new Date();
    const user: User = { 
      ...userData, 
      id,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async upsertUser(userData: UpsertUser): Promise<User> {
    // If user exists, update it
    if (userData.id && this.users.has(userData.id)) {
      const existingUser = this.users.get(userData.id)!;
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        email: userData.email || existingUser.email,
        firstName: userData.firstName || existingUser.firstName,
        lastName: userData.lastName || existingUser.lastName,
        profileImageUrl: userData.profileImageUrl || existingUser.profileImageUrl,
        updatedAt: new Date()
      };
      this.users.set(userData.id, updatedUser);
      return updatedUser;
    }
    // Otherwise create new user
    return this.createUser(userData);
  }
  
  async getVerse(book: string, chapter: number, verse: number): Promise<schema.Verse | undefined> {
    return Array.from(this.verses.values()).find(
      v => v.book === book.toLowerCase() && v.chapter === chapter && v.verseNumber === verse
    );
  }
  
  async getVerses(book: string, chapter: number): Promise<schema.Verse[]> {
    return Array.from(this.verses.values())
      .filter(v => v.book === book.toLowerCase() && v.chapter === chapter)
      .sort((a, b) => a.verseNumber - b.verseNumber);
  }
  
  async getNotes(userId: string, book: string, chapter: number): Promise<Note[]> {
    return Array.from(this.notes.values())
      .filter(n => n.userId === userId && n.book === book.toLowerCase() && n.chapter === chapter)
      .sort((a, b) => a.verse - b.verse);
  }
  
  async getNote(id: string): Promise<Note | undefined> {
    return this.notes.get(id);
  }
  
  async createNote(note: InsertNote): Promise<Note> {
    const id = uuidv4();
    const now = new Date();
    const newNote: Note = { ...note, id, createdAt: now, updatedAt: now };
    this.notes.set(id, newNote);
    return newNote;
  }
  
  async updateNote(id: string, content: string): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    
    const updatedNote: Note = { ...note, content, updatedAt: new Date() };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }
  
  async deleteNote(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }
  
  async toggleHighlight(userId: string, book: string, chapter: number, verse: number, highlight: boolean): Promise<boolean> {
    const existingNote = Array.from(this.notes.values()).find(
      n => n.userId === userId && n.book === book.toLowerCase() && n.chapter === chapter && n.verse === verse
    );
    
    if (existingNote) {
      // Update existing note
      const updatedNote: Note = { ...existingNote, highlight, updatedAt: new Date() };
      this.notes.set(existingNote.id, updatedNote);
    } else {
      // Create new note with highlight
      const id = uuidv4();
      const now = new Date();
      const newNote: Note = {
        id,
        userId,
        book: book.toLowerCase(),
        chapter,
        verse,
        content: null,
        highlight,
        createdAt: now,
        updatedAt: now
      };
      this.notes.set(id, newNote);
    }
    
    return true;
  }
  
  async getCommentary(verseId: string, lens: string): Promise<Commentary | undefined> {
    return Array.from(this.commentaries.values()).find(
      c => c.verseId === verseId && c.lens === lens
    );
  }
  
  async createCommentary(commentary: InsertCommentary): Promise<Commentary> {
    const id = uuidv4();
    const newCommentary: Commentary = { ...commentary, id, createdAt: new Date() };
    this.commentaries.set(id, newCommentary);
    return newCommentary;
  }
  
  async getTagsForVerse(verseId: string): Promise<Tag[]> {
    const tagIds = this.verseTags.get(verseId) || [];
    return tagIds.map(id => this.tags.get(id)).filter(Boolean) as Tag[];
  }
  
  async getAuthorInfo(book: string): Promise<Author | undefined> {
    return this.authors.get(book.toLowerCase());
  }
  
  async getDidYouKnow(verseId: string): Promise<DidYouKnow | undefined> {
    return this.didYouKnow.get(verseId);
  }
}

// Use MemStorage for development, DatabaseStorage for production
export const storage = process.env.NODE_ENV === "production" 
  ? new DatabaseStorage() 
  : new MemStorage();

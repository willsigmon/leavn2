import { pgTable, text, serial, integer, boolean, timestamp, varchar, foreignKey, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User model updated for Replit Auth
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Bible text
export const verses = pgTable("verses", {
  id: text("id").primaryKey(),
  book: text("book").notNull(),
  chapter: integer("chapter").notNull(),
  verseNumber: integer("verse_number").notNull(),
  textKjv: text("text_kjv").notNull(),
  textWeb: text("text_web").notNull(),
  embedding: text("embedding"),
});

// Bible chunks for RAG
export const bibleChunks = pgTable("bible_chunks", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  translation: text("translation").notNull(),
  book: text("book").notNull(),
  startChapter: integer("start_chapter").notNull(),
  startVerse: integer("start_verse").notNull(),
  endChapter: integer("end_chapter").notNull(),
  endVerse: integer("end_verse").notNull(),
  verses: text("verses").array().notNull(),
  tags: text("tags").array(),
  embedding: jsonb("embedding"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notes for users
export const notes = pgTable("notes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  book: text("book").notNull(),
  chapter: integer("chapter").notNull(),
  verse: integer("verse").notNull(),
  content: text("content"),
  highlight: boolean("highlight").default(false),
  highlightColor: text("highlight_color"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Commentary for verses
export const commentaries = pgTable("commentaries", {
  id: text("id").primaryKey(),
  verseId: text("verse_id").notNull().references(() => verses.id, { onDelete: "cascade" }),
  lens: text("lens").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tags for verses
export const tags = pgTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
});

// Junction table for verses and tags
export const verseTags = pgTable("verse_tags", {
  id: text("id").primaryKey(),
  verseId: text("verse_id").notNull().references(() => verses.id, { onDelete: "cascade" }),
  tagId: text("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
});

// Author information for books
export const authors = pgTable("authors", {
  id: text("id").primaryKey(),
  book: text("book").notNull().unique(),
  name: text("name"),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
});

// Reading plans
export const readingPlans = pgTable("reading_plans", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  days: integer("days").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reading plan entries
export const planEntries = pgTable("plan_entries", {
  id: text("id").primaryKey(),
  planId: text("plan_id").notNull().references(() => readingPlans.id, { onDelete: "cascade" }),
  day: integer("day").notNull(),
  book: text("book").notNull(),
  chapter: integer("chapter").notNull(),
  startVerse: integer("start_verse").default(1),
  endVerse: integer("end_verse"),
});

// User progress for reading plans
export const userProgress = pgTable("user_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: text("plan_id").notNull().references(() => readingPlans.id, { onDelete: "cascade" }),
  currentDay: integer("current_day").default(1),
  completed: boolean("completed").default(false),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// User reader preferences
export const userPreferences = pgTable("user_preferences", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fontSize: text("font_size").default("medium"), // small, medium, large, x-large
  fontFamily: text("font_family").default("serif"), // serif, sans-serif, dyslexic
  lineSpacing: text("line_spacing").default("normal"), // tight, normal, relaxed
  theme: text("theme").default("light"), // light, dark, sepia
  isOpenDyslexicEnabled: boolean("is_open_dyslexic_enabled").default(false),
  readingPosition: jsonb("reading_position").default({}),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// "Did you know" facts
export const didYouKnow = pgTable("did_you_know", {
  id: text("id").primaryKey(),
  verseId: text("verse_id").notNull().references(() => verses.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
});

// Bookmarks
export const bookmarks = pgTable("bookmarks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  book: text("book").notNull(),
  chapter: integer("chapter").notNull(),
  verse: integer("verse").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Cross-references between verses
export const crossReferences = pgTable("cross_references", {
  id: text("id").primaryKey(),
  fromRef: text("from_ref").notNull().references(() => verses.id, { onDelete: "cascade" }),
  toRef: text("to_ref").notNull().references(() => verses.id, { onDelete: "cascade" }),
  connectionType: text("connection_type").notNull(), // e.g., "thematic", "quotation", "fulfillment", etc.
  relevance: integer("relevance").notNull(), // 0-100 score
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tags for cross-references
export const crossRefTags = pgTable("cross_ref_tags", {
  id: text("id").primaryKey(),
  crossRefId: text("cross_ref_id").notNull().references(() => crossReferences.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertVerseSchema = createInsertSchema(verses).omit({ id: true });
export const insertBibleChunkSchema = createInsertSchema(bibleChunks).omit({ id: true, createdAt: true });
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCommentarySchema = createInsertSchema(commentaries).omit({ id: true, createdAt: true });
export const insertTagSchema = createInsertSchema(tags).omit({ id: true });
export const insertVerseTagSchema = createInsertSchema(verseTags).omit({ id: true });
export const insertAuthorSchema = createInsertSchema(authors).omit({ id: true });
export const insertReadingPlanSchema = createInsertSchema(readingPlans).omit({ id: true, createdAt: true });
export const insertPlanEntrySchema = createInsertSchema(planEntries).omit({ id: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true, startedAt: true, completedAt: true });
export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({ id: true, updatedAt: true });
export const insertDidYouKnowSchema = createInsertSchema(didYouKnow).omit({ id: true });
export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({ id: true, createdAt: true });
export const insertCrossReferenceSchema = createInsertSchema(crossReferences).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCrossRefTagSchema = createInsertSchema(crossRefTags).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertVerse = z.infer<typeof insertVerseSchema>;
export type Verse = typeof verses.$inferSelect & {
  highlighted?: boolean;
  hasCommentary?: boolean;
  commentary?: string;
  text?: { // For backward compatibility
    kjv: string;
    web: string;
  };
};

export type InsertBibleChunk = z.infer<typeof insertBibleChunkSchema>;
export type BibleChunk = typeof bibleChunks.$inferSelect;

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

export type InsertCommentary = z.infer<typeof insertCommentarySchema>;
export type Commentary = typeof commentaries.$inferSelect;

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

export type InsertVerseTag = z.infer<typeof insertVerseTagSchema>;
export type VerseTag = typeof verseTags.$inferSelect;

export type InsertAuthor = z.infer<typeof insertAuthorSchema>;
export type Author = typeof authors.$inferSelect;

export type InsertReadingPlan = z.infer<typeof insertReadingPlanSchema>;
export type ReadingPlan = typeof readingPlans.$inferSelect;

export type InsertPlanEntry = z.infer<typeof insertPlanEntrySchema>;
export type PlanEntry = typeof planEntries.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

export type InsertDidYouKnow = z.infer<typeof insertDidYouKnowSchema>;
export type DidYouKnow = typeof didYouKnow.$inferSelect;

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;

export type InsertCrossReference = z.infer<typeof insertCrossReferenceSchema>;
export type CrossReference = typeof crossReferences.$inferSelect;

export type InsertCrossRefTag = z.infer<typeof insertCrossRefTagSchema>;
export type CrossRefTag = typeof crossRefTags.$inferSelect;

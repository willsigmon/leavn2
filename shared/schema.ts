import { pgTable, text, serial, integer, boolean, timestamp, varchar, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bible text
export const verses = pgTable("verses", {
  id: text("id").primaryKey(),
  book: text("book").notNull(),
  chapter: integer("chapter").notNull(),
  verseNumber: integer("verse_number").notNull(),
  text: text("text").notNull(),
  embedding: text("embedding"),
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

// "Did you know" facts
export const didYouKnow = pgTable("did_you_know", {
  id: text("id").primaryKey(),
  verseId: text("verse_id").notNull().references(() => verses.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertVerseSchema = createInsertSchema(verses).omit({ id: true });
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCommentarySchema = createInsertSchema(commentaries).omit({ id: true, createdAt: true });
export const insertTagSchema = createInsertSchema(tags).omit({ id: true });
export const insertVerseTagSchema = createInsertSchema(verseTags).omit({ id: true });
export const insertAuthorSchema = createInsertSchema(authors).omit({ id: true });
export const insertReadingPlanSchema = createInsertSchema(readingPlans).omit({ id: true, createdAt: true });
export const insertPlanEntrySchema = createInsertSchema(planEntries).omit({ id: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true, startedAt: true, completedAt: true });
export const insertDidYouKnowSchema = createInsertSchema(didYouKnow).omit({ id: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVerse = z.infer<typeof insertVerseSchema>;
export type Verse = typeof verses.$inferSelect & {
  highlighted?: boolean;
  hasCommentary?: boolean;
  commentary?: string;
};

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

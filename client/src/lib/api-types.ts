// Define response types for our API endpoints
export interface NarrativeResponse {
  content: string;
}

export interface ArtworkResponse {
  url: string;
}

export interface TranslationResponse {
  genz: string;
  kids: string;
  devotional?: string;
  scholarly?: string;
}

export interface DidYouKnowResponse {
  content: string;
}

export interface CommentaryResponse {
  content: string;
}

export interface ContextualAnswerResponse {
  content: string;
}

export interface TagResponse {
  id: string;
  name: string;
  category: string;
}

export interface ChapterResponse {
  totalChapters: number;
  translation: string;
  verses: VerseResponse[];
}

export interface VerseResponse {
  id: string;
  book: string;
  chapter: number;
  verseNumber: number;
  text: string;
  highlighted?: boolean;
  hasCommentary?: boolean;
}

export interface NoteResponse {
  id: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  book: string;
  chapter: number;
  userId: string;
  verse: number;
  highlight: boolean | null;
}
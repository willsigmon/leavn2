export interface Verse {
  id: string;
  book: string;
  chapter: number;
  verseNumber: number;
  textKjv: string;
  textWeb: string;
  embedding: string | null;
}

export interface GenesisVerse extends Verse {
  isBookmarked: boolean;
  hasNote?: boolean | null;
  tags: string[];
}

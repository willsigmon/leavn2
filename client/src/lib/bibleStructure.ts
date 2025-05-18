/**
 * Bible structure information
 */

export interface BookInfo {
  name: string;
  chapters: number;
  testament: 'ot' | 'nt';
}

export interface BibleStructure {
  books: Record<string, BookInfo>;
  bookOrder: string[];
}

// Bible book information with chapter counts
export const bibleStructure: BibleStructure = {
  books: {
    genesis: { name: 'Genesis', chapters: 50, testament: 'ot' },
    exodus: { name: 'Exodus', chapters: 40, testament: 'ot' },
    leviticus: { name: 'Leviticus', chapters: 27, testament: 'ot' },
    numbers: { name: 'Numbers', chapters: 36, testament: 'ot' },
    deuteronomy: { name: 'Deuteronomy', chapters: 34, testament: 'ot' },
    joshua: { name: 'Joshua', chapters: 24, testament: 'ot' },
    judges: { name: 'Judges', chapters: 21, testament: 'ot' },
    ruth: { name: 'Ruth', chapters: 4, testament: 'ot' },
    '1samuel': { name: '1 Samuel', chapters: 31, testament: 'ot' },
    '2samuel': { name: '2 Samuel', chapters: 24, testament: 'ot' },
    '1kings': { name: '1 Kings', chapters: 22, testament: 'ot' },
    '2kings': { name: '2 Kings', chapters: 25, testament: 'ot' },
    '1chronicles': { name: '1 Chronicles', chapters: 29, testament: 'ot' },
    '2chronicles': { name: '2 Chronicles', chapters: 36, testament: 'ot' },
    ezra: { name: 'Ezra', chapters: 10, testament: 'ot' },
    nehemiah: { name: 'Nehemiah', chapters: 13, testament: 'ot' },
    esther: { name: 'Esther', chapters: 10, testament: 'ot' },
    job: { name: 'Job', chapters: 42, testament: 'ot' },
    psalms: { name: 'Psalms', chapters: 150, testament: 'ot' },
    proverbs: { name: 'Proverbs', chapters: 31, testament: 'ot' },
    ecclesiastes: { name: 'Ecclesiastes', chapters: 12, testament: 'ot' },
    songofsolomon: { name: 'Song of Solomon', chapters: 8, testament: 'ot' },
    isaiah: { name: 'Isaiah', chapters: 66, testament: 'ot' },
    jeremiah: { name: 'Jeremiah', chapters: 52, testament: 'ot' },
    lamentations: { name: 'Lamentations', chapters: 5, testament: 'ot' },
    ezekiel: { name: 'Ezekiel', chapters: 48, testament: 'ot' },
    daniel: { name: 'Daniel', chapters: 12, testament: 'ot' },
    hosea: { name: 'Hosea', chapters: 14, testament: 'ot' },
    joel: { name: 'Joel', chapters: 3, testament: 'ot' },
    amos: { name: 'Amos', chapters: 9, testament: 'ot' },
    obadiah: { name: 'Obadiah', chapters: 1, testament: 'ot' },
    jonah: { name: 'Jonah', chapters: 4, testament: 'ot' },
    micah: { name: 'Micah', chapters: 7, testament: 'ot' },
    nahum: { name: 'Nahum', chapters: 3, testament: 'ot' },
    habakkuk: { name: 'Habakkuk', chapters: 3, testament: 'ot' },
    zephaniah: { name: 'Zephaniah', chapters: 3, testament: 'ot' },
    haggai: { name: 'Haggai', chapters: 2, testament: 'ot' },
    zechariah: { name: 'Zechariah', chapters: 14, testament: 'ot' },
    malachi: { name: 'Malachi', chapters: 4, testament: 'ot' },
    matthew: { name: 'Matthew', chapters: 28, testament: 'nt' },
    mark: { name: 'Mark', chapters: 16, testament: 'nt' },
    luke: { name: 'Luke', chapters: 24, testament: 'nt' },
    john: { name: 'John', chapters: 21, testament: 'nt' },
    acts: { name: 'Acts', chapters: 28, testament: 'nt' },
    romans: { name: 'Romans', chapters: 16, testament: 'nt' },
    '1corinthians': { name: '1 Corinthians', chapters: 16, testament: 'nt' },
    '2corinthians': { name: '2 Corinthians', chapters: 13, testament: 'nt' },
    galatians: { name: 'Galatians', chapters: 6, testament: 'nt' },
    ephesians: { name: 'Ephesians', chapters: 6, testament: 'nt' },
    philippians: { name: 'Philippians', chapters: 4, testament: 'nt' },
    colossians: { name: 'Colossians', chapters: 4, testament: 'nt' },
    '1thessalonians': { name: '1 Thessalonians', chapters: 5, testament: 'nt' },
    '2thessalonians': { name: '2 Thessalonians', chapters: 3, testament: 'nt' },
    '1timothy': { name: '1 Timothy', chapters: 6, testament: 'nt' },
    '2timothy': { name: '2 Timothy', chapters: 4, testament: 'nt' },
    titus: { name: 'Titus', chapters: 3, testament: 'nt' },
    philemon: { name: 'Philemon', chapters: 1, testament: 'nt' },
    hebrews: { name: 'Hebrews', chapters: 13, testament: 'nt' },
    james: { name: 'James', chapters: 5, testament: 'nt' },
    '1peter': { name: '1 Peter', chapters: 5, testament: 'nt' },
    '2peter': { name: '2 Peter', chapters: 3, testament: 'nt' },
    '1john': { name: '1 John', chapters: 5, testament: 'nt' },
    '2john': { name: '2 John', chapters: 1, testament: 'nt' },
    '3john': { name: '3 John', chapters: 1, testament: 'nt' },
    jude: { name: 'Jude', chapters: 1, testament: 'nt' },
    revelation: { name: 'Revelation', chapters: 22, testament: 'nt' }
  },
  
  // Order of books in the Bible
  bookOrder: [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
    'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms',
    'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah',
    'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
    'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah',
    'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai',
    'Zechariah', 'Malachi',
    'Matthew', 'Mark', 'Luke', 'John', 'Acts',
    'Romans', '1 Corinthians', '2 Corinthians', 'Galatians',
    'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians',
    '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus',
    'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
    '1 John', '2 John', '3 John', 'Jude', 'Revelation'
  ]
};
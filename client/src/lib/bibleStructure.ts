/**
 * Bible structure data with sections, books, chapters and verses
 */

export interface BibleBook {
  id: string;
  name: string;
  shortName?: string;
  chapters: number;
  section: string;
  testament: 'old' | 'new';
  description?: string;
  author?: string;
  canonicalOrder: number;
}

export interface BibleSection {
  id: string;
  name: string;
  books: BibleBook[];
  testament: 'old' | 'new';
  description?: string;
  order: number;
}

export interface BibleStructure {
  sections: BibleSection[];
  books: Record<string, BibleBook>;
}

const oldTestamentSections: BibleSection[] = [
  {
    id: 'pentateuch',
    name: 'Pentateuch (Torah)',
    testament: 'old',
    description: 'The first five books of the Bible, also known as the Law or Torah',
    order: 1,
    books: [
      {
        id: 'genesis',
        name: 'Genesis',
        shortName: 'Gen',
        chapters: 50,
        section: 'pentateuch',
        testament: 'old',
        author: 'Moses',
        description: 'The beginning of the world and the story of the patriarchs',
        canonicalOrder: 1
      },
      {
        id: 'exodus',
        name: 'Exodus',
        shortName: 'Exo',
        chapters: 40,
        section: 'pentateuch',
        testament: 'old',
        author: 'Moses',
        description: 'The story of Israel\'s departure from Egypt and the giving of the Law',
        canonicalOrder: 2
      },
      {
        id: 'leviticus',
        name: 'Leviticus',
        shortName: 'Lev',
        chapters: 27,
        section: 'pentateuch',
        testament: 'old',
        author: 'Moses',
        description: 'Laws for the Levitical priesthood and holiness codes',
        canonicalOrder: 3
      },
      {
        id: 'numbers',
        name: 'Numbers',
        shortName: 'Num',
        chapters: 36,
        section: 'pentateuch',
        testament: 'old',
        author: 'Moses',
        description: 'Census of Israel and their journey through the wilderness',
        canonicalOrder: 4
      },
      {
        id: 'deuteronomy',
        name: 'Deuteronomy',
        shortName: 'Deut',
        chapters: 34,
        section: 'pentateuch',
        testament: 'old',
        author: 'Moses',
        description: 'Moses\' final addresses and a second giving of the law',
        canonicalOrder: 5
      }
    ]
  },
  {
    id: 'historical',
    name: 'Historical Books',
    testament: 'old',
    description: 'Books that tell the history of Israel from the conquest of Canaan to the return from exile',
    order: 2,
    books: [
      {
        id: 'joshua',
        name: 'Joshua',
        shortName: 'Josh',
        chapters: 24,
        section: 'historical',
        testament: 'old',
        author: 'Joshua',
        description: 'Conquest and division of the Promised Land',
        canonicalOrder: 6
      },
      {
        id: 'judges',
        name: 'Judges',
        shortName: 'Judg',
        chapters: 21,
        section: 'historical',
        testament: 'old',
        author: 'Samuel',
        description: 'Israel\'s cycle of sin, oppression, and deliverance through judges',
        canonicalOrder: 7
      },
      {
        id: 'ruth',
        name: 'Ruth',
        shortName: 'Ruth',
        chapters: 4,
        section: 'historical',
        testament: 'old',
        author: 'Unknown',
        description: 'Story of Ruth, a Moabite woman who becomes an ancestor of King David',
        canonicalOrder: 8
      },
      {
        id: '1samuel',
        name: '1 Samuel',
        shortName: '1 Sam',
        chapters: 31,
        section: 'historical',
        testament: 'old',
        author: 'Samuel, Nathan, Gad',
        description: 'Israel\'s transition from judges to kings, focusing on Samuel and Saul',
        canonicalOrder: 9
      },
      {
        id: '2samuel',
        name: '2 Samuel',
        shortName: '2 Sam',
        chapters: 24,
        section: 'historical',
        testament: 'old',
        author: 'Nathan, Gad',
        description: 'The reign of King David',
        canonicalOrder: 10
      },
      {
        id: '1kings',
        name: '1 Kings',
        shortName: '1 Kgs',
        chapters: 22,
        section: 'historical',
        testament: 'old',
        author: 'Jeremiah',
        description: 'Solomon\'s reign and the divided kingdom until Elijah',
        canonicalOrder: 11
      },
      {
        id: '2kings',
        name: '2 Kings',
        shortName: '2 Kgs',
        chapters: 25,
        section: 'historical',
        testament: 'old',
        author: 'Jeremiah',
        description: 'Continuation of the divided kingdom through the fall of Jerusalem',
        canonicalOrder: 12
      },
      {
        id: '1chronicles',
        name: '1 Chronicles',
        shortName: '1 Chr',
        chapters: 29,
        section: 'historical',
        testament: 'old',
        author: 'Ezra',
        description: 'Genealogies and the reign of King David (parallel account)',
        canonicalOrder: 13
      },
      {
        id: '2chronicles',
        name: '2 Chronicles',
        shortName: '2 Chr',
        chapters: 36,
        section: 'historical',
        testament: 'old',
        author: 'Ezra',
        description: 'Solomon\'s reign and the kings of Judah until the exile',
        canonicalOrder: 14
      },
      {
        id: 'ezra',
        name: 'Ezra',
        shortName: 'Ezra',
        chapters: 10,
        section: 'historical',
        testament: 'old',
        author: 'Ezra',
        description: 'Return from Babylonian exile and rebuilding the temple',
        canonicalOrder: 15
      },
      {
        id: 'nehemiah',
        name: 'Nehemiah',
        shortName: 'Neh',
        chapters: 13,
        section: 'historical',
        testament: 'old',
        author: 'Nehemiah',
        description: 'Rebuilding Jerusalem\'s walls and spiritual renewal',
        canonicalOrder: 16
      },
      {
        id: 'esther',
        name: 'Esther',
        shortName: 'Est',
        chapters: 10,
        section: 'historical',
        testament: 'old',
        author: 'Unknown',
        description: 'God\'s providence in protecting the Jews in Persia',
        canonicalOrder: 17
      }
    ]
  },
  {
    id: 'wisdom',
    name: 'Wisdom Literature',
    testament: 'old',
    description: 'Poetic books that focus on wisdom, worship, and practical living',
    order: 3,
    books: [
      {
        id: 'job',
        name: 'Job',
        shortName: 'Job',
        chapters: 42,
        section: 'wisdom',
        testament: 'old',
        author: 'Unknown',
        description: 'The problem of suffering and God\'s sovereignty',
        canonicalOrder: 18
      },
      {
        id: 'psalms',
        name: 'Psalms',
        shortName: 'Ps',
        chapters: 150,
        section: 'wisdom',
        testament: 'old',
        author: 'David and others',
        description: 'Collection of songs, prayers, and poetry used in worship',
        canonicalOrder: 19
      },
      {
        id: 'proverbs',
        name: 'Proverbs',
        shortName: 'Prov',
        chapters: 31,
        section: 'wisdom',
        testament: 'old',
        author: 'Solomon and others',
        description: 'Collection of wise sayings for godly living',
        canonicalOrder: 20
      },
      {
        id: 'ecclesiastes',
        name: 'Ecclesiastes',
        shortName: 'Eccl',
        chapters: 12,
        section: 'wisdom',
        testament: 'old',
        author: 'Solomon',
        description: 'Reflections on the meaning of life and the pursuit of wisdom',
        canonicalOrder: 21
      },
      {
        id: 'songofsolomon',
        name: 'Song of Solomon',
        shortName: 'Song',
        chapters: 8,
        section: 'wisdom',
        testament: 'old',
        author: 'Solomon',
        description: 'Poetic portrayal of love and marriage',
        canonicalOrder: 22
      }
    ]
  },
  {
    id: 'major-prophets',
    name: 'Major Prophets',
    testament: 'old',
    description: 'The longer prophetic books',
    order: 4,
    books: [
      {
        id: 'isaiah',
        name: 'Isaiah',
        shortName: 'Isa',
        chapters: 66,
        section: 'major-prophets',
        testament: 'old',
        author: 'Isaiah',
        description: 'Prophecies of judgment and hope, including many Messianic predictions',
        canonicalOrder: 23
      },
      {
        id: 'jeremiah',
        name: 'Jeremiah',
        shortName: 'Jer',
        chapters: 52,
        section: 'major-prophets',
        testament: 'old',
        author: 'Jeremiah',
        description: 'The "weeping prophet" who warned of Jerusalem\'s destruction',
        canonicalOrder: 24
      },
      {
        id: 'lamentations',
        name: 'Lamentations',
        shortName: 'Lam',
        chapters: 5,
        section: 'major-prophets',
        testament: 'old',
        author: 'Jeremiah',
        description: 'Mourning over the destruction of Jerusalem',
        canonicalOrder: 25
      },
      {
        id: 'ezekiel',
        name: 'Ezekiel',
        shortName: 'Ezek',
        chapters: 48,
        section: 'major-prophets',
        testament: 'old',
        author: 'Ezekiel',
        description: 'Visions and prophecies during the Babylonian exile',
        canonicalOrder: 26
      },
      {
        id: 'daniel',
        name: 'Daniel',
        shortName: 'Dan',
        chapters: 12,
        section: 'major-prophets',
        testament: 'old',
        author: 'Daniel',
        description: 'Daniel\'s experiences in Babylon and apocalyptic visions',
        canonicalOrder: 27
      }
    ]
  },
  {
    id: 'minor-prophets',
    name: 'Minor Prophets',
    testament: 'old',
    description: 'The shorter prophetic books, also known as "The Twelve"',
    order: 5,
    books: [
      {
        id: 'hosea',
        name: 'Hosea',
        shortName: 'Hos',
        chapters: 14,
        section: 'minor-prophets',
        testament: 'old',
        author: 'Hosea',
        description: 'God\'s faithful love despite Israel\'s unfaithfulness',
        canonicalOrder: 28
      },
      {
        id: 'joel',
        name: 'Joel',
        shortName: 'Joel',
        chapters: 3,
        section: 'minor-prophets',
        testament: 'old',
        author: 'Joel',
        description: 'The day of the Lord and a call to repentance',
        canonicalOrder: 29
      },
      {
        id: 'amos',
        name: 'Amos',
        shortName: 'Amos',
        chapters: 9,
        section: 'minor-prophets',
        testament: 'old',
        author: 'Amos',
        description: 'Social justice and judgment on Israel and surrounding nations',
        canonicalOrder: 30
      },
      {
        id: 'obadiah',
        name: 'Obadiah',
        shortName: 'Obad',
        chapters: 1,
        section: 'minor-prophets',
        testament: 'old',
        author: 'Obadiah',
        description: 'Judgment against Edom for their treatment of Israel',
        canonicalOrder: 31
      },
      {
        id: 'jonah',
        name: 'Jonah',
        shortName: 'Jonah',
        chapters: 4,
        section: 'minor-prophets',
        testament: 'old',
        author: 'Jonah',
        description: 'God\'s mercy extends to all nations, even Israel\'s enemies',
        canonicalOrder: 32
      },
      {
        id: 'micah',
        name: 'Micah',
        shortName: 'Mic',
        chapters: 7,
        section: 'minor-prophets',
        testament: 'old',
        author: 'Micah',
        description: 'Judgment, restoration, and the birth of the Messiah in Bethlehem',
        canonicalOrder: 33
      },
      {
        id: 'nahum',
        name: 'Nahum',
        shortName: 'Nah',
        chapters: 3,
        section: 'minor-prophets',
        testament: 'old',
        author: 'Nahum',
        description: 'Prophecy of the destruction of Nineveh',
        canonicalOrder: 34
      },
      {
        id: 'habakkuk',
        name: 'Habakkuk',
        shortName: 'Hab',
        chapters: 3,
        section: 'minor-prophets',
        testament: 'old',
        author: 'Habakkuk',
        description: 'Wrestling with God\'s use of a wicked nation to judge Israel',
        canonicalOrder: 35
      },
      {
        id: 'zephaniah',
        name: 'Zephaniah',
        shortName: 'Zeph',
        chapters: 3,
        section: 'minor-prophets',
        testament: 'old',
        author: 'Zephaniah',
        description: 'The coming day of the Lord and hope for the remnant',
        canonicalOrder: 36
      },
      {
        id: 'haggai',
        name: 'Haggai',
        shortName: 'Hag',
        chapters: 2,
        section: 'minor-prophets',
        testament: 'old',
        author: 'Haggai',
        description: 'Call to rebuild the temple after returning from exile',
        canonicalOrder: 37
      },
      {
        id: 'zechariah',
        name: 'Zechariah',
        shortName: 'Zech',
        chapters: 14,
        section: 'minor-prophets',
        testament: 'old',
        author: 'Zechariah',
        description: 'Apocalyptic visions and Messianic prophecies',
        canonicalOrder: 38
      },
      {
        id: 'malachi',
        name: 'Malachi',
        shortName: 'Mal',
        chapters: 4,
        section: 'minor-prophets',
        testament: 'old',
        author: 'Malachi',
        description: 'Final Old Testament prophet addressing unfaithfulness and coming judgment',
        canonicalOrder: 39
      }
    ]
  }
];

const newTestamentSections: BibleSection[] = [
  {
    id: 'gospels',
    name: 'Gospels',
    testament: 'new',
    description: 'Accounts of the life, ministry, death, and resurrection of Jesus Christ',
    order: 6,
    books: [
      {
        id: 'matthew',
        name: 'Matthew',
        shortName: 'Matt',
        chapters: 28,
        section: 'gospels',
        testament: 'new',
        author: 'Matthew',
        description: 'Jesus as the promised Messiah and King, fulfilling Old Testament prophecy',
        canonicalOrder: 40
      },
      {
        id: 'mark',
        name: 'Mark',
        shortName: 'Mark',
        chapters: 16,
        section: 'gospels',
        testament: 'new',
        author: 'Mark',
        description: 'Fast-paced account of Jesus as the servant and Son of God',
        canonicalOrder: 41
      },
      {
        id: 'luke',
        name: 'Luke',
        shortName: 'Luke',
        chapters: 24,
        section: 'gospels',
        testament: 'new',
        author: 'Luke',
        description: 'Detailed account of Jesus\' life emphasizing his humanity and compassion',
        canonicalOrder: 42
      },
      {
        id: 'john',
        name: 'John',
        shortName: 'John',
        chapters: 21,
        section: 'gospels',
        testament: 'new',
        author: 'John',
        description: 'Theological account emphasizing Jesus\' deity and mission',
        canonicalOrder: 43
      },
      {
        id: 'acts',
        name: 'Acts',
        shortName: 'Acts',
        chapters: 28,
        section: 'gospels',
        testament: 'new',
        author: 'Luke',
        description: 'The early church and the spread of the gospel from Jerusalem to Rome',
        canonicalOrder: 44
      }
    ]
  },
  {
    id: 'pauline-epistles',
    name: 'Pauline Epistles',
    testament: 'new',
    description: 'Letters written by the Apostle Paul to churches and individuals',
    order: 7,
    books: [
      {
        id: 'romans',
        name: 'Romans',
        shortName: 'Rom',
        chapters: 16,
        section: 'pauline-epistles',
        testament: 'new',
        author: 'Paul',
        description: 'Systematic explanation of the gospel and its implications',
        canonicalOrder: 45
      },
      {
        id: '1corinthians',
        name: '1 Corinthians',
        shortName: '1 Cor',
        chapters: 16,
        section: 'pauline-epistles',
        testament: 'new',
        author: 'Paul',
        description: 'Addressing problems in the Corinthian church: unity, immorality, worship',
        canonicalOrder: 46
      },
      {
        id: '2corinthians',
        name: '2 Corinthians',
        shortName: '2 Cor',
        chapters: 13,
        section: 'pauline-epistles',
        testament: 'new',
        author: 'Paul',
        description: 'Paul\'s defense of his ministry and the gospel',
        canonicalOrder: 47
      },
      {
        id: 'galatians',
        name: 'Galatians',
        shortName: 'Gal',
        chapters: 6,
        section: 'pauline-epistles',
        testament: 'new',
        author: 'Paul',
        description: 'Freedom in Christ versus legalism and human tradition',
        canonicalOrder: 48
      },
      {
        id: 'ephesians',
        name: 'Ephesians',
        shortName: 'Eph',
        chapters: 6,
        section: 'pauline-epistles',
        testament: 'new',
        author: 'Paul',
        description: 'Unity of believers in Christ and the mystery of the church',
        canonicalOrder: 49
      },
      {
        id: 'philippians',
        name: 'Philippians',
        shortName: 'Phil',
        chapters: 4,
        section: 'pauline-epistles',
        testament: 'new',
        author: 'Paul',
        description: 'Joy and partnership in the gospel, despite suffering',
        canonicalOrder: 50
      },
      {
        id: 'colossians',
        name: 'Colossians',
        shortName: 'Col',
        chapters: 4,
        section: 'pauline-epistles',
        testament: 'new',
        author: 'Paul',
        description: 'The supremacy of Christ over false teachings',
        canonicalOrder: 51
      },
      {
        id: '1thessalonians',
        name: '1 Thessalonians',
        shortName: '1 Thess',
        chapters: 5,
        section: 'pauline-epistles',
        testament: 'new',
        author: 'Paul',
        description: 'Encouragement in persecution and teaching about Christ\'s return',
        canonicalOrder: 52
      },
      {
        id: '2thessalonians',
        name: '2 Thessalonians',
        shortName: '2 Thess',
        chapters: 3,
        section: 'pauline-epistles',
        testament: 'new',
        author: 'Paul',
        description: 'Further teaching on the end times and warning against idleness',
        canonicalOrder: 53
      },
      {
        id: '1timothy',
        name: '1 Timothy',
        shortName: '1 Tim',
        chapters: 6,
        section: 'pauline-epistles',
        testament: 'new',
        author: 'Paul',
        description: 'Instructions for church leadership and sound doctrine',
        canonicalOrder: 54
      },
      {
        id: '2timothy',
        name: '2 Timothy',
        shortName: '2 Tim',
        chapters: 4,
        section: 'pauline-epistles',
        testament: 'new',
        author: 'Paul',
        description: 'Paul\'s final letter, encouraging faithfulness to the gospel',
        canonicalOrder: 55
      },
      {
        id: 'titus',
        name: 'Titus',
        shortName: 'Titus',
        chapters: 3,
        section: 'pauline-epistles',
        testament: 'new',
        author: 'Paul',
        description: 'Instructions for establishing order and leadership in the Cretan churches',
        canonicalOrder: 56
      },
      {
        id: 'philemon',
        name: 'Philemon',
        shortName: 'Phlm',
        chapters: 1,
        section: 'pauline-epistles',
        testament: 'new',
        author: 'Paul',
        description: 'Appeal for reconciliation between a master and his runaway slave',
        canonicalOrder: 57
      }
    ]
  },
  {
    id: 'general-epistles',
    name: 'General Epistles',
    testament: 'new',
    description: 'Letters written by other apostles to various churches and believers',
    order: 8,
    books: [
      {
        id: 'hebrews',
        name: 'Hebrews',
        shortName: 'Heb',
        chapters: 13,
        section: 'general-epistles',
        testament: 'new',
        author: 'Unknown',
        description: 'The superiority of Christ over the Old Testament system',
        canonicalOrder: 58
      },
      {
        id: 'james',
        name: 'James',
        shortName: 'Jas',
        chapters: 5,
        section: 'general-epistles',
        testament: 'new',
        author: 'James',
        description: 'Practical instruction on living out the Christian faith',
        canonicalOrder: 59
      },
      {
        id: '1peter',
        name: '1 Peter',
        shortName: '1 Pet',
        chapters: 5,
        section: 'general-epistles',
        testament: 'new',
        author: 'Peter',
        description: 'Encouragement for believers suffering persecution',
        canonicalOrder: 60
      },
      {
        id: '2peter',
        name: '2 Peter',
        shortName: '2 Pet',
        chapters: 3,
        section: 'general-epistles',
        testament: 'new',
        author: 'Peter',
        description: 'Warning against false teachers and encouragement to grow in grace',
        canonicalOrder: 61
      },
      {
        id: '1john',
        name: '1 John',
        shortName: '1 John',
        chapters: 5,
        section: 'general-epistles',
        testament: 'new',
        author: 'John',
        description: 'Tests of genuine faith and assurance of salvation',
        canonicalOrder: 62
      },
      {
        id: '2john',
        name: '2 John',
        shortName: '2 John',
        chapters: 1,
        section: 'general-epistles',
        testament: 'new',
        author: 'John',
        description: 'Warning about false teachers and walking in truth',
        canonicalOrder: 63
      },
      {
        id: '3john',
        name: '3 John',
        shortName: '3 John',
        chapters: 1,
        section: 'general-epistles',
        testament: 'new',
        author: 'John',
        description: 'Encouragement of hospitality and warning against a divisive church leader',
        canonicalOrder: 64
      },
      {
        id: 'jude',
        name: 'Jude',
        shortName: 'Jude',
        chapters: 1,
        section: 'general-epistles',
        testament: 'new',
        author: 'Jude',
        description: 'Warning against false teachers and apostasy',
        canonicalOrder: 65
      }
    ]
  },
  {
    id: 'apocalyptic',
    name: 'Apocalyptic',
    testament: 'new',
    description: 'Prophetic visions of the end times',
    order: 9,
    books: [
      {
        id: 'revelation',
        name: 'Revelation',
        shortName: 'Rev',
        chapters: 22,
        section: 'apocalyptic',
        testament: 'new',
        author: 'John',
        description: 'Vision of the glorified Christ and prophecies of the end times',
        canonicalOrder: 66
      }
    ]
  }
];

// Combine all sections
const allSections: BibleSection[] = [...oldTestamentSections, ...newTestamentSections];

// Create a lookup for quick access to books by ID
const bookLookup: Record<string, BibleBook> = {};
allSections.forEach(section => {
  section.books.forEach(book => {
    bookLookup[book.id] = book;
  });
});

// Create and export the Bible structure
export const bibleStructure: BibleStructure = {
  sections: allSections,
  books: bookLookup
};

/**
 * Get a book by its ID
 */
export function getBookById(bookId: string): BibleBook | undefined {
  return bibleStructure.books[bookId.toLowerCase()];
}

/**
 * Get all books in the Bible
 */
export function getAllBooks(): BibleBook[] {
  return Object.values(bibleStructure.books).sort((a, b) => a.canonicalOrder - b.canonicalOrder);
}

/**
 * Get a section by its ID
 */
export function getSectionById(sectionId: string): BibleSection | undefined {
  return bibleStructure.sections.find(section => section.id === sectionId);
}

/**
 * Get all books in a specific section
 */
export function getBooksBySection(sectionId: string): BibleBook[] {
  const section = getSectionById(sectionId);
  return section ? section.books : [];
}

/**
 * Get all books in a specific testament
 */
export function getBooksByTestament(testament: 'old' | 'new'): BibleBook[] {
  return Object.values(bibleStructure.books)
    .filter(book => book.testament === testament)
    .sort((a, b) => a.canonicalOrder - b.canonicalOrder);
}

/**
 * Get all sections in a specific testament
 */
export function getSectionsByTestament(testament: 'old' | 'new'): BibleSection[] {
  return bibleStructure.sections
    .filter(section => section.testament === testament)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get a book's reference from book name, chapter and verse
 */
export function getReference(bookId: string, chapter: number, verse?: number): string {
  const book = getBookById(bookId);
  if (!book) return '';
  
  if (verse) {
    return `${book.name} ${chapter}:${verse}`;
  }
  return `${book.name} ${chapter}`;
}

/**
 * Navigate to the previous chapter
 */
export function getPrevChapter(bookId: string, chapter: number): { book: string; chapter: number } | null {
  const book = getBookById(bookId);
  if (!book) return null;
  
  // If we're not at the first chapter, simply go to the previous chapter
  if (chapter > 1) {
    return { book: bookId, chapter: chapter - 1 };
  }
  
  // If we're at the first chapter, go to the previous book
  const allBooks = getAllBooks();
  const currentIndex = allBooks.findIndex(b => b.id === bookId);
  
  if (currentIndex <= 0) {
    // We're at the first book, there is no previous chapter
    return null;
  }
  
  const prevBook = allBooks[currentIndex - 1];
  return { book: prevBook.id, chapter: prevBook.chapters };
}

/**
 * Navigate to the next chapter
 */
export function getNextChapter(bookId: string, chapter: number): { book: string; chapter: number } | null {
  const book = getBookById(bookId);
  if (!book) return null;
  
  // If we're not at the last chapter, simply go to the next chapter
  if (chapter < book.chapters) {
    return { book: bookId, chapter: chapter + 1 };
  }
  
  // If we're at the last chapter, go to the next book
  const allBooks = getAllBooks();
  const currentIndex = allBooks.findIndex(b => b.id === bookId);
  
  if (currentIndex >= allBooks.length - 1) {
    // We're at the last book, there is no next chapter
    return null;
  }
  
  const nextBook = allBooks[currentIndex + 1];
  return { book: nextBook.id, chapter: 1 };
}

export default bibleStructure;
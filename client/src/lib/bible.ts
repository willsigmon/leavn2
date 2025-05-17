export const bibleData = {
  books: [
    // Old Testament
    {
      id: "genesis",
      title: "Genesis",
      chapters: 50,
      testament: "old"
    },
    {
      id: "exodus",
      title: "Exodus",
      chapters: 40,
      testament: "old"
    },
    {
      id: "psalms",
      title: "Psalms",
      chapters: 150,
      testament: "old"
    },
    {
      id: "proverbs",
      title: "Proverbs",
      chapters: 31,
      testament: "old"
    },
    // New Testament
    {
      id: "matthew",
      title: "Matthew",
      chapters: 28,
      testament: "new"
    },
    {
      id: "mark",
      title: "Mark",
      chapters: 16,
      testament: "new"
    },
    {
      id: "luke",
      title: "Luke",
      chapters: 24,
      testament: "new"
    },
    {
      id: "john",
      title: "John",
      chapters: 21,
      testament: "new"
    },
    // Non-Canonical Books
    // Apocrypha/Deuterocanonical Books
    {
      id: "tobit",
      title: "Tobit",
      chapters: 14,
      testament: "apocrypha"
    },
    {
      id: "judith",
      title: "Judith",
      chapters: 16,
      testament: "apocrypha"
    },
    {
      id: "wisdom",
      title: "Wisdom of Solomon",
      chapters: 19,
      testament: "apocrypha"
    },
    {
      id: "sirach",
      title: "Sirach (Ecclesiasticus)",
      chapters: 51,
      testament: "apocrypha"
    },
    {
      id: "baruch",
      title: "Baruch",
      chapters: 6,
      testament: "apocrypha"
    },
    {
      id: "1maccabees",
      title: "1 Maccabees",
      chapters: 16,
      testament: "apocrypha"
    },
    {
      id: "2maccabees",
      title: "2 Maccabees",
      chapters: 15,
      testament: "apocrypha"
    },
    // Pseudepigrapha Books
    {
      id: "enoch",
      title: "Book of Enoch",
      chapters: 108,
      testament: "pseudepigrapha"
    },
    {
      id: "jubilees",
      title: "Book of Jubilees",
      chapters: 50,
      testament: "pseudepigrapha"
    },
    {
      id: "jasher",
      title: "Book of Jasher",
      chapters: 91,
      testament: "pseudepigrapha"
    },
    {
      id: "4ezra",
      title: "4 Ezra (2 Esdras)",
      chapters: 16,
      testament: "pseudepigrapha"
    },
    {
      id: "apocalypseabraham",
      title: "Apocalypse of Abraham",
      chapters: 32,
      testament: "pseudepigrapha"
    },
    {
      id: "testamenttwelve",
      title: "Testaments of the Twelve Patriarchs",
      chapters: 12,
      testament: "pseudepigrapha"
    },
    {
      id: "3baruch",
      title: "3 Baruch",
      chapters: 17,
      testament: "pseudepigrapha"
    }
  ],
  
  getBookInfo(bookId: string) {
    return this.books.find(book => book.id === bookId.toLowerCase());
  },
  
  getChapterCount(bookId: string) {
    const book = this.getBookInfo(bookId);
    return book ? book.chapters : 0;
  },
  
  isValidReference(bookId: string, chapter: number) {
    const book = this.getBookInfo(bookId);
    if (!book) return false;
    return chapter >= 1 && chapter <= book.chapters;
  }
};

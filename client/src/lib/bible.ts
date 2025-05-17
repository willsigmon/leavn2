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

export type LendingBook = {
    _id: string;        // Book ID (matches booksData _id)
    bookTitle: string;  // Title of the book
};

export type Lending = {
    _id: string;             // Lending record ID
    readerId: string;       // Reader ID
    readerName: string;     // Reader name
    books: LendingBook[];   // Array of books lent
    borrowDate: string;     // Date borrowed (ISO string)
    dueDate: string;        // Due date for return
    returnDate?: string;    // Optional: return date (ISO string)
    status: "borrowed" | "returned"; // Lending status
};

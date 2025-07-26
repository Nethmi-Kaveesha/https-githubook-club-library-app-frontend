export type Book = {
    _id: string;         // MongoDB document ID
    bookId: string;      // Custom book identifier
    title: string;
    author: string;
    category?: string;
    isbn?: string;
    publisher?: string;
    publishYear?: number;
    description?: string;
    price: number;
    quantity: number;
    copiesAvailable: number;
    available?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type BookFormData = {
    bookId?: string;  // optional because backend generates it
    title: string;
    author: string;
    category?: string;
    isbn?: string;
    publisher?: string;
    publishYear?: number;
    description?: string;
    price: number;
    quantity: number;
    copiesAvailable: number;
    available?: boolean;
};

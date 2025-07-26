// /src/types/overdue.types.ts

export interface Reader {
    readerId: string;
    readerName: string;
}

export interface OverdueBook {
    bookTitle: string;
    dueDate: string;
}

import { useEffect, useState } from "react";
import type {OverdueBook} from "../../types/overdue";

interface Props {
    readerId: string | null;
    readerName: string;
}

const OverdueBooks: React.FC<Props> = ({ readerId, readerName }) => {
    const [books, setBooks] = useState<OverdueBook[]>([]);

    useEffect(() => {
        if (readerId) {
            fetch(`/api/overdue/books/${readerId}`)
                .then((res) => res.json())
                .then((data) => setBooks(data))
                .catch(() => alert("Failed to load overdue books."));
        }
    }, [readerId]);

    if (!readerId) {
        return (
            <div className="w-full lg:w-2/3 bg-white shadow rounded p-4 m-2">
                <p>Select a reader to view their overdue books.</p>
            </div>
        );
    }

    return (
        <div className="w-full lg:w-2/3 bg-white shadow rounded p-4 m-2">
            <h2 className="text-xl font-bold mb-4">
                Overdue Books for {readerName}
            </h2>
            {books.length === 0 ? (
                <p>No overdue books found.</p>
            ) : (
                <ul className="space-y-2">
                    {books.map((book, index) => (
                        <li key={index} className="p-2 bg-gray-100 rounded">
                            <strong>{book.bookTitle}</strong> – Due:{" "}
                            {new Date(book.dueDate).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OverdueBooks;

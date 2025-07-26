import React, { useState, useEffect, forwardRef, type ForwardedRef } from "react";
import { MdDelete } from "react-icons/md";
import type { Lending, LendingBook } from "../../types/Lending";
import type { Reader } from "../../types/Reader";
import type { Book } from "../../types/Book";

interface LendingFormProps {
    lending?: Lending | null;
    readers: Reader[];
    books: Book[];
    onSubmit: (
        lendingData: {
            readerId: string;
            readerName: string;
            books: LendingBook[];
            status: "borrowed" | "returned";
            _id: string;
        }
    ) => void;
}

interface FormErrors {
    reader?: string;
    books?: string;
}

const LendingForm = forwardRef<HTMLFormElement, LendingFormProps>(
    ({ lending, readers, books, onSubmit }, ref: ForwardedRef<HTMLFormElement>) => {
        const [selectedReaderId, setSelectedReaderId] = useState<string>("");
        const [lendingBooks, setLendingBooks] = useState<Book[]>([]);
        const [errors, setErrors] = useState<FormErrors>({});
        const [status, setStatus] = useState<Lending["status"]>("borrowed");

        useEffect(() => {
            // DEBUG: Log readers on each update
            console.log("LendingForm readers:", readers);

            if (lending) {
                setSelectedReaderId(lending.readerId);
                const mappedBooks: Book[] = lending.books.map((lb) => {
                    const fullBook = books.find((b) => b._id === lb._id) || null;
                    return (
                        fullBook || {
                            _id: lb._id,
                            title: lb.bookTitle,
                            author: "",
                            price: 0,
                            quantity: 1,
                            copiesAvailable: 0,
                            available: false,
                        }
                    );
                });
                setLendingBooks(mappedBooks);
                setStatus(lending.status);
            } else {
                setSelectedReaderId("");
                setLendingBooks([]);
                setStatus("borrowed");
            }
            setErrors({});
        }, [lending, books, readers]);

        const addBook = (book: Book) => {
            if (lendingBooks.find((b) => b._id === book._id)) return;
            setLendingBooks((prev) => [...prev, book]);
        };

        const removeBook = (_id: string) => {
            setLendingBooks((prev) => prev.filter((b) => b._id !== _id));
        };

        const validateForm = (): boolean => {
            const newErrors: FormErrors = {};
            if (!selectedReaderId) {
                newErrors.reader = "Please select a reader";
            }
            if (lendingBooks.length === 0) {
                newErrors.books = "Please add at least one book to lend";
            }
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (!validateForm()) return;

            const selectedReader = readers.find((r) => r._id === selectedReaderId);
            if (!selectedReader) return;

            const booksForLending: LendingBook[] = lendingBooks.map((book) => ({
                _id: book._id.toString(),
                bookTitle: book.title,
            }));

            onSubmit({
                readerId: selectedReaderId,
                readerName: selectedReader.name,
                books: booksForLending,
                status,
                _id: lending?._id || "",
            });
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-6" ref={ref} noValidate>
                {/* Reader select */}
                <div>
                    <label
                        htmlFor="reader"
                        className="block text-sm font-medium text-teal-400 mb-1"
                    >
                        Reader
                    </label>
                    <select
                        id="reader"
                        value={selectedReaderId}
                        onChange={(e) => {
                            setSelectedReaderId(e.target.value);
                            if (errors.reader)
                                setErrors((prev) => ({ ...prev, reader: undefined }));
                        }}
                        className={`w-full px-3 py-2 bg-black text-teal-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                            errors.reader ? "border-red-600" : "border-teal-700"
                        }`}
                    >
                        <option value="">Select a reader</option>
                        {readers.length === 0 ? (
                            <option disabled>Loading readers...</option>
                        ) : (
                            readers.map((reader) => (
                                <option key={reader._id} value={reader._id}>
                                    {reader.name} - {reader.email}
                                </option>
                            ))
                        )}
                    </select>
                    {errors.reader && (
                        <p className="mt-1 text-sm text-red-600">{errors.reader}</p>
                    )}
                </div>

                {/* Status select (only when editing) */}
                {lending && (
                    <div>
                        <label
                            htmlFor="status"
                            className="block text-sm font-medium text-teal-400 mb-1"
                        >
                            Status
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as Lending["status"])}
                            className="w-full px-3 py-2 bg-black text-teal-300 border border-teal-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="borrowed">Borrowed</option>
                            <option value="returned">Returned</option>
                        </select>
                    </div>
                )}

                {/* Available Books */}
                <div>
                    <h3 className="text-lg font-medium text-teal-400 mb-3">
                        Available Books
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-teal-700 rounded-md p-3 bg-black">
                        {books.map((book) => {
                            const isSelected = lendingBooks.some((b) => b._id === book._id);
                            const isDisabled = isSelected;

                            const baseClasses =
                                "flex justify-between items-center p-2 border rounded";
                            const disabledClasses =
                                "bg-gray-800 cursor-not-allowed text-gray-500 border-gray-700";
                            const enabledClasses =
                                "border-teal-700 hover:bg-teal-900 cursor-pointer text-teal-300";

                            return (
                                <button
                                    key={book._id}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => addBook(book)}
                                    aria-disabled={isDisabled}
                                    title={
                                        isDisabled
                                            ? "Book already selected"
                                            : "Add book to lending"
                                    }
                                    className={`${baseClasses} ${
                                        isDisabled ? disabledClasses : enabledClasses
                                    }`}
                                >
                                    <span className="text-sm">{book.title}</span>
                                    <span className="text-sm font-semibold">
                                        ${book.price.toFixed(2)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Books */}
                <div>
                    <h3 className="text-lg font-medium text-teal-400 mb-3">Lending Books</h3>
                    {lendingBooks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 border border-teal-700 rounded-md bg-black">
                            No books selected. Click above to add books.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {lendingBooks.map((book) => (
                                <div
                                    key={book._id}
                                    className="flex items-center justify-between p-3 border border-teal-700 rounded-md bg-black"
                                >
                                    <span className="font-medium text-teal-300">{book.title}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeBook(book._id)}
                                        className="p-1 text-red-500 hover:text-red-700"
                                        title="Remove book"
                                    >
                                        <MdDelete className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {errors.books && (
                        <p className="mt-1 text-sm text-red-600">{errors.books}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150"
                    >
                        {lending ? "Update Lending" : "Create Lending"}
                    </button>
                </div>
            </form>
        );
    }
);

export default LendingForm;

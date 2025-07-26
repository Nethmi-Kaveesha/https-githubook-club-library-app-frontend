import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import type { Book } from "../../types/Book";

interface BooksTableProps {
    books: Book[];
    onEdit: (book: Book) => void;
    onDelete: (book: Book) => void;
}

const BooksTable: React.FC<BooksTableProps> = ({ books, onEdit, onDelete }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };

    const renderStockBadge = (quantity?: number) => {
        if (quantity === undefined)
            return <span className="text-teal-400">-</span>;
        if (quantity === 0)
            return (
                <span className="px-2 py-1 bg-rose-800 text-rose-100 rounded-full text-xs font-semibold">
                    Out of Stock
                </span>
            );
        if (quantity <= 3)
            return (
                <span className="px-2 py-1 bg-amber-600 text-amber-100 rounded-full text-xs font-semibold">
                    Low Stock
                </span>
            );
        return (
            <span className="px-2 py-1 bg-teal-700 text-teal-100 rounded-full text-xs font-semibold">
                In Stock
            </span>
        );
    };

    return (
        <div className="bg-[#0f172a] shadow-md rounded-lg overflow-auto">
            <table className="min-w-full divide-y divide-teal-800">
                <thead className="bg-[#1e293b]">
                <tr>
                    {[
                        "ID",
                        "Title",
                        "Author",
                        "Category",
                        "ISBN",
                        "Publisher",
                        "Year",
                        "Price",
                        "Quantity",
                        "Availability",
                        "Actions",
                    ].map((header) => (
                        <th
                            key={header}
                            className="px-4 py-2 text-xs font-medium text-teal-400 uppercase"
                        >
                            {header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="bg-[#0f172a] divide-y divide-teal-800">
                {books.length === 0 ? (
                    <tr>
                        <td
                            colSpan={11}
                            className="px-6 py-4 text-center text-teal-500"
                        >
                            No books found
                        </td>
                    </tr>
                ) : (
                    books.map((book) => (
                        <tr
                            key={book.bookId || book._id || book.title}
                            className={`hover:bg-[#1f2937] ${
                                book.quantity === 0
                                    ? "bg-rose-900"
                                    : ""
                            }`}
                        >
                            <td className="px-4 py-2 text-sm text-teal-300">
                                {book.bookId ?? (
                                    <span className="text-teal-600">-</span>
                                )}
                            </td>
                            <td className="px-4 py-2 text-sm text-teal-100">
                                {book.title || (
                                    <span className="text-teal-600">-</span>
                                )}
                            </td>
                            <td className="px-4 py-2 text-sm text-teal-100">
                                {book.author || (
                                    <span className="text-teal-600">-</span>
                                )}
                            </td>
                            <td className="px-4 py-2 text-sm text-teal-100">
                                {book.category || (
                                    <span className="text-teal-600">-</span>
                                )}
                            </td>
                            <td className="px-4 py-2 text-sm text-teal-100">
                                {book.isbn || (
                                    <span className="text-teal-600">-</span>
                                )}
                            </td>
                            <td className="px-4 py-2 text-sm text-teal-100">
                                {book.publisher || (
                                    <span className="text-teal-600">-</span>
                                )}
                            </td>
                            <td className="px-4 py-2 text-sm text-teal-100">
                                {book.publishYear || (
                                    <span className="text-teal-600">-</span>
                                )}
                            </td>
                            <td className="px-4 py-2 text-sm font-semibold text-teal-200">
                                {typeof book.price === "number"
                                    ? formatPrice(book.price)
                                    : <span className="text-teal-600">-</span>}
                            </td>
                            <td className="px-4 py-2 text-sm text-center text-teal-200">
                                {book.quantity ?? (
                                    <span className="text-teal-600">-</span>
                                )}
                            </td>
                            <td className="px-4 py-2 text-sm text-center">
                                {renderStockBadge(book.quantity)}
                            </td>
                            <td className="px-4 py-2 text-sm">
                                <div className="flex space-x-2 justify-center">
                                    <button
                                        onClick={() => onEdit(book)}
                                        className="text-teal-400 hover:text-teal-300 focus:ring-2 focus:ring-teal-500 rounded p-1 hover:bg-teal-800 transition"
                                        title="Edit book"
                                        tabIndex={0}
                                        aria-label={`Edit book ${book.title}`}
                                    >
                                        <MdEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(book)}
                                        className="text-rose-400 hover:text-rose-300 focus:ring-2 focus:ring-rose-500 rounded p-1 hover:bg-rose-900 transition"
                                        title="Delete book"
                                        tabIndex={0}
                                        aria-label={`Delete book ${book.title}`}
                                    >
                                        <MdDelete className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default BooksTable;

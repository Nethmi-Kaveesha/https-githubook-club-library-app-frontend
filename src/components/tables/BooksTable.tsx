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
        if (quantity === undefined) return <span className="text-teal-400">-</span>;
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
        <div className="bg-[#0f172a] shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-teal-800">
                <thead className="bg-[#1e293b]">
                <tr>
                    {/* Hide less important columns on small screens with responsive classes */}
                    <th className="px-2 py-2 text-xs font-medium text-teal-400 uppercase whitespace-nowrap">
                        ID
                    </th>
                    <th className="px-2 py-2 text-xs font-medium text-teal-400 uppercase whitespace-nowrap min-w-[120px]">
                        Title
                    </th>
                    <th className="hidden sm:table-cell px-2 py-2 text-xs font-medium text-teal-400 uppercase whitespace-nowrap min-w-[100px]">
                        Author
                    </th>
                    <th className="hidden md:table-cell px-2 py-2 text-xs font-medium text-teal-400 uppercase whitespace-nowrap min-w-[100px]">
                        Category
                    </th>
                    <th className="hidden lg:table-cell px-2 py-2 text-xs font-medium text-teal-400 uppercase whitespace-nowrap min-w-[100px]">
                        ISBN
                    </th>
                    <th className="hidden xl:table-cell px-2 py-2 text-xs font-medium text-teal-400 uppercase whitespace-nowrap min-w-[120px]">
                        Publisher
                    </th>
                    <th className="hidden xl:table-cell px-2 py-2 text-xs font-medium text-teal-400 uppercase whitespace-nowrap min-w-[80px]">
                        Year
                    </th>
                    <th className="px-2 py-2 text-xs font-medium text-teal-400 uppercase whitespace-nowrap min-w-[70px] text-right">
                        Price
                    </th>
                    <th className="px-2 py-2 text-xs font-medium text-teal-400 uppercase whitespace-nowrap min-w-[60px] text-center">
                        Qty
                    </th>
                    <th className="hidden sm:table-cell px-2 py-2 text-xs font-medium text-teal-400 uppercase whitespace-nowrap min-w-[90px] text-center">
                        Availability
                    </th>
                    <th className="px-2 py-2 text-xs font-medium text-teal-400 uppercase whitespace-nowrap text-center min-w-[80px]">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-[#0f172a] divide-y divide-teal-800">
                {books.length === 0 ? (
                    <tr>
                        <td colSpan={11} className="px-6 py-4 text-center text-teal-500">
                            No books found
                        </td>
                    </tr>
                ) : (
                    books.map((book) => (
                        <tr
                            key={book.bookId || book._id || book.title}
                            className={`hover:bg-[#1f2937] ${book.quantity === 0 ? "bg-rose-900" : ""}`}
                        >
                            <td className="px-2 py-2 text-xs sm:text-sm text-teal-300 whitespace-nowrap">
                                {book.bookId ?? <span className="text-teal-600">-</span>}
                            </td>
                            <td className="px-2 py-2 text-xs sm:text-sm text-teal-100 whitespace-nowrap min-w-[120px]">
                                {book.title || <span className="text-teal-600">-</span>}
                            </td>
                            <td className="hidden sm:table-cell px-2 py-2 text-xs sm:text-sm text-teal-100 whitespace-nowrap min-w-[100px]">
                                {book.author || <span className="text-teal-600">-</span>}
                            </td>
                            <td className="hidden md:table-cell px-2 py-2 text-xs sm:text-sm text-teal-100 whitespace-nowrap min-w-[100px]">
                                {book.category || <span className="text-teal-600">-</span>}
                            </td>
                            <td className="hidden lg:table-cell px-2 py-2 text-xs sm:text-sm text-teal-100 whitespace-nowrap min-w-[100px]">
                                {book.isbn || <span className="text-teal-600">-</span>}
                            </td>
                            <td className="hidden xl:table-cell px-2 py-2 text-xs sm:text-sm text-teal-100 whitespace-nowrap min-w-[120px]">
                                {book.publisher || <span className="text-teal-600">-</span>}
                            </td>
                            <td className="hidden xl:table-cell px-2 py-2 text-xs sm:text-sm text-teal-100 whitespace-nowrap min-w-[80px] text-center">
                                {book.publishYear || <span className="text-teal-600">-</span>}
                            </td>
                            <td className="px-2 py-2 text-xs sm:text-sm font-semibold text-teal-200 whitespace-nowrap text-right min-w-[70px]">
                                {typeof book.price === "number" ? formatPrice(book.price) : <span className="text-teal-600">-</span>}
                            </td>
                            <td className="px-2 py-2 text-xs sm:text-sm text-center text-teal-200 whitespace-nowrap min-w-[60px]">
                                {book.quantity ?? <span className="text-teal-600">-</span>}
                            </td>
                            <td className="hidden sm:table-cell px-2 py-2 text-xs sm:text-sm text-center whitespace-nowrap min-w-[90px]">
                                {renderStockBadge(book.quantity)}
                            </td>
                            <td className="px-2 py-2 text-xs sm:text-sm text-center whitespace-nowrap min-w-[80px]">
                                <div className="flex space-x-1 justify-center">
                                    <button
                                        onClick={() => onEdit(book)}
                                        className="text-teal-400 hover:text-teal-300 focus:ring-2 focus:ring-teal-500 rounded p-1 hover:bg-teal-800 transition"
                                        title="Edit book"
                                        tabIndex={0}
                                        aria-label={`Edit book ${book.title}`}
                                    >
                                        <MdEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(book)}
                                        className="text-rose-400 hover:text-rose-300 focus:ring-2 focus:ring-rose-500 rounded p-1 hover:bg-rose-900 transition"
                                        title="Delete book"
                                        tabIndex={0}
                                        aria-label={`Delete book ${book.title}`}
                                    >
                                        <MdDelete className="w-4 h-4 sm:w-5 sm:h-5" />
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

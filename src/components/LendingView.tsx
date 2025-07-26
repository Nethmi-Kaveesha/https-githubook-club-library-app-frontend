import React from "react";
import type { Lending } from "../types/Lending";

interface LendingViewProps {
    lending: Lending;
}

const LendingView: React.FC<LendingViewProps> = ({ lending }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status: Lending["status"]) => {
        const statusClasses = {
            borrowed: "bg-yellow-100 text-yellow-800",
            returned: "bg-green-100 text-green-800",
        };

        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Lending Header */}
            <div className="border-b pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Lending #{lending.id}</h3>
                        <p className="text-gray-600 mt-1">Reader: {lending.readerName}</p>
                        <p className="text-gray-600">Borrow Date: {formatDate(lending.borrowDate)}</p>
                        <p className="text-gray-600">Due Date: {formatDate(lending.dueDate)}</p>
                        {lending.returnDate && (
                            <p className="text-gray-600">Return Date: {formatDate(lending.returnDate)}</p>
                        )}
                    </div>
                    <div>{getStatusBadge(lending.status)}</div>
                </div>
            </div>

            {/* Books Lent */}
            <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Books</h4>
                <div className="space-y-2">
                    {lending.books.map((book) => (
                        <div
                            key={book._id}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                        >
                            <div className="font-medium">{book.bookTitle}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LendingView;

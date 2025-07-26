import React from "react";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import type { Lending } from "../../types/Lending";

interface LendingsTableProps {
    lendings: Lending[];
    onView: (lending: Lending) => void;
    onEdit: (lending: Lending) => void;
    onDelete: (lending: Lending) => void;
}

const LendingsTable: React.FC<LendingsTableProps> = ({
                                                         lendings,
                                                         onView,
                                                         onEdit,
                                                         onDelete,
                                                     }) => {
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
    };

    const getStatusBadge = (status: Lending["status"]) => {
        const statusClasses = {
            borrowed: "bg-yellow-800 text-yellow-300",
            returned: "bg-green-800 text-green-300",
        };

        return (
            <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                    statusClasses[status]
                }`}
            >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
        );
    };

    return (
        <div className="bg-black shadow-md rounded-lg overflow-hidden border border-teal-700">
            {/* Make table horizontally scrollable on small devices */}
            <div className="overflow-x-auto">
                <table className="min-w-[700px] w-full divide-y divide-teal-700">
                    <thead className="bg-teal-900">
                    <tr>
                        {[
                            "Lending ID",
                            "Reader",
                            "Books",
                            "Borrowed",
                            "Due",
                            "Status",
                            "Actions",
                        ].map((header) => (
                            <th
                                key={header}
                                scope="col"
                                className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-teal-300 uppercase tracking-wider select-none whitespace-nowrap"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-teal-700">
                    {lendings.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-teal-400">
                                No lending records found
                            </td>
                        </tr>
                    ) : (
                        lendings.map((lending) => (
                            <tr
                                key={lending._id}
                                className="hover:bg-teal-900 cursor-pointer transition-colors duration-150"
                            >
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base font-medium text-teal-300">
                                    #{lending._id}
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-teal-300">
                                    {lending.readerName}
                                </td>
                                <td
                                    className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-teal-300 max-w-xs truncate"
                                    title={lending.books?.map((b) => b.bookTitle).join(", ")}
                                >
                                    {lending.books?.map((b) => b.bookTitle).join(", ")}
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-teal-300">
                                    {formatDate(lending.borrowDate)}
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-teal-300">
                                    {formatDate(lending.dueDate)}
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(lending.status)}
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onView(lending)}
                                            aria-label={`View lending ${lending._id}`}
                                            className="text-teal-400 hover:text-teal-600 p-1 rounded hover:bg-teal-800 transition duration-150"
                                        >
                                            <MdVisibility className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(lending)}
                                            aria-label={`Edit lending ${lending._id}`}
                                            className="text-teal-400 hover:text-teal-600 p-1 rounded hover:bg-teal-800 transition duration-150"
                                        >
                                            <MdEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(lending)}
                                            aria-label={`Delete lending ${lending._id}`}
                                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-900 transition duration-150"
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
        </div>
    );
};

export default LendingsTable;

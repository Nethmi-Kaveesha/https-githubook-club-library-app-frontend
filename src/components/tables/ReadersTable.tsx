import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import type { Reader } from "../../types/Reader";

interface ReadersTableProps {
    readers?: Reader[] | null;
    onEdit: (reader: Reader) => void;
    onDelete: (reader: Reader) => void;
}

const ReadersTable: React.FC<ReadersTableProps> = ({ readers, onEdit, onDelete }) => {
    const safeReaders = Array.isArray(readers) ? readers : [];

    return (
        <div className="bg-[#1e293b] rounded-lg overflow-hidden shadow-lg">
            <table className="min-w-full divide-y divide-teal-800">
                <thead className="bg-[#0f172a]">
                <tr>
                    {["ID", "Name", "Email", "Phone", "NIC", "Status", "Membership", "Remarks", "Actions"].map(
                        (header) => (
                            <th
                                key={header}
                                className="px-4 py-3 text-left text-xs font-bold text-teal-400 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        )
                    )}
                </tr>
                </thead>
                <tbody className="bg-[#1e293b] divide-y divide-teal-800">
                {safeReaders.length === 0 ? (
                    <tr>
                        <td colSpan={9} className="px-6 py-4 text-center text-teal-500">
                            No readers found
                        </td>
                    </tr>
                ) : (
                    safeReaders.map((reader) => (
                        <tr
                            key={reader._id}
                            className="hover:bg-[#0f172a] transition duration-150"
                        >
                            <td className="px-4 py-3 text-sm text-teal-200">{reader._id}</td>
                            <td className="px-4 py-3 text-sm text-teal-200">{reader.name}</td>
                            <td className="px-4 py-3 text-sm text-teal-200">{reader.email}</td>
                            <td className="px-4 py-3 text-sm text-teal-200">{reader.phone}</td>
                            <td className="px-4 py-3 text-sm text-teal-200">{reader.nic}</td>
                            <td className="px-4 py-3 text-sm text-teal-300 uppercase">{reader.status ?? "-"}</td>
                            <td className="px-4 py-3 text-sm text-teal-300 uppercase">{reader.membershipType ?? "-"}</td>
                            <td
                                className="px-4 py-3 text-sm text-teal-200 truncate max-w-xs"
                                title={reader.remarks || ""}
                            >
                                {reader.remarks ? reader.remarks : "-"}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEdit(reader)}
                                        className="p-1 rounded text-teal-400 hover:text-white hover:bg-teal-600 transition"
                                        title="Edit"
                                    >
                                        <MdEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(reader)}
                                        className="p-1 rounded text-red-500 hover:text-white hover:bg-red-600 transition"
                                        title="Delete"
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

export default ReadersTable;

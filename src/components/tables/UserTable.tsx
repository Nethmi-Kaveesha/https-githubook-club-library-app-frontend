import React from "react";
import type { User } from "../../types/User";

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
    return (
        <table className="min-w-full bg-gray-800 text-white rounded-md">
            <thead>
            <tr>
                <th className="py-2 px-4 border-b border-gray-600">ID</th>
                <th className="py-2 px-4 border-b border-gray-600">Name</th>
                <th className="py-2 px-4 border-b border-gray-600">Email</th>
                <th className="py-2 px-4 border-b border-gray-600">Role</th>
                <th className="py-2 px-4 border-b border-gray-600">Status</th>
                <th className="py-2 px-4 border-b border-gray-600">Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map(({ _id, name, email, role, isActive }) => (
                <tr key={_id} className="hover:bg-gray-700">
                    <td className="py-2 px-4 border-b border-gray-600">{_id}</td>
                    <td className="py-2 px-4 border-b border-gray-600">{name}</td>
                    <td className="py-2 px-4 border-b border-gray-600">{email}</td>
                    <td className="py-2 px-4 border-b border-gray-600 capitalize">{role}</td>
                    <td
                        className={`py-2 px-4 border-b border-gray-600 font-semibold ${
                            isActive ? "text-green-400" : "text-red-400"
                        }`}
                    >
                        {isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600 space-x-2">
                        <button
                            onClick={() => onEdit({ _id, name, email, role, isActive })}
                            className="px-3 py-1 bg-yellow-500 rounded hover:bg-yellow-600 text-black text-sm"
                            title="Edit User"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                if (
                                    window.confirm(`Are you sure you want to delete user "${name}"?`)
                                ) {
                                    onDelete(_id);
                                }
                            }}
                            className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-white text-sm"
                            title="Delete User"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default UserTable;

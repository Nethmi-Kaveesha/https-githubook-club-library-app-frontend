import React, { useEffect, useState } from "react";
import axios from "axios";
import UserTable from "../components/tables/UserTable";
import UserForm from "../components/forms/UsersForm";

interface User {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "staff";
    isActive: boolean;
}

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<User[]>("http://localhost:3000/api/auth/users");
            setUsers(response.data);
        } catch (err) {
            setError("Failed to load users.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddUser = () => {
        setEditUser(null);
        setShowForm(true);
    };

    const handleEditUser = (user: User) => {
        setEditUser(user);
        setShowForm(true);
    };

    const handleDeleteUser = async (userId: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) return;

        try {
            await axios.delete(`http://localhost:3000/api/auth/users/${userId}`);
            fetchUsers();
        } catch (error) {
            alert("Failed to delete user.");
            console.error(error);
        }
    };

    const onFormSuccess = () => {
        fetchUsers();
        setShowForm(false);
        setEditUser(null);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-teal-400 border-dashed rounded-full animate-spin"></div>
                    <p className="mt-4 text-teal-200 text-lg">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error)
        return (
            <p className="text-red-500 p-4 text-center text-base sm:text-lg">
                {error}
            </p>
        );

    return (
        <div className="w-full px-4 py-6 sm:px-6 md:px-8 bg-gray-900 text-teal-100 min-h-screen mt-10">
            {/* Header with responsive Add User button */}
            <div className="mb-6 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6">
                    <h1 className="text-xl sm:text-3xl font-bold text-green-400 break-words w-full sm:w-auto">
                        User Management
                    </h1>
                    <div className="w-full sm:w-auto hidden sm:block">
                        <button
                            onClick={handleAddUser}
                            className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow transition"
                        >
                            + Add User
                        </button>
                    </div>
                </div>
            </div>

            {/* Search & Refresh */}
            <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:flex-1 px-4 py-2 rounded-md bg-gray-800 text-teal-300 placeholder-teal-500 border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                    onClick={fetchUsers}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded shadow transition w-full sm:w-auto"
                >
                    Refresh
                </button>
            </div>

            {/* Mobile hint */}
            <div className="sm:hidden text-sm text-center text-teal-400 mb-2">
                📱 Swipe left/right to view full table
            </div>

            {/* Table */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-inner border border-teal-700 overflow-x-auto">
                <UserTable
                    users={filteredUsers}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                />
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-4">
                    <div className="bg-gray-900 text-white p-6 rounded-md shadow-lg w-full max-w-md max-h-screen overflow-y-auto relative border border-teal-700">
                        <button
                            className="absolute top-2 right-2 text-teal-400 hover:text-red-500 text-xl"
                            onClick={() => {
                                setShowForm(false);
                                setEditUser(null);
                            }}
                        >
                            ✕
                        </button>
                        <UserForm initialData={editUser} onSuccess={onFormSuccess} />
                    </div>
                </div>
            )}

            {/* Floating Add Button for Mobile */}
            <button
                onClick={handleAddUser}
                className="sm:hidden fixed bottom-4 right-4 z-50 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-full shadow-lg text-lg"
                title="Add User"
            >
                + Add
            </button>
        </div>
    );
};

export default UsersPage;

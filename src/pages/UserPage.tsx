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

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="w-full p-6 text-teal-100 bg-gray-900 min-h-screen mt-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-green-400">User Management</h1>
                <button
                    onClick={handleAddUser}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow transition"
                >
                    + Add User
                </button>
            </div>

            {/* Search + Refresh */}
            <div className="mb-4 flex items-center gap-3">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow px-4 py-2 rounded-md bg-gray-800 text-teal-300 placeholder-teal-500 border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                    onClick={fetchUsers}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded shadow transition"
                >
                    Refresh
                </button>
            </div>

            {/* Table */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-inner border border-teal-700">
                <UserTable users={filteredUsers} onEdit={handleEditUser} onDelete={handleDeleteUser} />
            </div>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="bg-gray-900 text-white p-6 rounded-md shadow-lg w-full max-w-md relative border border-teal-700">
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
        </div>
    );
};

export default UsersPage;

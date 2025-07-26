import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MdAdd, MdClear } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dialog from "../components/Dialog";
import type { Reader } from "../types/Reader";
import ReadersTable from "../components/tables/ReadersTable";
import ReaderForm from "../components/forms/ReaderForm";

const ReadersPage: React.FC = () => {
    const [readers, setReaders] = useState<Reader[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedReader, setSelectedReader] = useState<Reader | null>(null);

    const [, setFormSubmitting] = useState(false);

    const addFormRef = useRef<HTMLFormElement>(null);
    const editFormRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:3000/api/readers")
            .then((res) => {
                if (Array.isArray(res.data.data)) setReaders(res.data.data);
                else if (Array.isArray(res.data)) setReaders(res.data);
                else setReaders([]);
            })
            .catch(() => toast.error("Failed to load readers"))
            .finally(() => setLoading(false));
    }, []);

    const handleAddReader = () => {
        setSelectedReader(null);
        setIsAddDialogOpen(true);
    };

    const handleEditReader = (reader: Reader) => {
        setSelectedReader(reader);
        setIsEditDialogOpen(true);
    };

    const handleDeleteReader = (reader: Reader) => {
        setSelectedReader(reader);
        setIsDeleteDialogOpen(true);
    };

    const handleFormSubmit = async (readerData: Omit<Reader, "_id">) => {
        setFormSubmitting(true);
        try {
            const payload = {
                ...readerData,
                status: readerData.status?.toUpperCase(),
                membershipType: readerData.membershipType?.toUpperCase(),
            };

            if (selectedReader) {
                const response = await axios.put(
                    `http://localhost:3000/api/readers/${selectedReader._id}`,
                    payload
                );
                const updatedReader = response.data.data || response.data;
                setReaders((prev) =>
                    prev.map((r) => (r._id === updatedReader._id ? updatedReader : r))
                );
                toast.success("Reader updated successfully");
                setIsEditDialogOpen(false);
            } else {
                const response = await axios.post("http://localhost:3000/api/readers", payload);
                const newReader = response.data.data || response.data;
                setReaders((prev) => [...prev, newReader]);
                toast.success("Reader added successfully");
                setIsAddDialogOpen(false);
            }
            setSelectedReader(null);
        } catch {
            toast.error("Failed to save reader");
        } finally {
            setFormSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!selectedReader) return;
        try {
            await axios.delete(`http://localhost:3000/api/readers/${selectedReader._id}`);
            setReaders((prev) => prev.filter((reader) => reader._id !== selectedReader._id));
            toast.success("Reader deleted successfully");
            setIsDeleteDialogOpen(false);
            setSelectedReader(null);
        } catch {
            toast.error("Failed to delete reader");
        }
    };

    const cancelDialog = () => {
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        setIsDeleteDialogOpen(false);
        setSelectedReader(null);
    };

    const exportToCSV = () => {
        const headers = ["ID", "Name", "Email", "Phone", "NIC", "Status", "Membership", "Remarks"];
        const rows = readers.map((r) =>
            [
                r._id,
                r.name,
                r.email,
                r.phone,
                r.nic,
                r.status ?? "",
                r.membershipType ?? "",
                r.remarks ?? "",
            ]
                .map((field) => `"${String(field).replace(/"/g, '""')}"`)
                .join(",")
        );
        const csvContent = [headers.join(","), ...rows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "readers.csv";
        link.click();
    };

    const filteredReaders = readers.filter((reader) =>
        reader.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 bg-[#0f172a] min-h-screen mt-10 text-teal-100 font-sans">
            <ToastContainer />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold text-teal-300">Readers</h1>
                        <p className="text-teal-400 mt-1">Total Readers: {readers.length}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 w-full sm:w-auto">
                        <button
                            onClick={exportToCSV}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
                        >
                            Export CSV
                        </button>
                        <button
                            onClick={handleAddReader}
                            className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
                        >
                            <MdAdd className="w-5 h-5" />
                            <span>Add Reader</span>
                        </button>
                    </div>
                </div>

                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search by reader name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 bg-[#1e293b] text-teal-300 placeholder-teal-500 border border-teal-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-2 text-teal-400 hover:text-white"
                            title="Clear search"
                        >
                            <MdClear className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {loading ? (
                    <p className="text-center text-teal-400 py-10">Loading readers...</p>
                ) : filteredReaders.length === 0 ? (
                    <p className="text-center text-teal-400 py-10">No readers found.</p>
                ) : (
                    // Wrap the table for horizontal scroll on small devices
                    <div className="overflow-x-auto">
                        <ReadersTable
                            readers={filteredReaders}
                            onEdit={handleEditReader}
                            onDelete={handleDeleteReader}
                        />
                    </div>
                )}

                <Dialog
                    isOpen={isAddDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={() => addFormRef.current?.requestSubmit()}
                    title="Add New Reader"
                >
                    <ReaderForm onSubmit={handleFormSubmit} ref={addFormRef} />
                </Dialog>

                <Dialog
                    isOpen={isEditDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={() => editFormRef.current?.requestSubmit()}
                    title="Edit Reader"
                >
                    <ReaderForm reader={selectedReader} onSubmit={handleFormSubmit} ref={editFormRef} />
                </Dialog>

                <Dialog
                    isOpen={isDeleteDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={confirmDelete}
                    title="Delete Reader"
                >
                    <p className="text-teal-300">
                        Are you sure you want to delete <strong>{selectedReader?.name}</strong>? This action cannot be undone.
                    </p>
                </Dialog>
            </div>
        </div>
    );
};

export default ReadersPage;

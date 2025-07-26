import React, { useState, useEffect, useRef } from "react";
import { MdAdd } from "react-icons/md";
import axios from "axios";

import LendingView from "../components/LendingView";
import Dialog from "../components/Dialog";
import LendingForm from "../components/forms/LendingForm";

import type { Reader } from "../types/Reader";
import type { Book } from "../types/Book";
import type { Lending } from "../types/Lending";
import LendingsTable from "../components/tables/LendingsTable";

const BASE_URL = "http://localhost:3000/api";

const LendingPage: React.FC = () => {
    const [readers, setReaders] = useState<Reader[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [lendings, setLendings] = useState<Lending[]>([]);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [selectedLending, setSelectedLending] = useState<Lending | null>(null);

    const [notifyLoading, setNotifyLoading] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState("");

    const addFormRef = useRef<HTMLFormElement>(null);
    const editFormRef = useRef<HTMLFormElement>(null);

    const fetchData = async () => {
        try {
            const [readersRes, booksRes] = await Promise.all([
                fetch(`${BASE_URL}/readers`),
                fetch(`${BASE_URL}/books`),
            ]);

            if (!readersRes.ok) throw new Error("Failed to fetch readers");
            if (!booksRes.ok) throw new Error("Failed to fetch books");

            const readersJson = await readersRes.json();
            const booksJson = await booksRes.json();

            const readersArray = Array.isArray(readersJson.data) ? readersJson.data : [];
            const booksArray = Array.isArray(booksJson) ? booksJson : (Array.isArray(booksJson.books) ? booksJson.books : []);

            setReaders(readersArray);
            setBooks(booksArray);
        } catch (error) {
            console.error("Fetch readers/books error:", error);
            alert("Error fetching readers or books.");
            setReaders([]);
            setBooks([]);
        }
    };

    const fetchLendings = async () => {
        try {
            const res = await fetch(`${BASE_URL}/lendings`);
            if (!res.ok) throw new Error("Failed to fetch lendings");
            const data: Lending[] = await res.json();
            setLendings(data);
        } catch (error) {
            console.error("Fetch lendings error:", error);
            alert("Error fetching lendings.");
        }
    };

    useEffect(() => {
        fetchData();
        fetchLendings();
    }, []);

    const handleFormSubmit = async (lendingData: {
        readerId: string;
        readerName: string;
        books: { _id: string; bookTitle: string }[];
        status: "borrowed" | "returned";
        _id: string;
    }) => {
        try {
            const { _id, ...payload } = lendingData;

            if (_id && _id !== "") {
                await axios.put(`${BASE_URL}/lendings/${_id}`, payload);
            } else {
                await axios.post(`${BASE_URL}/lendings`, payload);
            }

            await fetchLendings();
            setSelectedLending(null);
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
        } catch (err) {
            console.error("Failed to save lending:", err);
            alert("Error saving lending. Please try again.");
        }
    };

    const confirmDelete = async () => {
        if (!selectedLending) return;
        try {
            await axios.delete(`${BASE_URL}/lendings/${selectedLending._id}`);
            await fetchLendings();
            setSelectedLending(null);
            setIsDeleteDialogOpen(false);
        } catch (err) {
            console.error("Failed to delete lending:", err);
            alert("Failed to delete lending. Please try again.");
        }
    };

    const cancelDialog = () => {
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        setIsViewDialogOpen(false);
        setIsDeleteDialogOpen(false);
        setSelectedLending(null);
    };

    const sendOverdueNotifications = async () => {
        setNotifyLoading(true);
        setNotifyMessage("");
        try {
            const res = await fetch(`${BASE_URL}/lendings/notify-overdue`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                setNotifyMessage("Overdue notifications sent successfully!");
            } else {
                const data = await res.json();
                setNotifyMessage("Failed: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            setNotifyMessage("Error sending notifications.");
            console.error("Notification error:", error);
        } finally {
            setNotifyLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white mt-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold text-teal-400">Lendings</h1>
                        <p className="text-gray-400 mt-1">Total Lendings: {lendings.length}</p>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={() => {
                                setSelectedLending(null);
                                setIsAddDialogOpen(true);
                            }}
                            className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        >
                            <MdAdd className="w-5 h-5" />
                            <span>Create Lending</span>
                        </button>

                        <button
                            onClick={sendOverdueNotifications}
                            disabled={notifyLoading}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                            {notifyLoading ? "Sending..." : "Send Overdue Notifications"}
                        </button>
                    </div>
                </div>

                {notifyMessage && (
                    <p
                        className={`mb-4 text-sm ${
                            notifyMessage.toLowerCase().includes("success")
                                ? "text-green-400"
                                : "text-red-400"
                        }`}
                    >
                        {notifyMessage}
                    </p>
                )}

                <LendingsTable
                    lendings={lendings}
                    onView={(lending) => {
                        setSelectedLending(lending);
                        setIsViewDialogOpen(true);
                    }}
                    onEdit={(lending) => {
                        setSelectedLending(lending);
                        setIsEditDialogOpen(true);
                    }}
                    onDelete={(lending) => {
                        setSelectedLending(lending);
                        setIsDeleteDialogOpen(true);
                    }}
                />

                <Dialog
                    isOpen={isAddDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={() => addFormRef.current?.requestSubmit()}
                    title="Create New Lending"
                >
                    <LendingForm
                        readers={readers}
                        books={books}
                        onSubmit={handleFormSubmit}
                        ref={addFormRef}
                    />
                </Dialog>

                <Dialog
                    isOpen={isEditDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={() => editFormRef.current?.requestSubmit()}
                    title="Edit Lending"
                >
                    <LendingForm
                        lending={selectedLending}
                        readers={readers}
                        books={books}
                        onSubmit={handleFormSubmit}
                        ref={editFormRef}
                    />
                </Dialog>

                <Dialog
                    isOpen={isViewDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={cancelDialog}
                    title="Lending Details"
                >
                    {selectedLending && <LendingView lending={selectedLending} />}
                </Dialog>

                <Dialog
                    isOpen={isDeleteDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={confirmDelete}
                    title="Delete Lending"
                >
                    <p className="text-gray-300">
                        Are you sure you want to delete Lending #{selectedLending?._id}? This action cannot be undone.
                    </p>
                </Dialog>
            </div>
        </div>
    );
};

export default LendingPage;

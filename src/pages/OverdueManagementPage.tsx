import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface OverdueReader {
    readerId: string;
    readerName: string;
}

interface OverdueBook {
    bookTitle: string;
    dueDate: string;
}

const OverdueReadersPage: React.FC = () => {
    const [readers, setReaders] = useState<OverdueReader[]>([]);
    const [selectedReaderId, setSelectedReaderId] = useState<string | null>(null);
    const [overdueBooks, setOverdueBooks] = useState<OverdueBook[]>([]);
    const [loadingReaders, setLoadingReaders] = useState(false);
    const [loadingBooks, setLoadingBooks] = useState(false);
    const [sendingEmails, setSendingEmails] = useState(false);
    const [message, setMessage] = useState("");

    // Email editor modal states
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailMessage, setEmailMessage] = useState("");
    const [emailReaderId, setEmailReaderId] = useState<string | null>(null);
    const [emailReaderName, setEmailReaderName] = useState<string>("");

    useEffect(() => {
        fetchOverdueReaders();
    }, []);

    const fetchOverdueReaders = async () => {
        setLoadingReaders(true);
        try {
            const res = await fetch("http://localhost:3000/api/overdue/readers");
            const data = await res.json();
            setReaders(data);
        } catch (error) {
            console.error("Failed to fetch overdue readers:", error);
        } finally {
            setLoadingReaders(false);
        }
    };

    const fetchOverdueBooks = async (readerId: string) => {
        setLoadingBooks(true);
        try {
            const res = await fetch(
                `http://localhost:3000/api/overdue/books/${readerId}`
            );
            const data = await res.json();
            setOverdueBooks(data);
        } catch (error) {
            console.error("Failed to fetch overdue books:", error);
        } finally {
            setLoadingBooks(false);
        }
    };

    const handleReaderSelect = (readerId: string) => {
        setSelectedReaderId(readerId);
        fetchOverdueBooks(readerId);
    };

    // CSV export
    const exportCSV = () => {
        if (overdueBooks.length === 0) return;
        const csvRows = [
            ["Book Title", "Due Date"],
            ...overdueBooks.map((book) => [
                `"${book.bookTitle}"`,
                `"${new Date(book.dueDate).toLocaleDateString()}"`,
            ]),
        ];

        const csvContent = csvRows.map((e) => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
            "download",
            `overdue_books_${selectedReaderId || "all"}.csv`
        );
        link.click();
    };

    // PDF export
    const exportPDF = () => {
        if (overdueBooks.length === 0) return;

        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text(
            `Overdue Books for ${
                selectedReaderId
                    ? readers.find((r) => r.readerId === selectedReaderId)?.readerName ||
                    selectedReaderId
                    : "All Readers"
            }`,
            14,
            20
        );
        doc.setFontSize(12);
        let y = 30;
        overdueBooks.forEach((book, idx) => {
            doc.text(
                `${idx + 1}. ${book.bookTitle} - Due ${new Date(
                    book.dueDate
                ).toLocaleDateString()}`,
                14,
                y
            );
            y += 10;
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
        });
        doc.save(
            `overdue_books_${selectedReaderId || "all"}_${new Date()
                .toISOString()
                .slice(0, 10)}.pdf`
        );
    };

    // Show email modal to customize message before sending
    const openEmailModal = (readerId: string, readerName: string) => {
        setEmailReaderId(readerId);
        setEmailReaderName(readerName);
        setEmailMessage(
            `Dear ${readerName},\n\nThis is a reminder that you have overdue books at the library. Please return them as soon as possible.\n\nThank you!`
        );
        setShowEmailModal(true);
    };

    // Send individual email with custom message
    const sendIndividualNotification = async () => {
        if (!emailReaderId) return;
        setSendingEmails(true);
        setMessage("");
        try {
            const res = await fetch(
                `http://localhost:3000/api/notifications/send-individual/${emailReaderId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message: emailMessage }),
                }
            );
            const data = await res.json();
            setMessage(
                res.ok
                    ? `Notification sent to ${emailReaderName}.`
                    : data.message || "Failed to send notification."
            );
        } catch (error) {
            console.error(error);
            setMessage("Error sending notification.");
        } finally {
            setSendingEmails(false);
            setShowEmailModal(false);
        }
    };

    // Send all notifications without custom message
    const sendAllNotifications = async () => {
        setSendingEmails(true);
        setMessage("");
        try {
            const res = await fetch(
                "http://localhost:3000/api/notifications/send-overdue-notifications",
                {
                    method: "POST",
                }
            );
            const data = await res.json();
            setMessage(
                res.ok
                    ? "Notification emails sent successfully."
                    : data.message || "Failed to send notifications."
            );
        } catch (error) {
            console.error(error);
            setMessage("Error sending notifications.");
        } finally {
            setSendingEmails(false);
        }
    };

    // Prepare data for chart: total overdue books per reader
    const chartData = {
        labels: readers.map((r) => r.readerName),
        datasets: [
            {
                label: "Overdue Books Count",
                data: readers.map((r) => {
                    // Count overdue books for this reader
                    if (r.readerId === selectedReaderId) return overdueBooks.length;
                    // For other readers, no book data loaded => 0
                    return 0;
                }),
                backgroundColor: "rgba(20, 184, 166, 0.7)", // teal-500
            },
        ],
    };

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen p-6 mt-10">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-xl sm:text-2xl font-bold text-teal-300 mb-4">
                    📚 Overdue Readers
                </h1>

                <button
                    onClick={sendAllNotifications}
                    disabled={sendingEmails}
                    className="mb-4 px-3 py-1.5 text-sm rounded bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
                >
                    {sendingEmails ? "Sending..." : "Send All Email Notifications"}
                </button>

                {message && (
                    <p className="text-sm text-green-400 mb-3 whitespace-pre-wrap">
                        {message}
                    </p>
                )}

                {loadingReaders ? (
                    <p className="text-sm">Loading readers...</p>
                ) : readers.length === 0 ? (
                    <p className="text-sm text-gray-400">No readers with overdue books.</p>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            {/* Readers List */}
                            <div className="w-full sm:w-1/3 bg-gray-800 p-3 rounded shadow">
                                <h2 className="text-sm font-semibold text-teal-400 mb-2">
                                    Readers
                                </h2>
                                <ul className="space-y-1 text-sm">
                                    {readers.map((reader) => (
                                        <li key={reader.readerId}>
                                            <button
                                                onClick={() => handleReaderSelect(reader.readerId)}
                                                className={`w-full text-left px-2 py-1 rounded text-sm ${
                                                    selectedReaderId === reader.readerId
                                                        ? "bg-teal-600 text-white"
                                                        : "hover:bg-gray-700"
                                                }`}
                                            >
                                                {reader.readerName}
                                            </button>

                                            {selectedReaderId === reader.readerId && (
                                                <button
                                                    onClick={() =>
                                                        openEmailModal(reader.readerId, reader.readerName)
                                                    }
                                                    className="mt-1 w-full text-xs bg-teal-700 hover:bg-teal-800 py-1 rounded"
                                                >
                                                    Customize & Send Email
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Overdue Books */}
                            <div className="flex-1 bg-gray-800 p-3 rounded shadow">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-sm font-semibold text-teal-400">
                                        Overdue Books{" "}
                                        {selectedReaderId && (
                                            <span className="text-gray-400">for ID: {selectedReaderId}</span>
                                        )}
                                    </h2>
                                    <div className="space-x-2">
                                        {overdueBooks.length > 0 && (
                                            <>
                                                <button
                                                    onClick={exportCSV}
                                                    className="bg-teal-600 hover:bg-teal-700 text-xs px-2 py-1 rounded"
                                                >
                                                    Export CSV
                                                </button>
                                                <button
                                                    onClick={exportPDF}
                                                    className="bg-teal-600 hover:bg-teal-700 text-xs px-2 py-1 rounded"
                                                >
                                                    Export PDF
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {loadingBooks ? (
                                    <p className="text-sm">Loading books...</p>
                                ) : overdueBooks.length === 0 ? (
                                    <p className="text-sm text-gray-400">
                                        Select a reader to view overdue books.
                                    </p>
                                ) : (
                                    <ul className="text-sm space-y-1">
                                        {overdueBooks.map((book, idx) => (
                                            <li key={idx}>
                                                📖 <strong>{book.bookTitle}</strong> —{" "}
                                                <span className="text-red-400">
                          Due {new Date(book.dueDate).toLocaleDateString()}
                        </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Chart: Overdue books count for selected reader */}
                        {selectedReaderId && (
                            <div className="bg-gray-800 p-4 rounded shadow">
                                <h3 className="text-teal-400 mb-2 font-semibold">
                                    Overdue Books Count Chart
                                </h3>
                                <Bar
                                    data={{
                                        labels: [readers.find((r) => r.readerId === selectedReaderId)?.readerName || ""],
                                        datasets: [
                                            {
                                                label: "Overdue Books Count",
                                                data: [overdueBooks.length],
                                                backgroundColor: "rgba(20, 184, 166, 0.7)",
                                            },
                                        ],
                                    }}
                                    options={{
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                precision: 0,
                                            },
                                        },
                                        plugins: {
                                            legend: { display: false },
                                        },
                                    }}
                                    height={150}
                                />
                            </div>
                        )}
                    </>
                )}

                {/* Email Editor Modal */}
                {showEmailModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                        <div className="bg-gray-800 p-6 rounded shadow-lg max-w-lg w-full text-gray-100">
                            <h2 className="text-lg font-semibold mb-4">
                                Customize Email to {emailReaderName}
                            </h2>
                            <textarea
                                className="w-full p-3 rounded bg-gray-700 text-gray-100 resize-y"
                                rows={8}
                                value={emailMessage}
                                onChange={(e) => setEmailMessage(e.target.value)}
                            />
                            <div className="mt-4 flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowEmailModal(false)}
                                    className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={sendIndividualNotification}
                                    disabled={sendingEmails}
                                    className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
                                >
                                    {sendingEmails ? "Sending..." : "Send Email"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OverdueReadersPage;

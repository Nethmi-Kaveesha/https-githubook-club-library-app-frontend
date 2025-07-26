import { useState } from "react";

const OverdueNotificationButton = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const sendNotifications = async () => {
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/lendings/notify-overdue", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setMessage("✅ Overdue notifications sent successfully!");
            } else {
                const data = await response.json();
                setMessage("❌ Failed: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            setMessage("❌ Error sending notifications.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen px-4 py-6 mt-20"
            style={{
                background: "linear-gradient(135deg, #008080 0%, #000000 50%, #006400 100%)", // teal, black, green gradient
            }}
        >
            <div className="w-full max-w-md p-6 bg-black bg-opacity-80 rounded-2xl shadow-lg">
                <h2 className="text-xl sm:text-2xl font-semibold text-teal-400 mb-6 text-center mt-40">
                    Overdue Notification Sender
                </h2>

                <button
                    onClick={sendNotifications}
                    disabled={loading}
                    className="w-full py-3 text-base font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-xl shadow-sm transition duration-300 focus:outline-none focus:ring-4 focus:ring-teal-400"
                >
                    {loading ? (
                        <span className="inline-block animate-pulse">Sending...</span>
                    ) : (
                        "Send Overdue Notifications"
                    )}
                </button>

                {message && (
                    <p
                        className={`mt-4 text-center text-sm sm:text-base font-medium ${
                            message.startsWith("✅") ? "text-green-400" : "text-red-400"
                        } break-words select-text`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default OverdueNotificationButton;

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
        <div>
            <button
                onClick={sendNotifications}
                disabled={loading}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 transition"
            >
                {loading ? "Sending..." : "Send Overdue Notifications"}
            </button>
            {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
    );
};

export default OverdueNotificationButton;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="border-b border-teal-700 w-full">
            {/* Top Bar */}
            <div className="bg-teal-900 text-teal-200 text-xs sm:text-sm py-2 px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-1 sm:space-y-0">
                <div>
                    Call us:{" "}
                    <span className="text-teal-400 font-medium">
            +94 711304050 / 0112820820
          </span>
                </div>
                <div>
                    Email:{" "}
                    <span className="text-teal-400 font-medium">
            webadmin@sarasavi.lk
          </span>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="bg-white shadow-md w-full px-4 sm:px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate("/")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && navigate("/")}
                    aria-label="Go to homepage"
                >
                    <img
                        src="/img/17-173735_book-icon-green-book-icon-png.png"
                        alt="Logo"
                        className="h-12 w-12 object-cover rounded-full"
                    />
                    <span className="text-3xl sm:text-4xl font-extrabold text-teal-900 tracking-widest font-montserrat select-none">
            LibroNexus
          </span>
                </div>

                {/* Search Bar */}
                <form
                    onSubmit={onSearch}
                    className="w-full max-w-xl flex items-center border border-teal-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-teal-400 transition"
                    role="search"
                    aria-label="Search books"
                >
                    <input
                        type="text"
                        placeholder="Search books..."
                        className="w-full px-4 py-2 text-teal-900 placeholder-teal-400 focus:outline-none text-sm sm:text-base"
                        aria-label="Search books"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-teal-600 hover:bg-teal-700 p-3 text-white transition"
                        aria-label="Search"
                    >
                        <FaSearch className="w-5 h-5" />
                    </button>
                </form>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="flex items-center text-sm bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                        aria-label="Login"
                    >
                        <FaUser className="mr-2" /> Login
                    </button>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};

export default Navbar;

import {
    FaBookOpen,
    FaChild,
    FaLightbulb,
    FaPenNib,
    FaBook,
    FaSmile,
    FaFeatherAlt,
} from "react-icons/fa";

const featuredBooks = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80",
    },
];

const categories = [
    {
        label: "Fiction",
        bgColor: "bg-pink-300",
        icon: <FaBookOpen size={28} className="text-gray-200" />,
    },
    {
        label: "Children's Books",
        bgColor: "bg-green-300",
        icon: <FaChild size={28} className="text-gray-200" />,
    },
    {
        label: "නවකතා",
        bgColor: "bg-orange-300",
        icon: <FaBook size={28} className="text-gray-200" />,
    },
    {
        label: "ප්‍රේරනා",
        bgColor: "bg-blue-300",
        icon: <FaLightbulb size={28} className="text-gray-200" />,
    },
    {
        label: "Short Story",
        bgColor: "bg-pink-300",
        icon: <FaPenNib size={28} className="text-gray-200" />,
    },
    {
        label: "කෙටිකතා",
        bgColor: "bg-green-300",
        icon: <FaFeatherAlt size={28} className="text-gray-200" />,
    },
    {
        label: "ළමා කතා",
        bgColor: "bg-orange-300",
        icon: <FaSmile size={28} className="text-gray-200" />,
    },

];

export default function Home() {
    return (
        <div className="bg-[#e9dbc3] pt-6">
            {/* Top Banner */}
            <div className="flex flex-col items-center justify-center px-1 lg:px-20 py-8">
                <div className="w-full h-[370px] flex justify-center items-center bg-black">
                    <img
                        src="src/img/web-banner--swarnpusthaka-jun'2024.jpg"
                        alt="Priyangwada Perera"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-sm font-medium py-5 max-w-7xl mx-auto">
                {categories.map(({ label, bgColor, icon }, index) => (
                    <div
                        key={index}
                        className={`${bgColor} py-8 flex flex-col justify-center items-center cursor-pointer rounded-xl transition`}
                    >
                        <div className="mb-2 text-emerald-700">{icon}</div>
                        <div className="font-semibold">{label}</div>
                    </div>
                ))}
            </div>

            {/* Horizontal Featured Books Slider */}
            <div className="mt-10 px-4 max-w-7xl mx-auto">
                <h2 className="text-center text-3xl font-extrabold text-emerald-600 mb-6">
                    Explore Featured Books
                </h2>

                <div className="relative">
                    <div className="flex flex-wrap justify-center gap-4 overflow-x-auto pb-4">
                        {featuredBooks.map((book) => (
                            <div
                                key={book.id}
                                className="w-[200px] bg-white shadow-md rounded-xl relative"
                            >
                                <div className="absolute top-2 right-2 bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    New Arrival
                                </div>

                                <img
                                    src={book.img}
                                    alt={book.title}
                                    className="w-full h-64 object-cover rounded-t-xl"
                                />

                                <div className="p-3 text-center">
                                    <p className="text-sm font-semibold text-gray-700 truncate">{book.title}</p>
                                    <p className="text-xs text-gray-500 italic truncate">{book.author}</p>

                                    <button className="mt-4 w-full bg-teal-600 text-white py-2 rounded-xl font-semibold hover:bg-teal-700 transition">
                                        Borrow Book
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Featured Books */}
            <section id="featured" className="py-24 px-6 max-w-7xl mx-auto text-center">
                <h2 className="text-5xl font-extrabold text-emerald-600 mb-10">New Arrivals</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                    {featuredBooks.map(({ id, title, author, img }) => (
                        <div
                            key={id}
                            className="bg-white rounded-3xl shadow-teal-300 shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-300"
                        >
                            <img src={img} alt={title} className="w-full h-72 object-cover" />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-emerald-600">{title}</h3>
                                <p className="text-gray-500 italic mt-1">{author}</p>
                                <button className="mt-6 w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 shadow-md hover:shadow-xl transition">
                                    Borrow Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Genres */}
            <section className="bg-gradient-to-r from-teal-900 via-emerald-800 to-green-700 py-20 px-6 rounded-3xl max-w-6xl mx-auto text-center shadow-lg text-white">
                <h2 className="text-4xl font-bold mb-6">Popular Genres</h2>
                <p className="mb-12 max-w-3xl mx-auto text-teal-200">
                    Dive into categories that spark curiosity and adventure.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    {[
                        "Fiction",
                        "Science",
                        "Mystery",
                        "Biography",
                        "Romance",
                        "Fantasy",
                        "History",
                        "Self-Help",
                    ].map((genre) => (
                        <span
                            key={genre}
                            className="bg-teal-800 text-green-300 border border-green-300 px-6 py-3 rounded-full font-semibold shadow hover:bg-teal-700 transition"
                        >
                        {genre}
                    </span>
                    ))}
                </div>
            </section>

            {/* About Us */}
            <section id="about" className="py-20 px-6 max-w-5xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-emerald-600 mb-6">About LibroNexus</h2>
                <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto">
                    Since 1995, <span className="font-semibold text-teal-500">LibroNexus</span> has connected readers
                    with stories that inspire and educate. Our curated collection spans genres and generations, fostering
                    lifelong learning and discovery.
                </p>
            </section>

            {/* Contact */}
            <section id="contact" className="py-20 px-6 max-w-xl mx-auto text-center">
                <h2 className="text-4xl font-extrabold text-emerald-600 mb-8">Contact Us</h2>
                <form className="space-y-6 text-left">
                    <div>
                        <label className="block font-semibold text-gray-700">Your Name</label>
                        <input
                            type="text"
                            className="w-full p-4 rounded-xl border-2 border-green-300 focus:ring-4 focus:ring-teal-400 focus:outline-none"
                            placeholder="Name"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-700">Your Email</label>
                        <input
                            type="email"
                            className="w-full p-4 rounded-xl border-2 border-green-300 focus:ring-4 focus:ring-teal-400 focus:outline-none"
                            placeholder="Email"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-700">Your Message</label>
                        <textarea
                            rows={4}
                            className="w-full p-4 rounded-xl border-2 border-green-300 focus:ring-4 focus:ring-teal-400 focus:outline-none resize-y"
                            placeholder="Message"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-teal-600 text-white w-full py-4 rounded-xl font-semibold hover:bg-teal-700 shadow-lg hover:shadow-xl transition"
                    >
                        Send Message
                    </button>
                </form>
                <p className="mt-8 text-gray-600">
                    Or call us at:{" "}
                    <a href="tel:+1234567890" className="text-teal-600 font-semibold hover:underline">
                        +1 (234) 567-890
                    </a>
                </p>
            </section>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-teal-900 to-emerald-800 text-teal-100 py-8 text-center">
                <p className="text-sm">&copy; 2025 LibroNexus. All rights reserved.</p>
                <div className="mt-4 space-x-6">
                    <a href="#" className="hover:text-green-300">
                        Privacy
                    </a>
                    <a href="#" className="hover:text-green-300">
                        Terms
                    </a>
                    <a href="#" className="hover:text-green-300">
                        Support
                    </a>
                </div>
            </footer>
        </div>

);
}

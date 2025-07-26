import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAdd } from "react-icons/md";
import Dialog from "../components/Dialog";
import type { Book, BookFormData } from "../types/Book";
import BooksTable from "../components/tables/BooksTable";
import BookForm from "../components/forms/BookForm";

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sortField, setSortField] = useState<"title" | "price" | "quantity">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    axios
        .get("http://localhost:3000/api/books")
        .then((res) => setBooks(res.data))
        .catch(() => alert("Failed to load books"));
  }, []);

  const handleFormSubmit = async (bookData: BookFormData) => {
    try {
      if (selectedBook) {
        const response = await axios.put(`http://localhost:3000/api/books/${selectedBook._id}`, bookData);
        const updatedBook = response.data;
        setBooks((prev) => prev.map((b) => (b._id === updatedBook._id ? updatedBook : b)));
        setIsEditDialogOpen(false);
      } else {
        const response = await axios.post("http://localhost:3000/api/books", bookData);
        const newBook = response.data;
        setBooks((prev) => [...prev, newBook]);
        setIsAddDialogOpen(false);
      }
      setSelectedBook(null);
    } catch {
      alert("Failed to save book.");
    }
  };

  const confirmDelete = async () => {
    if (!selectedBook) return;
    try {
      await axios.delete(`http://localhost:3000/api/books/${selectedBook._id}`);
      setBooks((prev) => prev.filter((b) => b._id !== selectedBook._id));
      setIsDeleteDialogOpen(false);
      setSelectedBook(null);
    } catch {
      alert("Failed to delete book.");
    }
  };

  const categories = ["All", ...Array.from(new Set(books.map((b) => b.category || "Uncategorized")))];

  const filteredBooks = books
      .filter((book) => {
        const query = searchQuery.toLowerCase();
        return (
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            (book.isbn && book.isbn.toLowerCase().includes(query))
        );
      })
      .filter((book) => (selectedCategory === "All" ? true : (book.category || "Uncategorized") === selectedCategory))
      .filter((book) => book.price >= minPrice && book.price <= maxPrice)
      .sort((a, b) => {
        const valA = (a[sortField] ?? "").toString().toLowerCase();
        const valB = (b[sortField] ?? "").toString().toLowerCase();
        return sortOrder === "asc" ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
      });

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  };

  return (
      <div className="p-6 bg-[#0f172a] min-h-screen mt-10 text-teal-100 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
            <div>
              <h1 className="text-3xl font-bold text-teal-300">Books</h1>
              <p className="text-teal-400 mt-1">Total Books: {books.length}</p>
            </div>
            <button
                onClick={() => {
                  setSelectedBook(null);
                  setIsAddDialogOpen(true);
                }}
                className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition whitespace-nowrap"
            >
              <MdAdd className="w-5 h-5" />
              <span>Add Book</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <input
                type="text"
                placeholder="Search by title, author, ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-teal-700 bg-[#1e293b] text-teal-300 placeholder-teal-500 rounded px-4 py-2 flex-grow min-w-[180px] focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-teal-700 bg-[#1e293b] text-teal-300 rounded px-4 py-2 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
              ))}
            </select>

            <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="border border-teal-700 bg-[#1e293b] text-teal-300 placeholder-teal-500 rounded px-4 py-2 w-24 sm:w-28 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="border border-teal-700 bg-[#1e293b] text-teal-300 placeholder-teal-500 rounded px-4 py-2 w-24 sm:w-28 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as "title" | "price" | "quantity")}
                className="border border-teal-700 bg-[#1e293b] text-teal-300 rounded px-4 py-2 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="title">Sort: Title</option>
              <option value="price">Sort: Price</option>
              <option value="quantity">Sort: Quantity</option>
            </select>

            <button
                onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded transition whitespace-nowrap"
            >
              {sortOrder === "asc" ? "Asc" : "Desc"}
            </button>

            <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setMinPrice(0);
                  setMaxPrice(100000);
                  setSortOrder("asc");
                  setSortField("title");
                  setCurrentPage(1);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded transition whitespace-nowrap"
            >
              Reset
            </button>
          </div>

          {/* Books Table - horizontally scrollable on small screens */}
          <div className="overflow-x-auto">
            <BooksTable books={paginatedBooks} onEdit={handleEdit} onDelete={handleDelete} />
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-center items-center mt-6 space-y-2 sm:space-y-0 sm:space-x-4 text-teal-200">
            <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-teal-600 rounded disabled:opacity-50 hover:bg-teal-700 transition"
            >
              Prev
            </button>
            <span>
            Page {currentPage} of {totalPages}
          </span>
            <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-teal-600 rounded disabled:opacity-50 hover:bg-teal-700 transition"
            >
              Next
            </button>
          </div>

          {/* Dialogs */}
          <Dialog
              isOpen={isAddDialogOpen}
              onCancel={() => setIsAddDialogOpen(false)}
              onConfirm={() => {
                const form = document.querySelector("#add-book-dialog form") as HTMLFormElement | null;
                if (form) form.requestSubmit();
              }}
              title="Add New Book"
          >
            <div id="add-book-dialog">
              <BookForm onSubmit={handleFormSubmit} />
            </div>
          </Dialog>

          <Dialog
              isOpen={isEditDialogOpen}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedBook(null);
              }}
              onConfirm={() => {
                const form = document.querySelector("#edit-book-dialog form") as HTMLFormElement | null;
                if (form) form.requestSubmit();
              }}
              title="Edit Book"
          >
            <div id="edit-book-dialog">{selectedBook && <BookForm book={selectedBook} onSubmit={handleFormSubmit} />}</div>
          </Dialog>

          <Dialog
              isOpen={isDeleteDialogOpen}
              onCancel={() => {
                setIsDeleteDialogOpen(false);
                setSelectedBook(null);
              }}
              onConfirm={confirmDelete}
              title="Delete Book"
          >
            <p>
              Are you sure you want to delete <strong>{selectedBook?.title}</strong>?
            </p>
          </Dialog>
        </div>
      </div>
  );
};

export default BooksPage;

import React, { useState, useEffect } from "react";
import type { Book } from "../../types/Book";

interface BookFormProps {
    book?: Book | null;
    onSubmit: (
        bookData: Omit<Book, "_id" | "createdAt" | "updatedAt" | "coverImageUrl" | "bookId">
    ) => void;
}

const initialFormState = {
    title: "",
    author: "",
    category: "",
    isbn: "",
    publisher: "",
    publishYear: "",
    description: "",
    price: "",
    quantity: "1",
    copiesAvailable: "1",
};

const BookForm: React.FC<BookFormProps> = ({ book, onSubmit }) => {
    const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                author: book.author,
                category: book.category ?? "",
                isbn: book.isbn ?? "",
                publisher: book.publisher ?? "",
                publishYear: book.publishYear?.toString() ?? "",
                description: book.description ?? "",
                price: book.price.toString(),
                quantity: (book.quantity ?? 1).toString(),
                copiesAvailable: (book.copiesAvailable ?? 1).toString(),
            });
        } else {
            setFormData(initialFormState);
        }
    }, [book]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value === "" || /^\d+$/.test(value)) {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const quantityNum = parseInt(formData.quantity, 10);
        const copiesAvailableNum = parseInt(formData.copiesAvailable, 10);

        if (copiesAvailableNum > quantityNum) {
            alert("Copies Available cannot exceed Quantity");
            return;
        }

        if (!formData.title.trim() || !formData.author.trim()) {
            alert("Please fill in the required fields: Title and Author");
            return;
        }

        onSubmit({
            title: formData.title.trim(),
            author: formData.author.trim(),
            category: formData.category ? formData.category.trim() : undefined,
            isbn: formData.isbn ? formData.isbn.trim() : undefined,
            publisher: formData.publisher ? formData.publisher.trim() : undefined,
            publishYear: formData.publishYear ? parseInt(formData.publishYear, 10) : undefined,
            description: formData.description ? formData.description.trim() : undefined,
            price: parseFloat(formData.price),
            quantity: quantityNum,
            copiesAvailable: copiesAvailableNum,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-[#1e293b] p-6 rounded-lg shadow-lg">
            {[
                { label: "Book Title", name: "title", type: "text" },
                { label: "Author", name: "author", type: "text" },
                { label: "Category", name: "category", type: "text" },
                { label: "ISBN", name: "isbn", type: "text" },
                { label: "Publisher", name: "publisher", type: "text" },
                { label: "Publish Year", name: "publishYear", type: "number", min: 0, step: 1 },
                { label: "Price ($)", name: "price", type: "number", min: 0, step: "0.01" },
                { label: "Quantity", name: "quantity", type: "number", min: 0, step: 1 },
                { label: "Copies Available", name: "copiesAvailable", type: "number", min: 0, step: 1 },
            ].map(({ label, name, type, min, step }) => (
                <div key={name}>
                    <label htmlFor={name} className="block text-sm font-medium text-teal-300 mb-1">
                        {label}
                    </label>
                    <input
                        type={type}
                        id={name}
                        name={name}
                        value={(formData as any)[name]}
                        onChange={
                            name === "price"
                                ? handlePriceChange
                                : type === "number"
                                    ? handleNumberChange
                                    : handleChange
                        }
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 border-teal-700 bg-[#0f172a] text-teal-200 placeholder-teal-500"
                        placeholder={`Enter ${label.toLowerCase()}`}
                        min={min}
                        step={step}
                    />
                </div>
            ))}

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-teal-300 mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 border-teal-700 bg-[#0f172a] text-teal-200 placeholder-teal-500"
                    placeholder="Enter description"
                />
            </div>

            <button
                type="submit"
                className="w-full px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
            >
                Save Book
            </button>
        </form>
    );
};

export default BookForm;

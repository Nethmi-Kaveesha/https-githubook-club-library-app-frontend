
import type {Book} from "../types/Book.ts";
import type {Order} from "../types/Order.ts";
import type {Lending} from "../types/Lending.ts";
import type {Reader} from "../types/Reader.ts";
//import type { Order } from "../types/Order"


export const booksData: Book[] = [
  {
    _id: "1",
    bookId: "B001",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 15.99,
    available: true,
    quantity: 10,
    copiesAvailable: 7,
  },
  {
    _id: "2",
    bookId: "B002",
    title: "1984",
    author: "George Orwell",
    price: 12.99,
    available: false,
    quantity: 5,
    copiesAvailable: 0,
  },
  {
    _id: "3",
    bookId: "B003",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 14.49,
    available: true,
    quantity: 8,
    copiesAvailable: 4,
  },
  {
    _id: "4",
    bookId: "B004",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    price: 13.75,
    available: true,
    quantity: 6,
    copiesAvailable: 6,
  },
  {
    _id: "5",
    bookId: "B005",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 9.99,
    available: false,
    quantity: 4,
    copiesAvailable: 0,
  },
];


export const readersData: Reader[] = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    nic: "987654321V",
    address: "123 Main St, New York, NY 10001",
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 234 567 8901",
    nic: "123456789V",
    address: "456 Oak Ave, Los Angeles, CA 90001",
  },
]

export const ordersData: Order[] = [
  {
    id: 1,
    customerId: 1,
    customerName: "John Doe",
    items: [
      { itemId: 1, itemName: "Wireless Headphones", price: 99.99, quantity: 1, subtotal: 99.99 },
      { itemId: 3, itemName: "USB-C Cable", price: 12.99, quantity: 2, subtotal: 25.98 },
    ],
    total: 125.97,
    date: "2025-05-27T10:30:00Z",
    status: "completed",
  },
  {
    id: 2,
    customerId: 2,
    customerName: "Jane Smith",
    items: [{ itemId: 2, itemName: "Bluetooth Speaker", price: 49.99, quantity: 1, subtotal: 49.99 }],
    total: 49.99,
    date: "2025-05-27T14:15:00Z",
    status: "pending",
  },
]

export const lendingsData: Lending[] = [
  {
    _id: "1001",
    readerId: "1",
    readerName: "John Doe",
    books: [
      { _id: "1", bookTitle: "The Great Gatsby" },
      { _id: "3", bookTitle: "To Kill a Mockingbird" },
    ],
    borrowDate: "2025-06-01T10:00:00Z",
    dueDate: "2025-06-08T10:00:00Z",
    returnDate: "2025-06-07T16:00:00Z",
    status: "returned",
  },
  {
    _id: "1002",
    readerId: "2",
    readerName: "Jane Smith",
    books: [{ _id: "2", bookTitle: "1984" }],
    borrowDate: "2025-06-05T14:30:00Z",
    dueDate: "2025-06-12T14:30:00Z",
    // Not returned yet
    status: "borrowed",
  },
]

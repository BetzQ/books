import React, { useState, useEffect, useRef } from "react";
import { API_URL, Book, addBook, deleteBook, getBooksByUserId } from "../api";
import "../styles/MyBook.css";
import EditBook from "../components/EditBook";

const MyBook: React.FC = () => {
  const [title, setTitle] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Retrieve user_id from localStorage
    const userDetail = localStorage.getItem("user_detail");
    if (userDetail) {
      const user = JSON.parse(userDetail);
      if (user) {
        setUserId(user);
        fetchBooks(user);
      }
    }
  }, []);

  const fetchBooks = async (userId: number) => {
    try {
      const booksData = await getBooksByUserId(userId);
      setBooks(booksData);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setDocument(event.target.files[0]);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
      setImagePreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleAddBook = async () => {
    try {
      if (!title || !document || !image || !userId) {
        alert("Please provide title, document, image, and user ID.");
        return;
      }

      await addBook(title, userId, document, image);
      setTitle("");
      setDocument(null);
      setImage(null);
      setImagePreview(null);
      if (documentInputRef.current) {
        documentInputRef.current.value = "";
      }

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }

      fetchBooks(userId);
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book); // Set buku yang sedang diedit
  };

  const handleDeleteBook = async (bookId: number) => {
    try {
      // Konfirmasi sebelum menghapus
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this book?"
      );
      if (!confirmDelete) {
        return; // Batal jika tidak dikonfirmasi
      }

      // Dapatkan userId dari localStorage
      const userDetailString = localStorage.getItem("user_detail");
      if (!userDetailString) {
        throw new Error("User details not found in localStorage");
      }
      const userDetail = JSON.parse(userDetailString);
      const userId = userDetail;

      // Kirim permintaan DELETE ke server menggunakan fungsi deleteBook
      await deleteBook(bookId, userId);

      // Muat ulang daftar buku setelah penghapusan
      await fetchBooks(userId);
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  return (
    <div className="book-container">
      <div className="add-book">
        <h2>Add Book</h2>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" value={title} onChange={handleTitleChange} />
        </div>
        <div className="form-group">
          <label>Document:</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleDocumentChange}
            ref={documentInputRef}
          />
        </div>
        <div className="form-group">
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={imageInputRef}
          />
          {imagePreview && <img src={imagePreview} className="book-img" />}
        </div>
        <button onClick={handleAddBook}>Add Book</button>
      </div>

      <div className="my-books">
        <h2>My Books</h2>
        <ul>
          {books.map((book) => (
            <li key={book.id} className="book-item">
              {/* Render input form jika buku sedang diedit */}
              {editingBook && editingBook.id === book.id ? (
                <EditBook
                  book={book}
                  setEditingBook={setEditingBook}
                  fetchBooks={fetchBooks}
                />
              ) : (
                <>
                  <div className="book-title">Title: {book.title}</div>
                  <div className="book-image">
                    Image:{" "}
                    <img
                      src={`${API_URL}/${book.imageUrl}`}
                      alt={book.title}
                      className="book-img"
                    />
                  </div>
                  <div className="book-download">
                    <span>&#x25B6;&#x25B6;</span>
                    <a
                      target="_blank"
                      href={`${API_URL}/${book.file}`}
                      download
                    >
                      See Document
                    </a>
                    <span>&#x25C0;&#x25C0;</span>
                  </div>
                  <div className="book-edit">
                    {/* Tombol edit dengan fungsi handleEditBook */}
                    <button onClick={() => handleEditBook(book)}>Edit</button>
                    <button onClick={() => handleDeleteBook(book.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyBook;

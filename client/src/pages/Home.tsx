import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";

interface Book {
  id: number;
  title: string;
  file: string;
  imageUrl: string;
  username: string;
}

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Periksa apakah user_detail ada di localStorage
    const userDetail = localStorage.getItem("user_detail");
    if (!userDetail) {
      // Jika tidak, arahkan pengguna ke rute /login
      navigate("/login");
    } else {
      // Jika ada, ambil data buku
      fetchBooks();
    }
  }, [navigate]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get<Book[]>(`${API_URL}/book`);

      setBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  return (
    <div className="home-container">
      <h1 className="title">Welcome to the Book Gallery</h1>
      <div className="book-gallery">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <img
              className="book-images"
              src={`${API_URL}/${book.imageUrl}`}
              alt={book.title}
            />
            <div className="book-info">
              <h2 className="book-title">{book.title}</h2>
              <h5>Author: {book.username}</h5>
              <div className="book-actions">
                <a
                  href={`${API_URL}/${book.file}`}
                  target="_blank"
                  download
                  className="download-link"
                >
                  See Document
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

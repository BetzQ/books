import React, { useState } from "react";
import { Book, updateBook } from "../api";
import "../styles/EditBook.css";

interface EditBookProps {
  book: Book;
  setEditingBook: React.Dispatch<React.SetStateAction<Book | null>>;
  fetchBooks: (userId: number) => Promise<void>;
}

const EditBook: React.FC<EditBookProps> = ({
  book,
  setEditingBook,
  fetchBooks,
}) => {
  const [title, setTitle] = useState(book.title);
  const [document, setDocument] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);

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
    }
  };

  const handleSave = async () => {
    try {
      // Mendapatkan user_id dari localStorage
      const userDetailString = localStorage.getItem("user_detail");
      if (!userDetailString) {
        throw new Error("User details not found in localStorage");
      }
      const userDetail = JSON.parse(userDetailString);
      const userId = userDetail;

      const formData = new FormData();
      formData.append("title", title);
      formData.append("userId", userId);
      if (document) {
        formData.append("document", document);
      }
      if (image) {
        formData.append("image", image);
      }

      await updateBook(book.id, formData);
      await fetchBooks(userId);
      setEditingBook(null);
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  return (
    <div className="edit-form">
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter title"
        />
      </div>
      <div className="form-group">
        <label htmlFor="document">Document:</label>
        <input
          id="document"
          type="file"
          accept=".pdf"
          onChange={handleDocumentChange}
          placeholder="Choose document"
        />
      </div>
      <div className="form-group">
        <label htmlFor="image">Image:</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          placeholder="Choose image"
        />
      </div>
      <button className="save-button" onClick={handleSave}>
        Save
      </button>
      <button className="cancel-button" onClick={() => setEditingBook(null)}>
        Cancel
      </button>
    </div>
  );
};

export default EditBook;

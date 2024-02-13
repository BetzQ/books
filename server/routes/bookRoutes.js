const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const connection = require("../config/db");
const fs = require("fs");

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

// Initialize multer upload
const upload = multer({ storage: storage });

// Route for getting all books with user information
router.get("/", (req, res) => {
  connection.query(
    "SELECT books.id, books.title, books.file, books.imageUrl, books.user_id, users.username FROM books INNER JOIN users ON books.user_id = users.id",
    (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to retrieve books" });
      }
      return res.status(200).json(results);
    }
  );
});

// Route for getting books by user_id
router.get("/user/:userId", (req, res) => {
  const userId = req.params.userId;

  connection.query(
    "SELECT * FROM books WHERE user_id = ?",
    [userId],
    (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to retrieve books" });
      }
      return res.status(200).json(results);
    }
  );
});

// Route for adding a book
router.post(
  "/",
  upload.fields([
    { name: "document", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  (req, res) => {
    const { title, userId } = req.body;
    const files = req.files; // Access multiple files

    // Check if title, files, and userId are provided
    if (!title || !files || !userId) {
      return res
        .status(400)
        .json({ message: "Title, files, and user ID are required" });
    }

    // Get file paths for documents and images
    const documentFilePath = files.document[0].path;
    const imageFilePath = files.image[0].path;

    connection.query(
      "INSERT INTO books (title, file, imageUrl, user_id) VALUES (?, ?, ?, ?)",
      [title, documentFilePath, imageFilePath, userId],
      (error, results, fields) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Failed to add book" });
        }
        return res.status(201).json({ message: "Book added successfully" });
      }
    );
  }
);

// Route for updating a book
router.put(
  "/:id",
  upload.fields([
    { name: "document", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  (req, res) => {
    const bookId = req.params.id;
    const { title, userId } = req.body;
    const files = req.files; // Access multiple files

    // Check if the user has permission to update the book
    connection.query(
      "SELECT * FROM books WHERE id = ? AND user_id = ?",
      [bookId, userId],
      (error, results, fields) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Failed to update book" });
        }
        if (results.length === 0) {
          return res
            .status(403)
            .json({ message: "You are not authorized to update this book" });
        }

        let query = "UPDATE books SET ";
        let values = [];

        // Check each field individually and append to the query if it exists
        if (title) {
          query += "title = ?, ";
          values.push(title);
        }
        if (userId) {
          query += "user_id = ?, ";
          values.push(userId);
        }
        if (files && files.document && files.document[0]) {
          const documentFilePath = files.document[0].path;
          query += "file = ?, ";
          values.push(documentFilePath);
        }
        if (files && files.image && files.image[0]) {
          const imageFilePath = files.image[0].path;
          query += "imageUrl = ?, ";
          values.push(imageFilePath);
        }
        if (
          files &&
          files.document &&
          files.document[0] &&
          results[0] &&
          results[0].file
        ) {
          fs.unlinkSync(results[0].file);
        }
        if (
          files &&
          files.image &&
          files.image[0] &&
          results[0] &&
          results[0].imageUrl
        ) {
          fs.unlinkSync(results[0].imageUrl);
        }
        // Remove the last comma and space
        query = query.slice(0, -2);
        query += " WHERE id = ?";
        values.push(bookId);

        connection.query(query, values, (error, results, fields) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to update book" });
          }
          // Remove old files if they exist
          return res.status(200).json({ message: "Book updated successfully" });
        });
      }
    );
  }
);

// Route for deleting a book
router.delete("/:id", (req, res) => {
  const bookId = req.params.id;
  const userId = req.body.userId;

  // Check if the user has permission to delete the book
  connection.query(
    "SELECT file, imageUrl FROM books WHERE id = ? AND user_id = ?",
    [bookId, userId],
    (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete book" });
      }
      if (results.length === 0) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this book" });
      }

      const bookData = results[0];

      // Delete associated files before deleting the book entry from the database
      if (bookData.file) {
        fs.unlinkSync(bookData.file);
      }
      if (bookData.imageUrl) {
        fs.unlinkSync(bookData.imageUrl);
      }

      // Delete book entry from the database after associated files are deleted
      connection.query(
        "DELETE FROM books WHERE id = ?",
        [bookId],
        (error, results, fields) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to delete book" });
          }
          return res.status(200).json({ message: "Book deleted successfully" });
        }
      );
    }
  );
});

module.exports = router;

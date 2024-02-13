const express = require("express");
const createDatabase = require("./createDatabase");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
const PORT = 3001;

// Middleware untuk mengaktifkan CORS
app.use(cors());

// Middleware untuk mengurai body dari permintaan HTTP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mengecek dan membuat database, tabel, dan seeder jika belum ada
createDatabase()
  .then(() => {
    // Menggunakan routes
    app.use("/user", userRoutes);
    app.use("/book", bookRoutes);

    // Menyediakan akses ke direktori upload untuk gambar dan file dokumen
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    // Lanjutkan menjalankan server Express
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error:", err);
  });

const connection = require("./config/db");

// Fungsi untuk membuat database, tabel, dan seeder jika belum ada
// Fungsi untuk membuat database, tabel, dan seeder jika belum ada
function createDatabase() {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) return reject(err);
      console.log("Connected to MySQL server");

      // Membuat database 'books' jika belum ada
      connection.query("CREATE DATABASE IF NOT EXISTS books", (err) => {
        if (err) return reject(err);
        console.log('Database "books" created or already exists');

        // Menggunakan database 'books'
        connection.query("USE books", (err) => {
          if (err) return reject(err);
          console.log('Using database "books"');

          // Membuat tabel 'users' jika belum ada
          connection.query(
            `CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
              )`,
            (err) => {
              if (err) return reject(err);
              console.log('Table "users" created or already exists');

              // Cek apakah tabel users sudah berisi data
              connection.query(
                "SELECT COUNT(*) AS userCount FROM users",
                (err, results) => {
                  if (err) return reject(err);

                  // Jika tabel users masih kosong, jalankan seeder
                  if (results[0].userCount === 0) {
                    // Seeder untuk users
                    const usersSeeder = `INSERT INTO users (id, username, password) VALUES
                      (1001, 'john_doe', 'password123'),
                      (1002, 'jane_smith', 'qwerty987'),
                      (1003, 'emma_jones', 'p@ssw0rd!')`;

                    connection.query(usersSeeder, (err) => {
                      if (err) return reject(err);
                      console.log("Seeder for users added successfully");
                      resolve(); // Selesai membuat database dan tabel
                    });
                  } else {
                    resolve(); // Selesai membuat database dan tabel (tidak ada seeder yang dijalankan)
                  }
                }
              );
            }
          );

          // Membuat tabel 'books' jika belum ada
          connection.query(
            `CREATE TABLE IF NOT EXISTS books (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                file VARCHAR(255) NOT NULL,
                imageUrl VARCHAR(255) NOT NULL,
                user_id INT,
                FOREIGN KEY (user_id) REFERENCES users(id)
              )`,
            (err) => {
              if (err) return reject(err);
              console.log('Table "books" created or already exists');
            }
          );
        });
      });
    });
  });
}

module.exports = createDatabase;

module.exports = createDatabase;

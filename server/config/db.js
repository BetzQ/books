const mysql = require("mysql2");

const dbConfig = {
  host: "localhost",
  user: "root", // Sesuaikan dengan pengguna MySQL Anda
  password: "", // Sesuaikan dengan kata sandi MySQL Anda
  multipleStatements: true,
};

const connection = mysql.createConnection(dbConfig);

module.exports = connection;

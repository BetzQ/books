const express = require("express");
const router = express.Router();
const connection = require("../config/db");

// Route for user login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  connection.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to login" });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const user = results[0];
      return res.status(200).json({ message: "Login successful", user });
    }
  );
});

// Route for getting user info based on user_id
router.get("/:id", (req, res) => {
  const userId = req.params.id;
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to get user info" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      const user = results[0];
      return res.status(200).json(user);
    }
  );
});

// Route for updating user
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  const { username, password } = req.body;
  let query = "UPDATE users SET ";
  let values = [];
  if (username) {
    query += "username = ?, ";
    values.push(username);
  }
  if (password) {
    query += "password = ?, ";
    values.push(password);
  }
  // Remove the last comma and space
  query = query.slice(0, -2);
  query += " WHERE id = ?";
  values.push(userId);

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to update user" });
    }
    return res.status(200).json({ message: "User updated successfully" });
  });
});

module.exports = router;

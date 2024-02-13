import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  // Mengambil userId dari localStorage
  const userId = localStorage.getItem("user_detail")
    ? JSON.parse(localStorage.getItem("user_detail")!)
    : null;

  function handleLogout() {
    localStorage.removeItem("user_detail");
  }

  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Book
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/mybook" className="nav-link">
            My Book
          </Link>
        </li>
        <li className="nav-item">
          {/* Menambahkan userId ke URL saat menuju ke halaman Account */}
          <Link
            to={userId ? `/account/${userId}` : "/account"}
            className="nav-link"
          >
            Account
          </Link>
        </li>
        <li className="nav-item" style={{ background: "red" }}>
          <Link to="/login" className="nav-link" onClick={handleLogout}>
            LogOut
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

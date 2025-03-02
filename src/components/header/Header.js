import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./header.css";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header>
      <span className="header-text">CodeBeast</span>
      <div className="header-buttons-div">
        {(location.pathname === "/login" || location.pathname === "/register") && (
          <Link to="/">
            <button className="header-button">Home</button>
          </Link>
        )}
        {!token && location.pathname !== "/register" && (
          <Link to="/register">
            <button className="header-button">Sign Up</button>
          </Link>
        )}
        {!token && location.pathname !== "/login" && (
          <Link to="/login">
            <button className="header-button">Login</button>
          </Link>
        )}
        {token && (
          <button className="header-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;

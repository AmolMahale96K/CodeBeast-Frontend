import React from "react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} CodeBeast | All rights reserved</p>
        <div className="footer-links">
          <a href="https://www.instagram.com/amolmahale96k" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="icon" />
          </a>
          <a href="https://www.linkedin.com/in/amolmahale96k" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="icon" />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <a href="/privacy-policy">Privacy Policy</a> | 
        <a href="/terms-of-service"> Terms of Service</a> | 
        <a href="/contact"> Contact Us</a>
      </div>
    </footer>
  );
}

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2 className="footer-logo">PetSwap</h2>
          <p className="footer-desc">
            Buy & sell second-hand items safely and easily.
          </p>
        </div>

        <div className="footer-section">
          <h3>Marketplace</h3>
          <ul>
            <li><Link to="/products">Browse Items</Link></li>
            <li><Link to="/products/new">Sell an Item</Link></li>
            <li><Link to="/products">Popular Listings</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li><Link to="/comingSoon">Help Center</Link></li>
            <li><Link to="/comingSoon">Safety Tips</Link></li>
            <li><Link to="/contactUs">Contact Us</Link></li>
            <li><Link to="/contactUs">Report an Issue</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><Link to="/comingSoon">Terms of Service</Link></li>
            <li><Link to="/comingSoon">Privacy Policy</Link></li>
            <li><Link to="/comingSoon">Cookie Policy</Link></li>
          </ul>
        </div>

      </div>

      <div className="footer-copyright">
        © 2026 PetSwap. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

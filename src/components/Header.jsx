import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../pages/CartContext";
import { IoEarth } from "react-icons/io5"; // classic earth icon
import { useSearch } from "../pages/SearchContext";
import {
   FaHome,
  FaInfoCircle,
  FaPhoneAlt,
  FaInstagram,
  FaTelegramPlane,
  FaWhatsapp,
  FaSearch,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount } = useCart();
 
  const { search, setSearch } = useSearch();



  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="header">

        
          <div className="header-marquee">
  <div className="marquee-content">
    <span>✅ 100% Successful</span>
    <span>✅ 100% Trustable</span>
    <span>✅  50% Discount</span>
    <span>✅  100% Guaranteed</span>
    <span>✅  Quality Guaranteed</span>
    <span>✅  Limited Offers</span>
    <span>✅  24/7 Support</span>
    <span>✅  100% Satisfaction</span>
      </div>
</div>

        {/* LEFT - HAMBURGER */}
        <div className="left-section">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars />
          </button>
        </div>

        {/* CENTER - LOGO */}
        <div className="center-section">
          <img src="sns2.svg" alt="Company Logo" className="logo" />
        </div>

        {/* RIGHT SECTION */}
        <div className="right-section">

          {/* LOCATION (Desktop only) */}
       <div className="location-box">
  <div className="icon-wrapper">
    <FaMapMarkerAlt className="location-icon" />
    <IoEarth className="earth-icon" />  {/* ✅ Classic Earth icon */}
  </div>
  <div className="location-text">
    <span className="small-text">Supply Products</span>
    <span className="bold-text">All Over the INDIA</span>
  </div>
</div>
          {/* DESKTOP SEARCH */}
         <div 
  className="icon-btn desktop-search"
 onClick={() => setSearchOpen(true)}
>
  <FaSearch />
</div>


          {/* DESKTOP CART */}
          <Link to="/checkout" className="cart-link desktop-cart">
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>

        </div>
        
      </header>
      
      
      {searchOpen && (
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="search-input"
      autoFocus   //
    />

    <button 
      className="search-close-btn"
      onClick={() => setSearchOpen(false)}
    >
      <FaTimes />
    </button>
  </div>
)}

      {/* ================= SIDEBAR ================= */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        <button
          className="close-btn"
          onClick={() => setSidebarOpen(false)}
        >
          <FaTimes />
        </button>

        {/* MOBILE SEARCH */}
 
 <div className="sidebar-location-box">
    <div className="icon-wrapper">
      <FaMapMarkerAlt className="location-icon" />
      <IoEarth className="earth-icon" />
    </div>
    <div className="location-text">
      <span className="small-text">Supply Products</span>
      <span className="bold-text">All Over the INDIA</span>
    </div>
  </div>

       <div 
  className="sidebar-search"
  onClick={() => {
    setSearchOpen(true);
    setSidebarOpen(false);
  }}
>
  <FaSearch className="menu-icon" />
  <span>Search</span>
</div>

        {/* MOBILE CART */}
        <Link
          to="/checkout"
          onClick={() => setSidebarOpen(false)}
          className="sidebar-link sidebar-cart"
        >
          <FaShoppingCart className="menu-icon" />
          Cart
          {cartCount > 0 && (
            <span className="sidebar-cart-badge">
              {cartCount}
            </span>
          )}
        </Link>

        {/* MENU LINKS */}
        <Link
          to="/"
          onClick={() => setSidebarOpen(false)}
          className="sidebar-link"
        >
          <FaHome className="menu-icon" />
          Home
        </Link>

        <Link
          to="/about"
          onClick={() => setSidebarOpen(false)}
          className="sidebar-link"
        >
          <FaInfoCircle className="menu-icon" />
          About
        </Link>

        <Link
          to="/contact"
          onClick={() => setSidebarOpen(false)}
          className="sidebar-link"
        >
          <FaPhoneAlt className="menu-icon" />
          Contact
        </Link>

        {/* SOCIAL ICONS */}
       <div className="social-icons">

  <a
    href="https://instagram.com"
    target="_blank"
    rel="noreferrer"
  >
    <FaInstagram />
  </a>

  <a
    href="https://t.me/"
    target="_blank"
    rel="noreferrer"
  >
    <FaTelegramPlane />
  </a>

  <a
    href="https://wa.me/919999999999"
    target="_blank"
    rel="noreferrer"
  >
    <FaWhatsapp />
  </a>

</div>

      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
     
    </>
  );
};

export default Header;
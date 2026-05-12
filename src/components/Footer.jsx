import React, { useState } from "react";
import Swal from "sweetalert2";
import "./Footer.css";
import { Link } from "react-router-dom";
import { FaInstagram, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
 const handleJoin = async () => {
  if (!email) {
    Swal.fire("Error", "Email is required", "error");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(
      "http://localhost:5000/api/newsletter/subscribe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      Swal.fire("Thank you!", "You joined successfully", "success");

      // clear input
      setEmail("");
    } else {
      Swal.fire("Error", data.message || "Something went wrong", "error");
    }
  } catch (error) {
    Swal.fire("Error", "Server error", "error");
  }

  setLoading(false);
};

  return (
    <footer className="footer">

      {/* TOP GLOW LINE */}
      <div className="footer-glow-line"></div>

      <div className="footer-container">

        {/* BRAND SECTION */}
        <div className="footer-brand">
          <img src="sns2.svg" className="footer-logo" alt="logo" />

          <p>
            Premium digital products, subscriptions & deals with instant delivery
            and trusted service experience.
          </p>

          <div className="socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href="https://t.me/" target="_blank" rel="noreferrer">
              <FaTelegramPlane />
            </a>
            <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-links">

          <div>
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/checkout">Cart</Link>
          </div>

         <div>
  <h4>Support</h4>

  <Link to="/faq">FAQ</Link>

  <Link to="/terms">
    Terms
  </Link>

  <Link to="/privacy">
    Privacy
  </Link>

  <Link to="/refund-policy">
    Refund
  </Link>
</div>
          <div>
            <h4>Contact</h4>
            <p>snswebofficial@gmail.com</p>
            <p>+91 9372641550</p>
            <span className="badge">24/7 Active</span>
          </div>

        </div>

        {/* NEWSLETTER BOX */}
        <div className="footer-newsletter">
          <h4>Join Newsletter</h4>
          <p>Get updates & exclusive offers</p>

          <div className="newsletter-box">
           <input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

<button
  onClick={handleJoin}
  disabled={!email || loading}
>
  {loading ? "Joining..." : "Join"}
</button>
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        © {year} SNSweb • Crafted with premium experience
      </div>

    </footer>
  );
};

export default Footer;
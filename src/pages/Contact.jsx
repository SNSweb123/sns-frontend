import React from "react";
import {
  FaHeadset,
  FaComments,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt
} from "react-icons/fa";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">

      {/* ===== HERO ===== */}
      <section className="contact-hero">
        <h1>Contact <span>Us</span></h1>
        <p>We’re here to help you with fast, premium support experience.</p>
      </section>

      {/* ===== MAIN GRID ===== */}
      <section className="contact-grid">

        {/* LEFT SIDE (CARDS) */}
        <div className="contact-cards">

          <div className="contact-card">
            <div className="icon-wrap"><FaHeadset /></div>
            <h3>Customer Care</h3>
            <p>24/7 dedicated support for all your needs.</p>
          </div>

          <div className="contact-card highlight">
            <div className="icon-wrap"><FaComments /></div>
            <h3>Live Chat</h3>
            <p>Instant support with our team.</p>
           <button
  className="chat-btn"
  onClick={() =>
    window.open(
      "https://wa.me/910000000000?text=Hello%20SNS%20Support,%20I%20need%20help.",
      "_blank"
    )
  }
>
  Start Chat
</button>
          </div>

          <div className="contact-card">
            <div className="icon-wrap"><FaEnvelope /></div>
            <h3>Email</h3>
            <p>snswebofficial@gmail.com</p>
          </div>

          <div className="contact-card">
            <div className="icon-wrap"><FaPhoneAlt /></div>
            <h3>Phone</h3>
            <p>+91 9372641550</p>
          </div>

          <div className="contact-card">
            <div className="icon-wrap"><FaMapMarkerAlt /></div>
            <h3>Global Reach</h3>
            <p>Serving customers worldwide 🌍</p>
          </div>

        </div>

        {/* RIGHT SIDE (PREMIUM PANEL) */}
        <div className="contact-panel">
          <h2>Need Help Fast?</h2>
          <p>
            Our team ensures quick responses and top-quality support.
            Get connected instantly and resolve your queries without delay.
          </p>

          <div className="panel-stats">
            <div>
              <h3>24/7</h3>
              <span>Support</span>
            </div>
            <div>
              <h3>100%</h3>
              <span>Satisfaction</span>
            </div>
          </div>

          <button
  className="panel-btn"
  onClick={() =>
    window.open(
      "https://wa.me/919372641550?text=Hello%20SNS%20Support,%20I%20need%20assistance.",
      "_blank"
    )
  }
>
  Contact Support
</button>
        </div>

      </section>

    </div>
  );
};

export default Contact;
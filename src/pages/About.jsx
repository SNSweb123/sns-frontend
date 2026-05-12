import React from 'react';
import './About.css';

function About() {
  return (
    <>
     

    <div className="about-page">

      {/* ===== HERO ===== */}
      <section className="about-hero">
        <h1>
          About <span>SNSweb</span>
        </h1>
        <p>
          We're passionate about providing high-quality Products that help
          creators, designers, and developers bring their ideas to life.
        </p>
      </section>

      {/* ===== STORY + STATS ===== */}
      <section className="about-story">
        <div className="story-card">
          <div className="story-text">
            <h2>Our Story</h2>
            <p>
              SNSweb was founded with a simple mission: to make premium  resources
              accessible to everyone. We believe that great design and development
              resources shouldn’t be limited by budget.
            </p>
            <p>
              Our curated collection includes Promocodes , Various Offer, and creative
              assets designed to help you build amazing projects faster and more
              efficiently.
            </p>
          </div>

          <div className="story-stats">
            <h3>1000+</h3>
            <p>Happy Customers</p>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="why-us">
        <h2>Why Choose Us?</h2>

        <div className="why-grid">
          <div className="why-card">
            <div className="icon">🛡️</div>
            <h4>Quality Guaranteed</h4>
            <p>All products are carefully curated and tested before listing.</p>
          </div>

          <div className="why-card">
            <div className="icon">⚡</div>
            <h4>Instant Delivery</h4>
            <p>Get your digital products delivered within 24 hours after payment.</p>
          </div>

          <div className="why-card">
            <div className="icon">❤️</div>
            <h4>Customer First</h4>
            <p>We prioritize customer satisfaction with 24/7 support.</p>
          </div>

          <div className="why-card">
            <div className="icon">⭐</div>
            <h4>Premium Selection</h4>
            <p>Only the best digital products make it to our store.</p>
          </div>
        </div>
      </section>

    </div>
       
    </>
  );
}



export default About;

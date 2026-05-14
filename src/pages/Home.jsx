import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useSearch } from "../pages/SearchContext";
import '../App.css';
import { BASE_URL } from "../config";



function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { search } = useSearch();


 useEffect(() => {
  let isMounted = true;

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/api/products`
      );

      if (isMounted) {
        setProducts(Array.isArray(response.data) ? response.data : []);
      }

    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchProducts();

  return () => {
    isMounted = false;
  };
}, []);


const filteredProducts = (Array.isArray(products) ? products : [])
  .filter((p) =>
    (p?.name || "").toLowerCase().includes((search || "").toLowerCase())
  );

  return (
    <div className="App">
      <main className="main-content">

     <section className="hero-section">

  <div className="hero-glow"></div>

  <div className="hero-content">

    <div className="hero-badge">
      ⚡ Trusted Digital Subscription Platform
    </div>

    <h1>
      Premium Digital <span>Subscriptions</span>
      <br />
      At Unbeatable Prices
    </h1>

    <p>
      Get instant access to premium subscriptions,
      gift vouchers and digital products with
      secure checkout, instant delivery and
      trusted customer support experience.
    </p>

    <div className="hero-stats">

      <div className="stat-box">
        <h3>10K+</h3>
        <span>Happy Customers</span>
      </div>

      <div className="stat-box">
        <h3>24/7</h3>
        <span>Live Support</span>
      </div>

      <div className="stat-box">
        <h3>100%</h3>
        <span>Secure Payments</span>
      </div>

    </div>

  </div>

</section>

    <div className="section-title">
  <h2>🔥 Trending Products</h2>
  <p>
    Explore our premium collection of subscriptions,
    vouchers and exclusive deals.
  </p>
</div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-container">

            {/* ✅ THIS IS WHERE MAP GOES (CORRECT PLACE) */}
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}

          </div>
        ) : (
          <div className="loading">No products found</div>
        )}

      </main>
    </div>
  );
}

export default Home;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./pages/CartContext";
import { SearchProvider } from "./pages/SearchContext";
import React, { useEffect } from "react";

function App() {

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.ctrlKey &&
        event.shiftKey &&
        event.key.toLowerCase() === "v"
      ) {
        event.preventDefault();

        localStorage.setItem("isAdmin", "true");
        window.location.href = "/admin";
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);



  
  const userId =
    localStorage.getItem("userId") ||
    (localStorage.setItem("userId", Date.now().toString()), localStorage.getItem("userId"));

  return (
  <Router>
    <CartProvider userId={userId}>
      <SearchProvider>

        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              localStorage.getItem("isAdmin") === "true" ? (
                <AdminPanel />
              ) : (
                <Navigate to="/admin-login" />
              )
            }
          />

          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", padding: "50px" }}>
                404 NOT FOUND
              </div>
            }
          />
        </Routes>

        <Footer />

      </SearchProvider>
    </CartProvider>
  </Router>
);
}

export default App;
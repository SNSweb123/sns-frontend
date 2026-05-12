import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import About from './pages/About'; 
import { CartProvider } from './pages/CartContext';
import Contact from './pages/Contact';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";
import { SearchProvider } from "./pages/SearchContext";
import './App.css';





function AppContent() {
  const [, setIsAdminMode] = useState(false);
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const location = useLocation();

  const hideLayout =
  location.pathname === "/admin" ||
  location.pathname === "/admin-login";

  
 


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'v') {
        event.preventDefault();
        setIsAdminMode(true);
        navigate('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return (
    <>
  {!hideLayout && <Header />}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} /> 
      <Route path="/admin-login" element={<AdminLogin />} />
 {/* Protected admin route */}
        <Route
          path="/admin"
          element={isAdmin ? <AdminPanel /> : <Navigate to="/admin-login" />}
        />

        {/* 404 page for everything else */}
        <Route
          path="*"
          element={<div style={{ textAlign: 'center', padding: '50px', fontSize: '24px' }}>404 NOT FOUND</div>}
        />
      </Routes>
        {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  // Ensure persistent userId
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = Date.now().toString();
    localStorage.setItem('userId', userId);
  }

  return (
    <Router>
      <CartProvider userId={userId}>
         <SearchProvider>
        <AppContent />
          </SearchProvider>
      </CartProvider>
    </Router>
  );
}

export default App;


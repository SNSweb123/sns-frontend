import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';
import { BASE_URL } from "../config";

function AdminLogin() {

  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

    const res = await axios.post(`${BASE_URL}/api/admin/login`,
        { password }
      );

      if (res.data.success) {

        localStorage.setItem('isAdmin', 'true');

        navigate('/admin');
      }

    } catch (err) {

      alert('Incorrect password!');
    }
  };


  return (
   <div className="admin-login">

  <div className="admin-logo">
    🔐
  </div>

  <h1>Admin Portal</h1>

  <p>
    Secure dashboard access
  </p>

  <form onSubmit={handleLogin}>

    <div className="input-group">
      <input
        type="password"
        placeholder="Enter Admin Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>

    <button type="submit">
      Login to Dashboard
    </button>

  </form>

  <div className="admin-footer">
    Protected & Encrypted Access
  </div>



</div>


  );
}

export default AdminLogin;
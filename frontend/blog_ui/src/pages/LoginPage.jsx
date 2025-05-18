// frontend/blog_ui/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api'; // Import the service function

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await loginUser(formData);
      console.log('Login successful:', response.data);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('authUser', JSON.stringify(response.data.user)); // Store user details

      // Trigger a re-render or state update for Navbar if needed.
      // A simple way is to navigate, then reload, or use a global state.
      navigate('/'); // Navigate to homepage
      window.location.reload(); // Force reload to update Navbar state based on localStorage
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      if (err.response && err.response.data) {
         const errorDetail = err.response.data.non_field_errors || err.response.data.detail;
         setError(errorDetail ? errorDetail[0] : 'Login failed. Invalid username or password.');
      } else {
        setError('Login failed. Please check your network or try again.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
// frontend/blog_ui/src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api'; // Import the service function

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username || !formData.email || !formData.password) {
        setError('Username, email, and password are required.');
        return;
    }

    try {
      const response = await registerUser(formData);
      console.log('Signup successful:', response.data);
      setSuccess('Registration successful! Please log in.');
      // Optionally redirect to login after a short delay or display a message
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Signup error:', err.response ? err.response.data : err.message);
      if (err.response && err.response.data) {
        // Format backend errors nicely
        const errors = err.response.data;
        let errorMsg = '';
        for (const key in errors) {
          errorMsg += `${key}: ${errors[key].join ? errors[key].join(', ') : errors[key]}\n`;
        }
        setError(errorMsg.trim() || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please check your network or try again.');
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="first_name">First Name (Optional):</label>
          <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name (Optional):</label>
          <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
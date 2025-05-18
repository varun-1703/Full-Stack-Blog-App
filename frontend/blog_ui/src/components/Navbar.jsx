// frontend/blog_ui/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // We'll create this CSS file next

const Navbar = () => {
  // We'll add logic later to check if user is logged in
  const isLoggedIn = !!localStorage.getItem('authToken'); // Simple check for now
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser'); // Remove user details if stored
    // Here you might also want to call a logout API endpoint if your backend invalidates tokens server-side
    navigate('/login');
    // Potentially force a re-render or use a state management solution to update UI
    window.location.reload(); // Quick way to refresh navbar state, improve later with context/redux
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MyBlogApp
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              All Blogs
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/blogs/create" className="nav-links">
                  Create Post
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-links-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-links">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
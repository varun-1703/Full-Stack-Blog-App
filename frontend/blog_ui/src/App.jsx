// frontend/blog_ui/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CreateBlogPage from './pages/CreateBlogPage';
import EditBlogPage from './pages/EditBlogPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css'; // Main app styles
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute


function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<BlogListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />

          {/* Protected Routes */}
          <Route
            path="/blogs/create"
            element={
              <ProtectedRoute>
                <CreateBlogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs/:id/edit"
            element={
              <ProtectedRoute>
                <EditBlogPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
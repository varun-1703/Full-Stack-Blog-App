// frontend/blog_ui/src/pages/CreateBlogPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlogPost } from '../services/api';
import './CreateBlogPage.css'; // We'll create this for styling

const CreateBlogPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!title.trim() || !content.trim()) {
      setError('Title and Content cannot be empty.');
      setIsLoading(false);
      return;
    }

    try {
      const newPostData = { title, content };
      const response = await createBlogPost(newPostData);
      console.log('Blog post created:', response.data);
      // Navigate to the newly created blog post's detail page
      navigate(`/blogs/${response.data.id}`);
    } catch (err) {
      console.error('Failed to create blog post:', err.response ? err.response.data : err.message);
      if (err.response && err.response.data) {
        // Handle specific backend errors if provided
        let errorMsg = 'Failed to create post. ';
        for (const key in err.response.data) {
          errorMsg += `${key}: ${err.response.data[key].join ? err.response.data[key].join(', ') : err.response.data[key]} `;
        }
        setError(errorMsg.trim());
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-blog-page">
      <h2>Create New Blog Post</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
};

export default CreateBlogPage;
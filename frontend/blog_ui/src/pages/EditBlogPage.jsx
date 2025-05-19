// frontend/blog_ui/src/pages/EditBlogPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBlogById, updateBlogPost } from '../services/api';
import './CreateBlogPage.css';

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: '', content: '' });
  // originalAuthorId is not strictly needed if pageState handles authorization display
  // const [originalAuthorId, setOriginalAuthorId] = useState(null);
  const [pageState, setPageState] = useState('loading'); // 'loading', 'loaded', 'error', 'unauthorized'
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get currentUser ONCE on component mount or when it fundamentally changes (e.g. login/logout causing Navbar reload)
  // This local `currentUser` won't react to localStorage changes *during* this component's lifecycle
  // unless the whole app re-renders from a higher level due to that change.
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('authUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // If you have a global auth context, use that instead of local state for currentUser.
  // For example: const { currentUser } = useAuth();

  const fetchPostData = useCallback(async () => {
    // Only proceed if `id` is available.
    if (!id) {
        setPageState('error');
        setErrorMessage('Blog post ID is missing.');
        return;
    }
    
    // No need to reset pageState to 'loading' here if it's already 'loading' from initial state
    // Or, ensure it's set if this function could be called when not initially loading
    setErrorMessage('');

    try {
      const response = await getBlogById(id);
      const postData = response.data;

      // Perform the check *before* setting form data if possible
      if (!currentUser || currentUser.id !== postData.author) {
        setErrorMessage("You are not authorized to edit this post.");
        setPageState('unauthorized');
        return; // Important: return early
      }

      setFormData({ title: postData.title, content: postData.content });
      // setOriginalAuthorId(postData.author); // Not strictly needed for display if pageState handles it
      setPageState('loaded'); // Transition to 'loaded' only after all checks and data setting
    } catch (err) {
      console.error('Failed to fetch post for editing:', err);
      if (err.response && err.response.status === 404) {
        setErrorMessage('Blog post not found.');
      } else {
        setErrorMessage('Failed to load blog post data. Please try again.');
      }
      setPageState('error');
    }
  }, [id, currentUser]); // Removed pageState from dependencies

  useEffect(() => {
    // Only fetch if we are in an initial loading state or if id changes
    // This prevents re-fetching if other state unrelated to id/user changes.
    if (id) { // Ensure id is present before fetching
        fetchPostData();
    }
  }, [id, fetchPostData]); // `fetchPostData` is the key dependency here.

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    // ... (handleSubmit remains largely the same)
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    if (!formData.title.trim() || !formData.content.trim()) {
      setErrorMessage('Title and Content cannot be empty.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await updateBlogPost(id, formData);
      navigate(`/blogs/${response.data.id}`);
    } catch (err) {
      let errorMsg = 'Failed to update post. ';
      if (err.response && err.response.data) {
        for (const key in err.response.data) {
          errorMsg += `${key}: ${err.response.data[key].join ? err.response.data[key].join(', ') : err.response.data[key]} `;
        }
      } else {
        errorMsg = 'An unexpected error occurred. Please try again.';
      }
      setErrorMessage(errorMsg.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Conditional Rendering Based on pageState ---
  if (pageState === 'loading') {
    return <p className="loading-message">Loading post data...</p>;
  }

  if (pageState === 'error' || pageState === 'unauthorized') {
    return (
      <div className="edit-blog-page-status">
        <h2>Edit Blog Post</h2>
        <p className="error-message">{errorMessage}</p>
        <Link to="/" className="action-button">Go to Homepage</Link>
      </div>
    );
  }

  // pageState === 'loaded'
  return (
    <div className="edit-blog-page">
      <h2>Edit Blog Post</h2>
      {errorMessage && isSubmitting && <p className="error-message">{errorMessage}</p>} {/* Only show submission errors here */}
      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="10"
            disabled={isSubmitting}
          />
        </div>
        <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditBlogPage;
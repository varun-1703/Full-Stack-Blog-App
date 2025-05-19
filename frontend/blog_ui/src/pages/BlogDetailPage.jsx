// frontend/blog_ui/src/pages/BlogDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogById, deleteBlogPost } from '../services/api';
import './BlogDetailPage.css'; // We'll create this

const BlogDetailPage = () => {
  const { id } = useParams(); // Get the blog post ID from the URL
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get logged-in user details from localStorage (if available)
  const storedUser = localStorage.getItem('authUser');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getBlogById(id);
        setPost(response.data);
      } catch (err) {
        console.error('Failed to fetch post:', err);
        if (err.response && err.response.status === 404) {
            setError('Blog post not found.');
        } else {
            setError('Failed to load the blog post. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]); // Re-fetch if the ID in the URL changes

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteBlogPost(id);
        navigate('/'); // Redirect to homepage after deletion
        // Optionally, show a success message (e.g., using a toast notification library)
      } catch (err) {
        console.error('Failed to delete post:', err);
        setError('Failed to delete the post. You might not have permission or an error occurred.');
      }
    }
  };

  if (loading) return <p className="loading-message">Loading post...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!post) return <p className="error-message">Blog post not found.</p>; // Should be caught by error state mostly

  // Check if the current user is the author of the post
  // The backend's `BlogPostSerializer` includes `author` (ID) and `author_username`.
  // `currentUser.id` should match `post.author` (which is the author's ID).
  const isAuthor = currentUser && post && currentUser.id === post.author;

  return (
    <div className="blog-detail-page">
      <article className="blog-post-full">
        <header className="blog-post-header">
          <h1 className="blog-post-title">{post.title}</h1>
          <p className="blog-post-meta">
            By <span className="author-name">{post.author_username || 'Unknown Author'}</span>
            {' on '}
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </time>
          </p>
        </header>

        {/* Render HTML content safely if your backend returns HTML, or just display as text.
            For now, assuming plain text that might contain newlines.
            If content can contain HTML, use a library like DOMPurify to sanitize it before using dangerouslySetInnerHTML.
            For simple text with newlines:
        */}
        <div className="blog-post-content" style={{ whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>

        {isAuthor && (
          <div className="blog-post-actions">
            <Link to={`/blogs/${post.id}/edit`} className="action-button edit-button">
              Edit Post
            </Link>
            <button onClick={handleDelete} className="action-button delete-button">
              Delete Post
            </button>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogDetailPage;
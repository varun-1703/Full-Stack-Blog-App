// frontend/blog_ui/src/components/BlogItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './BlogItem.css'; // We'll create this CSS file next

const BlogItem = ({ post }) => {
  // Function to truncate content for a preview
  const truncateContent = (content, wordLimit) => {
    const words = content.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return content;
  };

  return (
    <div className="blog-item">
      <h2 className="blog-item-title">
        <Link to={`/blogs/${post.id}`}>{post.title}</Link>
      </h2>
      <p className="blog-item-meta">
        By {post.author_username || 'Unknown Author'} on {new Date(post.created_at).toLocaleDateString()}
      </p>
      <p className="blog-item-content">{truncateContent(post.content, 30)}</p>
      <Link to={`/blogs/${post.id}`} className="read-more-link">
        Read More →
      </Link>
    </div>
  );
};

export default BlogItem;
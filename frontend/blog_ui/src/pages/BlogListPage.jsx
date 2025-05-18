// frontend/blog_ui/src/pages/BlogListPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllBlogs } from '../services/api';
import BlogItem from '../components/BlogItem';
import './BlogListPage.css'; // We'll create this

const BlogListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const fetchPosts = async (page) => {
      setLoading(true);
      setError('');
      try {
        const response = await getAllBlogs(page);
        setPosts(response.data.results); // DRF pagination structure
        setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page (from backend PAGE_SIZE)
        setTotalPosts(response.data.count);
        setCurrentPage(page); // Ensure currentPage is updated correctly
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts(currentPage);
  }, [currentPage]); // Re-fetch when currentPage changes

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination control
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Max number of page buttons to show
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
    } else {
        const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
        const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrentPage) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    return pageNumbers;
  };


  if (loading) return <p className="loading-message">Loading posts...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="blog-list-page">
      <h1>All Blog Posts</h1>
      {posts.length === 0 && !loading ? (
        <p>No blog posts found.</p>
      ) : (
        <div className="blog-list-container">
          {posts.map((post) => (
            <BlogItem key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            « Previous
          </button>

          {/* Ellipsis for first page if needed */}
          { getPageNumbers()[0] > 1 && (
            <>
              <button onClick={() => handlePageClick(1)}>1</button>
              { getPageNumbers()[0] > 2 && <span>...</span> }
            </>
          )}

          {getPageNumbers().map(pageNumber => (
            <button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              className={currentPage === pageNumber ? 'active' : ''}
            >
              {pageNumber}
            </button>
          ))}

          {/* Ellipsis for last page if needed */}
          { getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
            <>
              { getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && <span>...</span> }
              <button onClick={() => handlePageClick(totalPages)}>{totalPages}</button>
            </>
          )}

          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next »
          </button>
        </div>
      )}
       <p className="total-posts-info">Total posts: {totalPosts}</p>
    </div>
  );
};

export default BlogListPage;
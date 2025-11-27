import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient, { API_ENDPOINTS } from '@/config/api';

const Sidebar = ({ searchInput, setSearchInput, onSearch }) => {
  const [activeCategory, setActiveCategory] = useState('Gaming');
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        // Fetch only the 4 most recent published articles
        const response = await apiClient.get(
          `${API_ENDPOINTS.SHOP.BLOG.GET}?limit=4&published=true`
        );
        
        if (response.data.success) {
          setRecentPosts(response.data.articles || []);
        }
      } catch (err) {
        console.error("Error fetching recent posts:", err);
        // Keep empty array on error
        setRecentPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const categories = [
    { name: "Gaming", count: 12 },
    { name: "Smart Gadget", count: 5 },
    { name: "Software", count: 29 },
    { name: "Electronics", count: 24 },
    { name: "Laptop", count: 8 },
    { name: "Mobile & Accessories", count: 16 },
    { name: "Appliance", count: 24 }
  ];

  const popularTags = [
    "Technology", "Gaming", "Reviews", "Tutorials", "News",
    "Hardware", "Software", "Mobile", "PC", "Accessories"
  ];

  return (
    <aside className="blog-sidebar">
      <div>
        <form 
          className="search-container"
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSearch();
              }
            }}
            placeholder="Search articles..."
            className="search-input"
          />
          <button 
            type="submit" 
            className="search-button"
            onClick={(e) => {
              e.preventDefault();
              onSearch();
            }}
          >
            <i className="fa-solid fa-search"></i>
          </button>
        </form>
      </div>

      <div className="sidebar-widget recent-posts-widget">
        <h3 className="widget-title">Recent Posts</h3>
        <div className="recent-posts-list">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm text-white/60">Loading...</p>
            </div>
          ) : recentPosts.length === 0 ? (
            <p className="text-sm text-white/60 text-center py-4">No recent posts</p>
          ) : (
            recentPosts.map((post) => (
              <Link 
                key={post._id} 
                to={`/shop/article/${post._id}`}
                className="recent-post-item"
              >
                <div className="post-thumbnail">
                  <img 
                    src={post.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=160&h=120&fit=crop"} 
                    alt={post.title}
                    loading="lazy"
                  />
                  <div className="thumbnail-overlay"></div>
                </div>
                <div className="post-content">
                  <h4 className="post-title">{post.title}</h4>
                  <div className="post-meta">
                    <i className="fa-regular fa-calendar"></i>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="sidebar-widget categories-widget">
        <h3 className="widget-title">Categories</h3>
        <div className="categories-list">
          {categories.slice(0, 5).map((category, index) => (
            <a 
              key={index} 
              href="#"
              className={`category-pill ${activeCategory === category.name ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory(category.name);
              }}
            >
              <span className="category-name">{category.name}</span>
              <i className="fa-solid fa-angle-right"></i>
            </a>
          ))}
        </div>
      </div>

      <div className="sidebar-widget categories-count-widget">
        <h3 className="widget-title">Popular Categories</h3>
        <div className="categories-count-list">
          {categories.map((category, index) => (
            <div key={index} className="category-row">
              <span className="category-label">{category.name}</span>
              <span className="category-count">{category.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-widget cta-widget">
        <div className="cta-banner">
          <h4 className="cta-title">Premium Content</h4>
          <p className="cta-text">Access exclusive articles and tutorials</p>
          <button className="cta-button">
            Subscribe Now
          </button>
        </div>
      </div>

      <div className="sidebar-widget tags-widget">
        <h3 className="widget-title">Popular Tags</h3>
        <div className="tags-container">
          {popularTags.map((tag, index) => (
            <a key={index} href="#" className="tag-pill">
              {tag}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


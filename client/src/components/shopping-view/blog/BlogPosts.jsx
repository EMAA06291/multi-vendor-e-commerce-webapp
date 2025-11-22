import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient, { API_ENDPOINTS } from '@/config/api';

const BlogPosts = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(API_ENDPOINTS.SHOP.BLOG.GET);
        
        if (response.data.success) {
          setBlogPosts(response.data.articles || []);
        } else {
          setError("Failed to load articles");
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError(err.response?.data?.message || "Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
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

  if (loading) {
    return (
      <div className="main-column-spec">
        <div className="mb-8">
          <h1 className="page-title-spec mb-4">Blog</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-full"></div>
        </div>
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-column-spec">
        <div className="mb-8">
          <h1 className="page-title-spec mb-4">Blog</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-full"></div>
        </div>
        <div className="text-center py-10">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <div className="main-column-spec">
        <div className="mb-8">
          <h1 className="page-title-spec mb-4">Blog</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-full"></div>
        </div>
        <div className="text-center py-10">
          <p>No articles found. Be the first to write one!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-column-spec">
      <div className="mb-8">
        <h1 className="page-title-spec mb-4">Blog</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-full"></div>
      </div>

      <div className="space-y-10">
        {blogPosts.map((post) => (
          <Link 
            key={post._id} 
            to={`/shop/article/${post._id}`}
            className="block"
          >
            <article className="blog-card-spec relative cursor-pointer hover:opacity-90 transition-opacity">
            <div className="relative">
              <img 
                  src={post.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1470&auto=format&fit=crop"} 
                alt={post.title}
                className="blog-image-spec"
              />
              <div className="category-tag-spec">
                  {post.category || "General"}
                </div>
            </div>

            <div>
              <h2 className="blog-title-spec">
                {post.title}
              </h2>

              <div className="blog-meta-spec">
                <span>
                  <i className="fa-regular fa-calendar"></i>
                    {formatDate(post.createdAt)}
                </span>
                <span>
                    <i className="fa-regular fa-eye"></i>
                    {post.views || 0} views
                </span>
              </div>

              <p className="blog-excerpt-spec">
                  {post.excerpt || "No excerpt available"}
              </p>
            </div>
          </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogPosts;


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient, { API_ENDPOINTS } from '@/config/api';

const BlogPosts = ({ search = '' }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(API_ENDPOINTS.SHOP.BLOG.GET);
        
        if (response.data.success) {
          const articles = response.data.articles || [];
          setBlogPosts(articles);
          setFilteredPosts(articles);
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

  // Relevance-based search function
  const calculateRelevanceScore = (post, searchQuery) => {
    if (!searchQuery.trim()) return 0;

    const searchLower = searchQuery.toLowerCase().trim();
    const searchWords = searchLower.split(/\s+/).filter(word => word.length > 0);
    
    let score = 0;
    const title = (post.title || '').toLowerCase();
    const excerpt = (post.excerpt || '').toLowerCase();
    const content = (post.content || '').toLowerCase();
    const category = (post.category || '').toLowerCase();

    // Exact phrase match (highest priority)
    if (title.includes(searchLower)) score += 100;
    if (excerpt.includes(searchLower)) score += 50;
    if (content.includes(searchLower)) score += 30;
    if (category.includes(searchLower)) score += 40;

    // Word-by-word matching
    searchWords.forEach(word => {
      // Title matches (highest weight)
      if (title.includes(word)) {
        score += 20;
        // Bonus if word appears at the start of title
        if (title.startsWith(word)) score += 10;
      }
      
      // Excerpt matches
      if (excerpt.includes(word)) score += 10;
      
      // Content matches (lower weight)
      const contentMatches = (content.match(new RegExp(word, 'g')) || []).length;
      score += Math.min(contentMatches * 2, 10); // Cap at 10 points
      
      // Category matches
      if (category.includes(word)) score += 15;
    });

    // Partial word matches (fuzzy matching)
    searchWords.forEach(word => {
      if (word.length >= 3) {
        // Check if any word in title starts with search word
        const titleWords = title.split(/\s+/);
        titleWords.forEach(titleWord => {
          if (titleWord.startsWith(word)) score += 5;
        });
        
        // Check if any word in excerpt starts with search word
        const excerptWords = excerpt.split(/\s+/);
        excerptWords.forEach(excerptWord => {
          if (excerptWord.startsWith(word)) score += 3;
        });
      }
    });

    return score;
  };

  // Filter and sort posts based on search query with relevance scoring
  useEffect(() => {
    if (!search.trim()) {
      setFilteredPosts(blogPosts);
    } else {
      const postsWithScores = blogPosts.map(post => ({
        post,
        score: calculateRelevanceScore(post, search)
      }));

      // Filter out posts with score 0 and sort by relevance (highest first)
      const filtered = postsWithScores
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.post);

      setFilteredPosts(filtered);
    }
  }, [search, blogPosts]);

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3785D8] mx-auto mb-4"></div>
          <p className="text-gray-700">Loading articles...</p>
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
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!loading && blogPosts.length === 0) {
    return (
      <div className="main-column-spec">
        <div className="mb-8">
          <h1 className="page-title-spec mb-4">Blog</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-full"></div>
        </div>
        <div className="text-center py-10">
          <p className="text-gray-700">No articles found. Be the first to write one!</p>
        </div>
      </div>
    );
  }

  if (!loading && filteredPosts.length === 0 && search.trim()) {
    return (
      <div className="main-column-spec">
        <div className="mb-8">
          <h1 className="page-title-spec mb-4">Blog</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-full"></div>
        </div>
        <div className="text-center py-10">
          <p className="text-gray-700">No articles found matching "{search}"</p>
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
        {filteredPosts.map((post) => (
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


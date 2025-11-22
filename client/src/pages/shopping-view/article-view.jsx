import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { Button } from "@/components/ui/button";

const ArticleViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(
          API_ENDPOINTS.SHOP.BLOG.GET_BY_ID(id)
        );

        if (response.data.success) {
          setArticle(response.data.article);
        } else {
          setError("Article not found");
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(err.response?.data?.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E0F75] to-[#1C1DAB] text-[#ADC6E5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E0F75] to-[#1C1DAB] text-[#ADC6E5] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
          <p className="mb-6">{error || "The article you're looking for doesn't exist."}</p>
          <Button
            onClick={() => navigate("/shop/blog")}
            className="bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:from-[#2a6bb8] hover:to-[#a875c9] text-white"
          >
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E0F75] to-[#1C1DAB] text-[#ADC6E5] py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
          <Button
            onClick={() => navigate("/shop/blog")}
            variant="outline"
            className="mb-6 border-white/30 text-white hover:bg-white/10"
          >
            ← Back to Blog
          </Button>

        {/* Article Content */}
        <article className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          {/* Category */}
          <div className="mb-4">
            <span className="inline-block px-4 py-1 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] text-white rounded-full text-sm font-semibold">
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-6 text-white">{article.title}</h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-white/80 text-sm">
            <span>
              <i className="fa-regular fa-calendar mr-2"></i>
              {formatDate(article.createdAt)}
            </span>
            <span>
              <i className="fa-regular fa-user mr-2"></i>
              {article.author}
            </span>
            <span>
              <i className="fa-regular fa-eye mr-2"></i>
              {article.views} views
            </span>
          </div>

          {/* Featured Image */}
          {article.image && (
            <div className="mb-8">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 text-white rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-invert max-w-none text-white/90 leading-relaxed"
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {article.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-white/20"></div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center">
            <Button
              onClick={() => navigate("/shop/blog")}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              ← Back to Blog
            </Button>
            <div className="text-white/60 text-sm">
              Last updated: {formatDate(article.updatedAt)}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleViewPage;


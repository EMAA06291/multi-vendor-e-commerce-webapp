import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { Button } from "@/components/ui/button";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Card, CardContent } from "@/components/ui/card";

const VendorProfilePage = () => {
  const { sellerId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("products"); // "products" or "reviews"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        const [vendorRes, productsRes] = await Promise.all([
          apiClient.get(API_ENDPOINTS.SHOP.VENDOR.PROFILE(sellerId)),
          apiClient.get(API_ENDPOINTS.SHOP.VENDOR.PRODUCTS(sellerId)),
        ]);

        if (vendorRes.data.success) {
          setVendor(vendorRes.data.vendor);
        }

        if (productsRes.data.success) {
          setProducts(productsRes.data.products);
        }
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        const errorMessage = 
          err.response?.data?.message || 
          err.response?.data?.error || 
          err.message || 
          "Failed to load vendor profile";
        setError(errorMessage);
        console.error("Full error details:", {
          message: errorMessage,
          status: err.response?.status,
          data: err.response?.data,
        });
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchVendorData();
    }
  }, [sellerId]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (activeTab === "reviews" && sellerId) {
        try {
          const response = await apiClient.get(
            API_ENDPOINTS.SHOP.VENDOR.REVIEWS(sellerId)
          );
          if (response.data.success) {
            setReviews(response.data.reviews);
          }
        } catch (err) {
          console.error("Error fetching reviews:", err);
        }
      }
    };

    fetchReviews();
  }, [activeTab, sellerId]);

  const handleGetProductDetails = (productId) => {
    // Navigate to product details page
    window.location.href = `/shop/products/${productId}`;
  };

  const handleAddtoCart = (productId, stock) => {
    // Add to cart logic - you can implement this based on your cart system
    console.log("Add to cart:", productId, stock);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E0F75] to-[#1C1DAB] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading vendor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E0F75] to-[#1C1DAB] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error || "Vendor not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E0F75] to-[#1C1DAB] text-white">
      {/* Background Image Section */}
      <div className="relative h-64 md:h-80 w-full">
        <img
          src={
            vendor.backgroundImage ||
            "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1920&auto=format&fit=crop"
          }
          alt="Vendor background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={
                  vendor.profilePic ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop"
                }
                alt={vendor.storeName}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/30 object-cover"
              />
            </div>

            {/* Vendor Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {vendor.storeName}
              </h1>
              <p className="text-white/80 mb-4">{vendor.description}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {vendor.storeCategory}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {vendor.businessType}
                </span>
                {vendor.status === "approved" && (
                  <span className="bg-green-500/30 px-3 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 flex gap-4 border-b border-white/20">
            <Button
              variant={activeTab === "products" ? "default" : "ghost"}
              onClick={() => setActiveTab("products")}
              className={`${
                activeTab === "products"
                  ? "bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              Products ({products.length})
            </Button>
            <Button
              variant={activeTab === "reviews" ? "default" : "ghost"}
              onClick={() => setActiveTab("reviews")}
              className={`${
                activeTab === "reviews"
                  ? "bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              Reviews ({reviews.length})
            </Button>
          </div>

          {/* Content Section */}
          <div className="mt-8">
            {activeTab === "products" ? (
              <div>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-white/70">No products available yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <ShoppingProductTile
                        key={product._id}
                        product={product}
                        handleGetProductDetails={handleGetProductDetails}
                        handleAddtoCart={handleAddtoCart}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-white/70">No reviews yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card
                        key={review._id}
                        className="bg-white/10 backdrop-blur-lg border-white/20"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-white">
                                {review.userName || "Anonymous"}
                              </h3>
                              <p className="text-sm text-white/70">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-lg ${
                                    i < review.reviewValue
                                      ? "text-yellow-400"
                                      : "text-white/30"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-white/90">{review.reviewMessage}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfilePage;


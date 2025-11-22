import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart, ShoppingCart } from "lucide-react";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { useDispatch } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";

const Wishlist = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState(new Set());

  useEffect(() => {
    if (user?.id) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(API_ENDPOINTS.SHOP.WISHLIST.GET(user.id));
      if (response.data.success) {
        setWishlistProducts(response.data.data.products || []);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    if (!user?.id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to manage your wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      setRemovingIds((prev) => new Set(prev).add(productId));
      const response = await apiClient.post(API_ENDPOINTS.SHOP.WISHLIST.REMOVE, {
        userId: user.id,
        productId,
      });

      if (response.data.success) {
        setWishlistProducts((prev) =>
          prev.filter((product) => product._id !== productId)
        );
        toast({
          title: "Removed",
          description: "Product removed from wishlist",
        });
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove product from wishlist",
        variant: "destructive",
      });
    } finally {
      setRemovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
    navigate(`/shop/products/${productId}`);
  };

  const handleAddToCart = async (productId) => {
    if (!user?.id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    try {
      dispatch(
        addToCart({
          userId: user.id,
          productId,
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user.id));
          toast({
            title: "Added to cart",
            description: "Product added to cart successfully",
          });
        }
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E0F75] to-[#1C1DAB] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please Login</h1>
          <p className="text-white/70 mb-6">You need to be logged in to view your wishlist</p>
          <Button
            onClick={() => navigate("/auth/login")}
            className="bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:opacity-90 text-white"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E0F75] to-[#1C1DAB] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E0F75] to-[#1C1DAB] text-white py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
          <p className="text-white/70">
            {wishlistProducts.length === 0
              ? "Your wishlist is empty"
              : `${wishlistProducts.length} item${wishlistProducts.length > 1 ? "s" : ""} in your wishlist`}
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-24 h-24 mx-auto mb-6 text-white/30" />
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-white/70 mb-8">
              Start adding products you love to your wishlist
            </p>
            <Button
              onClick={() => navigate("/shop/listing")}
              className="bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:opacity-90 text-white"
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => {
              const displayPrice = product.salePrice > 0 ? product.salePrice : product.price;
              const originalPrice = product.salePrice > 0 ? product.price : null;
              const rating = product.averageReview || 0;
              const isRemoving = removingIds.has(product._id);

              return (
                <Card
                  key={product._id}
                  className="border-0 shadow-md hover:shadow-lg transition-all bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl overflow-hidden group"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          product.image ||
                          "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop"
                        }
                        alt={product.title}
                        className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        onClick={() => handleGetProductDetails(product._id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                        onClick={() => handleRemoveFromWishlist(product._id)}
                        disabled={isRemoving}
                      >
                        <Heart className={`w-5 h-5 fill-red-500 text-red-500 ${isRemoving ? "opacity-50" : ""}`} />
                      </Button>
                    </div>

                    <div className="p-6 flex flex-col items-center text-center space-y-3">
                      <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold">${displayPrice}</p>
                        {originalPrice && (
                          <p className="text-white/50 line-through text-sm">
                            ${originalPrice}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(rating)
                                ? "fill-yellow-400"
                                : "opacity-30"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-white/70 ml-1">
                          {rating.toFixed(1)}
                        </span>
                      </div>

                      <div className="flex gap-2 w-full mt-4">
                        <Button
                          className="flex-1 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] text-white hover:opacity-90 transition-all duration-300"
                          onClick={() => handleGetProductDetails(product._id)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-white/30 text-white hover:bg-white/10"
                          onClick={() => handleAddToCart(product._id)}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;


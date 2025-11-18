const Seller = require("../../models/Seller");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");
const User = require("../../models/User");

// Get vendor profile by sellerId
const getVendorProfile = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await Seller.findById(sellerId)
      .populate("userId", "userName email");

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.json({
      success: true,
      vendor: seller,
    });
  } catch (error) {
    console.error("Error fetching vendor profile:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vendor profile",
      error: error.message,
    });
  }
};

// Get vendor products by sellerId
const getVendorProducts = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const products = await Product.find({ sellerId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vendor products",
      error: error.message,
    });
  }
};

// Get vendor reviews (reviews for products belonging to this vendor)
const getVendorReviews = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // First, get all product IDs for this vendor
    const vendorProducts = await Product.find({ sellerId }).select("_id");
    const productIds = vendorProducts.map((p) => p._id.toString());

    // Get all reviews for these products (productId is stored as String in Review model)
    const reviews = await ProductReview.find({
      productId: { $in: productIds },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching vendor reviews:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vendor reviews",
      error: error.message,
    });
  }
};

module.exports = {
  getVendorProfile,
  getVendorProducts,
  getVendorReviews,
};


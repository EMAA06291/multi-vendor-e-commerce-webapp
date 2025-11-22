const express = require("express");
const {
  getVendorProfile,
  getVendorProducts,
  getVendorReviews,
  updateVendorProfile,
  getFeaturedVendors,
} = require("../../controllers/shop/vendor-controller");

const router = express.Router();

// Get vendor profile
router.get("/profile/:sellerId", getVendorProfile);

// Get vendor products
router.get("/products/:sellerId", getVendorProducts);

// Get vendor reviews
router.get("/reviews/:sellerId", getVendorReviews);

// Update vendor profile
router.put("/update/:sellerId", updateVendorProfile);

// Get featured vendors
router.get("/featured", getFeaturedVendors);

module.exports = router;


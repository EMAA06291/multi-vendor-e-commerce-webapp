const express = require("express");
const {
  getVendorProfile,
  getVendorProducts,
  getVendorReviews,
} = require("../../controllers/shop/vendor-controller");

const router = express.Router();

// Get vendor profile
router.get("/profile/:sellerId", getVendorProfile);

// Get vendor products
router.get("/products/:sellerId", getVendorProducts);

// Get vendor reviews
router.get("/reviews/:sellerId", getVendorReviews);

module.exports = router;


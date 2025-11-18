// Load environment variables from .env file if it exists
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopSellerRouter = require("./routes/shop/seller-routes");
const shopVendorRouter = require("./routes/shop/vendor-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");
const blogRouter = require("./routes/blog/blog-routes");


// MongoDB connection configuration
// Connection string should be provided via MONGODB_URI environment variable
// Format: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerceDBproject?retryWrites=true&w=majority
// Get it from MongoDB Atlas: Database > Connect > Connect your application

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://nadimhassan99921_db_user:kE1ewe4AGuMcO7nn@cluster0.zey0gnm.mongodb.net/ecommerceDBproject?retryWrites=true&w=majority";

// MongoDB connection options
// Note: useNewUrlParser and useUnifiedTopology are deprecated in mongoose 8.x
// They are enabled by default, so we don't need to specify them
const mongooseOptions = {
  // Connection pool settings
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  // Retry settings
  retryWrites: true,
  w: 'majority'
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined. Please set it in your .env file.");
    }

    const conn = await mongoose.connect(MONGODB_URI, mongooseOptions);
    
    console.log("✅ MongoDB connected successfully");
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on('reconnected', () => {
      console.log("✅ MongoDB reconnected successfully");
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });

  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("Please check your connection string in .env file or server.js");
    console.error("Error details:", error);
    // Don't exit immediately - allow server to start even if DB connection fails
    // This allows the app to continue running and attempt reconnection
    console.warn("⚠️  Server will continue to run. MongoDB will attempt to reconnect...");
  }
};

// Initialize database connection (non-blocking)
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/seller", shopSellerRouter);
app.use("/api/vendor", shopVendorRouter);

app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/blog", blogRouter);


app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));

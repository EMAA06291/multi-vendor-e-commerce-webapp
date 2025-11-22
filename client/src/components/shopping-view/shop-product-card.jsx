import React from "react";
import { Star } from "lucide-react";
import { brandOptionsMap, categoryOptionsMap } from "@/config";

const ShopProductCard = ({ product, onAdd, onViewDetails }) => {
  const displayPrice = product.salePrice > 0 ? product.salePrice : product.price;
  const originalPrice = product.salePrice > 0 ? product.price : null;
  const rating = product.averageReview || 0;
  const reviews = product.reviews || 0;
  const categoryLabel = product.category ? (categoryOptionsMap[product.category] || product.category) : null;
  const brandLabel = product.brand ? (brandOptionsMap[product.brand] || product.brand) : null;

  return (
    <div className="shop-product-card">
      <div className="shop-product-img-box" onClick={() => onViewDetails && onViewDetails(product._id)}>
        <img
          src={product.image || "https://via.placeholder.com/300x180?text=No+Image"}
          alt={product.title}
          className="shop-product-img"
        />
      </div>

      <div>
        <h3 className="shop-product-name" onClick={() => onViewDetails && onViewDetails(product._id)}>
          {product.title}
        </h3>
        <div className="shop-product-rating">
          <Star className="shop-star-icon" fill="#f5c518" color="#f5c518" size={14} />
          {rating.toFixed(1)} <span style={{ color: "#888" }}>({reviews})</span>
        </div>
        <div className="shop-product-price">
          ${displayPrice.toFixed(2)}
          {originalPrice && (
            <span className="shop-original-price"> ${originalPrice.toFixed(2)}</span>
          )}
        </div>

        {(categoryLabel || brandLabel) && (
          <div className="shop-tag-container">
            {categoryLabel && <span className="shop-tag">{categoryLabel}</span>}
            {brandLabel && <span className="shop-tag">{brandLabel}</span>}
          </div>
        )}
      </div>

      <button 
        className={`shop-add-btn ${product.totalStock === 0 ? "shop-add-btn-disabled" : ""}`}
        onClick={() => onAdd && onAdd(product._id, product.totalStock || 0)}
        disabled={product.totalStock === 0}
      >
        {product.totalStock === 0 ? "Out Of Stock" : "Add To Cart"}
      </button>
    </div>
  );
};

export default ShopProductCard;


import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const ProductCard = ({ product, onAdd }) => {
  return (
    <div className="product-card">
      <div className="product-img-box">
        <img
          src={product.image || "https://via.placeholder.com/300x180?text=No+Image"}
          alt={product.name}
          className="product-img"
        />
      </div>

      <div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <FontAwesomeIcon icon={faStar} style={{ color: "#f5c518", marginRight: "4px" }} />
          {product.rating} <span style={{ color: "#888" }}>({product.reviews})</span>
        </div>
        <div className="product-price">${product.price.toFixed(2)}</div>

        <div className="tag-container">
          {product.tags && product.tags.map((t, i) => (
            <span key={i} className="tag">{t}</span>
          ))}
        </div>
      </div>

      <button className="add-btn" onClick={() => onAdd && onAdd(product)}>
        Add To Cart
      </button>
    </div>
  );
};

export default ProductCard;

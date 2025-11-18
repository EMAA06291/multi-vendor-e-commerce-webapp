
import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import "../shop.css";

const API_BASE = "http://localhost:5000";
const TARGET_COUNT = 50;
const PRODUCTS_PER_PAGE = 12;

const makeFakeProduct = (id) => ({
  id,
  name: `Product ${id}`,
  price: Math.floor(Math.random() * 1500) + 50,
  image: `https://picsum.photos/400/300?random=${id}`,
  rating: (Math.random() * 2 + 3).toFixed(1),
  reviews: Math.floor(Math.random() * 200) + 1,
  tags: ["Tag1", "Tag2"],
});

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cartNotification, setCartNotification] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErrorMsg("");

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        if (!mounted) return;

        const normalized = (Array.isArray(data) ? data : []).map((p) => ({
          ...p,
          image: p.image || p.imageUrl || "",
        }));

        
        const all = [...normalized];
        let maxId = all.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0);
        for (let id = maxId + 1; all.length < TARGET_COUNT; id++) {
          all.push(makeFakeProduct(id));
        }

        // ensure ids are unique and sequential (1..N)
        const final = all.map((p, idx) => ({ ...p, id: idx + 1 }));

        setProducts(final);
        setLoading(false);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching products:", err);
        if (!mounted) return;
        setErrorMsg(err.message || "Failed to fetch products");
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="shop-loading">Loading products...</div>;
  if (errorMsg)
    return (
      <div className="shop-error">
        <h3>حصل خطأ أثناء جلب المنتجات</h3>
        <pre>{errorMsg}</pre>
        <p>تأكد أن السيرفر يعمل على: <code>{API_BASE}</code></p>
      </div>
    );

  // pagination
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const start = (safePage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(start, start + PRODUCTS_PER_PAGE);

  const handleAdd = async (product) => {
    try {
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || `Cart API ${res.status}`);

      setCartNotification({
        name: product.name,
        message: json.message || "تم إضافة المنتج للسلة"
      });

    
      setTimeout(() => setCartNotification(null), 4000);
    } catch (err) {
      console.error("Add to cart error:", err);
      setCartNotification({ name: "", message: "فشل إضافة المنتج للسلة" });
      setTimeout(() => setCartNotification(null), 4000);
    }
  };

  return (
    <div className="shop-container">
      <div className="shop-inner">
        <h2 className="shop-title">Shop</h2>

        <div className="products-grid">
          {currentProducts.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
        </div>

        <div className="pagination">
          <button
            className="nav-btn"
            onClick={() => setCurrentPage((s) => Math.max(1, s - 1))}
            disabled={safePage === 1}
            aria-label="Previous page"
          >
            ‹ Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`page-btn ${safePage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
              aria-current={safePage === i + 1 ? "page" : undefined}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="nav-btn"
            onClick={() => setCurrentPage((s) => Math.min(totalPages, s + 1))}
            disabled={safePage === totalPages}
            aria-label="Next page"
          >
            Next ›
          </button>
        </div>
      </div>

      {/* Notification Box */}
      {cartNotification && (
        <div className="cart-notification">
          <p>{cartNotification.message}</p>
          <div className="notif-actions">
            <button onClick={() => window.location.href = "/cart"}>
              انتقل للسلة
            </button>
            <button onClick={() => setCartNotification(null)}>
              أكمل التسوق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;

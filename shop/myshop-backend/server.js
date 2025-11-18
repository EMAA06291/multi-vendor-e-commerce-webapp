const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// بيانات أولية للمنتجات
let products = [
  { id: 1, name: "Instant Camera", price: 1499, image: "/images/camera1.jpg", rating: 4.7, reviews: 92, tags: ["Camera", "Photos"] },
  { id: 2, name: "Digital Camera", price: 999, image: "/images/camera2.jpg", rating: 4.5, reviews: 76, tags: ["Camera", "Zoom"] },
  { id: 3, name: "Headphones", price: 199, image: "/images/headphones.jpg", rating: 4.6, reviews: 40, tags: ["Audio"] },
  { "id": 4, "name": "Bluetooth Speaker", "price": 499, "image": "/images/speaker1.jpg", "rating": 4.6, "reviews": 110, "tags": ["Audio", "Portable"] },
  { "id": 5, "name": "DSLR Camera", "price": 5499, "image": "/images/camera2.jpg", "rating": 4.8, "reviews": 60, "tags": ["Camera", "Photography"] },
  { "id": 6, "name": "Laptop", "price": 8999, "image": "/images/laptop1.jpg", "rating": 4.4, "reviews": 200, "tags": ["Computers", "Work"] },
  { "id": 7, "name": "Gaming Mouse", "price": 299, "image": "/images/mouse1.jpg", "rating": 4.5, "reviews": 140, "tags": ["Gaming", "Accessories"] },
  { "id": 8, "name": "Mechanical Keyboard", "price": 799, "image": "/images/keyboard1.jpg", "rating": 4.7, "reviews": 95, "tags": ["Gaming", "Accessories"] },
  { "id": 9, "name": "Tablet", "price": 3299, "image": "/images/tablet1.jpg", "rating": 4.3, "reviews": 75, "tags": ["Computers", "Entertainment"] },
  { "id": 10, "name": "Smartphone", "price": 5999, "image": "/images/phone1.jpg", "rating": 4.6, "reviews": 180, "tags": ["Mobile", "Communication"] },
  { "id": 11, "name": "Fitness Tracker", "price": 699, "image": "/images/fitness1.jpg", "rating": 4.2, "reviews": 90, "tags": ["Fitness", "Wearable"] },
  { "id": 12, "name": "Digital Camera", "price": 2999, "image": "/images/camera3.jpg", "rating": 4.5, "reviews": 50, "tags": ["Camera", "Photography"] },
  { "id": 13, "name": "Noise Cancelling Headphones", "price": 1299, "image": "/images/headphones2.jpg", "rating": 4.6, "reviews": 120, "tags": ["Audio", "Music"] },
  { "id": 14, "name": "Portable Charger", "price": 199, "image": "/images/charger1.jpg", "rating": 4.4, "reviews": 210, "tags": ["Accessories", "Power"] },
  { "id": 15, "name": "Smart Thermostat", "price": 1599, "image": "/images/thermostat1.jpg", "rating": 4.3, "reviews": 70, "tags": ["Smart Home", "Climate"] },
  { "id": 16, "name": "Action Camera", "price": 2499, "image": "/images/camera4.jpg", "rating": 4.7, "reviews": 85, "tags": ["Camera", "Adventure"] },
  { "id": 17, "name": "VR Headset", "price": 3999, "image": "/images/vr1.jpg", "rating": 4.4, "reviews": 60, "tags": ["Gaming", "Virtual Reality"] },
  { "id": 18, "name": "Smart Light Bulb", "price": 149, "image": "/images/light1.jpg", "rating": 4.5, "reviews": 130, "tags": ["Smart Home", "Lighting"] },
  { "id": 19, "name": "Wireless Charger", "price": 299, "image": "/images/charger2.jpg", "rating": 4.3, "reviews": 90, "tags": ["Accessories", "Power"] },
  { "id": 20, "name": "E-Reader", "price": 1199, "image": "/images/ereader1.jpg", "rating": 4.6, "reviews": 50, "tags": ["Books", "Reading"] },
  { "id": 21, "name": "Portable Hard Drive", "price": 799, "image": "/images/hdd1.jpg", "rating": 4.5, "reviews": 110, "tags": ["Storage", "Computers"] },
  { "id": 22, "name": "Wireless Earbuds", "price": 499, "image": "/images/earbuds1.jpg", "rating": 4.2, "reviews": 170, "tags": ["Audio", "Music"] },
  { "id": 23, "name": "4K Monitor", "price": 3299, "image": "/images/monitor1.jpg", "rating": 4.7, "reviews": 60, "tags": ["Computers", "Display"] },
  { "id": 24, "name": "Gaming Chair", "price": 1999, "image": "/images/chair1.jpg", "rating": 4.4, "reviews": 40, "tags": ["Gaming", "Furniture"] },
  { "id": 25, "name": "Smart Door Lock", "price": 2499, "image": "/images/lock1.jpg", "rating": 4.3, "reviews": 55, "tags": ["Smart Home", "Security"] },
  { "id": 26, "name": "Drone", "price": 4999, "image": "/images/drone1.jpg", "rating": 4.6, "reviews": 75, "tags": ["Photography", "Drone"] },
  { "id": 27, "name": "Electric Scooter", "price": 3999, "image": "/images/scooter1.jpg", "rating": 4.5, "reviews": 35, "tags": ["Transport", "Electric"] },
  { "id": 28, "name": "Smart Scale", "price": 499, "image": "/images/scale1.jpg", "rating": 4.2, "reviews": 80, "tags": ["Fitness", "Health"] },
  { "id": 29, "name": "Portable Projector", "price": 1499, "image": "/images/projector1.jpg", "rating": 4.4, "reviews": 60, "tags": ["Entertainment", "Portable"] },
  { "id": 30, "name": "Gaming Console", "price": 6999, "image": "/images/console1.jpg", "rating": 4.7, "reviews": 100, "tags": ["Gaming", "Entertainment"] },
  { "id": 31, "name": "Digital Photo Frame", "price": 899, "image": "/images/frame1.jpg", "rating": 4.3, "reviews": 45, "tags": ["Photography", "Home"] },
  { "id": 32, "name": "Smart Plug", "price": 249, "image": "/images/plug1.jpg", "rating": 4.4, "reviews": 150, "tags": ["Smart Home", "Energy"] },
  { "id": 33, "name": "Laptop Stand", "price": 199, "image": "/images/stand1.jpg", "rating": 4.5, "reviews": 90, "tags": ["Computers", "Accessories"] },
  { "id": 34, "name": "Smart Doorbell", "price": 1299, "image": "/images/doorbell1.jpg", "rating": 4.6, "reviews": 70, "tags": ["Smart Home", "Security"] },
  { "id": 35, "name": "Portable Blender", "price": 499, "image": "/images/blender1.jpg", "rating": 4.2, "reviews": 50, "tags": ["Kitchen", "Portable"] },
  { "id": 36, "name": "Smart Air Purifier", "price": 2599, "image": "/images/purifier1.jpg", "rating": 4.5, "reviews": 60, "tags": ["Home", "Health"] },
  { "id": 37, "name": "Gaming Headset", "price": 799, "image": "/images/headset1.jpg", "rating": 4.6, "reviews": 85, "tags": ["Gaming", "Audio"] },
  { "id": 38, "name": "Smart Camera", "price": 1999, "image": "/images/camera5.jpg", "rating": 4.4, "reviews": 40, "tags": ["Smart Home", "Security"] },
  { "id": 39, "name": "Action Figure", "price": 199, "image": "/images/figure1.jpg", "rating": 4.3, "reviews": 30, "tags": ["Toys", "Collectibles"] },
  { "id": 40, "name": "Electric Toothbrush", "price": 599, "image": "/images/toothbrush1.jpg", "rating": 4.5, "reviews": 90, "tags": ["Health", "Personal Care"] },
  { "id": 41, "name": "Smart Glasses", "price": 3999, "image": "/images/glasses1.jpg", "rating": 4.2, "reviews": 20, "tags": ["Wearable", "Technology"] },
  { "id": 42, "name": "Portable Fan", "price": 299, "image": "/images/fan1.jpg", "rating": 4.4, "reviews": 60, "tags": ["Home", "Portable"] },
  { "id": 43, "name": "Smart Coffee Maker", "price": 2499, "image": "/images/coffee1.jpg", "rating": 4.6, "reviews": 75, "tags": ["Kitchen", "Smart Home"] },
  { "id": 44, "name": "Robot Vacuum", "price": 3999, "image": "/images/vacuum1.jpg", "rating": 4.5, "reviews": 65, "tags": ["Home", "Cleaning"] },
  { "id": 45, "name": "Electric Kettle", "price": 399, "image": "/images/kettle1.jpg", "rating": 4.3, "reviews": 80, "tags": ["Kitchen", "Appliances"] },
  { "id": 46, "name": "Smart Refrigerator", "price": 8999, "image": "/images/fridge1.jpg", "rating": 4.7, "reviews": 30, "tags": ["Kitchen", "Smart Home"] },
  { "id": 47, "name": "Wireless Gaming Controller", "price": 699, "image": "/images/controller1.jpg", "rating": 4.6, "reviews": 55, "tags": ["Gaming", "Accessories"] },
  { "id": 48, "name": "Smart Oven", "price": 4999, "image": "/images/oven1.jpg", "rating": 4.4, "reviews": 40, "tags": ["Kitchen", "Smart Home"] },
  { "id": 49, "name": "Electric Scooter Helmet", "price": 399, "image": "/images/helmet1.jpg", "rating": 4.5, "reviews": 35, "tags": ["Safety", "Transport"] },
  { "id": 50, "name": "Portable Air Conditioner", "price": 5499, "image": "/images/ac1.jpg", "rating": 4.3, "reviews": 25, "tags": ["Home", "Cooling"] }
]

;

let cart = [];


app.get("/api/products", (req, res) => {
  res.json(products);
});


app.post("/api/cart", (req, res) => {
  const { productId, quantity } = req.body;


  const product = products.find(p => p.id === Number(productId));
  if (!product) return res.status(404).json({ message: "Product not found" });

  const cartItem = cart.find(item => item.product.id === product.id);
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }

  res.json({ message: `${product.name} added to cart`, cart });
});
app.get("/api/cart", (req, res) => {
  res.json(cart);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

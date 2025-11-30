# DiagramGPT Prompt for Multi-Vendor E-Commerce Webapp Sequence Diagrams

Use this prompt in DiagramGPT to generate sequence diagrams for the multi-vendor e-commerce application.

---

## Prompt 1: User Authentication Flow

```
Create a sequence diagram showing the user authentication flow for a multi-vendor e-commerce webapp.

Actors: User, React Client (Frontend), Express Server (Backend), MongoDB Database

Flow:
1. User submits registration form with userName, email, password
2. React Client sends POST request to /api/auth/register
3. Express Server receives request and checks if user exists in MongoDB
4. If user exists, return error "User Already exists"
5. If new user, hash password with bcrypt, create new User document, save to MongoDB
6. Return success response to React Client
7. User redirected to login page
8. User submits login form with email and password
9. React Client sends POST request to /api/auth/login
10. Express Server validates credentials against MongoDB
11. If valid, generate JWT token, set HTTP-only cookie, return user data
12. React Client stores user data in Redux store
13. User authenticated and redirected to shopping home page
```

---

## Prompt 2: Shopping & Cart Flow

```
Create a sequence diagram showing the product browsing and cart management flow.

Actors: Customer, React Client, Express Server, MongoDB Database

Flow:
1. Customer visits product listing page (/shop/listing)
2. React Client sends GET request to /api/shop/products/get with filter and sort parameters
3. Express Server queries MongoDB Product collection with filters
4. MongoDB returns filtered products
5. Express Server returns product list to React Client
6. React Client displays products in grid layout with pagination
7. Customer applies filters (category, price range, brand, etc.)
8. React Client updates URL search params and fetches filtered products
9. Customer clicks "Add to Cart" on a product
10. React Client checks if user is authenticated
11. If not authenticated, redirect to login page
12. If authenticated, React Client sends POST request to /api/shop/cart/add with userId, productId, quantity
13. Express Server validates product stock availability
14. Express Server updates/creates Cart document in MongoDB
15. Express Server returns success response
16. React Client fetches updated cart items via GET /api/shop/cart/get/:userId
17. React Client updates cart count in UI
18. Customer views cart page (/shop/checkout)
19. React Client displays cart items with total amount
20. Customer proceeds to checkout
```

---

## Prompt 3: Order Creation & PayPal Payment Flow

```
Create a sequence diagram showing the order creation and PayPal payment processing flow.

Actors: Customer, React Client, Express Server, PayPal API, MongoDB Database

Flow:
1. Customer clicks "Place Order" on checkout page
2. React Client validates cart items and shipping address
3. React Client sends POST request to /api/shop/order/create with order data (userId, cartItems, addressInfo, totalAmount)
4. Express Server creates PayPal payment request with order details
5. Express Server calls PayPal API to create payment
6. PayPal API returns approval URL and payment ID
7. Express Server creates Order document in MongoDB with status "pending" and paymentStatus "pending"
8. Express Server returns approval URL and orderId to React Client
9. React Client redirects customer to PayPal approval URL
10. Customer completes payment on PayPal website
11. PayPal redirects customer back to /shop/paypal-return with paymentId and payerId
12. React Client sends POST request to /api/shop/order/capture with paymentId and payerId
13. Express Server calls PayPal API to capture payment
14. PayPal API confirms payment and returns transaction details
15. Express Server updates Order document in MongoDB: paymentStatus="completed", paymentId, payerId
16. Express Server clears Cart document in MongoDB
17. Express Server updates Product stock quantities in MongoDB
18. Express Server returns success response to React Client
19. React Client redirects customer to /shop/payment-success page
20. Customer sees order confirmation
```

---

## Prompt 4: Vendor Registration & Approval Flow

```
Create a sequence diagram showing the vendor registration and admin approval process.

Actors: User, React Client, Express Server, Admin, MongoDB Database

Flow:
1. User visits "Become a Seller" page (/shop/become-seller)
2. User fills seller application form (storeName, phone, businessType, storeCategory, description)
3. React Client sends POST request to /api/seller with userId and seller details
4. Express Server checks if user already has a seller application in MongoDB
5. If exists, return error "Application already submitted"
6. If new, Express Server creates Seller document in MongoDB with status="pending"
7. Express Server returns success message to React Client
8. User sees confirmation message "Application submitted, awaiting approval"
9. Admin logs into admin dashboard (/admin/dashboard)
10. Admin navigates to Vendors section (/admin/vendors)
11. React Client sends GET request to /api/admin/vendors/pending
12. Express Server queries MongoDB for Seller documents with status="pending"
13. Express Server returns pending vendor applications to React Client
14. Admin reviews vendor application details
15. Admin clicks "Approve" button
16. React Client sends PUT request to /api/admin/vendors/approve/:sellerId
17. Express Server updates Seller document status to "approved" in MongoDB
18. Express Server returns success response
19. Vendor can now access vendor dashboard (/vendor/dashboard)
20. Vendor can add products and manage orders
```

---

## Prompt 5: Vendor Product Management Flow

```
Create a sequence diagram showing how vendors add and manage products.

Actors: Vendor, React Client, Express Server, MongoDB Database

Flow:
1. Vendor logs into vendor dashboard (/vendor/dashboard)
2. Vendor navigates to Products page (/vendor/products)
3. React Client sends GET request to /api/vendor/products/get/:sellerId
4. Express Server queries MongoDB Product collection filtered by sellerId
5. Express Server returns vendor's products to React Client
6. Vendor clicks "Add New Product" button
7. Vendor fills product form (title, description, price, stock, category, images)
8. React Client uploads product images
9. React Client sends POST request to /api/vendor/products/add/:sellerId with product data
10. Express Server validates product data
11. Express Server creates Product document in MongoDB with sellerId reference
12. Express Server returns success response with new product data
13. React Client updates product list in UI
14. Vendor can edit product by clicking edit button
15. React Client sends PUT request to /api/vendor/products/edit/:sellerId/:productId
16. Express Server updates Product document in MongoDB
17. Vendor can delete product
18. React Client sends DELETE request to /api/vendor/products/delete/:sellerId/:productId
19. Express Server deletes Product document from MongoDB
20. React Client removes product from UI
```

---

## Prompt 6: Vendor Order Management Flow

```
Create a sequence diagram showing how vendors view and update order status.

Actors: Vendor, React Client, Express Server, MongoDB Database

Flow:
1. Vendor navigates to Orders page (/vendor/orders)
2. React Client sends GET request to /api/vendor/orders/get/:sellerId
3. Express Server queries MongoDB Order collection, filters orders containing vendor's products
4. Express Server returns vendor's orders to React Client
5. React Client displays orders in table with status, customer info, items, total
6. Vendor clicks on an order to view details
7. React Client sends GET request to /api/vendor/orders/details/:sellerId/:orderId
8. Express Server returns detailed order information
9. React Client displays order details dialog
10. Vendor updates order status (e.g., "processing", "shipped", "delivered")
11. React Client sends PUT request to /api/vendor/orders/update/:sellerId/:orderId with new status
12. Express Server updates Order document orderStatus and orderUpdateDate in MongoDB
13. Express Server returns success response
14. React Client updates order status in UI
15. Customer can see updated order status in their account page
```

---

## Prompt 7: Admin Management Flow

```
Create a sequence diagram showing admin managing products, vendors, and orders.

Actors: Admin, React Client, Express Server, MongoDB Database

Flow:
1. Admin logs into admin dashboard (/admin/dashboard)
2. Admin navigates to Products page (/admin/products)
3. React Client sends GET request to /api/admin/products/get
4. Express Server queries MongoDB Product collection (all products)
5. Express Server returns all products to React Client
6. Admin can add/edit/delete any product
7. Admin navigates to Vendors page (/admin/vendors)
8. React Client sends GET request to /api/admin/vendors/get
9. Express Server queries MongoDB Seller collection
10. Express Server returns all vendors with their status
11. Admin can approve/reject/suspend/delete vendors
12. Admin navigates to Orders page (/admin/orders)
13. React Client sends GET request to /api/admin/orders/get
14. Express Server queries MongoDB Order collection (all orders)
15. Express Server returns all orders to React Client
16. Admin can view order details and update order status
17. Admin can manage blog articles via /admin/write-article
18. Admin can manage site features via /admin/features
```

---

## Prompt 8: Product Search & Filtering Flow

```
Create a sequence diagram showing product search and advanced filtering.

Actors: Customer, React Client, Express Server, MongoDB Database

Flow:
1. Customer enters search keyword in search bar
2. React Client sends GET request to /api/shop/search/:keyword
3. Express Server performs text search on Product collection in MongoDB
4. MongoDB returns matching products
5. Express Server returns search results to React Client
6. React Client displays search results
7. Customer applies filters (category, price range, brand, rating)
8. React Client updates URL search parameters
9. React Client sends GET request to /api/shop/products/get with filter parameters
10. Express Server applies filters to MongoDB query
11. Express Server applies sorting (price-lowtohigh, price-hightolow, latest)
12. MongoDB returns filtered and sorted products
13. Express Server returns filtered products to React Client
14. React Client displays filtered products with pagination
15. Customer can change sort order via dropdown
16. React Client re-fetches products with new sort parameter
```

---

## Prompt 9: Wishlist Management Flow

```
Create a sequence diagram showing wishlist add/remove functionality.

Actors: Customer, React Client, Express Server, MongoDB Database

Flow:
1. Customer browses products on listing page
2. Customer clicks "Add to Wishlist" icon on a product
3. React Client checks if user is authenticated
4. If not authenticated, redirect to login
5. If authenticated, React Client sends POST request to /api/shop/wishlist/add with userId and productId
6. Express Server checks if product already in wishlist
7. If not exists, Express Server adds Wishlist document to MongoDB
8. Express Server returns success response
9. React Client updates wishlist icon state
10. Customer navigates to Wishlist page (/shop/wishlist)
11. React Client sends GET request to /api/shop/wishlist/get/:userId
12. Express Server queries MongoDB Wishlist collection for user's items
13. Express Server returns wishlist items with product details
14. React Client displays wishlist products
15. Customer clicks "Remove from Wishlist"
16. React Client sends DELETE request to /api/shop/wishlist/remove with userId and productId
17. Express Server removes Wishlist document from MongoDB
18. React Client updates UI to remove product from wishlist
```

---

## Prompt 10: Complete E-Commerce Flow (End-to-End)

```
Create a comprehensive sequence diagram showing the complete customer journey from registration to order completion.

Actors: Customer, React Client, Express Server, PayPal API, MongoDB Database, Vendor, Admin

Flow:
1. Customer registers account → Express Server creates User in MongoDB
2. Customer logs in → Express Server validates and sets JWT cookie
3. Customer browses products → Express Server queries MongoDB Product collection
4. Customer applies filters → Express Server filters products
5. Customer adds products to cart → Express Server updates Cart in MongoDB
6. Customer views cart → Express Server retrieves cart items
7. Customer adds shipping address → Express Server saves Address in MongoDB
8. Customer places order → Express Server creates Order and PayPal payment
9. Customer pays via PayPal → PayPal API processes payment
10. Express Server captures payment → PayPal API confirms transaction
11. Express Server updates Order status → MongoDB Order document updated
12. Express Server clears cart → MongoDB Cart cleared
13. Express Server updates product stock → MongoDB Product stock reduced
14. Vendor receives order notification → Vendor views order in dashboard
15. Vendor updates order status → Express Server updates Order in MongoDB
16. Customer tracks order → Express Server returns order status
17. Order delivered → Vendor marks as delivered
18. Customer can leave review → Express Server saves Review in MongoDB
```

---

## Usage Instructions

1. Copy any of the prompts above
2. Paste into DiagramGPT (https://diagramgpt.com or similar tool)
3. The tool will generate a visual sequence diagram
4. You can modify the prompts to focus on specific flows or add more detail
5. Combine multiple flows if needed for a comprehensive overview

## Tips for Better Diagrams

- Use specific prompt numbers for focused diagrams
- Combine prompts 1, 2, and 3 for a complete customer journey
- Use prompt 4 and 5 together for vendor onboarding flow
- Modify actor names or add more detail as needed
- Add error handling flows if needed (e.g., payment failure, stock unavailable)


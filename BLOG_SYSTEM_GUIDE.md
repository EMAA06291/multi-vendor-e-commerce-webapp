# Blog System - Complete Guide

## Overview

A complete blog system has been implemented with:
- ✅ Article writing page (for admins/authors)
- ✅ Article viewing page (for readers)
- ✅ Dynamic blog listing page (fetches from backend)
- ✅ Backend API with MongoDB integration
- ✅ Full CRUD operations for articles

## Backend Implementation

### 1. Article Model (`server/models/Article.js`)
- Stores article data in MongoDB
- Fields: title, content, excerpt, image, category, author, published status, views, tags
- Auto-generates excerpt from content if not provided
- Tracks creation and update timestamps

### 2. Blog Routes (`server/routes/blog/blog-routes.js`)
- `GET /api/blog/get` - Get all articles (with pagination and filtering)
- `GET /api/blog/get/:id` - Get single article by ID
- `POST /api/blog/create` - Create new article
- `PUT /api/blog/update/:id` - Update article
- `DELETE /api/blog/delete/:id` - Delete article

### 3. Blog Controller (`server/controllers/blog/blog-controller.js`)
- Handles all blog-related business logic
- Includes pagination, filtering, and view tracking
- Validates required fields

## Frontend Implementation

### 1. Article Writing Page (`client/src/pages/admin-view/write-article.jsx`)
**Route:** `/admin/write-article`

**Features:**
- Form to write new articles
- Fields: Title, Category, Image URL, Excerpt, Content, Tags, Publish status
- Sends article data to backend API
- Redirects to blog page after successful creation

**How to Access:**
- Navigate to: `http://localhost:5173/admin/write-article`
- Or add a link in your admin dashboard

### 2. Article Viewing Page (`client/src/pages/shopping-view/article-view.jsx`)
**Route:** `/shop/article/:id`

**Features:**
- Displays full article content
- Shows article metadata (date, author, views, category, tags)
- Automatically increments view count
- Back button to return to blog listing

**How to Access:**
- Click on any article from the blog listing page
- Or navigate directly: `http://localhost:5173/shop/article/[article-id]`

### 3. Updated Blog Listing (`client/src/components/shopping-view/blog/BlogPosts.jsx`)
**Route:** `/shop/blog`

**Features:**
- Dynamically fetches articles from backend
- Shows loading state while fetching
- Displays error message if fetch fails
- Each article card is clickable and links to article view page
- Shows article excerpt, date, views, and category

## API Endpoints

All blog endpoints are available under `/api/blog`:

### Get All Articles
```
GET /api/blog/get?category=Technology&published=true&page=1&limit=10
```

**Query Parameters:**
- `category` (optional) - Filter by category
- `published` (optional) - Filter by published status (default: true)
- `page` (optional) - Page number for pagination (default: 1)
- `limit` (optional) - Articles per page (default: 10)

**Response:**
```json
{
  "success": true,
  "articles": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Get Single Article
```
GET /api/blog/get/:id
```

**Response:**
```json
{
  "success": true,
  "article": {
    "_id": "...",
    "title": "...",
    "content": "...",
    "excerpt": "...",
    "image": "...",
    "category": "...",
    "author": "...",
    "views": 0,
    "tags": [...],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Create Article
```
POST /api/blog/create
Content-Type: application/json

{
  "title": "Article Title",
  "content": "Full article content...",
  "excerpt": "Brief summary (optional)",
  "image": "https://example.com/image.jpg",
  "category": "Technology",
  "author": "Author Name",
  "authorId": "user-id-optional",
  "published": true,
  "tags": ["tag1", "tag2"]
}
```

## How to Use

### 1. Start the Backend Server
```bash
cd server
npm run dev
```

The server should start on port 5000 and connect to MongoDB.

### 2. Start the Frontend Client
```bash
cd client
npm run dev
```

The client should start on port 5173.

### 3. Write Your First Article

1. Navigate to: `http://localhost:5173/admin/write-article`
2. Fill in the form:
   - **Title** (required): Your article title
   - **Category**: Select from dropdown (General, Technology, Business, etc.)
   - **Image URL**: Optional featured image
   - **Excerpt**: Optional (will be auto-generated from content if empty)
   - **Content** (required): Your full article content
   - **Tags**: Comma-separated tags
   - **Publish immediately**: Check to publish right away
3. Click "Publish Article"
4. You'll be redirected to the blog page where your article appears

### 4. View Articles

1. Navigate to: `http://localhost:5173/shop/blog`
2. You'll see all published articles listed
3. Click on any article to read the full content

## Database Schema

Articles are stored in MongoDB with the following structure:

```javascript
{
  _id: ObjectId,
  title: String (required),
  content: String (required),
  excerpt: String (auto-generated if not provided),
  image: String (optional),
  category: String (default: "General"),
  author: String (default: "Admin"),
  authorId: ObjectId (optional, references User),
  published: Boolean (default: false),
  views: Number (default: 0),
  tags: [String] (default: []),
  createdAt: Date,
  updatedAt: Date
}
```

## Features

✅ **Full CRUD Operations** - Create, Read, Update, Delete articles
✅ **Pagination** - Articles are paginated for better performance
✅ **Filtering** - Filter by category and published status
✅ **View Tracking** - Automatically tracks article views
✅ **Auto-excerpt** - Generates excerpt from content if not provided
✅ **Tags Support** - Add tags to articles for better organization
✅ **Published/Draft** - Control article visibility
✅ **Responsive Design** - Works on all screen sizes
✅ **Error Handling** - Proper error messages and loading states

## Next Steps (Optional Enhancements)

1. **Add Authentication** - Protect write/update/delete routes
2. **Add Image Upload** - Upload images directly instead of URLs
3. **Add Rich Text Editor** - Use a WYSIWYG editor for content
4. **Add Comments** - Allow users to comment on articles
5. **Add Search** - Search articles by title, content, or tags
6. **Add Categories Page** - Filter articles by category
7. **Add Author Pages** - Show all articles by a specific author

## Troubleshooting

### Articles not showing up?
- Check if articles are marked as `published: true`
- Verify backend is running and connected to MongoDB
- Check browser console for API errors

### Can't create articles?
- Make sure you're logged in (if authentication is required)
- Check that title and content fields are filled
- Verify backend API is accessible

### Images not displaying?
- Ensure image URLs are valid and accessible
- Check CORS settings if images are from external domains

## File Structure

```
server/
├── models/
│   └── Article.js              # Article MongoDB model
├── controllers/
│   └── blog/
│       └── blog-controller.js   # Blog business logic
├── routes/
│   └── blog/
│       └── blog-routes.js       # Blog API routes
└── server.js                    # Updated with blog routes

client/
├── src/
│   ├── pages/
│   │   ├── admin-view/
│   │   │   └── write-article.jsx    # Article writing page
│   │   └── shopping-view/
│   │       ├── blog.jsx              # Blog listing page
│   │       └── article-view.jsx      # Article viewing page
│   ├── components/
│   │   └── shopping-view/
│   │       └── blog/
│   │           └── BlogPosts.jsx     # Updated to fetch from API
│   ├── config/
│   │   └── api.js                    # Updated with blog endpoints
│   └── App.jsx                       # Updated with new routes
```

## Success! 🎉

Your blog system is now fully functional. You can:
- Write articles from the admin panel
- View articles on the blog page
- Click articles to read full content
- All data is stored in MongoDB and fetched dynamically


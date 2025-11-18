# Create Admin Account - Quick Guide

## Method 1: Using the Script (Recommended)

### Step 1: Run the create-admin script

```bash
cd server
npm run create-admin
```

This will create an admin account with:
- **Email:** `admin@example.com`
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** `admin`

### Step 2: Login

1. Start your frontend: `cd client && npm run dev`
2. Go to: `http://localhost:5173/auth/login`
3. Use the credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
4. You'll be automatically redirected to `/admin/dashboard`

## Method 2: Custom Admin Credentials

If you want to use different credentials, you can set environment variables:

### Option A: Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=your_mongodb_connection_string
ADMIN_EMAIL=your-admin@email.com
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-password
```

Then run:
```bash
cd server
npm run create-admin
```

### Option B: Register through the UI

1. Go to: `http://localhost:5173/auth/register`
2. Register with any email/username
3. The default role is "admin" (as set in the User model)
4. Login with your credentials

**Note:** All new users are created with `role: "admin"` by default, so any registered user can access admin pages.

## Method 3: Using MongoDB Directly

If you prefer to create the admin directly in MongoDB:

1. Connect to your MongoDB database
2. Insert a user document:

```javascript
{
  "userName": "admin",
  "email": "admin@example.com",
  "password": "[hashed password - use bcrypt]",
  "role": "admin"
}
```

**Note:** You'll need to hash the password using bcrypt with 12 salt rounds.

## Verify Admin Account

After creating the admin, you can verify it by:

1. **Check MongoDB:**
   ```bash
   # Connect to MongoDB and check users collection
   db.users.find({ role: "admin" })
   ```

2. **Login Test:**
   - Go to `http://localhost:5173/auth/login`
   - Use your admin credentials
   - Should redirect to `/admin/dashboard`

## Access Admin Pages

Once logged in as admin, you can access:

- **Dashboard:** `http://localhost:5173/admin/dashboard`
- **Products:** `http://localhost:5173/admin/products`
- **Orders:** `http://localhost:5173/admin/orders`
- **Features:** `http://localhost:5173/admin/features`
- **Write Article:** `http://localhost:5173/admin/write-article`

## Troubleshooting

### "Admin user already exists"
- The script detected an existing user with the same email/username
- You can either:
  1. Use the existing account
  2. Delete the existing user from MongoDB
  3. Use different credentials

### "Cannot connect to MongoDB"
- Make sure MongoDB connection string is correct in `.env` or `server.js`
- Ensure MongoDB Atlas network access allows your IP
- Check that the server is running

### "Login doesn't redirect to admin"
- Check that the user's role is set to "admin" in the database
- Verify the JWT token includes the role field
- Check browser console for errors

## Security Note

⚠️ **Important:** The default password `admin123` is not secure. 

**For production:**
1. Change the admin password immediately
2. Use a strong, unique password
3. Consider implementing password requirements
4. Add rate limiting to login endpoints
5. Use environment variables for sensitive data

## Quick Test

After creating the admin account:

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev

# Then:
# 1. Go to http://localhost:5173/auth/login
# 2. Login with admin credentials
# 3. You should be redirected to /admin/dashboard
```


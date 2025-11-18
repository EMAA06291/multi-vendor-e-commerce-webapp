# How to Run the Project

## Prerequisites
- Node.js installed (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

## Step 1: Install Dependencies

### Backend (Server)
```bash
cd server
npm install
```

### Frontend (Client)
```bash
cd client
npm install
```

## Step 2: Configure Environment Variables

### Server Configuration
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerceDBproject?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Note:** Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

### Client Configuration (Optional)
Create a `.env` file in the `client/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000
```

If you don't create this file, it will default to `http://localhost:5000`.

## Step 3: Start the Backend Server

Open a terminal and run:
```bash
cd server
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected successfully
   Host: cluster0.xxxxx.mongodb.net
   Database: ecommerceDBproject
Server is now running on port 5000
```

**If MongoDB connection fails:**
- The server will still start but show a warning
- Check your MongoDB connection string
- Make sure your IP is whitelisted in MongoDB Atlas
- Verify your username and password are correct

## Step 4: Start the Frontend Client

Open a **NEW** terminal window and run:
```bash
cd client
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Step 5: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## Common Errors and Solutions

### Error: "Cannot find module"
**Solution:** Run `npm install` in the respective directory (server or client)

### Error: "Port 5000 already in use"
**Solution:** 
- Kill the process using port 5000: `npx kill-port 5000` (or use Task Manager on Windows)
- Or change the port in `server/.env`: `PORT=5001`

### Error: "Port 5173 already in use"
**Solution:**
- Vite will automatically use the next available port (5174, 5175, etc.)
- Or kill the process: `npx kill-port 5173`

### Error: "MongoDB connection failed"
**Solution:**
- Check your connection string in `server/.env`
- Verify MongoDB Atlas network access allows your IP
- Make sure username and password are URL-encoded if they contain special characters
- The server will still run, but database operations will fail

### Error: "Module not found" in client
**Solution:**
- Clear Vite cache: `cd client && rm -rf node_modules/.vite`
- Reinstall dependencies: `npm install`
- Restart dev server

### Error: "Cannot resolve '@/config/api'"
**Solution:**
- Make sure `jsconfig.json` exists in `client/` directory
- Check that `vite.config.js` has the alias configured
- Restart the dev server

## Troubleshooting

1. **Clear all caches:**
   ```bash
   # Server
   cd server
   rm -rf node_modules
   npm install
   
   # Client
   cd client
   rm -rf node_modules node_modules/.vite
   npm install
   ```

2. **Check if ports are available:**
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :5000
   netstat -ano | findstr :5173
   ```

3. **Verify MongoDB connection:**
   - Test connection string in MongoDB Compass
   - Check MongoDB Atlas dashboard for connection issues
   - Verify network access settings

## Success Indicators

✅ **Server is running correctly when you see:**
- "✅ MongoDB connected successfully" (or warning if connection fails)
- "Server is now running on port 5000"

✅ **Client is running correctly when you see:**
- "VITE v5.x.x ready"
- Local URL displayed (usually http://localhost:5173)
- No red error messages in terminal

✅ **Application is working when:**
- Browser loads without errors
- You can navigate between pages
- API calls work (check browser console for errors)

## Next Steps

Once both server and client are running:
1. Test user registration at http://localhost:5173/auth/register
2. Test user login at http://localhost:5173/auth/login
3. Explore the application features


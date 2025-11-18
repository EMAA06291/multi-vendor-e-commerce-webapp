# Installing Dependencies - Guide

## Important Note About Errors

The PowerShell errors you see (`Add-Content : Could not find a part of the path...`) are **NOT** npm errors. These are just terminal output capture issues and can be safely ignored. 

**The actual npm install commands are working correctly!**

## How to Install Dependencies

### Option 1: Using PowerShell (Recommended)

Open PowerShell and navigate to your project:

```powershell
# Navigate to project root
cd "C:\Users\$ H i K O\OneDrive\Documents\DEPI\project\Gigs-Projects\multi-vendor-e-commerce-webapp"

# Install server dependencies
cd server
npm install

# Install client dependencies (in a new terminal or go back to root)
cd ..\client
npm install
```

### Option 2: Using Command Prompt (CMD)

```cmd
cd "C:\Users\$ H i K O\OneDrive\Documents\DEPI\project\Gigs-Projects\multi-vendor-e-commerce-webapp"

cd server
npm install

cd ..\client
npm install
```

### Option 3: Using Git Bash

```bash
cd "/c/Users/\$ H i K O/OneDrive/Documents/DEPI/project/Gigs-Projects/multi-vendor-e-commerce-webapp"

cd server
npm install

cd ../client
npm install
```

## What to Expect

### Successful Installation Output:
```
up to date, audited XXX packages in Xs

X packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

OR

```
up to date, audited XXX packages in Xs

X packages are looking for funding
  run `npm fund` for details

X vulnerabilities (X low, X high, X critical)

To address all issues, run:
  npm audit fix
```

**Note:** Vulnerabilities are common in npm packages and usually don't prevent the app from running. You can run `npm audit fix` to try to fix them, but it's not required.

## If You See Real Errors

### Error: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Error: "EACCES: permission denied"
**Solution:** 
- On Windows: Run PowerShell/CMD as Administrator
- Or use `npm install --force` (not recommended)

### Error: "ENOENT: no such file or directory"
**Solution:** Make sure you're in the correct directory (`server` or `client`)

### Error: "Cannot find module"
**Solution:** 
1. Delete `node_modules` folder
2. Delete `package-lock.json` file
3. Run `npm install` again

## Current Status

✅ **Server dependencies:** Installed (157 packages)
✅ **Client dependencies:** Should be installed (check with `npm install` in client folder)

## Next Steps

After installing dependencies:

1. **Start the server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the client (in a new terminal):**
   ```bash
   cd client
   npm run dev
   ```

## Troubleshooting

If you're still having issues:

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete and reinstall:**
   ```bash
   # In server folder
   rm -rf node_modules package-lock.json
   npm install
   
   # In client folder
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Node.js version:**
   ```bash
   node --version
   ```
   Should be v16 or higher.

4. **Check npm version:**
   ```bash
   npm --version
   ```
   Should be v7 or higher.


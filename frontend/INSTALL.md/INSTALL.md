# 🚀 RespectHub Frontend - Windows Installation Guide

## Complete Installation Instructions

### 📍 Current Location
Your backend is at: `C:\Users\kabir\Desktop\RespectHub\backend`

### Step 1: Copy Frontend Files

**Option A: Manual Copy**
1. Copy the entire `respecthub-frontend` folder
2. Paste it to: `C:\Users\kabir\Desktop\RespectHub\frontend`

**Option B: Command Line**
Open Command Prompt or PowerShell and run:
```cmd
cd C:\Users\kabir\Desktop\RespectHub
# Files should be in a 'frontend' folder here
```

### Step 2: Install Dependencies

```cmd
cd C:\Users\kabir\Desktop\RespectHub\frontend
npm install
```

This will install:
- React 18.3.1
- React Router DOM 6.22.0
- Axios 1.6.7
- Lucide React 0.263.1
- Vite 5.1.0

**Wait for installation to complete** (may take 1-2 minutes)

### Step 3: Verify Backend is Running

Open a **separate** Command Prompt window:

```cmd
cd C:\Users\kabir\Desktop\RespectHub\backend
npm start
```

You should see:
```
✅ DB connected
Server running on http://localhost:5000
```

**Keep this window open!**

### Step 4: Start Frontend

In your **original** Command Prompt window (or a new one):

```cmd
cd C:\Users\kabir\Desktop\RespectHub\frontend
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:3000/
```

### Step 5: Open in Browser

1. Open Google Chrome, Firefox, or Edge
2. Go to: `http://localhost:3000`
3. You should see the RespectHub login page! 🎉

---

## 🧪 Testing the Application

### Test Login

**Admin Account:**
- Email: `admin@respecthub.com`
- Password: `admin123`
- After login → Admin Dashboard with statistics

**Resident Account:**
- Email: `john@example.com`
- Password: `password123`
- After login → Resident Dashboard with points/badges

### Test Registration

1. Click "Register here" link
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Flat Number: A-101
3. Submit → Auto-login → Resident Dashboard

---

## 📂 Final Folder Structure

```
C:\Users\kabir\Desktop\RespectHub\
├── backend/              (Your existing backend)
│   ├── node_modules/
│   ├── package.json
│   ├── server.js
│   └── ...
└── frontend/             (New frontend)
    ├── node_modules/
    ├── public/
    ├── src/
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## ⚡ Quick Commands Reference

### Start Both Services

**Backend** (Terminal/CMD 1):
```cmd
cd C:\Users\kabir\Desktop\RespectHub\backend
npm start
```

**Frontend** (Terminal/CMD 2):
```cmd
cd C:\Users\kabir\Desktop\RespectHub\frontend
npm run dev
```

### Stop Services

- Press `Ctrl + C` in each terminal window
- Type `Y` when asked to terminate

---

## 🎯 What You Should See

### 1. Login Page
- Clean dark theme
- Gradient header with "Welcome Back"
- Email and password fields
- Register link at bottom

### 2. Resident Dashboard (after login as john@example.com)
- Stats cards: Total Points, Current Badge, Rank, Total Actions
- Badge Progress bar
- Recent Submissions list
- Sidebar navigation

### 3. Admin Dashboard (after login as admin@respecthub.com)
- Stats cards: Total Residents, Pending Reviews, Approved, Rejected
- Activity Overview
- Quick Actions section
- Sidebar navigation

---

## 🔧 Common Issues & Solutions

### ❌ "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org/

### ❌ "Cannot find module 'react'"
**Solution**: Run `npm install` in the frontend folder

### ❌ "Port 3000 is already in use"
**Solution**: 
1. Close any app using port 3000
2. OR change port in vite.config.js to 3001

### ❌ "Network Error" when logging in
**Solution**: Make sure backend is running on http://localhost:5000

### ❌ Backend not starting
**Solution**: 
```cmd
cd C:\Users\kabir\Desktop\RespectHub\backend
npm install
npm run seed
npm start
```

### ❌ White screen after opening http://localhost:3000
**Solution**: 
1. Check browser console (F12)
2. Look for errors
3. Try hard refresh (Ctrl + Shift + R)

---

## 📱 Browser Compatibility

✅ **Recommended**: 
- Google Chrome (latest)
- Microsoft Edge (latest)
- Firefox (latest)

⚠️ **Not Recommended**:
- Internet Explorer (any version)
- Very old browser versions

---

## 🎨 Features to Explore

### As Resident:
1. **Dashboard** - See your points, badge, and rank
2. **Submit Action** - Submit a community action for approval
3. **My Actions** - View all your submissions with status
4. **Leaderboard** - See where you rank in the community

### As Admin:
1. **Dashboard** - View community statistics
2. **Review Queue** - Approve or reject pending actions
3. **Filter Actions** - See pending/approved/rejected separately
4. **Add Notes** - Add rejection reasons when denying actions

---

## 🎓 Next Steps

After successful installation:

1. **Test the full workflow**:
   - Register new user → Submit action → Login as admin → Approve action → Check points update

2. **Customize**:
   - Change colors in `src/styles/index.css`
   - Add your logo
   - Modify action types in backend

3. **Deploy**:
   - Build for production: `npm run build`
   - Deploy to hosting service

---

## 💡 Pro Tips

1. **Keep both terminals open** while developing
2. **Use Chrome DevTools** (F12) to debug issues
3. **Check Network tab** to see API requests
4. **Save files** in VS Code triggers auto-refresh
5. **Use different browsers** to test compatibility

---

## ✅ Success Checklist

- [ ] Node.js installed
- [ ] Backend running on port 5000
- [ ] Frontend dependencies installed
- [ ] Frontend running on port 3000
- [ ] Can access login page
- [ ] Can login with demo accounts
- [ ] Dashboard loads correctly
- [ ] Can navigate between pages
- [ ] Can submit actions (resident)
- [ ] Can review actions (admin)

---

## 📞 Getting Help

If you encounter issues:

1. Check the error message in the terminal
2. Look at browser console (F12 → Console tab)
3. Verify both backend and frontend are running
4. Check the SETUP.md file for troubleshooting
5. Review the README.md for detailed information

---

**Congratulations! 🎉** 

You now have a fully functional community recognition platform!

---

Made with ❤️ for RespectHub
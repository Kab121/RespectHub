# RespectHub Frontend - Setup Instructions

## 🚀 Complete Setup Guide

### Step 1: Prerequisites Check

Ensure you have:
- ✅ Node.js v16+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ Backend running on http://localhost:5000

### Step 2: Install Frontend

```bash
# Navigate to the frontend directory
cd C:\Users\kabir\Desktop\RespectHub\frontend

# Install all dependencies
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Step 4: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the RespectHub login page!

## 🧪 Test with Demo Accounts

### Test Admin Account
1. Go to http://localhost:3000/login
2. Login with:
   - Email: `admin@respecthub.com`
   - Password: `admin123`
3. You'll be redirected to the Admin Dashboard

### Test Resident Account
1. Go to http://localhost:3000/login
2. Login with:
   - Email: `john@example.com`
   - Password: `password123`
3. You'll be redirected to the Resident Dashboard

### Create New Account
1. Go to http://localhost:3000/register
2. Fill in:
   - Name: Your Name
   - Email: your@email.com
   - Password: (min 6 characters)
   - Flat Number: e.g., A-101
3. Submit and you'll auto-login

## 📋 Feature Checklist

### ✅ Resident Features to Test:

1. **Dashboard**
   - View your total points
   - See current badge and progress
   - Check your rank
   - View recent submissions

2. **Submit Action**
   - Choose an action type
   - Add description
   - Optionally add proof URL
   - Submit and get confirmation

3. **My Actions**
   - View all your submissions
   - Filter by status (All/Pending/Approved/Rejected)
   - See admin notes on rejected actions

4. **Leaderboard**
   - View top 3 on podium
   - See your position highlighted
   - Check other residents' points

### ✅ Admin Features to Test:

1. **Admin Dashboard**
   - Total residents count
   - Pending actions count
   - Approved/Rejected statistics

2. **Review Queue**
   - View all action submissions
   - Filter by status
   - Approve actions (adds points)
   - Reject actions with notes

3. **Leaderboard**
   - Same as resident view
   - Monitor community engagement

## 🎨 UI Features to Notice:

- **Dark Theme**: Modern gradient-based design
- **Smooth Transitions**: Page loads and hover effects
- **Status Badges**: Color-coded (Yellow=Pending, Green=Approved, Red=Rejected)
- **Responsive Design**: Try resizing your browser
- **Avatar Generation**: First letter of name becomes avatar
- **Progress Bars**: Visual badge progress tracking

## 🔧 Troubleshooting

### Issue: "Cannot connect to backend"
**Solution**: Make sure backend is running on http://localhost:5000
```bash
cd C:\Users\kabir\Desktop\RespectHub\backend
npm start
```

### Issue: "Module not found"
**Solution**: Reinstall dependencies
```bash
cd C:\Users\kabir\Desktop\RespectHub\frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 already in use"
**Solution**: Kill the process or change port in vite.config.js:
```javascript
server: {
  port: 3001, // Change to different port
  // ...
}
```

### Issue: Login redirects to /login
**Solution**: Check if backend is running and returning proper JWT token

### Issue: Styles not loading
**Solution**: Hard refresh browser (Ctrl + Shift + R or Cmd + Shift + R)

## 📊 Expected Workflow

### Complete User Journey:

1. **New User Registration**
   ```
   Register → Auto Login → Resident Dashboard → Submit Action → 
   Wait for Review → Check My Actions → See Status
   ```

2. **Admin Workflow**
   ```
   Login → Admin Dashboard → Review Queue → 
   Approve/Reject Actions → Check Stats
   ```

3. **Points System**
   ```
   Submit Action → Admin Approves → Points Added → 
   Badge Progress Updates → Rank Changes → Leaderboard Updates
   ```

## 🎯 Production Build

When ready to deploy:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

This creates optimized files in the `dist/` folder.

## 💡 Tips

1. **Use Chrome DevTools**: Press F12 to see network requests and errors
2. **Check Console**: Look for any JavaScript errors
3. **Network Tab**: Verify API calls are successful
4. **Application Tab**: Check localStorage for token storage

## 🎓 Next Steps

- Customize the color scheme in `src/styles/index.css`
- Add more action types in the backend
- Implement file upload for proof images
- Add email notifications
- Create analytics dashboard

---

Need help? Check the README.md for more details!
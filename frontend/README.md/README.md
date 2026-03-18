# 🏆 RespectHub Frontend

A modern, interactive web application for community recognition and respect point management.

## ✨ Features

### 🔐 Authentication
- User registration with flat number
- Secure JWT-based login
- Role-based access control (Resident/Admin)
- Auto-redirect based on user role

### 👤 Resident Features
- **Dashboard**: View points, badge progress, rank, and recent submissions
- **Submit Action**: Submit community contributions with proof
- **My Actions**: Track all submissions with status filtering
- **Leaderboard**: See community rankings with top 3 podium

### 👨‍💼 Admin Features
- **Dashboard**: Overview of all community statistics
- **Review Queue**: Approve/reject pending submissions with notes
- **Status Filtering**: View actions by pending/approved/rejected status
- **Leaderboard Access**: Monitor community engagement

## 🎨 Design Features

- **Modern Dark Theme**: Professional gradient-based UI
- **Distinctive Typography**: Outfit + Space Mono fonts
- **Smooth Animations**: Page transitions and hover effects
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Status Indicators**: Color-coded badges for action statuses
- **Progress Tracking**: Visual badge progress bars

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- RespectHub backend running on `http://localhost:5000`

### Installation

1. **Navigate to frontend directory**:
   ```bash
   cd respecthub-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
respecthub-frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx          # Login page
│   │   │   └── Register.jsx       # Registration page
│   │   ├── resident/
│   │   │   ├── ResidentDashboard.jsx   # Resident dashboard
│   │   │   ├── SubmitAction.jsx        # Action submission form
│   │   │   ├── MyActions.jsx           # User's action history
│   │   │   └── Leaderboard.jsx         # Community rankings
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx      # Admin overview
│   │   │   └── ReviewQueue.jsx         # Action review system
│   │   └── shared/
│   │       ├── Layout.jsx              # App layout with sidebar
│   │       └── ProtectedRoute.jsx      # Auth protection
│   ├── services/
│   │   └── api.js                 # API communication layer
│   ├── utils/
│   │   └── AuthContext.jsx        # Authentication state
│   ├── styles/
│   │   └── index.css              # Global styles
│   ├── App.jsx                    # Main app component
│   └── main.jsx                   # Entry point
├── public/
├── index.html
├── vite.config.js
└── package.json
```

## 🔌 API Integration

The frontend connects to your backend at `http://localhost:5000/api` via proxy.

### Endpoints Used:

**Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

**Actions**
- `GET /api/actions/my` - Get user's actions
- `GET /api/actions` - Get all actions (admin)
- `POST /api/actions` - Submit new action
- `PUT /api/actions/:id/status` - Update action status (admin)

**Users**
- `GET /api/users/profile` - Get user profile
- `GET /api/users/leaderboard` - Get leaderboard

**Admin**
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/pending` - Get pending actions

**Action Types**
- `GET /api/action-types` - Get all action types

## 🎯 User Flow

### For Residents:

1. **Register** → Create account with name, email, password, flat number
2. **Login** → Auto-redirect to resident dashboard
3. **View Dashboard** → See points, badge progress, rank, recent actions
4. **Submit Action** → Choose action type, add description, optional proof
5. **Track Progress** → View all submissions in "My Actions" with filters
6. **Check Rankings** → See position on community leaderboard

### For Admins:

1. **Login** → Auto-redirect to admin dashboard
2. **View Stats** → Total residents, pending/approved/rejected counts
3. **Review Queue** → See all pending submissions
4. **Approve/Reject** → Update action status with optional notes
5. **Monitor Community** → View leaderboard and activity

## 🎨 Color Scheme

```css
Primary: #6366f1 (Indigo)
Secondary: #ec4899 (Pink)
Accent: #f59e0b (Amber)
Success: #10b981 (Emerald)
Warning: #f59e0b (Amber)
Danger: #ef4444 (Red)

Background: #0f172a (Slate 900)
Surface: #1e293b (Slate 800)
```

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

## 🔒 Security Features

- JWT token storage in localStorage
- Automatic token attachment to requests
- 401 auto-redirect to login
- Role-based route protection
- Protected API endpoints

## 🛠️ Built With

- **React 18** - UI library
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Vite** - Build tool

## 📝 Environment Notes

The frontend expects the backend to be running on `http://localhost:5000`. If your backend runs on a different port, update the proxy in `vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:YOUR_PORT',
      changeOrigin: true
    }
  }
}
```

## 🎭 Demo Credentials

After running the backend seed:

**Admin**
- Email: `admin@respecthub.com`
- Password: `admin123`

**Resident**
- Email: `john@example.com`
- Password: `password123`

## 🚧 Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📄 License

This project is part of RespectHub - Community Recognition Platform

---

Made with ❤️ for community engagement
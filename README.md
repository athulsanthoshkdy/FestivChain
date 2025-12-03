# 🎉 FestivChain - Smart Festive Shopping Platform

A real-time, interactive festive shopping platform with Firebase backend, dynamic pricing, and festival-themed animations.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Firebase Setup](#firebase-setup)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)

---

## ✨ Features

### 🎯 Core Features
- ✅ Real-time dynamic pricing with market predictions
- ✅ Pre-booking with locked prices
- ✅ Group buying pools with tier-based discounts
- ✅ Dual interface (Customer & Vendor)
- ✅ Live order tracking with timeline
- ✅ Product reviews & ratings
- ✅ Firebase real-time database integration

### 🎨 Interactive Elements
- ✅ Festival-based theme switching (Onam, Diwali, Christmas, Pongal, Vishu)
- ✅ Dynamic background animations (snowfall, flower fall, crackers)
- ✅ Real-time cart updates
- ✅ Live vendor status & availability
- ✅ Smooth page transitions
- ✅ Toast notifications for all actions

### 📍 Kerala Locations
- 9 cities with 6+ areas each
- 10+ verified vendors across regions
- Real-time product availability
- Distance-based vendor filtering

---

## 🛠️ Tech Stack

```
Frontend:
- HTML5, CSS3 (with CSS animations)
- Vanilla JavaScript (ES6+)
- Firebase Realtime Database
- Firebase Authentication
- Firebase Storage

Backend:
- Firebase Cloud Functions (optional)
- Firestore Rules
- Real-time listeners

Hosting:
- Firebase Hosting
- Or custom server (Node.js/Python)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ (or Python 3.8+ for local server)
- Firebase account (free tier OK)
- VS Code (recommended)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/athulsanthoshkdy/festivchain-firebase.git
cd festivchain-firebase
```

### 2. Install Dependencies
```bash
npm install
# or just use Firebase CLI
npm install -g firebase-tools
```

### 3. Setup Firebase Project
See [Firebase Setup](#firebase-setup) section below.

### 4. Update Firebase Config
1. Get your Firebase config from Firebase Console
2. Update `src/js/firebase/firebaseConfig.js`:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    databaseURL: "https://your-app.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 5. Run Locally
```bash
# Using Python (port 8000)
python -m http.server 8000

# Or using Node.js
npx http-server

# Or using Firebase Emulator
firebase emulators:start
```

Open `http://localhost:8000` in browser.

---

## 🔥 Firebase Setup - Complete Guide

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Project name: `festivchain`
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Enable Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Phone** authentication
3. Enable **Email/Password** (optional, for future)

### Step 3: Create Realtime Database
1. Go to **Realtime Database**
2. Click **Create Database**
3. Select region: `asia-south1` (India)
4. Choose **Start in test mode** (for development)
5. Click **Enable**

### Step 4: Set Database Rules
Go to **Realtime Database** → **Rules** and replace with:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "products": {
      ".read": true,
      "$pid": {
        ".write": "root.child('users').child(auth.uid).child('role').val() === 'vendor'"
      }
    },
    "orders": {
      "$oid": {
        ".read": "root.child('users').child(auth.uid).exists()",
        ".write": "root.child('users').child(auth.uid).exists()"
      }
    },
    "vendors": {
      ".read": true,
      "$vid": {
        ".write": "$vid === auth.uid"
      }
    },
    "reviews": {
      ".read": true,
      ".write": "auth.uid != null"
    },
    "prebooks": {
      ".read": true,
      ".write": "auth.uid != null"
    },
    "pools": {
      ".read": true,
      ".write": "auth.uid != null"
    }
  }
}
```

### Step 5: Get Firebase Config
1. Go to **Project Settings** (⚙️ icon)
2. Click **Your Apps**
3. Click **Web** app
4. Copy the config object
5. Paste into `src/js/firebase/firebaseConfig.js`

### Step 6: Initialize Sample Data
1. In Firebase Console, go to **Realtime Database**
2. Click **Import JSON**
3. Use `config/firebase-sample-data.json` (provided)

---

## 📁 Project Structure

festivchain-firebase/
├── public/
│   ├── index.html              # Main entry point
│   ├── manifest.json           # PWA manifest
│   ├── 404.html               # Firebase Hosting 404
│   └── src/
│       ├── css/
│       │   ├── main.css           # Global styles
│       │   ├── landing.css        # Landing page styles
│       │   ├── animations.css     # Animations & effects
│       │   └── themes.css         # Festival themes
│       ├── js/
│           ├── firebase/
│           │   ├── firebaseConfig.js      # ⚠️ Firebase config (keep secret!)
│           │   ├── auth.js                # Authentication logic
│           │   ├── database.js            # Database operations
│           │   └── storage.js             # File uploads
│           ├── pages/
│           │   ├── auth.js                # Login/Signup
│           │   ├── customerHome.js        # Customer dashboard
│           │   ├── vendorDashboard.js     # Vendor dashboard
│           │   ├── cart.js                # Cart management
│           │   ├── orders.js              # Order tracking
│           │   └── products.js            # Product browsing
│           ├── themes/
│           │   ├── themeManager.js        # Theme switching
│           │   ├── onam.js                # Onam theme effects
│           │   ├── diwali.js              # Diwali theme effects
│           │   ├── christmas.js           # Christmas theme effects
│           │   ├── pongal.js              # Pongal theme effects
│           │   └── vishu.js               # Vishu theme effects
│           ├── utils.js                   # Utility functions
│           └── app.js                     # Main application logic
├── config/
│   ├── firebase-sample-data.json      # Sample database data
│   └── firebaseConfig.example.js      # Config template
├── docs/
│   ├── DATABASE_SCHEMA.md             # Database structure
│   ├── API_REFERENCE.md               # API docs
│   └── DEPLOYMENT_GUIDE.md            # Deployment steps
├── firebase.json                       # Firebase configuration
├── .firebaserc                        # Firebase project config
├── .gitignore                         # Git ignore rules
├── package.json                       # Dependencies
└── README.md                          # This file
```

---

## 🚢 Deployment

### Option 1: Firebase Hosting (Recommended)

```bash
# 1. Login to Firebase
firebase login

# 2. Initialize Firebase
firebase init hosting

# 3. Configure:
# - Choose existing project: festivchain
# - Public directory: public
# - Single page app: Yes
# - Setup GitHub Actions: Optional

# 4. Deploy
firebase deploy --only hosting
```

Your app will be live at: `https://festivchain.web.app`

### Option 2: Netlify

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --prod --dir=public
```

### Option 3: Vercel

```bash
# 1. Push to GitHub
git push origin main

# 2. Import in Vercel Dashboard
# Connect GitHub repo → Auto-deploys

# 3. Set environment variables
# Add Firebase config in Vercel settings
```

### Option 4: Custom Server (Node.js)

```bash
# 1. Install dependencies
npm install express

# 2. Create server.js (see docs/)

# 3. Deploy to Heroku/AWS/DigitalOcean
heroku create festivchain
git push heroku main
```

---

## 🔐 Security Best Practices

### Never Commit Secrets!
```bash
# Bad ❌
git add src/js/firebase/firebaseConfig.js

# Good ✅
git add src/js/firebase/firebaseConfig.example.js
# Keep firebaseConfig.js in .gitignore
```

### Protect API Keys
1. Use Firebase Emulator for development
2. Enable reCAPTCHA for production
3. Restrict API keys in Firebase Console
4. Use Cloud Functions for sensitive operations

### Database Security
```json
// Production Rules (Firestore)
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        ".validate": "newData.hasChildren(['phone', 'role', 'createdAt'])"
      }
    }
  }
}
```

---

## 📱 Features Walkthrough

### Customer Flow
1. **Sign In** → Phone OTP authentication
2. **Select Location** → Choose city/area
3. **Browse Products** → Real-time pricing
4. **Pre-Book** → Lock prices
5. **Join Pools** → Get group discounts
6. **Checkout** → Mock payment
7. **Track Orders** → Live updates
8. **Leave Reviews** → Rate vendors

### Vendor Flow
1. **Sign In** → Phone OTP
2. **Dashboard** → Stats & analytics
3. **List Products** → Add inventory
4. **Manage Orders** → Accept/reject bookings
5. **Update Status** → Track fulfillment
6. **View Analytics** → Sales & performance

---

## 🎨 Theme System

Themes automatically change based on selected delivery date:

- **Onam (Aug-Sept)** 🌿: Green background, flower falling animation
- **Diwali (Oct-Nov)** 🎆: Red/gold theme, crackers animation
- **Christmas (Dec)** ❄️: Blue/white theme, snowfall animation
- **Pongal (Jan)** 🎊: Yellow/orange theme, sparkle effects
- **Vishu (Apr)** 🎉: Rainbow theme, multicolor animations

Theme changes automatically when user selects delivery date!

---

## 🐛 Troubleshooting

### Firebase Config Not Found
```
Error: firebaseConfig is not defined
Solution: Create src/js/firebase/firebaseConfig.js with your config
```

### Port Already in Use
```bash
# Find process on port 8000
lsof -i :8000

# Kill process
kill -9 <PID>

# Or use different port
python -m http.server 8001
```

### CORS Errors
```
Solution: Use Firebase Hosting or enable CORS in your backend
Firebase Hosting has CORS pre-configured
```

### Real-time Updates Not Working
```
Check:
1. Firebase Realtime Database is enabled
2. Internet connection is active
3. Check browser console for errors
4. Verify database rules allow read/write
```

---

## 📚 API Reference

See `docs/API_REFERENCE.md` for complete API documentation.

### Quick Examples

```javascript
// Get all products
db.ref('products').on('value', snapshot => {
    const products = snapshot.val();
});

// Add product to cart
db.ref('users/' + uid + '/cart').push({
    productId: 123,
    quantity: 2,
    timestamp: Date.now()
});

// Get user orders
db.ref('orders').orderByChild('userId').equalTo(uid)
    .on('value', snapshot => {
        const orders = snapshot.val();
    });
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 📞 Support

- 📧 Email: support@festivchain.com
- 💬 Discord: [Join Server]
- 🐛 Issues: [GitHub Issues]
- 📖 Docs: [docs/](docs/)

---

## 🎯 Roadmap

- [ ] Payment gateway integration (Razorpay)
- [ ] SMS notifications
- [ ] Email confirmations
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Admin panel
- [ ] Multi-language support
- [ ] Cryptocurrency payments

---

## 🙏 Acknowledgments

- Built with ❤️ for festive shoppers
- Powered by Firebase
- Inspired by group buying platforms

---

**Made with 🎉 by FestivChain Team & [athulsanthoshkdy](https://github.com/athulsanthoshkdy)**

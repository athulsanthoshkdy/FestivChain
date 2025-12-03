# FestivChain - Quick Start Guide

## ⚡ 5 Minutes to Running

### Step 1: Get Firebase Config (2 min)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project or select existing one
3. Go to Project Settings → Your Apps → Web
4. Copy the config object

### Step 2: Add Config (1 min)
1. Create `src/js/firebase/firebaseConfig.js`
2. Paste this template:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```
3. Replace YOUR_* values with actual config

### Step 3: Run Locally (2 min)
```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx http-server -p 8000
```

### Step 4: Test
Open browser: `http://localhost:8000`

**Demo Login:** Phone: any 10 digits, OTP: 1234

---

## 🎨 Key Features to Try

1. **Change Festival Theme**
   - Select different delivery dates to see themes change
   - Aug-Sep: Onam (flower fall) 🌹
   - Oct-Nov: Diwali (crackers) 🎆
   - Dec: Christmas (snowfall) ❄️
   - Jan: Pongal (sparkles) ✨
   - Apr: Vishu (confetti) 🎉

2. **Pre-Book Products**
   - Browse categories
   - Lock prices
   - Check savings

3. **Add to Cart**
   - View real-time prices
   - See discount calculations

4. **Track Vendor Operations**
   - Switch to vendor role
   - List products
   - Manage orders

---

## 📱 Test Accounts

**Customer:**
- Phone: 9999999999
- OTP: 1234

**Vendor:**
- Phone: 8888888888
- OTP: 1234

---

## 🚀 Deploy to Firebase (5 min)

```bash
# 1. Login to Firebase
firebase login

# 2. Deploy
firebase deploy --only hosting

# Your app is live!
```

---

## 📚 Next Steps

- Read [README.md](../README.md) for full setup
- Check [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for production
- See [API_REFERENCE.md](docs/API_REFERENCE.md) for code API
- Review [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for data structure

---

## ❓ Troubleshooting

**Blank page?**
- Press F12, check Console tab
- Verify firebaseConfig.js exists
- Check if Firebase config is correct

**Can't login?**
- Use OTP: 1234 (demo)
- Check browser console for errors

**Prices not updating?**
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page

**Theme not changing?**
- Select a date in the date picker
- Check console for errors

---

Need more help? See README.md or docs/ folder.

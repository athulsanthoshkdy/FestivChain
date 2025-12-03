# FestivChain Deployment Guide

## Prerequisites
- Node.js 14+ installed
- Firebase account (free tier OK)
- Firebase CLI installed: `npm install -g firebase-tools`
- Git installed (optional)

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Enter "festivchain" as project name
4. Click "Continue"
5. Disable Google Analytics (optional)
6. Click "Create Project"

### 1.2 Enable Realtime Database
1. In Firebase Console, go to **Realtime Database**
2. Click **Create Database**
3. Select region: `asia-south1` (closer to India)
4. Choose **Start in test mode** (for development)
5. Click **Enable**

### 1.3 Enable Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Phone** sign-in
3. Enable **Email/Password** (optional)

### 1.4 Get Firebase Config
1. Go to **Project Settings** (⚙️ icon)
2. Click **Your Apps** section
3. Click **Web** app
4. Copy the config object

## Step 2: Local Setup

### 2.1 Clone Repository
```bash
git clone https://github.com/yourusername/festivchain-firebase.git
cd festivchain-firebase
```

### 2.2 Create Firebase Config
1. Copy `config/firebaseConfig.example.js` to `src/js/firebase/firebaseConfig.js`
2. Replace placeholder values with your Firebase config:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "festivchain-xxxxx.firebaseapp.com",
    databaseURL: "https://festivchain-xxxxx.firebaseio.com",
    projectId: "festivchain-xxxxx",
    storageBucket: "festivchain-xxxxx.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

### 2.3 Test Locally
```bash
# Using Python (port 8000)
python -m http.server 8000

# Or using Node.js http-server
npm install -g http-server
http-server -p 8000

# Or using Firebase Emulator
firebase emulators:start
```

Visit http://localhost:8000 and test the app!

## Step 3: Deploy to Firebase Hosting

### 3.1 Initialize Firebase
```bash
firebase login
firebase init hosting
```

When prompted:
- Choose existing project: `festivchain`
- Public directory: `public`
- Single page app: `Yes` (press Enter)
- Rewrite index.html for all requests: `Yes`
- Setup GitHub Actions: Optional

### 3.2 Deploy
```bash
firebase deploy --only hosting
```

Your app will be live at: `https://festivchain.web.app`

### 3.3 Check Deployment
```bash
firebase hosting:channel:list
```

## Step 4: Alternative Deployment Options

### Option A: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=public
```

### Option B: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option C: GitHub Pages

```bash
# Create GitHub repository
git remote add origin https://github.com/yourusername/festivchain-firebase.git
git branch -M main
git push -u origin main

# Enable GitHub Pages in repo settings
# Deploy from: main branch / root directory
```

### Option D: Heroku (Backend + Frontend)

```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Create app
heroku create festivchain-app

# Deploy
git push heroku main
```

## Step 5: Database Import

### Option 1: Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com)
2. Go to **Realtime Database**
3. Click **Import JSON**
4. Select `config/firebase-sample-data.json`
5. Click **Import**

### Option 2: Firebase CLI
```bash
firebase database:set / config/firebase-sample-data.json
```

## Step 6: Environment Variables

### Firebase Hosting
1. Go to Firebase Console → Project Settings
2. Click **Environment variables** tab
3. Add variables (optional for Firebase Hosting)

### Custom Server
Create `.env` file:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
# ... other vars
```

**IMPORTANT:** Add `.env` to `.gitignore`

## Step 7: Continuous Deployment

### GitHub Actions (Firebase)
Already configured in `firebase.json` during init:
1. Push to GitHub
2. GitHub Actions automatically deploys to Firebase Hosting

### Manual CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '14'
      - run: npm install -g firebase-tools
      - run: firebase deploy --token ${{ secrets.FIREBASE_TOKEN }}
```

## Step 8: Monitoring

### Firebase Console Analytics
1. Go to **Analytics** dashboard
2. Monitor real-time users
3. Track custom events

### Performance Monitoring
1. Go to **Performance** → **Dashboard**
2. Monitor page load times
3. Check for bottlenecks

### Error Tracking
1. Go to **Crashlytics** (if enabled)
2. Monitor app errors
3. Debug issues

## Troubleshooting

### Firebase Config Not Found
```
Error: Cannot find firebaseConfig
Solution: 
1. Create src/js/firebase/firebaseConfig.js
2. Add your Firebase config
3. Restart server
```

### Port Already in Use
```bash
# Find process
lsof -i :8000

# Kill process
kill -9 <PID>

# Or use different port
python -m http.server 8001
```

### CORS Errors
```
Solution: Use Firebase Hosting (has CORS pre-configured)
Or configure server with CORS headers
```

### Database Rules Too Strict
```
Error: Permission denied
Solution:
1. Go to Realtime Database → Rules
2. Use test mode rules temporarily
3. Add proper rules from DATABASE_SCHEMA.md
```

### Blank Page After Deploy
```
Solution:
1. Check browser console for errors (F12)
2. Verify Firebase config is correct
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check if firebaseConfig.js exists
```

## Production Checklist

- [ ] Firebase config hidden in firebaseConfig.js
- [ ] Database rules updated from test mode
- [ ] Authentication configured (Phone/Email)
- [ ] reCAPTCHA v3 enabled (recommended)
- [ ] Sample data removed
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Error tracking enabled

## Scaling Considerations

### If Usage Increases:

1. **Database Optimization**
   - Add composite indexes
   - Optimize query structure
   - Archive old data

2. **Hosting**
   - Enable CDN (automatic in Firebase)
   - Consider Cloud Functions for heavy lifting
   - Use Firestore for complex queries

3. **Authentication**
   - Implement email verification
   - Add 2FA
   - Use reCAPTCHA

4. **Storage**
   - Consider Cloud Storage for images
   - Implement cleanup policies
   - Monitor usage

## Support

- Firebase Docs: https://firebase.google.com/docs
- Firebase CLI: https://firebase.google.com/docs/cli
- Troubleshooting: See README.md


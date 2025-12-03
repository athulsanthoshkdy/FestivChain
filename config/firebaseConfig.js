// ⚠️ TEMPLATE FILE - Copy this and create firebaseConfig.js with your actual credentials
// NEVER commit firebaseConfig.js to GitHub!

// Get these values from Firebase Console → Project Settings → Your Apps → Web

const firebaseConfig = {
  apiKey: "AIzaSyCnkLCK55K3TJiITxbelEgiJU2pmkO0Zn4",
  authDomain: "festivchain.firebaseapp.com",
  databaseURL: "https://festivchain-default-rtdb.firebaseio.com",
  projectId: "festivchain",
  storageBucket: "festivchain.firebasestorage.app",
  messagingSenderId: "72449903896",
  appId: "1:72449903896:web:cab74cd0baaf94d686a26d"
};

// 📝 SETUP INSTRUCTIONS:
/*
1. Go to https://console.firebase.google.com/
2. Create a new project called 'festivchain'
3. Go to Project Settings (⚙️ icon)
4. Click "Your Apps" → Add Web App
5. Copy the config object
6. Create file: src/js/firebase/firebaseConfig.js
7. Paste this template and fill in your values
8. IMPORTANT: Keep firebaseConfig.js in .gitignore
*/

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseConfig;
}

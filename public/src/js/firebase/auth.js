// ============================================
// FESTIVCHAIN - FIREBASE AUTHENTICATION
// ============================================

let auth = null;
let db = null;
let storage = null;

// Hardcoded admin credentials (change before production)
const ADMIN_CREDENTIALS = {
    email: 'admin@festivchain.local',
    password: 'Admin@123'
};

// Initialize Firebase (called from firebaseConfig.js)
function initializeFirebase() {
    try {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.database();
        storage = firebase.storage();

        console.log('✅ Firebase initialized successfully');
        if (typeof hideLoadingSpinner === 'function') hideLoadingSpinner();
        if (typeof setupAuthListener === 'function') setupAuthListener();
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        if (typeof showToast === 'function') showToast('Firebase initialization error', 'error');
        else console.error('Firebase initialization error (no showToast available):', error);
    }
}

// Setup authentication state listener
function setupAuthListener() {
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log('👤 User logged in:', user.uid);
            loadUserData(user.uid);
        } else {
            console.log('🚪 User logged out');
            currentUser = null;
        }
    });
}

// Send OTP
// (Legacy) OTP function kept for compatibility but not used for email flow
function sendOTP(role) {
    showToast('Phone/OTP flow deprecated — using email/password now', 'info');
}

// Handle Customer Authentication
async function handleCustomerAuth(event) {
    event.preventDefault();

    const email = document.getElementById('custEmail').value;
    const password = document.getElementById('custPassword').value;

    if (!email || !password) {
        showToast('Please enter both email and password', 'error');
        return;
    }

    try {
        // Safer flow: check whether email has providers registered
        const methods = await auth.fetchSignInMethodsForEmail(email);
        let result;

        if (!methods || methods.length === 0) {
            // no account exists -> create
            result = await auth.createUserWithEmailAndPassword(email, password);
        } else {
            // account exists -> sign in
            result = await auth.signInWithEmailAndPassword(email, password);
        }

        const uid = result.user.uid;
        currentUser = {
            uid: uid,
            email: email,
            role: 'customer',
            createdAt: new Date().toISOString()
        };

        // Save user data to Realtime Database
        await db.ref('users/' + uid).update({
            email: email,
            role: 'customer',
            createdAt: currentUser.createdAt,
            updatedAt: new Date().toISOString()
        });

        localStorage.setItem('festivchain_user', JSON.stringify(currentUser));
        showToast('✅ Welcome! Proceeding to location setup...', 'success');

        setTimeout(() => {
            showScreen('customerLocation');
        }, 800);
    } catch (error) {
        console.error('Auth Error:', error);
        const code = error && error.code ? error.code : 'unknown';
        const msg = error && error.message ? error.message : String(error);
        if (typeof showToast === 'function') showToast(`Authentication failed (${code}): ${msg}`, 'error');
        else console.error('Authentication failed:', code, msg);
    }
}

// Explicit Sign In for Customer
async function handleCustomerSignIn(event) {
    try {
        event && event.preventDefault && event.preventDefault();
        const email = document.getElementById('custEmail').value;
        const password = document.getElementById('custPassword').value;
        if (!email || !password) return showToast && showToast('Please enter email and password', 'error');
        const result = await auth.signInWithEmailAndPassword(email, password);
        // reuse existing post-signin flow
        await postSignInSetup(result.user, 'customer');
    } catch (error) {
        console.error('Customer sign-in error:', error);
        const code = error && error.code ? error.code : 'unknown';
        const msg = error && error.message ? error.message : String(error);
        if (typeof showToast === 'function') showToast(`Sign in failed (${code}): ${msg}`, 'error');
    }
}

// Explicit Sign Up for Customer
async function handleCustomerSignUp(event) {
    try {
        event && event.preventDefault && event.preventDefault();
        const email = document.getElementById('custEmail').value;
        const password = document.getElementById('custPassword').value;
        if (!email || !password) return showToast && showToast('Please enter email and password', 'error');
        const result = await auth.createUserWithEmailAndPassword(email, password);
        await postSignInSetup(result.user, 'customer');
    } catch (error) {
        console.error('Customer sign-up error:', error);
        const code = error && error.code ? error.code : 'unknown';
        const msg = error && error.message ? error.message : String(error);
        if (typeof showToast === 'function') showToast(`Sign up failed (${code}): ${msg}`, 'error');
    }
}

// Explicit Sign In for Vendor
async function handleVendorSignIn(event) {
    try {
        event && event.preventDefault && event.preventDefault();
        const email = document.getElementById('vendEmail').value;
        const password = document.getElementById('vendPassword').value;
        if (!email || !password) return showToast && showToast('Please enter email and password', 'error');
        const result = await auth.signInWithEmailAndPassword(email, password);
        await postSignInSetup(result.user, 'vendor');
    } catch (error) {
        console.error('Vendor sign-in error:', error);
        const code = error && error.code ? error.code : 'unknown';
        const msg = error && error.message ? error.message : String(error);
        if (typeof showToast === 'function') showToast(`Sign in failed (${code}): ${msg}`, 'error');
    }
}

// Explicit Sign Up for Vendor
async function handleVendorSignUp(event) {
    try {
        event && event.preventDefault && event.preventDefault();
        const email = document.getElementById('vendEmail').value;
        const password = document.getElementById('vendPassword').value;
        if (!email || !password) return showToast && showToast('Please enter email and password', 'error');
        const result = await auth.createUserWithEmailAndPassword(email, password);
        await postSignInSetup(result.user, 'vendor');
    } catch (error) {
        console.error('Vendor sign-up error:', error);
        const code = error && error.code ? error.code : 'unknown';
        const msg = error && error.message ? error.message : String(error);
        if (typeof showToast === 'function') showToast(`Sign up failed (${code}): ${msg}`, 'error');
    }
}

// Shared post sign-in/setup logic for both customers and vendors
async function postSignInSetup(user, role) {
    try {
        const uid = user.uid;
        currentUser = { uid: uid, email: user.email, role: role, createdAt: new Date().toISOString() };
        await db.ref('users/' + uid).update({ email: user.email, role: role, updatedAt: new Date().toISOString(), createdAt: currentUser.createdAt });
        localStorage.setItem('festivchain_user', JSON.stringify(currentUser));
        if (typeof updateNavbarForLoggedInUser === 'function') updateNavbarForLoggedInUser();
        if (typeof showToast === 'function') showToast(role === 'vendor' ? '✅ Welcome Vendor! Loading your dashboard...' : '✅ Welcome! Proceeding to location setup...', 'success');

        // Vendor: create default inventory
        if (role === 'vendor') {
            try {
                // ensure vendor record exists (minimal info)
                if (db) {
                    const vendorRef = db.ref('vendors/' + uid);
                    const snap = await vendorRef.once('value');
                    if (!snap.exists()) {
                        await vendorRef.set({
                            email: user.email || null,
                            name: (user.displayName && user.displayName) ? user.displayName : (user.email ? user.email.split('@')[0] : 'Vendor'),
                            city: null,
                            area: null,
                            phone: null,
                            createdAt: firebase.database.ServerValue.TIMESTAMP
                        });
                    } else {
                        // update email/name if changed
                        await vendorRef.update({ email: user.email || null, name: (user.displayName || (user.email ? user.email.split('@')[0] : 'Vendor')) });
                    }
                }

                if (typeof createVendorDefaultInventory === 'function') await createVendorDefaultInventory(uid);
            } catch (e) { console.warn('Could not create default inventory:', e); }
        }

        // Navigate to appropriate screen
        setTimeout(() => {
            if (role === 'customer') {
                if (typeof showScreen === 'function') showScreen('customerLocation');
            } else if (role === 'vendor') {
                if (typeof showScreen === 'function') showScreen('vendorDashboard');
                if (typeof loadVendorDashboard === 'function') loadVendorDashboard();
            }
        }, 600);
    } catch (err) {
        console.error('postSignInSetup error:', err);
    }
}

// Handle Vendor Authentication
async function handleVendorAuth(event) {
    event.preventDefault();

    const email = document.getElementById('vendEmail').value;
    const password = document.getElementById('vendPassword').value;

    if (!email || !password) {
        showToast('Please enter both email and password', 'error');
        return;
    }

    try {
        // Safer flow: check whether email has providers registered
        const methods = await auth.fetchSignInMethodsForEmail(email);
        let result;

        if (!methods || methods.length === 0) {
            result = await auth.createUserWithEmailAndPassword(email, password);
        } else {
            result = await auth.signInWithEmailAndPassword(email, password);
        }

        // Reuse central post sign-in setup to ensure vendor DB record, inventory and navigation
        await postSignInSetup(result.user, 'vendor');
    } catch (error) {
        console.error('Auth Error:', error);
        const code = error && error.code ? error.code : 'unknown';
        const msg = error && error.message ? error.message : String(error);
        if (typeof showToast === 'function') showToast(`Authentication failed (${code}): ${msg}`, 'error');
        else console.error('Authentication failed:', code, msg);
    }
}

// Admin login with hardcoded credentials (local only)
function handleAdminAuth(event) {
    event.preventDefault();

    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        currentUser = {
            uid: 'admin_local',
            email: email,
            role: 'admin',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('festivchain_user', JSON.stringify(currentUser));
        showToast('✅ Admin authenticated (local)', 'success');
        setTimeout(() => {
            showScreen('adminDashboard');
            if (typeof loadAdminDashboard === 'function') loadAdminDashboard();
        }, 500);
    } else {
        showToast('Invalid admin credentials', 'error');
    }
}

// Load User Data
async function loadUserData(uid) {
    try {
        const snapshot = await db.ref('users/' + uid).once('value');
        const userData = snapshot.val();

        if (userData) {
            currentUser = {
                uid: uid,
                ...userData
            };
            console.log('📊 User data loaded:', currentUser);
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        auth.signOut().then(() => {
            currentUser = null;
            customerCart = { prebook: [], pool: [] };
            customerOrders = [];
            localStorage.removeItem('festivchain_user');
            showToast('✅ Logged out successfully', 'success');
            setTimeout(() => {
                showScreen('roleSelect');
            }, 600);
        }).catch(error => {
            console.error('Logout error:', error);
            showToast('Error logging out', 'error');
        });
    }
}

// Initialize Firebase when page loads
window.addEventListener('load', () => {
    if (typeof firebaseConfig !== 'undefined') {
        initializeFirebase();
    } else {
        console.error('❌ Firebase config not found. See README for setup instructions.');
        showToast('Firebase config not configured. Check README.', 'error');
    }
});

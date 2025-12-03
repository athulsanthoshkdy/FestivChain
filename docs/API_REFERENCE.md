# FestivChain API Reference

## Authentication Module (`src/js/firebase/auth.js`)

### Functions

#### `initializeFirebase()`
Initialize Firebase with configuration from `firebaseConfig.js`
```javascript
initializeFirebase();
```

#### `sendOTP(role)`
Send OTP to phone number
```javascript
sendOTP('customer'); // or 'vendor'
```
**Demo:** Use OTP `1234` for testing

#### `handleCustomerAuth(event)`
Authenticate customer with phone and OTP
```javascript
// Form submission event
await handleCustomerAuth(event);
```

#### `handleVendorAuth(event)`
Authenticate vendor with phone and OTP
```javascript
// Form submission event
await handleVendorAuth(event);
```

#### `logout()`
Sign out current user
```javascript
logout();
// Clears: currentUser, cart, localStorage
```

---

## Database Module (`src/js/firebase/database.js`)

### Products

#### `getAllProducts()`
Get all products from all categories
```javascript
const products = await getAllProducts();
// Returns: { flowers: [], fruits: [], sweets: [] }
```

#### `getProductsByCategory(category)`
Get products by category
```javascript
const flowers = await getProductsByCategory('Flowers');
// Returns: Array of product objects
```

**Categories:** 'Flowers', 'Fruits', 'Sweets'

---

### Vendors

#### `getAllVendors()`
Get all vendors
```javascript
const vendors = await getAllVendors();
// Returns: Array of vendor objects
```

#### `getVendorsByCity(city)`
Get vendors in specific city
```javascript
const vendors = await getVendorsByCity('Kochi');
```

**Available Cities:**
- Kochi, Thiruvananthapuram, Kozhikode
- Thrissur, Alappuzha, Kannur
- Kollam, Palakkad, Malappuram

---

### Pre-Bookings

#### `savePrebook(prebookData)`
Create a pre-booking
```javascript
const prebook = await savePrebook({
    productId: 1,
    productName: 'Roses',
    quantity: 2,
    lockedPrice: 240,
    totalPrice: 480,
    deliveryDate: '2024-12-25',
    vendorId: 'v1'
});
// Returns: prebookId or null
```

---

### Cart Management

#### `addToCart(item, type)`
Add item to local cart
```javascript
addToCart({
    id: 1,
    name: 'Roses',
    quantity: 2,
    price: 240
}, 'prebook');
// type: 'prebook' or 'pool'
```

#### `getCart()`
Get current cart
```javascript
const cart = getCart();
// Returns: { prebook: [], pool: [] }
```

#### `clearCart()`
Clear cart completely
```javascript
clearCart();
```

---

### Orders

#### `saveOrder(orderData)`
Create and save order
```javascript
const orderId = await saveOrder({
    items: cartItems,
    totalAmount: 1200,
    location: { city: 'Kochi', area: 'Fort Kochi' }
});
```

#### `getUserOrders()`
Get all orders for logged-in user
```javascript
const orders = await getUserOrders();
// Returns: Array of order objects
```

#### `updateOrderStatus(orderId, status)`
Update order status (vendor only)
```javascript
await updateOrderStatus('order123', 'Delivered');
// Status: 'Confirmed', 'Preparing', 'Ready', 'Delivered'
```

---

### Reviews

#### `saveReview(reviewData)`
Submit product review
```javascript
const reviewId = await saveReview({
    productId: 1,
    vendorId: 'v1',
    rating: 5,
    comment: 'Great quality!'
});
```

#### `getProductReviews(productId)`
Get all reviews for product
```javascript
const reviews = await getProductReviews(1);
// Returns: Array of review objects
```

---

### Vendor Products

#### `saveVendorProduct(productData)`
List new product (vendor only)
```javascript
const productId = await saveVendorProduct({
    name: 'Fresh Roses',
    category: 'Flowers',
    price: 340,
    stock: 50,
    deliveryDate: '2024-12-25'
});
```

#### `getVendorProducts(vendorId)`
Get all products from vendor
```javascript
const products = await getVendorProducts('v1');
```

---

## Theme Manager (`src/js/themes/themeManager.js`)

#### `getFestivalFromDate(dateString)`
Determine festival from date
```javascript
const festival = getFestivalFromDate('2024-12-25');
// Returns: 'Christmas', 'Diwali', 'Onam', etc.
```

#### `applyTheme(festival)`
Apply theme and animations
```javascript
applyTheme('Christmas');
// Changes colors, background, and starts animations
```

**Available Themes:**
- `'Onam'` - Green, flower fall
- `'Diwali'` - Red/gold, crackers
- `'Christmas'` - Blue/white, snowfall
- `'Pongal'` - Orange/yellow, sparkles
- `'Vishu'` - Rainbow, confetti

#### `handleDateChange()`
Handle festival date selection
```javascript
// Call when user selects delivery date
handleDateChange();
```

---

## Utility Functions (`src/js/utils.js`)

#### `showScreen(screenId)`
Navigate to screen
```javascript
showScreen('customerHome');
// screenId: element ID in HTML
```

#### `showToast(message, type, duration)`
Show notification toast
```javascript
showToast('Product added!', 'success', 3000);
// type: 'success', 'error', 'info', 'warning'
// duration: milliseconds (default 3000)
```

#### `showLoadingSpinner()`
Show loading indicator
```javascript
showLoadingSpinner();
```

#### `hideLoadingSpinner()`
Hide loading indicator
```javascript
hideLoadingSpinner();
```

#### `updateLocationDisplay()`
Update location info display
```javascript
updateLocationDisplay();
```

#### `populateCities()`
Populate city dropdown with Kerala cities
```javascript
populateCities();
```

#### `updateAreas()`
Update areas based on selected city
```javascript
updateAreas();
```

#### `updateLocation(event)`
Handle location form submission
```javascript
updateLocation(event);
```

#### `browseCategory(category)`
Browse products by category
```javascript
browseCategory('Flowers');
```

#### `showProductDetail(category, productId)`
Show detailed product view
```javascript
showProductDetail('Flowers', 1);
```

#### `startPrebooking(category, productId)`
Start pre-booking flow
```javascript
startPrebooking('Flowers', 1);
```

#### `confirmPrebook(category, productId)`
Confirm pre-booking and add to cart
```javascript
confirmPrebook('Flowers', 1);
```

#### `updateCartDisplay()`
Refresh cart display
```javascript
updateCartDisplay();
```

#### `removeFromCart(type, index)`
Remove item from cart
```javascript
removeFromCart('prebook', 0);
// type: 'prebook' or 'pool'
```

#### `proceedToCheckout(amount)`
Move to checkout
```javascript
proceedToCheckout(1200);
```

#### `processPayment(amount)`
Process payment (demo)
```javascript
processPayment(1200);
```

#### `loadVendorDashboard()`
Load vendor dashboard
```javascript
loadVendorDashboard();
```

---

## Global Variables

```javascript
// Current logged-in user
currentUser = {
    uid: string,
    phone: string,
    role: 'customer' | 'vendor',
    createdAt: timestamp
}

// Selected location
currentLocation = {
    city: string,
    area: string
}

// Shopping cart
customerCart = {
    prebook: [],   // Pre-booked items
    pool: []       // Pool items
}

// All user orders
customerOrders = []
```

---

## Error Handling

All async functions return `null` or empty array on error and show toast:

```javascript
try {
    const products = await getProductsByCategory('Flowers');
    if (!products) {
        // Error occurred, toast already shown
    }
} catch (error) {
    console.error('Error:', error);
}
```

---

## Data Structures

### Product Object
```javascript
{
    id: number,
    name: string,
    category: 'Flowers' | 'Fruits' | 'Sweets',
    marketPrice: number,
    predictedPrice: number,
    description: string,
    rating: number (4.5),
    reviews: number,
    image: string (emoji)
}
```

### Vendor Object
```javascript
{
    id: string,
    name: string,
    city: string,
    area: string,
    distance: string,
    rating: number,
    reviews: number,
    availability: 'Available' | 'Busy',
    phone: string
}
```

### Order Object
```javascript
{
    id: string,
    items: array,
    totalAmount: number,
    location: { city, area },
    status: 'Confirmed' | 'Preparing' | 'Ready' | 'Delivered',
    createdAt: timestamp
}
```

### Review Object
```javascript
{
    id: string,
    productId: number,
    vendorId: string,
    userId: string,
    rating: number (1-5),
    comment: string,
    createdAt: timestamp
}
```

---

## Constants

### Festival Date Ranges
```javascript
FESTIVAL_DATES = {
    'Onam': { start: '08-01', end: '09-15' },
    'Diwali': { start: '10-01', end: '11-30' },
    'Christmas': { start: '12-01', end: '12-31' },
    'Pongal': { start: '01-01', end: '01-31' },
    'Vishu': { start: '04-01', end: '04-30' }
}
```

### Kerala Cities & Areas
```javascript
KERALA_CITIES_AREAS = {
    'Kochi': ['Fort Kochi', 'Vyttila', ...],
    'Thiruvananthapuram': [...],
    // ... more cities
}
```

### Sample Products & Vendors
```javascript
SAMPLE_PRODUCTS = { flowers, fruits, sweets }
SAMPLE_VENDORS = [vendor1, vendor2, ...]
```

---

## Best Practices

1. **Always check for null returns**
   ```javascript
   const id = await saveOrder(data);
   if (id) { /* success */ }
   ```

2. **Use showToast for feedback**
   ```javascript
   showToast('Action completed', 'success');
   ```

3. **Show spinner for async operations**
   ```javascript
   showLoadingSpinner();
   await fetchData();
   hideLoadingSpinner();
   ```

4. **Save to localStorage for persistence**
   ```javascript
   localStorage.setItem('key', JSON.stringify(data));
   ```

5. **Handle errors gracefully**
   ```javascript
   try { ... } catch(e) { showToast(e.message, 'error'); }
   ```


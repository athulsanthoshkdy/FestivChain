# FestivChain Database Schema

## Firebase Realtime Database Structure

```
festivchain/
├── users/
│   └── {uid}/
│       ├── phone: string
│       ├── role: 'customer' | 'vendor'
│       ├── createdAt: timestamp
│       ├── updatedAt: timestamp
│       ├── location: {city, area}
│       └── profile: {name, email, image}
│
├── products/
│   └── {productId}/
│       ├── name: string
│       ├── category: 'Flowers' | 'Fruits' | 'Sweets'
│       ├── marketPrice: number
│       ├── predictedPrice: number
│       ├── description: string
│       ├── rating: number (4.5)
│       ├── reviews: number
│       ├── image: emoji
│       └── createdAt: timestamp
│
├── vendors/
│   └── {vendorId}/
│       ├── name: string
│       ├── city: string
│       ├── area: string
│       ├── distance: string
│       ├── rating: number
│       ├── reviews: number
│       ├── availability: 'Available' | 'Busy'
│       ├── phone: string
│       └── products: [productIds]
│
├── prebooks/
│   └── {prebookId}/
│       ├── userId: string
│       ├── productId: number
│       ├── productName: string
│       ├── quantity: number
│       ├── lockedPrice: number
│       ├── totalPrice: number
│       ├── deliveryDate: date
│       ├── status: 'Pending' | 'Approved' | 'Rejected'
│       ├── vendorId: string
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── orders/
│   └── {orderId}/
│       ├── userId: string
│       ├── items: [{productId, name, quantity, price}]
│       ├── totalAmount: number
│       ├── location: {city, area}
│       ├── status: 'Confirmed' | 'Preparing' | 'Ready' | 'Delivered'
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── pools/
│   └── {poolId}/
│       ├── productId: number
│       ├── totalQuantity: number
│       ├── targetQuantity: number
│       ├── discountTier: 5 | 10 | 20
│       ├── discount: 5 | 10 | 20 (%)
│       ├── participants: [userIds]
│       ├── status: 'Active' | 'Closed' | 'Completed'
│       ├── createdAt: timestamp
│       └── closedAt: timestamp
│
└── reviews/
    └── {reviewId}/
        ├── userId: string
        ├── productId: number
        ├── vendorId: string
        ├── rating: number (1-5)
        ├── comment: string
        ├── createdAt: timestamp
        └── updatedAt: timestamp
```

## Firestore Rules (Production)

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
      ".write": false
    },
    "vendors": {
      ".read": true,
      "$vid": {
        ".write": "$vid === auth.uid && root.child('users').child(auth.uid).child('role').val() === 'vendor'"
      }
    },
    "prebooks": {
      ".read": "auth.uid != null",
      ".write": "auth.uid != null"
    },
    "orders": {
      "$oid": {
        ".read": "auth.uid != null && (data.child('userId').val() === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'vendor')",
        ".write": "auth.uid != null"
      }
    },
    "reviews": {
      ".read": true,
      ".write": "auth.uid != null"
    }
  }
}
```

## Data Types

| Field | Type | Example |
|-------|------|---------|
| uid | String | "abc123def456" |
| phone | String | "9876543210" |
| role | Enum | "customer", "vendor" |
| rating | Float | 4.5, 4.8 |
| price | Number | 340, 240 |
| quantity | Number | 2.5 (kg) |
| date | Date String | "2024-12-25" |
| timestamp | Firebase Timestamp | ServerValue.TIMESTAMP |
| status | Enum | "Pending", "Approved", "Delivered" |

## Data Relationships

```
User (1) ──┬─→ (M) Orders
           ├─→ (M) Reviews
           └─→ (M) Prebooks

Product (1) ──┬─→ (M) Reviews
              ├─→ (M) Prebooks
              └─→ (M) Orders

Vendor (1) ──┬─→ (M) Products
             ├─→ (M) Orders
             └─→ (M) Reviews

Order (1) ──→ (M) OrderItems
```

## Sample Data Initialization

See `config/firebase-sample-data.json` for sample data to import.

### Import Steps:
1. Open Firebase Console
2. Go to Realtime Database
3. Click "Import JSON"
4. Select `firebase-sample-data.json`
5. Click "Import"

## Indexing Strategy

For production, add composite indexes:
- `orders.userId + orders.createdAt`
- `prebooks.userId + prebooks.status`
- `reviews.productId + reviews.rating`
- `vendors.city + vendors.rating`

Add these in Firebase Console → Database → Indexes tab.

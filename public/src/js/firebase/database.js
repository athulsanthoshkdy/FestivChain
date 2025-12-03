// ============================================
// FESTIVCHAIN - FIREBASE DATABASE OPERATIONS
// ============================================

// Sample data structure for development
const SAMPLE_PRODUCTS = {
    flowers: [
        { id: 1, name: 'Premium Red Roses', category: 'Flowers', marketPrice: 300, predictedPrice: 240, description: 'Fresh garden roses', rating: 4.8, reviews: 124, image: '🌹' },
        { id: 2, name: 'White Jasmine', category: 'Flowers', marketPrice: 200, predictedPrice: 160, description: 'Fragrant jasmine buds', rating: 4.9, reviews: 87, image: '🌿' },
        { id: 3, name: 'Marigolds', category: 'Flowers', marketPrice: 120, predictedPrice: 95, description: 'Golden yellow flowers', rating: 4.7, reviews: 156, image: '🌼' },
        { id: 4, name: 'Orchids', category: 'Flowers', marketPrice: 350, predictedPrice: 280, description: 'Exotic purple orchids', rating: 4.9, reviews: 98, image: '🌺' },
        { id: 5, name: 'Carnations', category: 'Flowers', marketPrice: 220, predictedPrice: 175, description: 'Mix of colors', rating: 4.6, reviews: 67, image: '🌷' }
    ],
    fruits: [
        { id: 1, name: 'Washington Apples', category: 'Fruits', marketPrice: 140, predictedPrice: 110, description: 'Sweet and crispy', rating: 4.7, reviews: 156, image: '🍎' },
        { id: 2, name: 'Fresh Mangoes', category: 'Fruits', marketPrice: 150, predictedPrice: 120, description: 'Ripe and sweet', rating: 4.6, reviews: 98, image: '🥭' },
        { id: 3, name: 'Pineapples', category: 'Fruits', marketPrice: 80, predictedPrice: 65, description: 'Tropical juicy', rating: 4.8, reviews: 87, image: '🍍' },
        { id: 4, name: 'Papayas', category: 'Fruits', marketPrice: 65, predictedPrice: 50, description: 'Golden ripe', rating: 4.5, reviews: 45, image: '🧡' },
        { id: 5, name: 'Bananas', category: 'Fruits', marketPrice: 50, predictedPrice: 40, description: 'Fresh yellow bunches', rating: 4.9, reviews: 234, image: '🍌' },
        { id: 6, name: 'Grapes', category: 'Fruits', marketPrice: 120, predictedPrice: 95, description: 'Seedless purple', rating: 4.8, reviews: 112, image: '🍇' }
    ],
    sweets: [
        { id: 1, name: 'Traditional Laddus', category: 'Sweets', marketPrice: 500, predictedPrice: 400, description: 'Homemade traditional sweets', rating: 4.9, reviews: 234, image: '🍪' },
        { id: 2, name: 'Coconut Barfi', category: 'Sweets', marketPrice: 520, predictedPrice: 415, description: 'Rich and delicious', rating: 4.8, reviews: 167, image: '🍮' },
        { id: 3, name: 'Payasam Mix', category: 'Sweets', marketPrice: 550, predictedPrice: 440, description: 'Festival favorite', rating: 4.9, reviews: 198, image: '🍯' },
        { id: 4, name: 'Halwa (Premium)', category: 'Sweets', marketPrice: 480, predictedPrice: 385, description: 'Smooth and rich', rating: 4.7, reviews: 142, image: '🍲' },
        { id: 5, name: 'Jaggery Sweets', category: 'Sweets', marketPrice: 420, predictedPrice: 335, description: 'Traditional taste', rating: 4.6, reviews: 89, image: '🟤' }
    ]
};

const SAMPLE_VENDORS = [
    { id: 'v1', name: 'Fresh Harvest Market', city: 'Kochi', area: 'Fort Kochi', distance: '2.3 km', rating: 4.8, reviews: 342, availability: 'Available', phone: '9876543210' },
    { id: 'v2', name: 'Premium Fruits Store', city: 'Kochi', area: 'Vyttila', distance: '1.8 km', rating: 4.6, reviews: 298, availability: 'Available', phone: '9876543211' },
    { id: 'v3', name: 'Sweet Dreams Bakery', city: 'Kochi', area: 'Ernakulam', distance: '3.1 km', rating: 4.9, reviews: 267, availability: 'Available', phone: '9876543212' },
    { id: 'v4', name: 'Thiruvananthapuram Florals', city: 'Thiruvananthapuram', area: 'TVM Central', distance: '4.2 km', rating: 4.7, reviews: 189, availability: 'Available', phone: '9876543213' },
    { id: 'v5', name: 'Kerala Fruits Paradise', city: 'Thiruvananthapuram', area: 'Karamana', distance: '5.5 km', rating: 4.5, reviews: 156, availability: 'Available', phone: '9876543214' },
    { id: 'v6', name: 'Kozhikode Sweets House', city: 'Kozhikode', area: 'Kozhikode City', distance: '2.9 km', rating: 4.8, reviews: 234, availability: 'Available', phone: '9876543215' },
    { id: 'v7', name: 'Thrissur Flower House', city: 'Thrissur', area: 'Thrissur City', distance: '3.3 km', rating: 4.9, reviews: 178, availability: 'Available', phone: '9876543216' },
    { id: 'v8', name: 'Alappuzha Fresh Mart', city: 'Alappuzha', area: 'Alappuzha', distance: '1.5 km', rating: 4.7, reviews: 267, availability: 'Available', phone: '9876543217' },
    { id: 'v9', name: 'Kannur Garden Fresh', city: 'Kannur', area: 'Kannur City', distance: '4.8 km', rating: 4.6, reviews: 145, availability: 'Available', phone: '9876543218' },
    { id: 'v10', name: 'Kollam Sweet Palace', city: 'Kollam', area: 'Kollam City', distance: '3.7 km', rating: 4.8, reviews: 201, availability: 'Available', phone: '9876543219' }
];

const KERALA_CITIES_AREAS = {
    'Kochi': ['Fort Kochi', 'Vyttila', 'Ernakulam', 'Panampilly Nagar', 'Palarivattom', 'Kakkanad'],
    'Thiruvananthapuram': ['TVM Central', 'Pappanamcode', 'TVM South', 'Veli', 'Karamana', 'Kowdiar'],
    'Kozhikode': ['Kozhikode City', 'Calicut', 'KZC South', 'KZC North', 'Beypore', 'Kunnamangalam'],
    'Thrissur': ['Thrissur City', 'Eroor', 'Kunnamkulam', 'Irinjalakuda', 'Chalakudy', 'Kodungalloor'],
    'Alappuzha': ['Alappuzha', 'Cherthala', 'Harippad', 'Thrikkunnapuzha', 'Kayamkulam'],
    'Kannur': ['Kannur City', 'Thalassery', 'Mattanur', 'Payyanur', 'Kasaragod'],
    'Kollam': ['Kollam City', 'Parippally', 'Kottarakkara', 'Kundara', 'Pathanamthitta'],
    'Palakkad': ['Palakkad City', 'Kunnamangalam', 'Mannanthala', 'Koduvayur', 'Ottapalam'],
    'Malappuram': ['Malappuram', 'Kondotty', 'Ponnani', 'Tanur', 'Kottakkal']
};

// Get all products from sample data
async function getAllProducts() {
    try {
        // Prefer database products if available
        if (db) {
            const snap = await db.ref('products').once('value');
            const val = snap.val();
            if (val) {
                // convert object map to array keyed by category
                const grouped = {};
                Object.keys(val).forEach(k => {
                    const p = val[k];
                    const catKey = (p.category || 'uncategorized').toLowerCase();
                    grouped[catKey] = grouped[catKey] || [];
                        // choose a default displayed price (first seasonal price or marketPrice)
                        const seasons = p.prices && Object.keys(p.prices);
                        const defaultPrice = (seasons && seasons.length) ? p.prices[seasons[0]] : (p.marketPrice || 0);
                        grouped[catKey].push({ id: k, ...p, predictedPrice: defaultPrice });
                });
                return grouped;
            }
        }

        return SAMPLE_PRODUCTS;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    }
}

// Get products by category
async function getProductsByCategory(category) {
    try {
        // Try realtime DB first
        if (db) {
            const snapshot = await db.ref('products').orderByChild('category').equalTo(category).once('value');
            const products = [];
            snapshot.forEach(child => {
                const p = child.val();
                const seasons = p.prices && Object.keys(p.prices);
                const defaultPrice = (seasons && seasons.length) ? p.prices[seasons[0]] : (p.marketPrice || 0);
                products.push({ id: child.key, ...p, predictedPrice: defaultPrice });
            });
            if (products.length) return products;
        }

        const categoryKey = category.toLowerCase();
        if (SAMPLE_PRODUCTS[categoryKey]) {
            return SAMPLE_PRODUCTS[categoryKey];
        }
        return [];
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }
}

// Get all vendors
async function getAllVendors() {
    try {
        if (db) {
            const snap = await db.ref('vendors').once('value');
            const val = snap.val();
            if (val) {
                const arr = [];
                Object.keys(val).forEach(k => arr.push({ id: k, ...val[k] }));
                return arr;
            }
        }
        return SAMPLE_VENDORS;
    } catch (error) {
        console.error('Error fetching vendors:', error);
        return [];
    }
}

// Get all categories (array)
async function getAllCategories() {
    try {
        if (!db) throw new Error('Database not initialized');
        const snap = await db.ref('categories').once('value');
        const val = snap.val();
        if (!val) return [];
        return Object.keys(val).map(k => ({ id: k, ...val[k] }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// Get flat list of all products (array)
async function getProductsList() {
    try {
        if (!db) throw new Error('Database not initialized');
        const snap = await db.ref('products').once('value');
        const val = snap.val();
        if (!val) return [];
        return Object.keys(val).map(k => {
            const p = val[k];
            const seasons = p.prices && Object.keys(p.prices);
            const defaultPrice = (seasons && seasons.length) ? p.prices[seasons[0]] : (p.marketPrice || 0);
            return { id: k, ...p, predictedPrice: defaultPrice };
        });
    } catch (error) {
        console.error('Error fetching product list:', error);
        return [];
    }
}

// Update product details (images, prices, description, marketPrice, name, tags)
async function updateProductDetails(productId, updates) {
    try {
        if (!db) throw new Error('Database not initialized');
        await db.ref('products/' + productId).update(updates);
        showToast('✅ Product updated', 'success');
    } catch (error) {
        console.error('Error updating product:', error);
        showToast('Error updating product', 'error');
    }
}

// Update category details
async function updateCategoryDetails(categoryId, updates) {
    try {
        if (!db) throw new Error('Database not initialized');
        await db.ref('categories/' + categoryId).update(updates);
        showToast('✅ Category updated', 'success');
    } catch (error) {
        console.error('Error updating category:', error);
        showToast('Error updating category', 'error');
    }
}

// Load admin dashboard data and render into admin panel
async function loadAdminDashboard() {
    try {
        if (!db) throw new Error('Database not initialized');
        const cats = await getAllCategories();
        const prods = await getProductsList();

        // Render categories
        const catContainer = document.getElementById('adminCategoriesList');
        if (catContainer) {
            if (cats.length === 0) catContainer.innerHTML = '<p style="color:#666">No categories</p>';
            else {
                catContainer.innerHTML = cats.map(cat => `
                    <div class="card" style="margin-bottom:10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <strong>${cat.name}</strong> <small style="color:#666">(${cat.season || '—'})</small>
                                <div style="font-size:0.9em;color:#666">ID: ${cat.id}</div>
                            </div>
                            <div style="display:flex; gap:8px;">
                                <input placeholder="Image URL" id="catImg_${cat.id}" value="${cat.image || ''}" style="width:300px">
                                <button class="btn btn-sm" onclick="(async function(){ await updateCategoryDetails('${cat.id}', { image: document.getElementById('catImg_${cat.id}').value }); loadAdminDashboard(); })()">Save</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Render products
        const prodContainer = document.getElementById('adminProductsList');
        if (prodContainer) {
            if (prods.length === 0) prodContainer.innerHTML = '<p style="color:#666">No products</p>';
            else {
                prodContainer.innerHTML = prods.map(p => `
                    <div class="card" style="margin-bottom:12px;">
                        <div style="display:flex; gap:12px; align-items:flex-start;">
                            <div style="width:120px;">
                                <img src="${(p.images && p.images[0]) || ''}" alt="img" style="width:100%; height:80px; object-fit:cover; background:#f3f3f3">
                            </div>
                            <div style="flex:1;">
                                <strong>${p.name}</strong>
                                <div style="font-size:0.9em;color:#666">ID: ${p.id} — Category: ${p.category}</div>
                                <div style="margin-top:8px;">
                                    <label>Images (comma-separated)</label>
                                    <input id="prodImgs_${p.id}" value="${(p.images || []).join(',') || ''}" style="width:100%">
                                </div>
                                <div style="margin-top:8px; display:flex; gap:8px;">
                                    <div style="flex:1">
                                        <label>Market Price</label>
                                        <input id="prodMarket_${p.id}" type="number" value="${p.marketPrice || 0}" style="width:100%">
                                    </div>
                                    <div style="flex:2">
                                        <label>Seasonal Prices (JSON)</label>
                                        <input id="prodPrices_${p.id}" value='${JSON.stringify(p.prices || {})}' style="width:100%">
                                    </div>
                                </div>
                                <div style="margin-top:8px;">
                                    <label>Description</label>
                                    <input id="prodDesc_${p.id}" value="${(p.description || '').replace(/"/g, '&quot;')}" style="width:100%">
                                </div>
                                <div style="margin-top:8px; display:flex; gap:8px;">
                                    <button class="btn btn-primary" onclick="(async function(){ try{ const imgs=document.getElementById('prodImgs_${p.id}').value.split(',').map(s=>s.trim()).filter(Boolean); const market=Number(document.getElementById('prodMarket_${p.id}').value)||0; let prices={}; try{ prices=JSON.parse(document.getElementById('prodPrices_${p.id}').value); }catch(e){ alert('Prices must be valid JSON'); return; } const desc=document.getElementById('prodDesc_${p.id}').value; await updateProductDetails('${p.id}', { images: imgs, prices: prices, marketPrice: market, description: desc }); loadAdminDashboard(); }catch(err){ console.error(err); alert('Update failed'); } })()">Save</button>
                                    <button class="btn btn-sm" onclick="(async function(){ if(confirm('Delete product?')){ await db.ref('products/${p.id}').remove(); loadAdminDashboard(); } })()">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        showToast('Error loading admin data', 'error');
    }
}

// Get vendors by city
async function getVendorsByCity(city) {
    try {
        if (db) {
            const snapshot = await db.ref('vendors').orderByChild('city').equalTo(city).once('value');
            const vendors = [];
            snapshot.forEach(child => vendors.push({ id: child.key, ...child.val() }));
            if (vendors.length) return vendors;
        }
        return SAMPLE_VENDORS.filter(v => v.city === city);
    } catch (error) {
        console.error('Error fetching vendors by city:', error);
        return [];
    }
}

// Get vendor orders (orders assigned to vendor)
async function getVendorOrders(vendorId) {
    try {
        if (!db) throw new Error('Database not initialized');
        const snap = await db.ref('vendor_orders/' + vendorId).once('value');
        const val = snap.val() || {};
        const orders = Object.keys(val).map(k => ({ id: k, ...val[k] }));
        return orders;
    } catch (error) {
        console.error('Error fetching vendor orders:', error);
        return [];
    }
}

// Create a category in database
async function createCategory(categoryData) {
    try {
        if (!db) throw new Error('Database not initialized');
        const ref = db.ref('categories').push();
        await ref.set({
            name: categoryData.name,
            season: categoryData.season || null,
            image: categoryData.image || null,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        });
        return ref.key;
    } catch (error) {
        console.error('Error creating category:', error);
        return null;
    }
}

// Create a product in database. productData should include: name, category, marketPrice, prices (object by season), images (array), description
async function createProduct(productData) {
    try {
        if (!db) throw new Error('Database not initialized');
        const ref = db.ref('products').push();
        await ref.set({
            name: productData.name,
            category: productData.category,
            marketPrice: productData.marketPrice || 0,
            prices: productData.prices || {},
            images: productData.images || [],
            description: productData.description || '',
            createdAt: firebase.database.ServerValue.TIMESTAMP
        });
        return ref.key;
    } catch (error) {
        console.error('Error creating product:', error);
        return null;
    }
}

// Set seasonal prices for a product
async function setSeasonalPrices(productId, prices) {
    try {
        if (!db) throw new Error('Database not initialized');
        await db.ref('products/' + productId + '/prices').set(prices);
        showToast('✅ Seasonal prices updated', 'success');
    } catch (error) {
        console.error('Error setting seasonal prices:', error);
        showToast('Error updating prices', 'error');
    }
}

// Remove demo/sample nodes to start fresh
async function clearSampleData() {
    try {
        if (!db) throw new Error('Database not initialized');
        await db.ref('categories').remove();
        await db.ref('products').remove();
        await db.ref('vendors').remove();
        await db.ref('vendor_products').remove();
        showToast('✅ Cleared categories/products/vendors', 'success');
    } catch (error) {
        console.error('Error clearing sample data:', error);
        showToast('Error clearing data', 'error');
    }
}

// Create default inventory entries for a new vendor (adds every product with stock 20)
async function createVendorDefaultInventory(vendorId) {
    try {
        if (!db) throw new Error('Database not initialized');
        const snapshot = await db.ref('products').once('value');
        const products = snapshot.val();
        if (!products) return;

        const updates = {};
        Object.keys(products).forEach(pid => {
            const p = products[pid];
            const price = (p.prices && Object.values(p.prices)[0]) || p.marketPrice || 0;
            const vpRef = db.ref('vendor_products/' + vendorId).push();
            updates['vendor_products/' + vendorId + '/' + vpRef.key] = {
                productId: pid,
                name: p.name,
                price: price,
                stock: 20,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };
        });

        await db.ref().update(updates);
        console.log('✅ Default inventory created for vendor', vendorId);
    } catch (error) {
        console.error('Error creating vendor default inventory:', error);
    }
}

// Initialize seasonal demo data: 4 seasons, 3 categories per season, 3 products per category
async function initializeSeasonalDemo() {
    try {
        if (!db) throw new Error('Database not initialized');
        const seasons = ['Summer', 'Monsoon', 'Winter', 'Spring'];
        for (const season of seasons) {
            for (let c = 1; c <= 3; c++) {
                const categoryName = `${season} Category ${c}`;
                const catId = await createCategory({ name: categoryName, season: season, image: '' });
                for (let p = 1; p <= 3; p++) {
                    const prodName = `${categoryName} - Product ${p}`;
                    const base = 100 + (c * 50) + (p * 10);
                    const prices = {};
                    seasons.forEach((s, idx) => prices[s] = Math.round(base * (1 + idx * 0.1)));
                    await createProduct({
                        name: prodName,
                        category: categoryName,
                        marketPrice: base + 50,
                        prices: prices,
                        images: [],
                        description: `Auto-generated ${prodName}`
                    });
                }
            }
        }
        showToast('✅ Seasonal demo data initialized', 'success');
    } catch (error) {
        console.error('Error initializing demo data:', error);
        showToast('Error initializing demo data', 'error');
    }
}

// Save pre-book order
async function savePrebook(prebookData) {
    try {
        if (!currentUser) throw new Error('User not logged in');

        const prebookRef = db.ref('prebooks').push();
        await prebookRef.set({
            ...prebookData,
            userId: currentUser.uid,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            status: 'Pending'
        });

        showToast('✅ Product pre-booked successfully!', 'success');
        return prebookRef.key;
    } catch (error) {
        console.error('Error saving prebook:', error);
        showToast('Error pre-booking product', 'error');
        return null;
    }
}

// Add to cart locally
function addToCart(item, type = 'prebook') {
    try {
        const cartItem = {
            id: Date.now(),
            ...item,
            type: type,
            addedAt: new Date().toISOString()
        };

        // Ensure necessary fields
        cartItem.quantity = cartItem.quantity || 1;
        cartItem.price = cartItem.price || cartItem.lockedPrice || cartItem.marketPrice || 0;
        cartItem.marketPrice = cartItem.marketPrice || cartItem.price;
        cartItem.totalPrice = cartItem.totalPrice || (cartItem.price * cartItem.quantity);

        if (type === 'prebook') {
            customerCart.prebook.push(cartItem);
        } else {
            customerCart.pool.push(cartItem);
        }

        localStorage.setItem('festivchain_cart', JSON.stringify(customerCart));
        showToast(`✅ Added to ${type} cart!`, 'success');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Error adding to cart', 'error');
    }
}

// Get user cart
function getCart() {
    return customerCart;
}

// Clear cart
function clearCart() {
    customerCart = { prebook: [], pool: [] };
    localStorage.removeItem('festivchain_cart');
}

// Save order
async function saveOrder(orderData) {
    try {
        if (!currentUser) throw new Error('User not logged in');

        const orderRef = db.ref('orders').push();
        const orderPayload = {
            ...orderData,
            userId: currentUser.uid,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            status: 'Confirmed'
        };

        await orderRef.set(orderPayload);

        // Assign order items to vendors: group items by vendor who stocks them
        const items = orderData.items || [];
        const vendorMap = {}; // vendorId -> [items]

        for (const item of items) {
            // find vendor_products entries that reference this productId
            const vpSnap = await db.ref('vendor_products').orderByChild('productId').equalTo(item.productId).once('value');
            let assigned = false;
            vpSnap.forEach(child => {
                const vp = child.val();
                const vendorId = child.ref.parent.key; // this will not work directly; instead derive from path
            });

            // Alternative approach: scan all vendors and their vendor_products once
        }

        // Efficient approach: read all vendor_products and map productId->vendorId
        const allVPSnap = await db.ref('vendor_products').once('value');
        const vpVal = allVPSnap.val() || {};
        const prodToVendors = {}; // productId -> [vendorId]
        Object.keys(vpVal).forEach(vendorId => {
            const vendorProds = vpVal[vendorId] || {};
            Object.keys(vendorProds).forEach(vpid => {
                const vp = vendorProds[vpid];
                const pid = vp.productId;
                prodToVendors[pid] = prodToVendors[pid] || [];
                prodToVendors[pid].push({ vendorId, vpId: vpid, stock: vp.stock || 0, price: vp.price });
            });
        });

        items.forEach(item => {
            const options = prodToVendors[item.productId] || [];
            // prefer vendor in user's city if possible
            let chosen = null;
            if (options.length) {
                // try match by currentLocation.city
                if (currentLocation && currentLocation.city) {
                    for (const opt of options) {
                        // check vendor city
                        // vendors stored at /vendors/{vendorId}
                        // we will read vendor record
                    }
                }
                // fallback: choose first vendor with stock
                chosen = options.find(o => o.stock > 0) || options[0];
            }

            if (chosen) {
                vendorMap[chosen.vendorId] = vendorMap[chosen.vendorId] || [];
                vendorMap[chosen.vendorId].push(item);
            } else {
                // no vendor found, leave assigned to 'unassigned'
                vendorMap['unassigned'] = vendorMap['unassigned'] || [];
                vendorMap['unassigned'].push(item);
            }
        });

        // Write vendor_orders entries
        const assignedVendors = [];
        const updates = {};
        Object.keys(vendorMap).forEach(vendorId => {
            assignedVendors.push(vendorId);
            const voRef = db.ref('vendor_orders/' + vendorId + '/' + orderRef.key);
            updates['vendor_orders/' + vendorId + '/' + orderRef.key] = {
                orderId: orderRef.key,
                userId: currentUser.uid,
                items: vendorMap[vendorId],
                status: 'New',
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };
        });

        // Update order with assigned vendors
        updates['orders/' + orderRef.key + '/assignedVendors'] = assignedVendors;
        await db.ref().update(updates);

        showToast && showToast('✅ Order placed successfully', 'success');
        return orderRef.key;
    } catch (error) {
        console.error('Error saving order:', error);
        showToast('Error saving order', 'error');
        return null;
    }
}

// Get user orders
async function getUserOrders() {
    try {
        if (!currentUser) return [];

        const snapshot = await db.ref('orders').orderByChild('userId').equalTo(currentUser.uid).once('value');
        const orders = [];
        snapshot.forEach(child => {
            orders.push({
                id: child.key,
                ...child.val()
            });
        });

        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

// Save vendor product
async function saveVendorProduct(productData) {
    try {
        if (!currentUser || currentUser.role !== 'vendor') throw new Error('Only vendors can add products');

        const prodRef = db.ref('vendor_products/' + currentUser.uid).push();
        await prodRef.set({
            ...productData,
            vendorId: currentUser.uid,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        });

        showToast('✅ Product listed successfully!', 'success');
        return prodRef.key;
    } catch (error) {
        console.error('Error saving product:', error);
        showToast('Error listing product', 'error');
        return null;
    }
}

// Get vendor products
async function getVendorProducts(vendorId) {
    try {
        const snapshot = await db.ref('vendor_products/' + vendorId).once('value');
        const products = [];
        snapshot.forEach(child => {
            const val = child.val() || {};
            products.push({
                id: child.key,
                productId: val.productId || val.productID || val.pid || null,
                name: val.name || val.productName || ('Product ' + child.key),
                category: val.category || val.cat || null,
                price: val.price || val.pricePerUnit || 0,
                stock: typeof val.stock !== 'undefined' ? val.stock : (val.quantity || 0),
                deliveryDate: val.deliveryDate || null,
                raw: val
            });
        });

        return products;
    } catch (error) {
        console.error('Error fetching vendor products:', error);
        return [];
    }
}

// Save review
async function saveReview(reviewData) {
    try {
        if (!currentUser) throw new Error('User not logged in');

        const reviewRef = db.ref('reviews').push();
        await reviewRef.set({
            ...reviewData,
            userId: currentUser.uid,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        });

        showToast('✅ Review submitted successfully!', 'success');
        return reviewRef.key;
    } catch (error) {
        console.error('Error saving review:', error);
        showToast('Error submitting review', 'error');
        return null;
    }
}

// Get product reviews
async function getProductReviews(productId) {
    try {
        const snapshot = await db.ref('reviews').orderByChild('productId').equalTo(productId).once('value');
        const reviews = [];
        snapshot.forEach(child => {
            reviews.push({
                id: child.key,
                ...child.val()
            });
        });

        return reviews;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

// Update order status (vendor only)
async function updateOrderStatus(orderId, status) {
    try {
        if (!currentUser || currentUser.role !== 'vendor') throw new Error('Only vendors can update orders');

        await db.ref('orders/' + orderId).update({
            status: status,
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        });

        showToast('✅ Order status updated!', 'success');
    } catch (error) {
        console.error('Error updating order:', error);
        showToast('Error updating order', 'error');
    }
}

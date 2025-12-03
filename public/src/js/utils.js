// ============================================
// FESTIVCHAIN - UTILITY FUNCTIONS
// ============================================

// Global variables
let currentUser = null;
let currentLocation = null;
let customerCart = { prebook: [], pool: [] };
let customerOrders = [];

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        window.scrollTo(0, 0);
        console.log('📄 Screen:', screenId);
    }
}

// Toast Notifications
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type} animate-slide-in-up`;

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };

    toast.innerHTML = `
        <span>${icons[type]} ${message}</span>
        <span class="toast-close" onclick="this.parentElement.remove()">✕</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}

// Loading Spinner
function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

// Update Location Display
function updateLocationDisplay() {
    const locationInfo = document.getElementById('custLocationInfo');
    if (currentLocation && locationInfo) {
        locationInfo.innerHTML = `
            <strong>📍 ${currentLocation.area}, ${currentLocation.city}</strong>
        `;
    }
}

// Update Areas based on City
function updateAreas() {
    const citySelect = document.getElementById('citySelect');
    const areaSelect = document.getElementById('areaSelect');

    const city = citySelect.value;
    areaSelect.innerHTML = '<option value="">Select Area</option>';

    if (city && KERALA_CITIES_AREAS[city]) {
        KERALA_CITIES_AREAS[city].forEach(area => {
            const option = document.createElement('option');
            option.value = area;
            option.textContent = area;
            areaSelect.appendChild(option);
        });
    }
}

// Populate City Select
function populateCities() {
    const citySelect = document.getElementById('citySelect');
    Object.keys(KERALA_CITIES_AREAS).forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

// Update Location
function updateLocation(event) {
    event.preventDefault();

    const city = document.getElementById('citySelect').value;
    const area = document.getElementById('areaSelect').value;

    if (!city || !area) {
        showToast('Please select both city and area', 'error');
        return;
    }

    currentLocation = { city, area };
    localStorage.setItem('festivchain_location', JSON.stringify(currentLocation));
    updateLocationDisplay();
    showToast('📍 Location updated successfully!', 'success');

    setTimeout(() => {
        showScreen('customerHome');
        loadCustomerHome();
    }, 600);
}

// Load Customer Home
async function loadCustomerHome() {
    const idText = currentUser.email || currentUser.phone || 'Guest';
    document.getElementById('custWelcome').textContent = `Welcome, ${idText}! 👋`;
    updateLocationDisplay();

    // Set today as default date
    const dateInput = document.getElementById('festivalDate');
    dateInput.valueAsDate = new Date();
    handleDateChange();

    // Load featured products
    loadFeaturedProducts();

    // Load categories
    loadCategories();
}

// Load Categories (from DB)
// showAll: when true, render all categories; otherwise show top 6 relevant to current festival
async function loadCategories(showAll = false) {
    const categoryGrid = document.getElementById('categoryGrid');
    if (!categoryGrid) return;
    categoryGrid.innerHTML = '';
    try {
        const cats = await getAllCategories();
        if (!cats || !cats.length) {
            categoryGrid.innerHTML = '<p style="color:#666">No categories available</p>';
            return;
        }

        // Determine active festival (set by themeManager) - fallback to stored value or null
        const festival = (localStorage.getItem('festivchain_festival') || null);

        let ordered = [...cats];

        if (!showAll && festival) {
            // Prefer categories that match the festival/season field
            const fav = ordered.filter(c => c.season && String(c.season).toLowerCase() === String(festival).toLowerCase());
            const others = ordered.filter(c => !(c.season && String(c.season).toLowerCase() === String(festival).toLowerCase()));
            ordered = [...fav, ...others];
            // take top 6
            ordered = ordered.slice(0, 6);
        }

        // Render cards
        const html = ordered.map(c => {
            const img = c.image || 'assets/default-cat.png';
            return `
                <div class="category-card" onclick="browseCategory('${(c.name || '').replace(/'/g, "\\'")}')">
                    <div class="category-card-icon"><img src="${img}" alt="${(c.name || 'Category')}"></div>
                    <h3>${c.name}</h3>
                    <p style="color: #666;">${c.season || ''}</p>
                </div>
            `;
        }).join('');

        categoryGrid.innerHTML = html;

        // If not showing all and there are more categories, show a 'Show All' button
        // Remove any existing wrapper first to avoid duplicates
        const existing = document.getElementById('showAllCatsWrapper');
        if (existing) existing.remove();

        if (!showAll && cats.length > ordered.length) {
            const wrapper = document.createElement('div');
            wrapper.id = 'showAllCatsWrapper';
            wrapper.style.textAlign = 'center';
            wrapper.style.marginTop = '12px';
            wrapper.innerHTML = `<button class="btn btn-outline" id="showAllCatsBtn">Show All Categories</button>`;
            // insert after the category grid so placement is consistent
            categoryGrid.insertAdjacentElement('afterend', wrapper);
            const btn = document.getElementById('showAllCatsBtn');
            if (btn) {
                btn.addEventListener('click', () => {
                    wrapper.remove();
                    loadCategories(true);
                });
            }
        }

    } catch (err) {
        console.error('Error loading categories:', err);
        categoryGrid.innerHTML = '<p style="color:#666">Failed to load categories</p>';
    }
}

// Browse Category and show Add to Cart buttons
async function browseCategory(category) {
    try {
        showLoadingSpinner();
        const products = await getProductsByCategory(category);

        if (!products || products.length === 0) {
            document.getElementById('productsList').innerHTML = '<p style="color:#666;text-align:center;padding:30px;">No products found for this category</p>';
            document.getElementById('categoryTitle').textContent = `${category}`;
            hideLoadingSpinner();
            showScreen('productsScreen');
            return;
        }

        const html = products.map(product => {
            const img = (product.images && product.images.length) ? product.images[0] : (product.image || '');
            const price = product.predictedPrice || product.marketPrice || 0;
            return `
                <div class="product-card animate-fade-in" data-id="${product.id}">
                    <div class="discount-badge">${product.marketPrice ? Math.round(((product.marketPrice - price) / product.marketPrice) * 100) : 0}% OFF</div>
                    <div class="product-image"><img src="${img || 'https://static.thenounproject.com/png/482114-200.png'}" alt="${product.name}" style="width:100%;height:120px;object-fit:cover;border-radius:6px"></div>
                    <div class="product-name">${product.name}</div>
                    <div class="price-info">
                        <div class="price-row" style="font-weight: bold; color: var(--color-success);">
                            <span>₹${price}</span>
                        </div>
                    </div>
                    <div style="display:flex;gap:8px;margin-top:10px">
                        <button class="btn btn-primary btn-add" data-pid="${product.id}">Add to Cart</button>
                        <button class="btn btn-secondary btn-view" data-pid="${product.id}">View</button>
                    </div>
                </div>
            `;
        }).join('');

        document.getElementById('productsList').innerHTML = html;
        document.getElementById('categoryTitle').textContent = `${category}`;

        // attach handlers
        document.querySelectorAll('.btn-add').forEach(btn => {
            btn.addEventListener('click', async (ev) => {
                ev.stopPropagation();
                const pid = btn.getAttribute('data-pid');
                const prod = products.find(p => String(p.id) === String(pid));
                const item = {
                    productId: prod.id || prod.key,
                    name: prod.name,
                    category: prod.category || category,
                    price: prod.predictedPrice || prod.marketPrice || 0,
                    quantity: 1,
                    image: (prod.images && prod.images[0]) || prod.image || ''
                };
                addToCart(item, 'pool');
            });
        });

        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                const pid = btn.getAttribute('data-pid');
                showProductDetail(category, pid);
            });
        });

        hideLoadingSpinner();
        showScreen('productsScreen');
    } catch (error) {
        console.error('Error browsing category:', error);
        hideLoadingSpinner();
        showToast('Error loading products', 'error');
    }
}

// Show Product Detail with Add to Cart
async function showProductDetail(category, productId) {
    try {
        showLoadingSpinner();
        const products = await getProductsByCategory(category);
        const product = products.find(p => (String(p.id) === String(productId)) || (p.id === productId));
        if (!product) {
            document.getElementById('productDetailContent').innerHTML = '<p style="color:#666">Product not found</p>';
            hideLoadingSpinner();
            showScreen('productDetail');
            return;
        }

        const img = (product.images && product.images.length) ? product.images[0] : (product.image || '');
        const price = product.predictedPrice || product.marketPrice || 0;

        const html = `
            <div style="text-align: center;">
                <div style="margin: 10px 0;"><img src="${img || 'https://static.thenounproject.com/png/482114-200.png'}" alt="${product.name}" style="width:200px;height:200px;object-fit:cover;border-radius:8px"></div>
                <h2 style="color: var(--color-primary); margin: 20px 0;">${product.name}</h2>
                <p style="color: var(--color-text-secondary); margin: 20px 0; font-size: 1.1em;">${product.description || ''}</p>

                <div class="price-info" style="margin: 20px 0;">
                    <div class="price-row" style="font-size: 1.1em;">
                        <span>Market Price:</span>
                        <span style="color: #999; text-decoration: line-through;">₹${product.marketPrice || price}</span>
                    </div>
                    <div class="price-row" style="font-size: 1.3em; color: var(--color-success); font-weight: bold;">
                        <span>Our Price:</span>
                        <span>₹${price}</span>
                    </div>
                </div>

                <div style="margin-top:20px; display:flex; gap:8px; justify-content:center; align-items:center;">
                    <input id="pd_qty" type="number" min="1" value="1" style="width:80px; padding:8px; border-radius:6px; border:1px solid #ddd">
                    <button id="pd_add" class="btn btn-primary">Add to Cart</button>
                    <button class="btn btn-secondary" onclick="showScreen('productsScreen')">← Back</button>
                </div>
            </div>
        `;

        document.getElementById('productDetailContent').innerHTML = html;
        document.getElementById('pd_add').addEventListener('click', () => {
            const qty = parseInt(document.getElementById('pd_qty').value, 10) || 1;
            const item = {
                productId: product.id || product.key,
                name: product.name,
                category: product.category || category,
                price: price,
                quantity: qty,
                image: img
            };
            addToCart(item, 'pool');
        });

        hideLoadingSpinner();
        showScreen('productDetail');
    } catch (err) {
        console.error('Error showing product detail', err);
        hideLoadingSpinner();
        showToast('Error loading product', 'error');
    }
}

// Start Prebooking (deprecated) -> convert to add-to-cart flow
async function startPrebooking(category, productId) {
    const products = await getProductsByCategory(category);
    const product = products.find(p => (String(p.id) === String(productId)) || (p.id === productId));
    if (!product) return;
    const item = {
        productId: product.id || product.key,
        name: product.name,
        category: product.category || category,
        price: product.predictedPrice || product.marketPrice || 0,
        quantity: 1,
        image: (product.images && product.images[0]) || product.image || ''
    };
    addToCart(item, 'pool');
    showToast('Added to cart (prebook converted to cart)', 'info');
    setTimeout(() => showScreen('customerHome'), 700);
}

// Confirm Prebook (kept for compatibility) - converts to cart
async function confirmPrebook(category, productId) {
    const products = await getProductsByCategory(category);
    const product = products.find(p => (String(p.id) === String(productId)) || (p.id === productId));
    const qty = parseFloat(document.getElementById('prebookQty').value) || 1;
    const date = document.getElementById('prebookDeliveryDate') ? document.getElementById('prebookDeliveryDate').value : null;

    if (!product) return;

    const item = {
        productId: product.id,
        name: product.name,
        category: category,
        marketPrice: product.marketPrice,
        lockedPrice: product.predictedPrice,
        quantity: qty,
        deliveryDate: date,
        totalPrice: (product.predictedPrice || product.marketPrice || 0) * qty,
        image: (product.images && product.images[0]) || product.image || ''
    };

    addToCart(item, 'prebook');
    setTimeout(() => showScreen('customerHome'), 800);
}

// Load Featured Products
async function loadFeaturedProducts() {
    const featured = document.getElementById('featuredProducts');
    if (!featured) return;

    const all = await getAllProducts();
    // pick RANDOM product from each top-level grouping (if available)
    const products = [];
    if (all) {
        Object.keys(all).forEach(k => {
            if (Array.isArray(all[k]) && all[k].length) {
                const randomIdx = Math.floor(Math.random() * all[k].length);
                products.push(all[k][randomIdx]);
            }
        });
    }

    featured.innerHTML = products.map(product => {
        const savings = Math.round(((product.marketPrice - product.predictedPrice) / product.marketPrice) * 100);
        // prefer explicit images array, then product.image (URL), else fallback to placeholder
        let imgSrc = '';
        if (product.images && product.images.length) imgSrc = product.images[0];
        else if (product.image && typeof product.image === 'string' && (product.image.startsWith('http') || product.image.startsWith('/'))) imgSrc = product.image;

        const imageHtml = imgSrc ? `<div class="product-image"><img src="${imgSrc}" alt="${product.name}"></div>` : `<div class="product-image"><img src="https://static.thenounproject.com/png/482114-200.png" alt="${product.name}"></div>`;

        return `
            <div class="product-card" onclick="showProductDetail('${product.category}', '${product.id}')">
                <div class="discount-badge">${savings}% OFF</div>
                ${imageHtml}
                <div class="product-name">${product.name}</div>
                <div class="product-rating">⭐ ${product.rating || ''}</div>
                <div class="price-info">
                    <div class="price-row" style="font-weight: bold; color: var(--color-success);">
                        <span>Our:</span>
                        <span>₹${product.predictedPrice || 0}</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm btn-full btn-add-featured" style="margin-top: 10px;" data-pid="${product.id}" data-cat="${product.category}">Add to Cart</button>
            </div>
        `;
    }).join('');

    // Duplicate products for infinite scroll effect
    const productHTML = products.map(product => {
        const savings = Math.round(((product.marketPrice - product.predictedPrice) / product.marketPrice) * 100);
        let imgSrc = '';
        if (product.images && product.images.length) imgSrc = product.images[0];
        else if (product.image && typeof product.image === 'string' && (product.image.startsWith('http') || product.image.startsWith('/'))) imgSrc = product.image;

        const imageHtml = imgSrc ? `<div class="product-image"><img src="${imgSrc}" alt="${product.name}"></div>` : `<div class="product-image"><img src="https://static.thenounproject.com/png/482114-200.png" alt="${product.name}"></div>`;

        return `
            <div class="product-card" onclick="showProductDetail('${product.category}', '${product.id}')">
                <div class="discount-badge">${savings}% OFF</div>
                ${imageHtml}
                <div class="product-name">${product.name}</div>
                <div class="product-rating">⭐ ${product.rating || ''}</div>
                <div class="price-info">
                    <div class="price-row" style="font-weight: bold; color: var(--color-success);">
                        <span>Our:</span>
                        <span>₹${product.predictedPrice || 0}</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm btn-full btn-add-featured" style="margin-top: 10px;" data-pid="${product.id}" data-cat="${product.category}">Add to Cart</button>
            </div>
        `;
    }).join('');

    // Duplicate for seamless loop
    featured.innerHTML = productHTML + productHTML;

    // Set CSS variable for animation
    featured.style.setProperty('--product-count', products.length);

    // Attach event listeners for Add to Cart buttons
    document.querySelectorAll('.btn-add-featured').forEach(btn => {
        btn.addEventListener('click', async (ev) => {
            ev.stopPropagation();
            const pid = btn.getAttribute('data-pid');
            const cat = btn.getAttribute('data-cat');

            // Find product details
            const all = await getAllProducts();
            let prod = null;
            if (all && all[cat.toLowerCase()]) {
                prod = all[cat.toLowerCase()].find(p => String(p.id) === String(pid));
            }

            if (prod) {
                const item = {
                    productId: prod.id || prod.key,
                    name: prod.name,
                    category: prod.category || cat,
                    price: prod.predictedPrice || prod.marketPrice || 0,
                    quantity: 1,
                    image: (prod.images && prod.images[0]) || prod.image || ''
                };
                addToCart(item, 'pool');
            }
        });
    });
}

// Load Vendor Dashboard
async function loadVendorDashboard() {
    try {
        // Load vendor stats
        const products = await getVendorProducts(currentUser.uid);
        const orders = await getVendorOrders(currentUser.uid);

        let activeOrders = 0;
        let totalSales = 0;

        if (orders && orders.length > 0) {
            activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

            // Calculate total sales from completed orders
            orders.forEach(o => {
                if (o.status === 'Delivered' || o.status === 'Completed' || o.status === 'Out for Delivery') { // Assuming these count as sales
                    // Calculate total for this vendor's items in the order
                    if (o.items && Array.isArray(o.items)) {
                        o.items.forEach(item => {
                            totalSales += (item.price * item.quantity);
                        });
                    } else if (o.items) {
                        Object.values(o.items).forEach(item => {
                            totalSales += (item.price * item.quantity);
                        });
                    }
                }
            });
        }

        document.querySelector('.stats-grid').innerHTML = `
            <div class="stat-card">
                <div class="stat-label">Total Products</div>
                <div class="stat-value">${products.length}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Stock</div>
                <div class="stat-value">${products.reduce((sum, p) => sum + (p.stock || 0), 0)} kg</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Active Orders</div>
                <div class="stat-value">${activeOrders}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, var(--color-success) 0%, #16A34A 100%);">
                <div class="stat-label">Total Sales</div>
                <div class="stat-value">₹${totalSales.toFixed(0)}</div>
            </div>
        `;

        // Load vendor products list
        displayVendorProducts(products);
        // Also preload inventory and orders for vendor screens
        try {
            await loadVendorInventory();
        } catch (e) { console.warn('Could not preload inventory:', e); }
        try {
            await loadVendorOrders();
        } catch (e) { console.warn('Could not preload vendor orders:', e); }
    } catch (error) {
        console.error('Error loading vendor dashboard:', error);
        showToast('Error loading dashboard', 'error');
    }
}

// Load admin dashboard data and render into admin panel
async function loadAdminDashboard() {
    try {
        if (!db) throw new Error('Database not initialized');
        const cats = await getAllCategories();
        const prods = await getProductsList();

        // Fetch all orders for stats
        let totalOrders = 0;
        let totalSales = 0;
        try {
            const ordersSnap = await db.ref('orders').once('value');
            const ordersVal = ordersSnap.val();
            if (ordersVal) {
                const orders = Object.values(ordersVal);
                totalOrders = orders.length;
                orders.forEach(o => {
                    totalSales += (o.totalAmount || 0);
                });
            }
        } catch (e) {
            console.error('Error fetching orders for admin stats:', e);
        }

        // Inject Admin Stats
        const adminContainer = document.querySelector('#adminDashboard .container');
        let statsDiv = document.getElementById('adminStatsGrid');
        if (!statsDiv) {
            statsDiv = document.createElement('div');
            statsDiv.id = 'adminStatsGrid';
            statsDiv.className = 'stats-grid';
            // Insert after header bar
            const headerBar = adminContainer.querySelector('.header-bar');
            if (headerBar) {
                headerBar.insertAdjacentElement('afterend', statsDiv);
            }
        }

        statsDiv.innerHTML = `
            <div class="stat-card">
                <div class="stat-label">Total Orders</div>
                <div class="stat-value">${totalOrders}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, var(--color-success) 0%, #16A34A 100%);">
                <div class="stat-label">Total Sales</div>
                <div class="stat-value">₹${totalSales.toFixed(0)}</div>
            </div>
             <div class="stat-card" style="background: linear-gradient(135deg, var(--color-warning) 0%, #F59E0B 100%);">
                <div class="stat-label">Total Products</div>
                <div class="stat-value">${prods.length}</div>
            </div>
        `;

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

// Load vendor inventory into vendorInventoryList
async function loadVendorInventory() {
    try {
        const invList = document.getElementById('vendorInventoryList');
        if (!invList) return;
        invList.innerHTML = '<p style="color:#666; text-align:center">Loading inventory...</p>';
        const products = await getVendorProducts(currentUser.uid);
        if (!products || products.length === 0) {
            invList.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 40px;">No inventory items</p>';
            return;
        }

        invList.innerHTML = products.map(prod => `
            <div class="card" style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <strong>${prod.name || prod.productId}</strong>
                    <div style="font-size:0.9em;color:#666">ProductId: ${prod.productId || '—'}</div>
                    <div style="margin-top:6px">Price: ₹${prod.price} • Stock: ${prod.stock}</div>
                </div>
                <div style="display:flex;flex-direction:column;gap:6px;">
                    <button class="btn btn-sm" onclick="(async ()=>{ const q=prompt('Set new stock for this item', '${prod.stock}'); if(q!==null){ await db.ref('vendor_products/' + currentUser.uid + '/' + '${prod.id}').update({ stock: Number(q) }); loadVendorInventory(); loadVendorDashboard(); } })()">Set Stock</button>
                    <button class="btn btn-danger btn-sm" onclick="(async ()=>{ if(confirm('Remove item?')){ await db.ref('vendor_products/' + currentUser.uid + '/' + '${prod.id}').remove(); loadVendorInventory(); loadVendorDashboard(); } })()">Remove</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Error loading vendor inventory', err);
        showToast('Error loading inventory', 'error');
    }
}

// Load vendor-specific orders
async function loadVendorOrders() {
    try {
        const container = document.getElementById('vendorPrebookList');
        if (!container) return;
        container.innerHTML = '<p style="color:#666;text-align:center">Loading orders...</p>';
        const orders = await getVendorOrders(currentUser.uid);
        if (!orders || orders.length === 0) {
            container.innerHTML = '<p style="color:#666;text-align:center;padding:30px">No orders yet</p>';
            return;
        }

        container.innerHTML = orders.map(o => `
            <div class="card">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div>
                        <strong>Order: ${o.orderId || o.id}</strong>
                        <div style="font-size:0.9em;color:#666">Status: ${o.status}</div>
                        <div style="margin-top:8px">Items: ${Array.isArray(o.items) ? o.items.length : (o.items ? Object.keys(o.items).length : 0)}</div>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:6px;">
                        <button class="btn btn-sm" onclick="(async ()=>{ await updateOrderStatus(o.orderId||o.id,'Preparing'); loadVendorOrders(); })()">Mark Preparing</button>
                        <button class="btn btn-success btn-sm" onclick="(async ()=>{ await updateOrderStatus(o.orderId||o.id,'Out for Delivery'); loadVendorOrders(); })()">Out for Delivery</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Error loading vendor orders', err);
        showToast('Error loading orders', 'error');
    }
}

// Display Vendor Products
async function displayVendorProducts(products) {
    const container = document.getElementById('vendorProductsList');
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 40px;">No products listed yet</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="card" style="display: flex; justify-content: space-between; align-items: start;">
            <div>
                <h4>${product.name || 'Product'}</h4>
                <p><strong>Category:</strong> ${product.category}</p>
                <p><strong>Price:</strong> ₹${product.price}/unit</p>
                <p><strong>Stock:</strong> ${product.stock} units</p>
                <p><strong>Delivery:</strong> ${product.deliveryDate}</p>
            </div>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.id}')">Delete</button>
        </div>
    `).join('');
}

// Handle Product Listing
async function handleProductListing(event) {
    event.preventDefault();

    try {
        showLoadingSpinner();

        const product = {
            name: document.getElementById('prodName').value,
            category: document.getElementById('prodCategory').value,
            price: parseFloat(document.getElementById('prodPrice').value),
            stock: parseFloat(document.getElementById('prodStock').value),
            deliveryDate: document.getElementById('prodDelivery').value
        };

        const productId = await saveVendorProduct(product);

        if (productId) {
            document.getElementById('productForm').reset();
            const products = await getVendorProducts(currentUser.uid);
            displayVendorProducts(products);
        }

        hideLoadingSpinner();
    } catch (error) {
        console.error('Error:', error);
        hideLoadingSpinner();
        showToast('Error adding product', 'error');
    }
}

// Handle Create Product (Admin)
async function handleCreateProduct(event) {
    event.preventDefault();
    const name = document.getElementById('adminProdName').value;
    const cat = document.getElementById('adminProdCat').value;
    const market = Number(document.getElementById('adminProdMarket').value) || 0;
    const pricesRaw = document.getElementById('adminProdPrices').value;
    let prices = {};
    try {
        if (pricesRaw) prices = JSON.parse(pricesRaw);
    } catch (e) {
        showToast('Prices must be a valid JSON object, e.g. {"Winter":200}', 'error');
        return;
    }

    try {
        await createProduct({
            name,
            category: cat,
            marketPrice: market,
            prices,
            images: [document.getElementById('adminProdImg').value || ''],
            description: document.getElementById('adminProdDesc').value
        });
        // Clear form
        document.getElementById('adminProdName').value = '';
        document.getElementById('adminProdCat').value = '';
        document.getElementById('adminProdMarket').value = '';
        document.getElementById('adminProdPrices').value = '';
        document.getElementById('adminProdImg').value = '';
        document.getElementById('adminProdDesc').value = '';

        loadAdminDashboard();
        showToast('Product created successfully', 'success');
    } catch (err) {
        console.error(err);
        showToast('Failed to create product', 'error');
    }
}

// Initialize app on load
window.addEventListener('load', () => {
    populateCities();
    loadTheme();
});

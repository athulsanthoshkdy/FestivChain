// ============================================
// FESTIVCHAIN - MAIN APPLICATION LOGIC
// ============================================

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 FestivChain initializing...');

    // Initialize Scroll Animations
    initScrollAnimations();

    // Initialize Counters
    initCounters();

    // Restore saved user session
    const savedUser = localStorage.getItem('festivchain_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        const savedLocation = localStorage.getItem('festivchain_location');
        if (savedLocation) {
            currentLocation = JSON.parse(savedLocation);

            if (currentUser.role === 'customer') {
                setTimeout(() => {
                    if (typeof showScreen === 'function') showScreen('customerHome');
                    else console.log('showScreen not available, cannot navigate to customerHome');
                    if (typeof loadCustomerHome === 'function') loadCustomerHome();
                }, 500);
            } else if (currentUser.role === 'vendor') {
                setTimeout(() => {
                    if (typeof showScreen === 'function') showScreen('vendorDashboard');
                    else console.log('showScreen not available, cannot navigate to vendorDashboard');
                    if (typeof loadVendorDashboard === 'function') loadVendorDashboard();
                }, 500);
            }
        }
    } else {
        // Ensure landing page is shown if no user
        showScreen('landingPage');
        hideLoadingSpinner();
    }

    // Update navbar to hide login buttons if user is logged in
    updateNavbarForLoggedInUser();
});

// Scroll Animation Observer
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Number Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText.replace(/,/g, ''); // remove commas if any

                    // Lower inc to slow and higher to slow
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc).toLocaleString();
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target.toLocaleString() + '+';
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ========== CART MANAGEMENT ==========

// Update cart display
function updateCartDisplay() {
    const cartContainer = document.getElementById('cartContent');
    if (!cartContainer) return;

    let totalAmount = 0;
    let totalItems = 0;
    let marketAmount = 0;

    // Prebook items
    customerCart.prebook.forEach(item => {
        totalItems += item.quantity;
        totalAmount += item.totalPrice;
        marketAmount += item.marketPrice * item.quantity;
    });

    // Pool items
    customerCart.pool.forEach(item => {
        totalItems += item.quantity;
        totalAmount += item.totalPrice;
        marketAmount += item.marketPrice * item.quantity;
    });

    const savings = marketAmount - totalAmount;

    const html = `
        <div style="margin-bottom: 30px;">
            <h3 style="color: var(--color-primary); margin-bottom: 15px;">Pre-Booked Items</h3>
            ${customerCart.prebook.length === 0
            ? '<p style="color: var(--color-text-secondary);">No pre-booked items</p>'
            : customerCart.prebook.map((item, idx) => `
                    <div class="card" style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${item.name}</strong><br>
                            <small>${item.quantity} kg @ ₹${item.lockedPrice} = ₹${item.totalPrice}</small><br>
                            <small style="color: var(--color-success);">Savings: ₹${(item.marketPrice * item.quantity - item.totalPrice).toFixed(0)}</small>
                        </div>
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart('prebook', ${idx})">Remove</button>
                    </div>
                `).join('')
        }
        </div>

        <div style="margin-bottom: 30px;">
            <h3 style="color: var(--color-primary); margin-bottom: 15px;">Pool Orders</h3>
            ${customerCart.pool.length === 0
            ? '<p style="color: var(--color-text-secondary);">No pool items</p>'
            : customerCart.pool.map((item, idx) => `
                    <div class="card" style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${item.name}</strong><br>
                            <small>${item.quantity} kg @ ₹${item.price} = ₹${item.totalPrice}</small>
                        </div>
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart('pool', ${idx})">Remove</button>
                    </div>
                `).join('')
        }
        </div>

        <div style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <div class="price-row" style="color: white;">
                <span>Total Items:</span>
                <strong>${totalItems.toFixed(1)} kg</strong>
            </div>
            <div class="price-row" style="color: white; font-size: 1.2em; margin-top: 10px;">
                <span>Total Amount:</span>
                <strong>₹${totalAmount.toFixed(0)}</strong>
            </div>
            <div class="price-row" style="color: var(--color-accent-3); font-size: 1.1em; margin-top: 10px;">
                <span>You Save:</span>
                <strong>₹${savings.toFixed(0)}</strong>
            </div>
        </div>

        ${totalAmount > 0
            ? `<button class="btn btn-success btn-full" onclick="proceedToCheckout(${totalAmount})">Proceed to Checkout</button>`
            : `<p style="text-align: center; color: var(--color-text-secondary);">Add items to continue shopping</p>`
        }
        <button class="btn btn-secondary btn-full" style="margin-top: 10px;" onclick="showScreen('customerHome')">Continue Shopping</button>
    `;

    cartContainer.innerHTML = html;
}

// Remove from cart
function removeFromCart(type, index) {
    if (type === 'prebook') {
        customerCart.prebook.splice(index, 1);
    } else {
        customerCart.pool.splice(index, 1);
    }
    localStorage.setItem('festivchain_cart', JSON.stringify(customerCart));
    updateCartDisplay();
    showToast('Removed from cart', 'info');
}

// Proceed to checkout
function proceedToCheckout(amount) {
    const html = `
        <div class="card">
            <h2>Checkout</h2>
            <div class="price-section" style="background: var(--color-primary-light); margin: 20px 0; padding: 20px; border-radius: 8px;">
                <div class="price-row">
                    <span>Amount to Pay:</span>
                    <strong style="color: var(--color-primary); font-size: 1.3em;">₹${amount.toFixed(0)}</strong>
                </div>
            </div>

            <div class="form-group">
                <label>Payment Method</label>
                <select id="paymentMethod">
                    <option value="upi">UPI Payment</option>
                    <option value="card">Debit/Credit Card (Demo)</option>
                    <option value="netbanking">Net Banking (Demo)</option>
                </select>
            </div>

            <button class="btn btn-success btn-full" onclick="processPayment(${amount})">Complete Payment</button>
        </div>
    `;

    document.getElementById('cartContent').innerHTML = html;
}

// Process Payment
async function processPayment(amount) {
    try {
        showLoadingSpinner();

        // create order payload
        const order = {
            items: [...customerCart.prebook, ...customerCart.pool],
            totalAmount: amount,
            status: 'Confirmed',
            createdAt: new Date().toISOString()
        };

        // simulate payment delay
        await new Promise(r => setTimeout(r, 1200));

        // Save to realtime DB (will also create vendor_orders)
        const orderId = await saveOrder(order);

        hideLoadingSpinner();

        if (orderId) {
            // local store for user's order history
            const localOrder = { id: orderId, ...order };
            customerOrders.push(localOrder);
            localStorage.setItem('festivchain_orders', JSON.stringify(customerOrders));

            showToast('✅ Payment successful! Order confirmed!', 'success');

            // Show order confirmation
            setTimeout(() => {
                showOrderConfirmation(localOrder);
            }, 600);

            // Clear cart
            customerCart = { prebook: [], pool: [] };
            localStorage.removeItem('festivchain_cart');
        } else {
            showToast('Order failed to save. Contact support.', 'error');
        }
    } catch (err) {
        console.error('Payment error:', err);
        hideLoadingSpinner();
        showToast('Payment failed', 'error');
    }
}

// Show Order Confirmation
function showOrderConfirmation(order) {
    const html = `
        <div style="text-align: center;">
            <div style="font-size: 4em; margin: 20px 0;">✅</div>
            <h2 style="color: var(--color-success); margin: 20px 0;">Order Confirmed!</h2>

            <div class="card" style="max-width: 500px; margin: 20px auto;">
                <div class="price-row">
                    <span>Order ID:</span>
                    <strong>${order.id}</strong>
                </div>
                <div class="price-row">
                    <span>Items:</span>
                    <strong>${order.items.length}</strong>
                </div>
                <div class="price-row">
                    <span>Total Amount:</span>
                    <strong style="color: var(--color-primary);">₹${order.totalAmount.toFixed(0)}</strong>
                </div>
                <div class="price-row">
                    <span>Status:</span>
                    <span class="status-badge badge-success">${order.status}</span>
                </div>
            </div>

            <button class="btn btn-primary" onclick="showOrderTracking('${order.id}')" style="width: 100%; max-width: 500px;">Track Order</button>
            <button class="btn btn-secondary" onclick="showScreen('customerHome')" style="width: 100%; max-width: 500px; margin-top: 10px;">Back to Home</button>
        </div>
    `;

    document.getElementById('cartContent').innerHTML = html;
}

// Show Order Tracking
function showOrderTracking(orderId) {
    const order = customerOrders.find(o => o.id === orderId);
    if (!order) return;

    const statuses = ['Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered'];
    const currentStatus = Math.floor(Math.random() * (statuses.length - 1));

    let timeline = '';
    statuses.forEach((status, idx) => {
        const isCompleted = idx < currentStatus;
        const isActive = idx === currentStatus;

        timeline += `
            <div class="timeline-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
                <strong>${status}</strong>
                ${(isCompleted || isActive) ? '<br><small>✓ ' + new Date().toLocaleTimeString() + '</small>' : ''}
            </div>
        `;
    });

    const html = `
        <div>
            <div class="card">
                <h3 style="color: var(--color-primary);">Order #${orderId}</h3>
                <div class="timeline">${timeline}</div>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <button class="btn btn-primary" onclick="showScreen('customerHome')">Back to Home</button>
            </div>
        </div>
    `;

    document.getElementById('cartContent').innerHTML = html;
}

// ========== ORDERS MANAGEMENT ==========

// Show Orders List
function showOrdersList() {
    const ordersContainer = document.getElementById('ordersList');
    if (customerOrders.length === 0) {
        ordersContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: 40px;">No orders yet</p>';
        return;
    }

    ordersContainer.innerHTML = customerOrders.map(order => `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h3>${order.id}</h3>
                    <p><strong>Items:</strong> ${order.items.length}</p>
                    <p><strong>Amount:</strong> ₹${order.totalAmount.toFixed(0)}</p>
                    <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                    <span class="status-badge badge-success">${order.status}</span>
                </div>
                <button class="btn btn-primary btn-sm" onclick="showOrderTracking('${order.id}')">Track</button>
            </div>
        </div>
    `).join('');
}

// ========== VENDORS LIST ==========

// Show Vendors
async function showVendorsList() {
    try {
        showLoadingSpinner();
        let vendors = await getAllVendors();

        if (currentLocation && currentLocation.city) {
            vendors = vendors.filter(v => v.city === currentLocation.city);
        }

        const vendorsGrid = document.getElementById('vendorsGrid');
        vendorsGrid.innerHTML = vendors.map(vendor => `
            <div class="vendor-card">
                <div class="vendor-header">
                    <div class="vendor-name">${vendor.name}</div>
                    <div class="vendor-rating">⭐ ${vendor.rating}</div>
                </div>
                <div class="vendor-info">
                    <p>📍 ${vendor.area}</p>
                    <p>📏 ${vendor.distance}</p>
                    <p>⭐ ${vendor.reviews} reviews</p>
                    <p><span class="status-badge badge-success">${vendor.availability}</span></p>
                </div>
            </div>
        `).join('');

        hideLoadingSpinner();
        showScreen('vendorsList');
    } catch (error) {
        console.error('Error loading vendors:', error);
        hideLoadingSpinner();
        showToast('Error loading vendors', 'error');
    }
}

// ========== EVENT LISTENERS ==========

// Setup screen transitions
document.addEventListener('load', () => {
    // Set minimum date to today
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (input.id !== 'festivalDate') {
            input.min = new Date().toISOString().split('T')[0];
        }
    });
});

// Cart screen transition
const observer = new MutationObserver(() => {
    const cartScreen = document.getElementById('cartScreen');
    if (cartScreen && cartScreen.classList.contains('active')) {
        updateCartDisplay();
    }

    const ordersScreen = document.getElementById('ordersScreen');
    if (ordersScreen && ordersScreen.classList.contains('active')) {
        showOrdersList();
    }
});

observer.observe(document.body, { attributes: true, subtree: true });

console.log('✅ FestivChain app initialized successfully');

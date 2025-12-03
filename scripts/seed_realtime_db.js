#!/usr/bin/env node
/**
 * Seed Realtime Database with seasonal categories and products.
 * Usage:
 *  - Set environment variables or pass args:
 *    - SERVICE_ACCOUNT: path to service account JSON (or set GOOGLE_APPLICATION_CREDENTIALS)
 *    - DATABASE_URL: your Firebase Realtime Database URL (e.g. https://<project>.firebaseio.com)
 *  - Run: `node scripts/seed_realtime_db.js`
 *
 * The script will create seasons, categories (3 per season) and products (3 per category), and
 * will create two sample vendors and add default inventory (20 units each product) for them.
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        const serviceAccountPath = process.env.SERVICE_ACCOUNT || process.env.GOOGLE_APPLICATION_CREDENTIALS;
        const databaseURL = process.env.DATABASE_URL;

        if (!serviceAccountPath) {
            console.error('SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS environment variable must point to service account JSON');
            process.exit(1);
        }
        if (!databaseURL) {
            console.error('DATABASE_URL environment variable must be set to your Realtime Database URL');
            process.exit(1);
        }

        const sa = require(path.resolve(serviceAccountPath));

        admin.initializeApp({
            credential: admin.credential.cert(sa),
            databaseURL: databaseURL
        });

        const db = admin.database();

        const seasons = ['Summer', 'Monsoon', 'Winter', 'Spring'];
        const categoriesPerSeason = Number(process.env.CATS_PER_SEASON) || 3;
        const productsPerCategory = Number(process.env.PRODS_PER_CATEGORY) || 3;

        const placeholderImage = 'https://via.placeholder.com/400x300?text=FestivChain';

        console.log('Clearing existing categories/products/vendors/vendor_products...');
        await db.ref('categories').remove();
        await db.ref('products').remove();
        await db.ref('vendors').remove();
        await db.ref('vendor_products').remove();

        const allProductIds = [];

        console.log('Creating seasonal categories and products...');
        for (const season of seasons) {
            for (let c = 1; c <= categoriesPerSeason; c++) {
                const categoryName = `${season} Category ${c}`;
                const catRef = db.ref('categories').push();
                await catRef.set({
                    name: categoryName,
                    season: season,
                    image: placeholderImage,
                    createdAt: Date.now()
                });

                for (let p = 1; p <= productsPerCategory; p++) {
                    const prodName = `${categoryName} - Product ${p}`;
                    const base = 100 + (c * 50) + (p * 10);
                    // create seasonal prices for all seasons
                    const prices = {};
                    seasons.forEach((s, idx) => prices[s] = Math.round(base * (1 + idx * 0.1)));

                    const prodRef = db.ref('products').push();
                    const prodId = prodRef.key;
                    allProductIds.push(prodId);

                    await prodRef.set({
                        name: prodName,
                        sku: `SKU-${prodId ? prodId.slice(0,6) : 'GEN'}-${Date.now() % 10000}`,
                        category: categoryName,
                        unit: 'kg',
                        unitLabel: 'kg',
                        marketPrice: base + 50,
                        // prices per season (object)
                        prices: prices,
                        // tags including season
                        tags: [season.toLowerCase(), `category-${c}`],
                        // images array (admin will update later)
                        images: [placeholderImage],
                        description: `Auto-generated product ${prodName}`,
                        rating: +( (4.0 + Math.random()).toFixed(1) ),
                        reviews: Math.floor(50 + Math.random() * 200),
                        createdAt: Date.now()
                    });
                }
            }
        }

        console.log('Creating sample vendors and adding default inventory (20 units each)...');
        const sampleVendors = [
            { name: 'Fresh Harvest Market', city: 'Kochi', area: 'Fort Kochi', phone: '9876543210' },
            { name: 'Kerala Fruits Paradise', city: 'Thiruvananthapuram', area: 'Karamana', phone: '9876543214' }
        ];

        for (const v of sampleVendors) {
            const vRef = db.ref('vendors').push();
            const vid = vRef.key;
            await vRef.set({ ...v, createdAt: Date.now() });

            // add vendor_products entries
            for (const pid of allProductIds) {
                const vpRef = db.ref(`vendor_products/${vid}`).push();
                await vpRef.set({ productId: pid, price: 0, stock: 20, createdAt: Date.now() });
            }
        }

        console.log('Seeding complete. Created %d products and %d vendors.', allProductIds.length, sampleVendors.length);
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(2);
    }
}

main();

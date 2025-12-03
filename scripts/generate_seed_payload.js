const fs = require('fs');
const path = require('path');

function makeId(prefix, n) {
    return `${prefix}_${n}_${Math.random().toString(36).slice(2,8)}`;
}

function generate() {
    const seasons = ['Summer','Monsoon','Winter','Spring'];
    const categories = {};
    const products = {};
    const vendors = {};
    const vendor_products = {};

    let catCount = 0;
    let prodCount = 0;

    const catsPerSeason = 3;
    const prodsPerCat = 3;

    for (const season of seasons) {
        for (let c = 1; c <= catsPerSeason; c++) {
            catCount++;
            const catId = makeId('cat', catCount);
            const catName = `${season} Category ${c}`;
            categories[catId] = { name: catName, season: season, image: 'https://via.placeholder.com/400x300?text='+encodeURIComponent(catName), createdAt: Date.now() };

            for (let p = 1; p <= prodsPerCat; p++) {
                prodCount++;
                const prodId = makeId('prod', prodCount);
                const prodName = `${catName} - Product ${p}`;
                const base = 100 + (c * 50) + (p * 10);
                const prices = {};
                seasons.forEach((s, idx) => prices[s] = Math.round(base * (1 + idx * 0.1)));

                products[prodId] = {
                    name: prodName,
                    sku: `SKU-${prodCount.toString().padStart(4,'0')}`,
                    category: catName,
                    unit: 'kg',
                    unitLabel: 'kg',
                    marketPrice: base + 50,
                    prices: prices,
                    tags: [season.toLowerCase(), `cat${c}`],
                    images: ['https://via.placeholder.com/400x300?text='+encodeURIComponent(prodName)],
                    description: `Auto-generated product ${prodName}`,
                    rating: +( (4.0 + Math.random()).toFixed(1) ),
                    reviews: Math.floor(50 + Math.random() * 200),
                    createdAt: Date.now()
                };
            }
        }
    }

    // sample vendors
    const sampleVendors = [
        { name: 'Fresh Harvest Market', city: 'Kochi', area: 'Fort Kochi', phone: '9876543210' },
        { name: 'Kerala Fruits Paradise', city: 'Thiruvananthapuram', area: 'Karamana', phone: '9876543214' }
    ];

    let vI = 0;
    const prodIds = Object.keys(products);
    for (const sv of sampleVendors) {
        vI++;
        const vid = makeId('vend', vI);
        vendors[vid] = { ...sv, createdAt: Date.now() };
        vendor_products[vid] = {};
        // add all products with 20 qty and default price (first season)
        prodIds.forEach(pid => {
            const p = products[pid];
            const seasonKeys = Object.keys(p.prices || {});
            const price = seasonKeys.length ? p.prices[seasonKeys[0]] : p.marketPrice || 0;
            const vpid = makeId('vp', Math.floor(Math.random()*10000));
            vendor_products[vid][vpid] = { productId: pid, price: price, stock: 20, createdAt: Date.now() };
        });
    }

    const payload = { categories, products, vendors, vendor_products };
    const outPath = path.resolve(__dirname, 'seed_payload.json');
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
    console.log('Wrote', outPath);
}

generate();

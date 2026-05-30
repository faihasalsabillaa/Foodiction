const fs = require('fs');
const csv = require('csv-parser');
const { randomUUID } = require('crypto');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'lommy',
    host: 'localhost',
    database: 'foodiction_db',
    password: '', 
    port: 5432,
});

function loadCsv(filePath) {
    return new Promise((resolve, reject) => {
        const rows = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => rows.push(row))
            .on('end', () => resolve(rows))
            .on('error', reject);
    });
}

function normalizeText(value) {
    return (value || '')
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function priceFromLevel(level) {
    switch (Number(level)) {
        case 1:
            return 10000;
        case 2:
            return 15000;
        case 3:
            return 20000;
        default:
            return 15000;
    }
}

function parseRatingField(field) {
    if (!field) return 0;
    const normalized = field.replace(/'/g, '"');
    try {
        const parsed = JSON.parse(normalized);
        return Number(parsed.average) || 0;
    } catch {
        const match = field.match(/average\s*[:=]\s*([0-9]+\.?[0-9]*)/i);
        return match ? Number(match[1]) : 0;
    }
}

function formatMinutes(minutes) {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
}

function mergeIntervals(intervals) {
    if (!intervals.length) return [];
    const sorted = [...intervals].sort((a, b) => a.start - b.start);
    const merged = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i];
        const last = merged[merged.length - 1];
        if (current.start <= last.end) {
            last.end = Math.max(last.end, current.end);
        } else {
            merged.push({ ...current });
        }
    }

    return merged;
}

function formatIntervals(intervals) {
    if (!intervals.length) return 'closed';
    return intervals.map((it) => `${formatMinutes(it.start)}-${formatMinutes(it.end)}`).join(', ');
}

function parseCreateYear(createTime) {
    if (!createTime) return null;
    const date = new Date(createTime);
    if (Number.isNaN(date.getTime())) return null;
    return date.getUTCFullYear();
}

function parseTags(field) {
    if (!field) return null;
    // CSV stores tags as a Python-like list of dicts. Normalize to JSON and parse.
    try {
        const jsonText = field.replace(/'/g, '"');
        const parsed = JSON.parse(jsonText);
        if (!Array.isArray(parsed)) return null;
        // Prefer displayName when available, otherwise use uid or key
        const out = parsed.map((t) => {
            if (!t) return null;
            if (t.displayName) return t.displayName.toString();
            if (t.uid) return t.uid.toString();
            if (t.key) return t.key.toString();
            return null;
        }).filter(Boolean);
        return out.length ? out : null;
    } catch (e) {
        return null;
    }
}

const reviewerNames = [
    "Aditya","Arka","Baskara","Bumi","Bayu","Bintang","Bagas","Cahaya","Candra","Damar","Dewa","Dimas","Eka","Fajar","Galang","Guntur","Gilang","Huda","Indra","Jaka","Kadek","Langit","Lestari","Mega","Mentari","Ndaru","Nyoman","Oasis","Pandu","Putra","Putri","Raditya","Rian","Rizky","Rama","Rendra","Satria","Surya","Sinar","Tegar","Taufan","Utama","Wira","Wijaya","Wisnu","Yuda","Zaki","Anggraini","Citra","Dewi","Endah","Fitri","Gita","Indah","Kartika","Laras","mawar","Ningrum","ratih","Sekar",
    "Asher","Atlas","Axel","Blake","Brody","Caleb","Cole","Chase","Dexter","Dylan","Ethan","Ezra","Felix","Finn","Gavin","Grant","Hugo","Hunter","Ian","Isaac","Jax","Jude","Kai","Knox","Leo","Liam","Milo","Max","Noah","Nico","Owen","Orion","Parker","Phoenix","Quinn","River","Ryder","Silas","Sawyer","Theo","Tyler","Vince","Wyatt","Xander","Zack","Zion",
    "Ava","Bella","Chloe","Daisy","Emma","Freya","Hazel","Iris","Jade","Luna","Maya","Nova","Ruby","Stella",
    "Akira","Arata","Daiki","Hiro","Haru","Itsuki","Jun","Kenji","Kaito","Kazuma","Minato","Makoto","Naoki","Ren","Ryu","Sora","Shota","Takeru","Yuto","Yuki","Aiko","Ami","Chiyo","Emi","Hana","Hinata","Kiko","Mei","Mio","Nana","Riku","Sakura","Sayuri","Yua","Yuna",
    "Aero","Aqua","Ash","Blaze","Bolt","Clay","Cosmo","Dusk","Echo","Ember","Flint","Frost","Galaxy","Hydra","Ion","Jet","Laser","Mist","Neon","Nova","Onyx","Pyro","Quartz","Rain","Rogue","Shadow","Sky","Sonic","Spark","Storm","Titan","Vapor","Vector","Volt","Wolf","Zenith","Zephyr","Nebula",
    "Clover","Willow","Ivy","Fern","Ocean","Ridge","Canyon","Cliff","Vale","Meadow","Forest","River","Brooke","Dawn","Dusk","Eclipse","Sol",
    "Albert","Arthur","Bernard","Charles","David","Edward","Francis","George","Henry","James","Joseph","Louis","Michael","Oliver","Peter","Philip","Richard","Robert","Samuel","Thomas","Victor","William",
    "Alice","Beatrice","Catherine","Diana","Eleanor","Elizabeth","Florence","Grace","Helena","Isabella","Jane","Katherine","Margaret","Mary","Olivia","Penelope","Rose","Victoria",
    "Alistair","Benedict","Cedric","Dorian","Evander","Gideon","Jasper","Lawrence","Magnus","Nathaniel","Percival","Roderick","Sebastian","Theodore","Vincent","Winston",
    "Anastasia","Cassandra","Cordelia","Emmeline","Genevieve","Juliet","Madeline","Ophelia","Rosalind","Vivienne",
    "Alpha","Beta","Gamma","Delta","Omega","Sigma","Ace","Duke","Baron","Cesar"
];

function pickRandomReviewer() {
    return reviewerNames[Math.floor(Math.random() * reviewerNames.length)];
}

function parseOpenPeriods(field) {
    if (!field) return null;
    let parsed;
    try {
        const jsonText = field
            .replace(/'/g, '"')
            .replace(/True/g, 'true')
            .replace(/False/g, 'false')
            .replace(/None/g, 'null');
        parsed = JSON.parse(jsonText);
    } catch {
        return null;
    }
    if (!Array.isArray(parsed)) return null;

    const groups = {
        weekday: [],
        weekend: [],
    };

    for (const entry of parsed) {
        if (!entry || !entry.startTime || !entry.endTime || typeof entry.day !== 'number') continue;
        const start = Number(entry.startTime.hours) * 60 + Number(entry.startTime.minutes);
        const end = Number(entry.endTime.hours) * 60 + Number(entry.endTime.minutes);
        if (Number.isNaN(start) || Number.isNaN(end) || end <= start) continue;
        const group = entry.day >= 6 ? 'weekend' : 'weekday';
        groups[group].push({ start, end });
    }

    const weekday = mergeIntervals(groups.weekday);
    const weekend = mergeIntervals(groups.weekend);

    return `weekday: ${formatIntervals(weekday)}; weekend: ${formatIntervals(weekend)}`;
}

function buildRestaurantKeywords(displayName) {
    const normalized = normalizeText(displayName);
    const tokens = new Set(normalized.split(' '));
    return Array.from(tokens).filter((token) => token.length > 3);
}

async function seedRestaurantsAndMenus() {
    const merchants = await loadCsv('gofood_merchants.csv');
    console.log(`⏳ Processing ${merchants.length} merchants for restaurants + menus...`);

    // NOTE: Schema DDL is managed by migrations in /migrations.
    // Seeder will only clear and populate data.
    await pool.query('DELETE FROM reviews');
    await pool.query('DELETE FROM menus');

    for (const merchant of merchants) {
        const id = merchant.uid;
        const name = merchant.displayName || 'Unknown Merchant';
        const description = merchant.description || null;
        const rating = parseRatingField(merchant.ratings);
        const price = priceFromLevel(merchant.priceLevel);
        const openPeriod = parseOpenPeriods(merchant.openPeriods);
        const createdYear = parseCreateYear(merchant.createTime);
        const tags = parseTags(merchant.tags);
        const latitude = merchant['location.latitude'] ? Number(merchant['location.latitude']) : null;
        const longitude = merchant['location.longitude'] ? Number(merchant['location.longitude']) : null;

        await pool.query(
            `INSERT INTO restaurants (id, name, description, rating, open_period, created_year, tags, latitude, longitude)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             ON CONFLICT (id) DO UPDATE SET
                 name = EXCLUDED.name,
                 description = EXCLUDED.description,
                 rating = EXCLUDED.rating,
                 open_period = EXCLUDED.open_period,
                 created_year = EXCLUDED.created_year,
                 tags = EXCLUDED.tags,
                 latitude = EXCLUDED.latitude,
                 longitude = EXCLUDED.longitude`,
            [id, name, description, rating, openPeriod, createdYear, tags, latitude, longitude]
        );

        await pool.query(
            'INSERT INTO menus (restaurant_id, name, price) VALUES ($1, $2, $3)',
            [id, name, price]
        );
    }

    console.log('✅ Restaurants and menus seeded from merchants.csv');
}

function matchRestaurantByKeywords(restaurants, text) {
    const normalizedText = normalizeText(text);
    const tokens = new Set(normalizedText.split(' '));

    return restaurants.find((restaurant) =>
        restaurant.keywords.some((keyword) => tokens.has(keyword))
    );
}

async function seedReviews() {
    const { rows: restaurants } = await pool.query('SELECT id, name FROM restaurants');
    const restaurantData = restaurants.map((row) => ({
        id: row.id,
        keywords: buildRestaurantKeywords(row.name),
    }));

    const overviews = await loadCsv('gofood_food_overviews.csv');
    console.log(`⏳ Processing ${overviews.length} overview review...`);

    for (const item of overviews) {
        const ratingScore = item.rating ? Number(item.rating) : 0;
        if (!ratingScore || ratingScore < 1) continue;

        const reviewText = item.review || item.orderItem || '';
        const orderedItem = item.orderItem || null;
        const textToMatch = `${item.orderItem || ''} ${item.review || ''}`;
        const targetRestaurant = matchRestaurantByKeywords(restaurantData, textToMatch);
        if (!targetRestaurant) continue;

        let savedOrderedItem = null;
        if (orderedItem && orderedItem.trim()) {
            const ord = orderedItem.trim();
            // try to find existing menu for this restaurant with same name (case-insensitive)
            const { rows: menuRows } = await pool.query(
                'SELECT id, name, price FROM menus WHERE restaurant_id = $1 AND lower(name) = lower($2) LIMIT 1',
                [targetRestaurant.id, ord]
            );

            if (menuRows.length > 0) {
                savedOrderedItem = menuRows[0].name;
            } else {
                // fallback price: try to reuse an existing menu price for this restaurant
                const { rows: priceRows } = await pool.query('SELECT price FROM menus WHERE restaurant_id = $1 LIMIT 1', [targetRestaurant.id]);
                const fallbackPrice = (priceRows[0] && priceRows[0].price) ? Number(priceRows[0].price) : 15000;
                const { rows: inserted } = await pool.query(
                    'INSERT INTO menus (restaurant_id, name, price) VALUES ($1, $2, $3) RETURNING id, name',
                    [targetRestaurant.id, ord, fallbackPrice]
                );
                savedOrderedItem = inserted[0] ? inserted[0].name : ord;
            }
        }

        await pool.query(
            `INSERT INTO reviews (id, restaurant_id, user_name, rating, review_text, ordered_item)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [randomUUID(), targetRestaurant.id, pickRandomReviewer(), ratingScore, reviewText, savedOrderedItem]
        );
    }

    console.log('✅ Reviews seeded from gofood_food_overviews.csv');
}

async function runSeeder() {
    console.log('🚀 Starting the seeding process from merchants.csv and overview.csv...');
    try {
        await seedRestaurantsAndMenus();
        await seedReviews();
        console.log('🎉 Seeder Finished!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error', error);
        process.exit(1);
    }
}

runSeeder();
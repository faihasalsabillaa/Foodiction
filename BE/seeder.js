const fs = require('fs');
const csv = require('csv-parser');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'lommy',
    host: 'localhost',
    database: 'foodiction_db',
    password: '', 
    port: 5432,
});

function parseRating(ratingsField) {
    if (!ratingsField) return 0;

    const normalized = ratingsField.replace(/'/g, '"');
    try {
        const parsed = JSON.parse(normalized);
        return Number(parsed.average) || 0;
    } catch {
        const match = ratingsField.match(/average\s*[:=]\s*([0-9]+\.?[0-9]*)/);
        return match ? Number(match[1]) : 0;
    }
}

async function seedRestos() {
    const rows = [];

    await new Promise((resolve, reject) => {
        fs.createReadStream('gofood_merchants.csv')
            .pipe(csv())
            .on('data', (row) => rows.push(row))
            .on('end', resolve)
            .on('error', reject);
    });

    // Hapus data lama atau gunakan upsert untuk menjaga id tetap unik
    await pool.query('DELETE FROM restaurants');

    for (const row of rows) {
        const rating = parseRating(row.ratings);
        await pool.query(
            `INSERT INTO restaurants (id, name, rating, latitude, longitude)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (id) DO UPDATE SET
                 name = EXCLUDED.name,
                 rating = EXCLUDED.rating,
                 latitude = EXCLUDED.latitude,
                 longitude = EXCLUDED.longitude`,
            [row.uid, row.displayName, rating, row['location.latitude'], row['location.longitude']]
        );
    }

    console.log('✅ Restaurants seeded.');
}

seedRestos().catch((err) => {
    console.error(err);
    process.exit(1);
});
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { randomUUID } = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'lommy',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || 'foodiction_db',
  port: Number(process.env.PGPORT || 5432),
});

const app = express();
app.use(cors());
app.use(express.json());

const DEFAULT_RADIUS_METERS = 5000;

function successResponse(data, meta = {}) {
  return {
    success: true,
    data,
    ...(Object.keys(meta).length ? { meta } : {}),
  };
}

function errorResponse(message) {
  return {
    success: false,
    error: message,
  };
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lng2 - lng1);
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function parseOpenPeriod(openPeriod) {
  if (!openPeriod || typeof openPeriod !== 'string') return null;
  const parsed = {};
  const groups = openPeriod.split(';').map((segment) => segment.trim()).filter(Boolean);
  for (const group of groups) {
    const [key, value] = group.split(':').map((part) => part.trim());
    if (!key || !value) continue;
    parsed[key.toLowerCase()] = value.split(',').map((range) => range.trim()).filter(Boolean);
  }
  return parsed;
}

function toMinutes(timeString) {
  const parts = timeString.split(':').map((p) => Number(p));
  if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) return null;
  return parts[0] * 60 + parts[1];
}

function isOpenNow(openPeriod, timeString, dayIndex) {
  const period = parseOpenPeriod(openPeriod);
  if (!period) return null;
  const currentMinutes = toMinutes(timeString);
  if (currentMinutes === null) return null;
  const dayType = dayIndex >= 6 ? 'weekend' : 'weekday';
  const ranges = period[dayType] || [];
  for (const range of ranges) {
    const [start, end] = range.split('-').map((t) => t.trim());
    const startMinutes = toMinutes(start);
    const endMinutes = toMinutes(end);
    if (startMinutes === null || endMinutes === null) continue;
    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) return true;
  }
  return false;
}

function normalizeCategory(value) {
  return (value || '').toString().trim().toLowerCase();
}

function getUserId(req) {
  return req.header('x-user-id') || req.query.user_id || null;
}

function normalizeTextArray(values) {
  return Array.isArray(values)
    ? values.map((value) => String(value).trim().toLowerCase()).filter(Boolean)
    : [];
}

async function getPreferencesForUser(userId) {
  if (!userId) return null;
  const result = await pool.query(
    'SELECT taste_preferences, max_budget, preferred_radius FROM user_preferences WHERE user_id = $1',
    [userId]
  );
  if (!result.rows.length) return null;
  return {
    tastePreferences: normalizeTextArray(result.rows[0].taste_preferences),
    maxBudget: result.rows[0].max_budget !== null ? Number(result.rows[0].max_budget) : null,
    preferredRadius: result.rows[0].preferred_radius !== null ? Number(result.rows[0].preferred_radius) : null,
  };
}

function buildTasteScore(restaurant, preferences) {
  if (!preferences || !preferences.tastePreferences.length) return 0;
  const tastes = preferences.tastePreferences;
  const tags = Array.isArray(restaurant.tags) ? restaurant.tags.map((tag) => String(tag).toLowerCase()) : [];
  const nameText = String(restaurant.name || '').toLowerCase();
  let score = 0;
  for (const taste of tastes) {
    if (tags.includes(taste)) score += 2;
    if (nameText.includes(taste)) score += 1;
  }
  return score;
}

app.get('/restaurants/nearby', async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radius = Number(req.query.radius) || DEFAULT_RADIUS_METERS;
  const maxBudget = req.query.max_budget ? Number(req.query.max_budget) : null;
  const category = req.query.category ? normalizeCategory(req.query.category) : null;

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json(errorResponse('lat and lng query parameters are required and must be numbers.'));
  }

  try {
    const result = await pool.query(
      `SELECT r.*, COALESCE(MIN(m.price), 0) AS min_menu_price
       FROM restaurants r
       LEFT JOIN menus m ON r.id = m.restaurant_id
       GROUP BY r.id;
      `
    );

    const restaurants = result.rows
      .map((restaurant) => {
        const distanceMeters = restaurant.latitude && restaurant.longitude
          ? haversineDistance(lat, lng, Number(restaurant.latitude), Number(restaurant.longitude))
          : null;

        return {
          ...restaurant,
          min_menu_price: Number(restaurant.min_menu_price || 0),
          distance_meters: distanceMeters,
        };
      })
      .filter((restaurant) => restaurant.distance_meters !== null && restaurant.distance_meters <= radius)
      .filter((restaurant) => {
        if (maxBudget !== null && restaurant.min_menu_price > maxBudget) return false;
        if (!category) return true;
        const tags = Array.isArray(restaurant.tags) ? restaurant.tags.map((tag) => tag.toString().toLowerCase()) : [];
        return tags.includes(category) || restaurant.name.toLowerCase().includes(category);
      })
      .sort((a, b) => a.distance_meters - b.distance_meters)
      .map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        rating: restaurant.rating !== null ? Number(restaurant.rating) : null,
        open_period: restaurant.open_period,
        tags: restaurant.tags,
        latitude: restaurant.latitude !== null ? Number(restaurant.latitude) : null,
        longitude: restaurant.longitude !== null ? Number(restaurant.longitude) : null,
        min_menu_price: restaurant.min_menu_price,
        distance_meters: Number(restaurant.distance_meters.toFixed(1)),
      }));

    return res.json(successResponse({ restaurants }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse('Failed to fetch nearby restaurants.'));
  }
});

app.get('/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json(errorResponse('Restaurant not found.'));
    }
    const restaurant = result.rows[0];
    return res.json(successResponse({ restaurant }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse('Failed to fetch restaurant details.'));
  }
});

app.get('/restaurants/:id/menus', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT id, restaurant_id, name, price FROM menus WHERE restaurant_id = $1 ORDER BY name', [id]);
    return res.json(successResponse({ menus: result.rows }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse('Failed to fetch menus.'));
  }
});

app.get('/restaurants/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 10);
  const offset = (page - 1) * limit;

  try {
    const countResult = await pool.query('SELECT COUNT(*) AS total FROM reviews WHERE restaurant_id = $1', [id]);
    const total = Number(countResult.rows[0].total || 0);

    const result = await pool.query(
      `SELECT id, restaurant_id, user_name, rating, review_text, ordered_item, created_at
       FROM reviews
       WHERE restaurant_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );

    return res.json(successResponse({
      reviews: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse('Failed to fetch reviews.'));
  }
});

app.post('/restaurants/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const { user_name, rating, review_text, ordered_item } = req.body;
  const ratingValue = Number(rating);

  if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
    return res.status(400).json(errorResponse('rating must be an integer between 1 and 5.'));
  }

  const userName = user_name ? String(user_name).trim() : 'Foodie';

  try {
    const restaurantResult = await pool.query('SELECT id FROM restaurants WHERE id = $1', [id]);
    if (restaurantResult.rows.length === 0) {
      return res.status(404).json(errorResponse('Restaurant not found.'));
    }

    await pool.query(
      `INSERT INTO reviews (id, restaurant_id, user_name, rating, review_text, ordered_item)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [randomUUID(), id, userName, ratingValue, review_text || null, ordered_item || null]
    );

    return res.status(201).json(successResponse({ message: 'Review submitted successfully.' }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse('Failed to submit review.'));
  }
});

app.get('/recommendations/smart-pick', async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const currentTime = req.query.current_time;
  const maxBudget = req.query.max_budget ? Number(req.query.max_budget) : null;
  const userId = getUserId(req);

  if (Number.isNaN(lat) || Number.isNaN(lng) || !currentTime) {
    return res.status(400).json(errorResponse('lat, lng, and current_time are required.'));
  }

  const preferences = userId ? await getPreferencesForUser(userId) : null;
  const effectiveMaxBudget = maxBudget !== null ? maxBudget : preferences?.maxBudget;
  const radius = preferences?.preferredRadius ?? DEFAULT_RADIUS_METERS;
  const now = new Date();
  const dayIndex = now.getDay();

  try {
    const result = await pool.query(
      `SELECT r.*, COALESCE(MIN(m.price), 0) AS min_menu_price
       FROM restaurants r
       LEFT JOIN menus m ON r.id = m.restaurant_id
       GROUP BY r.id`
    );

    const candidates = result.rows
      .map((restaurant) => {
        const distanceMeters = restaurant.latitude && restaurant.longitude
          ? haversineDistance(lat, lng, Number(restaurant.latitude), Number(restaurant.longitude))
          : null;
        return {
          ...restaurant,
          min_menu_price: Number(restaurant.min_menu_price || 0),
          distance_meters: distanceMeters,
          is_open: isOpenNow(restaurant.open_period, currentTime, dayIndex),
          taste_score: buildTasteScore(restaurant, preferences),
        };
      })
      .filter((restaurant) => restaurant.distance_meters !== null)
      .filter((restaurant) => effectiveMaxBudget === null || restaurant.min_menu_price <= effectiveMaxBudget)
      .filter((restaurant) => restaurant.distance_meters <= radius)
      .filter((restaurant) => restaurant.is_open !== false)
      .sort((a, b) => {
        if ((b.taste_score || 0) !== (a.taste_score || 0)) return (b.taste_score || 0) - (a.taste_score || 0);
        if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0);
        if (a.distance_meters !== b.distance_meters) return a.distance_meters - b.distance_meters;
        return a.min_menu_price - b.min_menu_price;
      })
      .slice(0, 10)
      .map((restaurant) => ({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        matchReason: restaurant.is_open
          ? `Open now and ranked by rating and proximity.`
          : `Recommended by rating and local relevance.`,
        estimatedBudget: restaurant.min_menu_price,
        distance_meters: Number(restaurant.distance_meters.toFixed(1)),
        rating: restaurant.rating !== null ? Number(restaurant.rating) : null,
        taste_score: restaurant.taste_score,
      }));

    return res.json(successResponse({
      context: 'Smart Pick Recommendation',
      preferences,
      recommendations: candidates,
    }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse('Failed to generate recommendations.'));
  }
});

app.get('/users/me/preferences', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(400).json(errorResponse('Missing user_id. Send x-user-id header or user_id query parameter.'));
  }

  try {
    const preferences = await getPreferencesForUser(userId);
    return res.json(successResponse({
      preferences: preferences || {
        tastePreferences: [],
        maxBudget: null,
        preferredRadius: null,
      },
    }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse('Failed to fetch user preferences.'));
  }
});

app.put('/users/me/preferences', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(400).json(errorResponse('Missing user_id. Send x-user-id header or user_id query parameter.'));
  }

  const tastePreferences = normalizeTextArray(req.body.tastePreferences || req.body.taste_preferences || []);
  const maxBudget = req.body.maxBudget ?? req.body.max_budget ?? null;
  const preferredRadius = req.body.preferredRadius ?? req.body.preferred_radius ?? null;

  if (maxBudget !== null && Number.isNaN(Number(maxBudget))) {
    return res.status(400).json(errorResponse('maxBudget must be a number.'));
  }
  if (preferredRadius !== null && Number.isNaN(Number(preferredRadius))) {
    return res.status(400).json(errorResponse('preferredRadius must be a number.'));
  }

  try {
    await pool.query(
      `INSERT INTO user_preferences (user_id, taste_preferences, max_budget, preferred_radius)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE SET
         taste_preferences = EXCLUDED.taste_preferences,
         max_budget = EXCLUDED.max_budget,
         preferred_radius = EXCLUDED.preferred_radius`,
      [userId, tastePreferences, maxBudget !== null ? Number(maxBudget) : null, preferredRadius !== null ? Number(preferredRadius) : null]
    );

    const preferences = await getPreferencesForUser(userId);
    return res.json(successResponse({ preferences }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse('Failed to save user preferences.'));
  }
});

app.use((req, res) => {
  res.status(404).json(errorResponse('Route not found.'));
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Foodiction API listening on port ${port}`);
});

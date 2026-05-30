# Foodiction - REST API Design

**Project:** Food Recommendation Web Application (Yogyakarta Culinary Heritage)  
**API Version:** v1  
**Base URL:** `https://api.foodiction.com/v1`  
**Last Updated:** May 30, 2026

---

## Table of Contents
1. [API Overview & Standards](#1-api-overview--standards)
2. [Authentication Endpoints](#2-authentication-endpoints)
3. [User Profile & Preferences Endpoints](#3-user-profile--preferences-endpoints)
4. [Geospatial Discovery (Restaurants) Endpoints](#4-geospatial-discovery-restaurants-endpoints)
5. [Recommendation Engine Endpoints](#5-recommendation-engine-endpoints)
6. [Social Proof (Reviews) Endpoints](#6-social-proof-reviews-endpoints)

---

## 1. API Overview & Standards

### Standard Response Envelope
All API responses follow a strict envelope structure to make it easy for the Frontend (Next.js) to parse data, handle errors, and manage pagination.

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-05-30T10:30:00Z"
  }
}
```

**Pagination Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "meta": { "timestamp": "2026-05-30T10:30:00Z" }
}
```

---

## 2. Authentication Endpoints

Handles secure user access via JWT (JSON Web Tokens).

### POST /auth/register
Registers a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "Budi Santoso"
}
```

### POST /auth/login
Authenticates a user and issues access/refresh tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "char-36-uuid",
      "email": "user@example.com",
      "fullName": "Budi Santoso"
    },
    "tokens": {
      "accessToken": "eyJhb...",
      "expiresIn": 3600
    }
  }
}
```

---

## 3. User Profile & Preferences Endpoints

Manages personal filters that will be fed into the Recommendation Engine.

### GET /users/me/preferences
Retrieves the logged-in user's taste, budget, and distance preferences.
* **Headers:** `Authorization: Bearer <token>`

### PUT /users/me/preferences
Updates the user's base preferences.

**Request Body:**
```json
{
  "tastePreference": "spicy",
  "maxBudget": 25000,
  "preferredRadius": 5000
}
```

---

## 4. Geospatial Discovery (Restaurants) Endpoints

The core catalog endpoints replacing the old recipe-focused routes.

### GET /restaurants/nearby
Fetches a list of restaurants sorted by geographic proximity to the user.

* **Headers:** `Authorization: Bearer <token>` (Optional)
* **Query Parameters:**
  * `lat` (Required): User's latitude (e.g., `-7.7670`).
  * `lng` (Required): User's longitude (e.g., `110.3775`).
  * `radius` (Optional): Search radius in meters (Default: 5000).
  * `max_budget` (Optional): Filter out places where average menu price exceeds this.
  * `category` (Optional): Filter by heritage type (e.g., `Angkringan`, `Gudeg`).

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Angkringan Pak Jali",
      "distanceMeters": 850,
      "averageRating": 4.8,
      "isOpen": true,
      "imageUrl": "https://..."
    }
  ],
  "pagination": { ... }
}
```

### GET /restaurants/:id
Retrieves full details of a specific restaurant (address, operating hours, coordinates).

### GET /restaurants/:id/menus
Retrieves the list of foods/drinks sold at a specific restaurant.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Nasi Kucing Sambal Teri",
      "category": "Angkringan",
      "tasteProfile": "spicy",
      "price": 4000
    }
  ]
}
```

---

## 5. Recommendation Engine Endpoints

The "Smart Pick" logic that factors in time of day, location, and budget.

### GET /recommendations/smart-pick
Generates highly personalized food destination suggestions.

* **Headers:** `Authorization: Bearer <token>` (Optional - if present, pulls user preferences).
* **Query Parameters:**
  * `lat` (Required): User's current latitude.
  * `lng` (Required): User's current longitude.
  * `currentTime` (Required): User's local time `HH:mm` (e.g., `23:30`) to determine if they need breakfast, lunch, or late-night snacks.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "context": "Late-Night Cravings",
    "recommendations": [
      {
        "restaurantId": "uuid",
        "restaurantName": "Gudeg Bromo Bu Tekluk",
        "matchReason": "Open until 03:00 AM. Matches your 'savory' preference and is only 1.2km away.",
        "estimatedBudget": 25000
      }
    ]
  }
}
```

---

## 6. Social Proof (Reviews) Endpoints

Handles user feedback. Note that submitting a review triggers an asynchronous background process via Redis.

### GET /restaurants/:id/reviews
Fetches paginated reviews for a restaurant.

### POST /restaurants/:id/reviews
Submits a new review. Returns instantly (201 Created) while background workers calculate the new averages.

* **Headers:** `Authorization: Bearer <token>` (Required)

**Request Body:**
```json
{
  "ratingScore": 5,
  "reviewText": "Porsi nasinya banyak, sambal terinya mantap banget buat makan malam!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "message": "Review submitted successfully. Ratings will be updated shortly."
  }
}
```

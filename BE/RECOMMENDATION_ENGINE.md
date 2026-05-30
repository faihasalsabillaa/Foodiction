# Foodiction - Recommendation Engine Design

**Project:** Food Recommendation Web Application (Yogyakarta Culinary Heritage)  
**Recommendation System Type:** Content-Based & Context-Aware (Geospatial & Time)  
**Target Data Source:** GoFood Merchants Dataset  
**Last Updated:** May 30, 2026

---

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Recommendation Contexts](#2-recommendation-contexts)
3. [Algorithms & Math](#3-algorithms--math)
4. [Implementation Pipeline](#4-implementation-pipeline)

---

## 1. System Overview

### Architecture Overview

```
┌───────────────────────────────────────────┐
│              User Request                 │
│ (Context: Smart Pick, Nearby, lat/lng)    │
└─────────────────────┬─────────────────────┘
                      │
┌─────────────────────▼─────────────────────┐
│          Recommendation Engine            │
│          (Node.js + PostgreSQL)           │
│                                           │
│  ┌─────────────────────────────────────┐  │
│  │ 1. Context Analyzer                 │  │
│  │    - Extract time (e.g., 23:00)     │  │
│  │    - Extract location (lat/lng)     │  │
│  └─────────────────────────────────────┘  │
│  ┌─────────────────────────────────────┐  │
│  │ 2. Candidate Generator (PostgreSQL) │  │
│  │    - Filter restaurants that are    │  │
│  │      OPEN and within radius         │  │
│  │    - Filter by user max_budget      │  │
│  └─────────────────────────────────────┘  │
│  ┌─────────────────────────────────────┐  │
│  │ 3. Scoring & Ranker (Node.js)       │  │
│  │    - Content-Based (Taste Match)    │  │
│  │    - Distance Proximity Score       │  │
│  │    - Sort and Return Top 10-20      │  │
│  └─────────────────────────────────────┘  │
└─────────────────────┬─────────────────────┘
                      │
           ┌──────────▼───────────┐
           │   Recommendations    │
           │     (Top 10-20)      │
           └──────────────────────┘
```

---

## 2. Recommendation Contexts

### 1. Smart Pick (Personalized Default)
**Purpose:** General recommendations that dynamically shift based on the time of day, user taste preferences, and location.
**Algorithm Priority:**
1. Content-Based / Taste Match (50%)
2. Time-Based / Contextual Filter (30%)
3. Distance Scoring (20%)

**Example:**
```
User (Loves: Pedas, Gurih) accessing app at 23:30 (Midnight).
System filters out Breakfast spots.
Recommend: Gudeg Mercon Bu Tin (Matches 'Pedas' & Open late).
```

### 2. Nearby (Location-Based)
**Purpose:** Find the absolute best foods within walking or short driving distance.
**Algorithm Priority:**
1. Distance Scoring (70%)
2. Content-Based / Rating (30%)

---

## 3. Algorithms & Math

### 1. Content-Based Filtering (Attribute Matching)
**Concept:** Recommend restaurants/menus that share attributes with the user's saved preferences (`taste_preferences`, `max_budget`).

**Implementation:**
The backend compares the user's `taste_preferences` array (e.g., `['manis', 'pedas', 'berkuah']`) against the restaurant's `tags` array or name.
- +2 points for every exact Tag match.
- +1 point for partial Name match.

### 2. Geospatial Scoring (Haversine Formula)
Used to calculate the exact distance between the user's phone GPS and the restaurant's coordinates.

```javascript
distance_meters = 6371000 * acos (
    cos(radians(user_lat)) * cos(radians(resto_lat)) * cos(radians(resto_lng) - radians(user_lng)) + 
    sin(radians(user_lat)) * sin(radians(resto_lat))
)
```

### 3. Contextual Time Filtering
Converts the user's local `current_time` (e.g., `14:30`) into minutes (870) and checks it against the restaurant's `open_period` schedule. Restaurants that are currently closed are strictly filtered out of the "Smart Pick" results.

---

## 4. Implementation Pipeline

1. **Real-time execution (Online - Under 1 second):**
   - User opens the Foodiction app.
   - Frontend sends `lat`, `lng`, and `current_time` to `/api/v1/recommendations/smart-pick`.
   - Backend queries PostgreSQL for all restaurants, pulling their minimum menu prices.
   - Backend runs the Haversine formula to find restaurants within the user's `preferred_radius`.
   - Backend runs the Time Analyzer to drop closed restaurants.
   - Backend calculates the `taste_score` based on the user's saved flavor profile.
   - Backend sorts the final list primarily by `taste_score` and `rating`, then distance, and returns the top 10 recommendations.

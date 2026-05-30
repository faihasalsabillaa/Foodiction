# Foodiction - Recommendation Engine Design

**Project:** Food Recommendation Web Application (Yogyakarta Culinary Heritage)  
**Recommendation System Type:** Hybrid (Collaborative + Content-Based + Context-Based)  
**Target Data Source:** GoFood Merchants & Reviews Dataset  
**Last Updated:** May 30, 2026

---

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Recommendation Contexts](#2-recommendation-contexts)
3. [Algorithms & Math](#3-algorithms--math)
4. [Scoring Formulas](#4-scoring-formulas)
5. [Implementation Pipeline](#5-implementation-pipeline)

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
│                                           │
│  ┌─────────────────────────────────────┐  │
│  │ 1. Context Analyzer                 │  │
│  │    - Extract time (e.g., 23:00)     │  │
│  │    - Extract location (lat/lng)     │  │
│  └─────────────────────────────────────┘  │
│  ┌─────────────────────────────────────┐  │
│  │ 2. Candidate Generator              │  │
│  │    - Filter restaurants that are    │  │
│  │      OPEN and within 5km radius     │  │
│  └─────────────────────────────────────┘  │
│  ┌─────────────────────────────────────┐  │
│  │ 3. Hybrid Scoring Module            │  │
│  │    - Collaborative (User reviews)   │  │
│  │    - Content-based (Taste/Category) │  │
│  │    - Haversine Distance score       │  │
│  └─────────────────────────────────────┘  │
│  ┌─────────────────────────────────────┐  │
│  │ 4. Ranker                           │  │
│  │    - Sort by final weighted score   │  │
│  │    - Return Top 10-20 Eateries      │  │
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

### 1. Smart Pick (Time-Aware Default)
**Purpose:** General recommendations that dynamically shift based on the time of day and user taste.
**Algorithm Priority:**
1. Collaborative Filtering (40%)
2. Time-Based / Contextual Filter (40%)
3. Content-Based (20%)

**Example:**
```
User accessing app at 23:30 (Midnight).
System filters out Breakfast spots.
Recommend: Angkringan Pak Jali, Sate Klatak Pak Pong (Late-night spots highly rated by similar users).
```

### 2. Nearby (Location-Based)
**Purpose:** Find the absolute best foods within walking or short driving distance.
**Algorithm Priority:**
1. Distance Scoring (50%)
2. Content-Based / Price Level (30%)
3. Collaborative Filtering (20%)

**Distance Formula:**
```
distance_score = 1 - (distance_meters / max_radius_meters)
(e.g., Max radius = 5000m. A restaurant 1000m away gets a high distance score of 0.8)
```

### 3. Budget Friendly (Price-Conscious)
**Purpose:** High-quality local foods at student-friendly prices.
**Algorithm Priority:**
1. Price-Adjusted Score (50%)
2. Rating Normalization (30%)
3. Content-Based (20%)

**Formula:**
```
budget_score = (normalized_rating) / (price_level_factor)
```
**Example:**
```
User selects Budget Friendly near campus.
Recommend: Nasi Kucing Rp 4.000 (Rating 4.5) beats Gudeg Premium Rp 45.000 (Rating 4.8).
```

---

## 3. Algorithms & Math

### 1. Collaborative Filtering (User-Based)
**Concept:** Users who liked similar local warungs/restaurants in the past will like similar ones in the future.

**Implementation (Cosine Similarity):**
```
similarity(User_A, User_B) = (sum of (A_i × B_i)) / (||A|| × ||B||)
```
*Note: We will use the `rating` column from `gofood_food_overviews.csv` to build the User-Restaurant Matrix.*

### 2. Content-Based Filtering (Attribute Matching)
**Concept:** Recommend restaurants/menus that share attributes with the user's saved preferences (`taste_preference`, `budget`).

**Restaurant & Menu Feature Vectors:**
Instead of prep_time or difficulty, we use catalog attributes:
- `Category`: Gudeg, Angkringan, Bakmi, Sate
- `TasteProfile`: Sweet, Savory, Spicy
- `PriceLevel`: 1 (Cheap), 2 (Medium), 3 (Expensive)
- `OperatingWindow`: Breakfast, Lunch, Late-Night

**Example Vector for "Gudeg Mercon Bu Tin":**
```
- Category: Gudeg (1, 0, 0, 0)
- TasteProfile: Spicy (0, 0, 1)
- PriceLevel: 2
- OperatingWindow: Late-Night
```

### 3. Geospatial Scoring (Haversine Formula)
Used specifically for the "Nearby" constraint.
```sql
distance_meters = 6371000 * acos (
    cos(radians(user_lat)) * cos(radians(resto_lat)) * cos(radians(resto_lng) - radians(user_lng)) + 
    sin(radians(user_lat)) * sin(radians(resto_lat))
)
```

---

## 4. Scoring Formulas

The engine merges the algorithms into a single weighted pipeline. The "Weights" change depending on the UI mode selected by the user.

```javascript
// Base Hybrid Formula
final_score = (weight_distance * distance_score) + 
              (weight_collab * collab_score) + 
              (weight_content * content_score)

// Mode Adjustments:
if (context === 'NEARBY') {
    weight_distance = 0.60;
    weight_collab = 0.20;
    weight_content = 0.20;
} else if (context === 'SMART_PICK') {
    weight_distance = 0.20;
    weight_collab = 0.50;
    weight_content = 0.30;
    // Apply strict penalty if current_time is outside restaurant opening_hours
}
```

---

## 5. Implementation Pipeline

1. **Pre-computation (Offline):**
   - Run a daily background cron job to calculate user-to-user similarity matrices using the GoFood review datasets. Store results in Redis to avoid heavy math on every API call.
2. **Real-time execution (Online - Under 2 seconds):**
   - User opens the Foodiction Next.js app.
   - Frontend sends `lat`, `lng`, and `time` to `/api/v1/recommendations/smart-pick`.
   - Backend queries PostgreSQL for open restaurants within 5km.
   - Backend applies the weights, sorts the list, and returns the top 20 recommendations.

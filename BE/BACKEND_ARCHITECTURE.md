# Foodiction Backend Architecture & Development Plan

**Project:** Food Recommendation Web Application (Yogyakarta Culinary Heritage Platform)  
**Type:** University Capstone Project / Scalable Software Design Implementation  
**Architecture Style:** Microservices / Stateless Containerized Architecture  
**Databases:** Hybrid Data Layer (MySQL for User Service, PostgreSQL with Geospatial Capability for Food Service, Redis for Cache & Messaging)  
**API Style:** RESTful  
**Target Deployment:** Containerized Environment (Docker / Cloud-Ready AWS/GCP)  

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [System Architecture & Component Boundaries](#2-system-architecture--component-boundaries)
3. [Database Design & Data Layer Isolation](#3-database-design--data-layer-isolation)
4. [API Design & Endpoint Specifications](#4-api-design--endpoint-specifications)
5. [Asynchronous Event-Driven Components (Redis Pub/Sub)](#5-asynchronous-event-driven-components-redis-pubsub)
6. [Standardized Folder Structure](#6-standardized-folder-structure)
7. [Development Roadmap & Phases](#7-development-roadmap--phases)

---

## 1. Executive Summary

### Current State & Context
The backend is purposefully redesigned to fulfill the core vision of Foodiction which is a highly scalable, intelligent local food discovery platform dedicated to preserving and promoting Yogyakarta’s rich culinary heritage (e.g., Gudeg, Angkringan, Bakmi Jawa)**.

### System Scope
The backend services will directly provide:
- High-concurrency stateless authentication and session management.
- Geospatial restaurant discovery (finding local eateries near the user's live coordinates).
- A context-aware Recommendation Engine that combines user taste profiles, strict budget limits, and time-of-day variables (e.g., prioritizing midnight Angkringan gems over breakfast-only spots).
- Asynchronous, non-blocking user review processing to ensure low API latency.
- Admin capabilities for bulk culinary data ingestion and operational monitoring.

### Performance & Non-Functional Targets
- **Availability:** Target 99.5% uptime through independent service isolation.
- **Latency:** Core geospatial and recommendation API responses must resolve in **under 2 seconds**.
- **Traffic Handling:** Gracefully manage a normal load of 10–50 Requests Per Second (RPS) and auto-scale to handle peak spikes of up to **250 RPS** during holiday tourist seasons and peak lunch/dinner hours in Yogyakarta.

---

## 2. System Architecture & Component Boundaries

### 1. Architecture Map

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                      │
│            (Fully Implemented Web Client Interface)         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ REST API (HTTPS Protocol)
                         │
┌────────────────────────▼────────────────────────────────────┐
│                API GATEWAY / REVERSE PROXY                  │
│                (Nginx / Kong Container Layer)               │
│     [TLS Termination | Rate Limiting | Request Routing]     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Private Inter-Service Docker Network
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    APPLICATION LAYER                        │
├──────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐     ┌────────────────────────┐  │
│  │ User & Auth Service     │     │ Food & Catalog Service │  │
│  │ (Stateless Account &    │     │ (Geospatial Discovery, │  │
│  │ Preference Management)  │     │ Menu Catalog, Reviews) │  │
│  └────────────┬────────────┘     └───────────┬────────────┘  │
│               │                              │               │
│               │                      ┌───────▼────────────┐  │
│               │                      │ Recommend. Engine  │  │
│               │                      │ (Context Smart-Pick│  │
│               │                      │ In-Memory Worker)  │  │
│               │                      └───────┬────────────┘  │
└───────────────┼──────────────────────────────┼───────────────┘
                │                              │
        ┌───────▼───────┐              ┌───────▼───────┐
        │   MySQL DB    │              │ PostgreSQL DB │
        │ (Stateful User│              │  (Stateful    │
        │ Credentials & │              │ Geography /   │
        │ Preferences)  │              │ Resto & Menu) │
        └───────────────┘              └───────┬───────┘
                                               │
                                       ┌───────▼───────┐
                                       │  Redis Cluster│
                                       │ (Cache Layer &│
                                       │ Event Pub/Sub)│
                                       └───────────────┘
```

### 2. Component Boundary Breakdown

| Component | Architecture Role | core Responsibilities |
|-----------|-------------------|-----------------------|
| **API Gateway** | System Edge Entry Point | Terminates external SSL/TLS certificates; applies IP-based rate limiting; intercepts requests to inspect and strip invalid headers; forwards clean downstream traffic over the isolated Docker network bridge. |
| **User & Auth Service** | Identity & Domain Control | Manages secure signup, password hashing with `bcrypt`, JWT access/refresh token signing, and records fine-grained user flavor and budget constraints. |
| **Food & Catalog Service** | Core Ingestion & Discovery | Houses the master list of physical restaurants and menu arrays. Interacts with the coordinate database to resolve geographic boundaries and coordinates user ulasan (reviews). |
| **Recommendation Engine** | Computational Worker | Pulls dynamic context vectors (live coordinates, system server clock time), merges them with historical data, and calculates high-relevance food outputs. |

---

## 3. Database Design & Data Layer Isolation

To prevent single points of failure and decouple scaling restrictions as dictated by microservices principles, the data layer implements a strict **Database-per-Service** isolation model. 

### A. User Domain Database (Target Engine: MySQL)
Maintains strong transactional relational consistency for corporate user profiles and security logs.

```sql
-- 1. Users Table
CREATE TABLE users (
    id CHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. User Preferences Table (Powers personalized filtering constraints)
CREATE TABLE user_preferences (
    user_id CHAR(36) NOT NULL,
    taste_preference VARCHAR(50) DEFAULT NULL, -- e.g., 'spicy', 'savory', 'sweet'
    max_budget DECIMAL(10,2) DEFAULT NULL,     -- User's standard purchasing limit
    preferred_radius INT DEFAULT 5000,          -- Target search distance in meters (e.g., 5km)
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_pref_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### B. Food Discovery & Catalog Domain Database (Target Engine: PostgreSQL)
Handles high-performance complex relational joins, string matching indices, and geospatial distance computations via built-in geographic constraints.

```sql
-- Enable standard UUID generator expansion extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Restaurants Table (The physical anchor of the platform)
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,   -- Latitude data points
    longitude DECIMAL(11, 8) NOT NULL,  -- Longitude data points
    opening_time TIME NOT NULL,         -- Used for dynamic "Time Recommendations"
    closing_time TIME NOT NULL,         -- Deploys boundaries for operational windows
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- B-Tree Index for high-volume lookup optimization on spatial coordinate calculations
CREATE INDEX idx_restaurants_coords ON restaurants (latitude, longitude);

-- 2. Menus Table (Katalog menu mapping from master datasets like nutrition.csv)
CREATE TABLE menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,          -- e.g., 'Gudeg Mercon Komplit', 'Abon Sapi Cap Ayam'
    category VARCHAR(100) NOT NULL,      -- Heritage Categories: 'Gudeg', 'Angkringan', 'Bakmi Jawa'
    taste_profile VARCHAR(50),           -- 'spicy', 'savory', 'sweet', 'bitter'
    price DECIMAL(10,2) NOT NULL,        -- Used for precise budget threshold filters
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menus_category ON menus (category);
CREATE INDEX idx_menus_price ON menus (price);

-- 3. Reviews Table (Persisted instantly, analytics derived asynchronously via message layers)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,               -- Federated ID tracking to external User Service
    rating_score INTEGER NOT NULL CHECK (rating_score BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_restaurant ON reviews (restaurant_id);
```

---

## 4. API Design & Endpoint Specifications

### 1. Global Specifications
- **Base Routing URL:** `https://api.foodiction.com/v1`
- **Payload Format:** `application/json`
- **Authentication Header:** Standard HTTP Authorization Bearer scheme (`Authorization: Bearer <JWT_TOKEN>`)

### 2. Core Operational Endpoints

#### A. Geospatial Discovery: Fetch Nearby Restaurants
Provides localized restaurant discovery by ranking distances using coordinates.

- **HTTP Method:** `GET`
- **Endpoint:** `/restaurants/nearby`
- **Query Parameters:**
  | Parameter | Type | Required | Description |
  |-----------|------|----------|-------------|
  | `lat` | Decimal | **Yes** | Client's real-time latitude coordinate. |
  | `lng` | Decimal | **Yes** | Client's real-time longitude coordinate. |
  | `radius` | Integer | No | Max circle boundary distance in meters. Default: `5000`. |
  | `max_budget` | Decimal | No | Maximum price limit of food available in menus. |
  | `category` | String | No | Target specific heritage subset (`Gudeg`, `Angkringan`). |

- **Sample JSON Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "restaurants": [
      {
        "id": "8f3b202c-564a-4e2a-8ea1-923f1200bc56",
        "name": "Gudeg Yu Djum Wijilan 16",
        "address": "Jl. Wijilan No.16, Panembahan, Kecamatan Kraton, Kota Yogyakarta",
        "distance_meters": 1240.50,
        "average_rating": 4.65,
        "price_range_indicator": "Medium",
        "image_url": "https://storage.googleapis.com/foodiction-media/resto_yudjum.webp"
      }
    ],
    "pagination": {
      "total_records": 1,
      "page": 1,
      "limit": 10
    }
  },
  "meta": {
    "timestamp": "2026-05-30T17:58:12Z"
  }
}
```

#### B. Context-Aware Engine: Smart Pick Recommendations
Combines user preference states, the physical location, and current chronological timeline.

- **HTTP Method:** `GET`
- **Endpoint:** `/recommendations/smart-pick`
- **Query Parameters:**
  | Parameter | Type | Required | Description |
  |-----------|------|----------|-------------|
  | `lat` | Decimal | **Yes** | Live client latitude. |
  | `lng` | Decimal | **Yes** | Live client longitude. |
  | `current_time`| String | **Yes** | Format `HH:mm` (e.g. `23:45`) to detect night lifestyle profiles. |

- **Sample JSON Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "context_detected": "Late-Night Cravings Window",
    "recommendations": [
      {
        "restaurant_id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
        "restaurant_name": "Angkringan Pak Jali UGM",
        "reason_token": "Open now. Matches your 'Savory' profile within 1.2km during late-night hours.",
        "recommended_menu_highlight": "Nasi Kucing Sambal Teri & Sate Kulit",
        "estimated_spend": 15000.00
      }
    ]
  }
}
```

---

## 5. Asynchronous Event-Driven Components (Redis Pub/Sub)

To guarantee the system fulfills the sub-2 second processing target without sacrificing application integrity, long-running math calculations or secondary updates are uncoupled from the live request thread using **Redis Pub/Sub**.

### Review Submission Event Topology Diagram

```
[Client App] 
     │
     │ 1. POST /restaurants/:id/reviews
     ▼
┌──────────────────────────────────────────────┐
│ Food Service API Instance                    │
│ ── Writes Review Row to PostgreSQL Instantly  │
│ ── Returns "201 Created" to Client (Fast!)   │
└────────────────────┬─────────────────────────┘
                     │
                     │ 2. Publishes JSON Payload
                     ▼
             【 Redis Channel 】 ──> event: "review_created"
                     │
         ┌───────────┴───────────┐
         │ (Parallel Broadcast)  │
         ▼                       ▼
┌────────────────────┐   ┌────────────────────────────────┐
│ Worker A: Ratings  │   │ Worker B: Cache Invalidator    │
│ ── Recalculates    │   │ ── Purges Old In-Memory Blocks │
│    Average Score   │   │    So Fresh Reviews Load Next  │
│ ── Updates Postgre │   └────────────────────────────────┘
└────────────────────┘
```

### Data Consistency Matrix
- **Critical Transactions (User Authentication, Core Financial Budgets):** Implements **Strong Consistency** models. Requests hold open until confirmation writes hit the storage disks.
- **Derived/Analytical Meta (Trending Scores, Average Ratings Graphs, Aggregates):** Evaluated under **Eventual Consistency** guidelines. Latency spikes on analytical scores lag up to ~1-2 seconds behind active updates to maximize horizontal processing throughput.

---

## 6. Standardized Folder Structure

The application directory structure uses a highly robust layered MVC layout tailored for Node.js/Express, creating separation between entry protocols, business routing, and querying adapters.

```
foodiction-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Handles MySQL & PostgreSQL connection pooling
│   │   ├── redis.js             # Initializes Redis Client & Pub/Sub engines
│   │   └── environments.js      # Strict env variable assertions
│   ├── models/
│   │   ├── User.js              # Maps user entities
│   │   ├── Restaurant.js        # Maps geospatial metadata
│   │   └── Menu.js              # Maps individual menu catalog entries
│   ├── routes/
│   │   ├── auth.routes.js       # Handles /v1/auth paths
│   │   ├── food.routes.js       # Handles /v1/restaurants paths
│   │   └── recommend.routes.js  # Handles /v1/recommendations paths
│   ├── controllers/
│   │   ├── AuthController.js    # Decodes incoming requests & payload validation
│   │   ├── FoodController.js    # Triggers coordinates calculations and indexing
│   │   └── RecommendController.js# Orchestrates contextual vectors
│   ├── services/
│   │   ├── AuthService.js       # Executes password verification
│   │   ├── GeoSearchService.js  # Runs mathematical distance equations
│   │   └── CacheService.js      # Interacts with memory string buckets
│   ├── middleware/
│   │   ├── jwtVerify.js         # Intercepts requests for authentication validation
│   │   └── errorHandler.js      # Catches global system errors safely
│   ├── workers/
│   │   ├── ratingConsumer.js    # Asynchronous Redis background math evaluator
│   │   └── cacheInvalidator.js  # Listens for updates to flush memory data
│   └── app.js                   # Express application setup lifecycle
├── docker-compose.yml           # Local orchestrator configuration for local infrastructure
├── package.json
└── server.js                    # Core Entry Point script
```

---

## 7. Development Roadmap & Phases

```
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 0: INFRASTRUCTURE & IDENTITY ASSURANCE (Weeks 1-2)               │
│ ── Scaffold standardized directory trees & spin up local Docker engines│
│ ── Build Stateless Auth Service using MySQL storage & JWT signing      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: GEOSPATIAL DISCOVERY & INGESTION (Weeks 3-4)                  │
│ ── Populate PostgreSQL with foods schema, import nutrition.csv entries │
│ ── Code /restaurants/nearby endpoint using Coordinate index tracking   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: CONTEXT RECOMMENDATIONS & MESSAGING (Weeks 5-6)              │
│ ── Formulate /recommendations/smart-pick conditional engine algorithms │
│ ── Program non-blocking background workers using Redis Pub/Sub channels│
└────────────────────────────────────────────────────────────────────────┘
```
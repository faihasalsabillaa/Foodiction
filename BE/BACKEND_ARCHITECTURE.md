# Foodiction Backend Architecture & Development Plan

**Project:** Food Recommendation Web Application (Yogyakarta Culinary Heritage Platform)  
**Type:** University Capstone Project / Scalable Software Design Implementation  
**Architecture Style:** Modular Monolith / Stateless Containerized Architecture  
**Database:** PostgreSQL 14+ (Single Source of Truth for Users, Food, and Geospatial Data)  
**API Style:** RESTful  
**Target Deployment:** Containerized Environment (Docker / Cloud-Ready AWS/GCP)  

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [System Architecture & Component Boundaries](#2-system-architecture--component-boundaries)
3. [Database Design & Data Layer](#3-database-design--data-layer)
4. [API Design & Endpoint Specifications](#4-api-design--endpoint-specifications)
5. [Standardized Folder Structure](#5-standardized-folder-structure)

---

## 1. Executive Summary

### Current State & Context
The backend is purposefully designed to fulfill the core vision of Foodiction which is a highly scalable, intelligent local food discovery platform dedicated to preserving and promoting Yogyakarta’s rich culinary heritage (e.g., Gudeg, Angkringan, Bakmi Jawa).

### System Scope
The backend services will directly provide:
- High-concurrency stateless authentication and session management via JWT.
- Geospatial restaurant discovery (finding local eateries near the user's live coordinates).
- A context-aware Recommendation Engine that combines user taste profiles, strict budget limits, and time-of-day variables (e.g., prioritizing midnight Angkringan gems over breakfast-only spots).
- User review management and preference saving.

### Performance & Non-Functional Targets
- **Availability:** Target 99.5% uptime.
- **Latency:** Core geospatial and recommendation API responses must resolve in **under 1 second**.
- **Traffic Handling:** Gracefully manage a normal load of 10–50 Requests Per Second (RPS) using Node.js event-driven architecture.

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
│                    APPLICATION LAYER                        │
│                (Node.js / Express Server)                   │
├──────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐     ┌────────────────────────┐  │
│  │ User & Auth Module      │     │ Food & Catalog Module  │  │
│  │ (Stateless Account &    │     │ (Geospatial Discovery, │  │
│  │ Preference Management)  │     │ Menu Catalog, Reviews) │  │
│  └────────────┬────────────┘     └───────────┬────────────┘  │
│               │                              │               │
│               │                      ┌───────▼────────────┐  │
│               │                      │ Recommend. Engine  │  │
│               │                      │ (Context Smart-Pick│  │
│               │                      │ Content-Based)     │  │
│               │                      └───────┬────────────┘  │
└───────────────┼──────────────────────────────┼───────────────┘
                │                              │
                       ┌───────▼───────┐
                       │ PostgreSQL DB │
                       │ (Users, Auth, │
                       │ Restaurants,  │
                       │ Reviews)      │
                       └───────────────┘
```

### 2. Component Boundary Breakdown

| Component | Architecture Role | Core Responsibilities |
|-----------|-------------------|-----------------------|
| **User & Auth Module** | Identity & Domain Control | Manages secure signup, password hashing with `bcrypt`, JWT access token signing, and records fine-grained user flavor and budget constraints. |
| **Food & Catalog Module** | Core Ingestion & Discovery | Houses the master list of physical restaurants and menu arrays. Resolves geographic boundaries and coordinates user reviews. |
| **Recommendation Engine** | Computational Logic | Pulls dynamic context vectors (live coordinates, system server clock time), merges them with user preferences (taste, budget), and calculates high-relevance food outputs on the fly. |

---

## 3. Database Design & Data Layer

To ensure simplicity, high performance on complex queries, and strong consistency, the data layer utilizes a **Single PostgreSQL Database** (`foodiction_db`). This allows us to use foreign keys across the user and food domains effortlessly.

### A. Core Schema (Target Engine: PostgreSQL 14+)

*See `DATABASE_SCHEMA.md` for the complete ERD and column specifications.*

**Key Elements:**
- **Users & Auth:** Stored securely using bcrypt and UUIDs.
- **User Preferences:** Direct Foreign Key to `users`. Stores arrays of tags (`TEXT[]`) and budget constraints.
- **Restaurants & Menus:** Indexed heavily for Haversine geospatial calculations.
- **Reviews:** Connected to both `restaurants` and `users` to maintain data integrity.

---

## 4. API Design & Endpoint Specifications

*See `API_DESIGN.md` for full request/response payload structures.*

### 1. Global Specifications
- **Base Routing URL:** `https://api.foodiction.com/v1` (or `localhost:4000`)
- **Payload Format:** `application/json`
- **Authentication Header:** Standard HTTP Authorization Bearer scheme (`Authorization: Bearer <JWT_TOKEN>`)

### 2. Core Operational Endpoints Summary
- `POST /auth/register` & `POST /auth/login`: JWT Authentication.
- `GET /auth/me`: Fetch logged-in profile.
- `GET/PUT /users/me/preferences`: Manage taste tags and budget constraints.
- `GET /restaurants/nearby`: Geospatial bounding box searches.
- `GET /recommendations/smart-pick`: The main Context-Aware recommendation route.
- `POST /restaurants/:id/reviews`: Secure review submission mapped to user accounts.

---

## 5. Standardized Folder Structure

The application directory structure uses a highly robust layered MVC layout tailored for Node.js/Express.

```
foodiction-backend/
├── BE/
│   ├── migrations/          # SQL scripts to initialize schema (e.g. 001_create_schema.sql)
│   ├── .env                 # Environment variables (DB Credentials, JWT Secret)
│   ├── package.json         # Node.js dependencies
│   ├── seeder_reviews.js    # Data ingestion script for restaurants and fake reviews
│   └── server.js            # Core Entry Point script (Express App, Routes, Logic)
├── src/                     # Next.js Frontend (Separate Domain)
└── README.md
```
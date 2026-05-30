-- Migration: create initial schema for Foodiction
-- Run this once per environment to establish tables used by seeders

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rating DECIMAL(3,2),
    open_period TEXT,
    created_year INT,
    tags TEXT[],
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8)
);

-- Menus table
CREATE TABLE IF NOT EXISTS menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_name VARCHAR(100),
    rating INTEGER,
    review_text TEXT,
    ordered_item VARCHAR(255)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_restaurants_coords ON restaurants (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_menus_restaurant ON menus (restaurant_id);

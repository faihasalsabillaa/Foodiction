-- Migration: create user preferences table for Foodiction
-- Run this after initial schema migration to persist UI profile preferences

CREATE TABLE IF NOT EXISTS user_preferences (
    user_id VARCHAR(36) PRIMARY KEY,
    taste_preferences TEXT[],
    max_budget NUMERIC(10,2),
    preferred_radius INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

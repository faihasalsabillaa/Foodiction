-- Migration: create users table and add FK to user_preferences
-- Run this after 002_create_user_preferences.sql

-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name   VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- 2. Migrate user_preferences to use UUID FK
--    Drop old VARCHAR primary key and recreate with UUID reference to users
ALTER TABLE user_preferences DROP CONSTRAINT IF EXISTS user_preferences_pkey;
ALTER TABLE user_preferences ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
ALTER TABLE user_preferences ADD PRIMARY KEY (user_id);
ALTER TABLE user_preferences
    ADD CONSTRAINT fk_user_preferences_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

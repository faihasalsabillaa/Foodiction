-- Migration: add user_id and created_at to reviews table
-- user_id is required for Collaborative Filtering in the Recommendation Engine
-- created_at is required for sorting reviews chronologically

ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Index to optimize querying reviews by a specific user (for recommendations)
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews (user_id);

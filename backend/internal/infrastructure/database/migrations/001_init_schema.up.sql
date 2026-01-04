-- 001_init_schema.up.sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User profiles table (from onboarding data)
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER NOT NULL CHECK (age >= 18 AND age <= 100),
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    height DECIMAL(5,2) NOT NULL CHECK (height >= 100 AND height <= 250),
    weight DECIMAL(5,2) NOT NULL CHECK (weight >= 30 AND weight <= 300),
    goal_weight DECIMAL(5,2) CHECK (goal_weight >= 30 AND goal_weight <= 300),
    activity_level VARCHAR(20) NOT NULL CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'very', 'extreme')),
    goal VARCHAR(20) NOT NULL CHECK (goal IN ('lose', 'maintain', 'gain')),
    preferred_language VARCHAR(5) DEFAULT 'th' CHECK (preferred_language IN ('en', 'th')),

    -- Calculated values
    bmr INTEGER NOT NULL,
    tdee INTEGER NOT NULL,
    target_calories INTEGER NOT NULL,
    protein_target INTEGER NOT NULL,
    carbs_target INTEGER NOT NULL,
    fat_target INTEGER NOT NULL,
    protein_calories INTEGER NOT NULL,
    carbs_calories INTEGER NOT NULL,
    fat_calories INTEGER NOT NULL,

    completed_onboarding BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Meals table
CREATE TABLE meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    calories INTEGER NOT NULL,
    grams DECIMAL(7,2) NOT NULL,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),

    -- Nutrition breakdown
    protein DECIMAL(7,2) DEFAULT 0,
    carbs DECIMAL(7,2) DEFAULT 0,
    fat DECIMAL(7,2) DEFAULT 0,
    fiber DECIMAL(7,2),
    sugar DECIMAL(7,2),
    sodium INTEGER,

    image_url TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id and date for faster queries
CREATE INDEX idx_meals_user_date ON meals(user_id, date DESC);
CREATE INDEX idx_meals_meal_type ON meals(user_id, meal_type);

-- Favorite foods table
CREATE TABLE favorite_foods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    food_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    category VARCHAR(100),
    calories INTEGER NOT NULL,
    protein DECIMAL(7,2),
    carbs DECIMAL(7,2),
    fat DECIMAL(7,2),
    fiber DECIMAL(7,2),
    sugar DECIMAL(7,2),
    sodium INTEGER,
    serving_size DECIMAL(7,2),
    serving_unit VARCHAR(20) DEFAULT 'g',
    emoji VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, food_id)
);

CREATE INDEX idx_favorite_foods_user ON favorite_foods(user_id);

-- Custom foods table (user-created foods)
CREATE TABLE custom_foods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,

    -- Nutrition info per serving
    calories INTEGER NOT NULL,
    protein DECIMAL(7,2) DEFAULT 0,
    carbs DECIMAL(7,2) DEFAULT 0,
    fat DECIMAL(7,2) DEFAULT 0,
    fiber DECIMAL(7,2),
    sugar DECIMAL(7,2),
    sodium INTEGER,

    serving_size DECIMAL(7,2) DEFAULT 100,
    serving_unit VARCHAR(20) DEFAULT 'g',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_custom_foods_user ON custom_foods(user_id);

-- Open Food Facts cache table
CREATE TABLE off_cache (
    barcode VARCHAR(50) PRIMARY KEY,
    product_data JSONB NOT NULL,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Indexed fields for faster queries
    name VARCHAR(255),
    brand VARCHAR(255),
    calories INTEGER,
    protein DECIMAL(7,2),
    carbs DECIMAL(7,2),
    fat DECIMAL(7,2),
    image_url TEXT
);

-- Create index for cache expiry cleanup
CREATE INDEX idx_off_cache_expires ON off_cache(expires_at);

-- Refresh tokens table (for JWT refresh)
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON meals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_foods_updated_at BEFORE UPDATE ON custom_foods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

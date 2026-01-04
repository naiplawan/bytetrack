package database

import (
	"context"
	"fmt"

	"github.com/bytetrack/backend/internal/infrastructure/config"
	"github.com/jackc/pgx/v5/pgxpool"
)

// DB holds the database connection pool
type DB struct {
	Pool *pgxpool.Pool
}

// New creates a new database connection pool
func New(cfg *config.Config) (*DB, error) {
	connString := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s",
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.DBName,
	)

	poolConfig, err := pgxpool.ParseConfig(connString)
	if err != nil {
		return nil, fmt.Errorf("failed to parse database config: %w", err)
	}

	// Set connection pool settings
	poolConfig.MaxConns = 20
	poolConfig.MinConns = 5

	pool, err := pgxpool.NewWithConfig(context.Background(), poolConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to create connection pool: %w", err)
	}

	// Verify connection
	if err := pool.Ping(context.Background()); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &DB{Pool: pool}, nil
}

// Close closes the database connection pool
func (db *DB) Close() {
	if db.Pool != nil {
		db.Pool.Close()
	}
}

// RunMigrations runs the database migrations
func (db *DB) RunMigrations(ctx context.Context, migrations []Migration) error {
	for _, m := range migrations {
		if _, err := db.Pool.Exec(ctx, m.Up); err != nil {
			return fmt.Errorf("failed to run migration %s: %w", m.Name, err)
		}
	}
	return nil
}

// Migration represents a database migration
type Migration struct {
	Name string
	Up   string
	Down string
}

// GetMigrations returns all migrations
func GetMigrations() []Migration {
	return []Migration{
		{
			Name: "001_init_schema",
			Up:   migration001Up,
			Down: migration001Down,
		},
		{
			Name: "002_thai_foods",
			Up:   migration002Up,
			Down: migration002Down,
		},
	}
}

const (
	migration001Up = `
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
`

	migration001Down = `
-- Drop triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_meals_updated_at ON meals;
DROP TRIGGER IF EXISTS update_custom_foods_updated_at ON custom_foods;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS off_cache;
DROP TABLE IF EXISTS custom_foods;
DROP TABLE IF EXISTS favorite_foods;
DROP TABLE IF EXISTS meals;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;

-- Drop extension
DROP EXTENSION IF EXISTS "uuid-ossp";
`

	migration002Up = `
-- Create Thai foods table
CREATE TABLE thai_foods (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,

    -- Nutrition per serving
    calories INTEGER NOT NULL,
    protein DECIMAL(7,2) NOT NULL,
    carbs DECIMAL(7,2) NOT NULL,
    fat DECIMAL(7,2) NOT NULL,
    fiber DECIMAL(7,2),
    sugar DECIMAL(7,2),
    sodium INTEGER,

    serving_size DECIMAL(7,2) NOT NULL,
    serving_unit VARCHAR(20) DEFAULT 'g',
    emoji VARCHAR(10)
);

CREATE INDEX idx_thai_foods_category ON thai_foods(category);
CREATE INDEX idx_thai_foods_name ON thai_foods USING gin(to_tsvector('english', name || ' ' || name_en));

-- Insert 20 Thai foods
INSERT INTO thai_foods (id, name, name_en, category, calories, protein, carbs, fat, fiber, serving_size, emoji) VALUES
('th_1', 'ข้าวผัดกุ้ง', 'Fried Rice with Shrimp', 'rice', 350, 18, 45, 12, 2, 250, '🍤'),
('th_2', 'ผัดไทย', 'Pad Thai', 'noodles', 400, 15, 55, 14, 3, 300, '🍜'),
('th_3', 'แกงเขียวหวานไก่', 'Green Curry with Chicken', 'curry', 280, 25, 8, 18, 2, 200, '🍛'),
('th_4', 'ต้มยำกุ้ง', 'Tom Yum Goong', 'soup', 120, 15, 8, 3, 1, 250, '🍲'),
('th_5', 'ข้าวมันไก่', 'Hainanese Chicken Rice', 'rice', 480, 28, 55, 16, 1, 350, '🍗'),
('th_6', 'ส้มตำ', 'Papaya Salad', 'salad', 150, 3, 30, 2, 8, 200, '🥗'),
('th_7', 'ไก่ย่าง', 'Grilled Chicken', 'grilled', 250, 35, 0, 12, 0, 150, '🍖'),
('th_8', 'ผัดกะเพราหมูสับ', 'Stir-fried Basil with Minced Pork', 'stir-fry', 320, 20, 15, 22, 2, 200, '🥘'),
('th_9', 'มะม่วงข้าวเหนียว', 'Mango Sticky Rice', 'dessert', 380, 6, 70, 12, 3, 180, '🥭'),
('th_10', 'ข้าวต้มหมู', 'Rice Porridge with Pork', 'soup', 200, 15, 25, 5, 1, 300, '🍲'),
('th_11', 'ลาบหมู', 'Spicy Minced Pork Salad', 'salad', 180, 22, 5, 9, 2, 150, '🥗'),
('th_12', 'ก๋วยเตี๋ยวน้ำใส', 'Clear Noodle Soup', 'noodles', 280, 18, 35, 8, 2, 400, '🍜'),
('th_13', 'แกงมัสมั่นไก่', 'Massaman Curry with Chicken', 'curry', 350, 22, 20, 22, 3, 250, '🍛'),
('th_14', 'ข้าวขาหมู', 'Braised Pork Leg on Rice', 'rice', 550, 30, 50, 25, 1, 350, '🍖'),
('th_15', 'ยำวุ้นเส้น', 'Glass Noodle Salad', 'salad', 220, 12, 30, 6, 2, 200, '🥗'),
('th_16', 'ต้มข่าไก่', 'Chicken in Coconut Soup', 'soup', 250, 18, 8, 18, 1, 250, '🍲'),
('th_17', 'ผัดซีอิ๊ว', 'Stir-fried Noodles with Soy Sauce', 'noodles', 380, 15, 50, 14, 2, 300, '🍜'),
('th_18', 'หมูสะเต๊ะ', 'Pork Satay', 'grilled', 300, 25, 12, 18, 1, 150, '🍢'),
('th_19', 'ข้าวเหนียวหมูปิ้ง', 'Sticky Rice with Grilled Pork', 'grilled', 420, 22, 45, 18, 2, 250, '🍖'),
('th_20', 'ไข่เจียว', 'Thai Omelette', 'stir-fry', 280, 14, 2, 24, 0, 120, '🍳');
`

	migration002Down = `
DROP TABLE IF EXISTS thai_foods;
`
)

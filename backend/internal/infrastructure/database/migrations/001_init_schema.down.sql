-- 001_init_schema.down.sql
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

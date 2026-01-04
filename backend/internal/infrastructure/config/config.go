package config

import (
	"os"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the application
type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Redis    RedisConfig
	JWT      JWTConfig
	CORS     CORSConfig
	OFF      OFFConfig
}

// ServerConfig holds server configuration
type ServerConfig struct {
	Port string
	Host string
}

// DatabaseConfig holds database configuration
type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
}

// RedisConfig holds Redis configuration
type RedisConfig struct {
	Host     string
	Password string
	CacheTTL time.Duration
}

// JWTConfig holds JWT configuration
type JWTConfig struct {
	Secret     string
	AccessTTL  time.Duration
	RefreshTTL time.Duration
}

// CORSConfig holds CORS configuration
type CORSConfig struct {
	AllowedOrigins []string
}

// OFFConfig holds Open Food Facts configuration
type OFFConfig struct {
	CacheEnabled bool
	CacheTTL     time.Duration
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
	// Load .env file if exists (ignore error in production)
	_ = godotenv.Load()

	getEnv := func(key, defaultValue string) string {
		if value := os.Getenv(key); value != "" {
			return value
		}
		return defaultValue
	}

	getEnvDuration := func(key string, defaultValue time.Duration) time.Duration {
		if value := os.Getenv(key); value != "" {
			if duration, err := time.ParseDuration(value); err == nil {
				return duration
			}
		}
		return defaultValue
	}

	return &Config{
		Server: ServerConfig{
			Port: getEnv("SERVER_PORT", "8080"),
			Host: getEnv("SERVER_HOST", "0.0.0.0"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "bytetrack"),
			Password: getEnv("DB_PASSWORD", "changeme"),
			DBName:   getEnv("DB_NAME", "bytetrack"),
		},
		Redis: RedisConfig{
			Host:     getEnv("REDIS_HOST", "localhost:6379"),
			Password: getEnv("REDIS_PASSWORD", ""),
			CacheTTL: getEnvDuration("REDIS_CACHE_TTL", 168*time.Hour),
		},
		JWT: JWTConfig{
			Secret:     getEnv("JWT_SECRET", "your-super-secret-key-change-this"),
			AccessTTL:  getEnvDuration("JWT_ACCESS_TTL", 15*time.Minute),
			RefreshTTL: getEnvDuration("JWT_REFRESH_TTL", 168*time.Hour),
		},
		CORS: CORSConfig{
			AllowedOrigins: []string{
				getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:3000"),
			},
		},
		OFF: OFFConfig{
			CacheEnabled: getEnv("OFF_CACHE_ENABLED", "true") == "true",
			CacheTTL:     getEnvDuration("OFF_CACHE_TTL", 168*time.Hour),
		},
	}, nil
}

package middleware

import (
	"strings"

	"github.com/bytetrack/backend/internal/infrastructure/config"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// CORSConfig returns CORS middleware configuration
func CORSConfig(cfg *config.Config) fiber.Handler {
	return cors.New(cors.Config{
		AllowOrigins:     strings.Join(cfg.CORS.AllowedOrigins, ","),
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		AllowCredentials: true,
		MaxAge:           86400, // 24 hours
	})
}

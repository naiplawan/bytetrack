package middleware

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

// LoggerConfig returns logger middleware configuration
func LoggerConfig() fiber.Handler {
	return logger.New(logger.Config{
		Format:     "[${time}] ${status} - ${method} ${path} - ${latency}\n",
		TimeFormat: "2006-01-02 15:04:05",
		TimeZone:   "Local",
	})
}

// RequestID adds a request ID to each request
func RequestID() fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Locals("request_id", time.Now().UnixNano())
		return c.Next()
	}
}

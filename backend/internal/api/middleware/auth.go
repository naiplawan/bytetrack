package middleware

import (
	"strings"

	"github.com/bytetrack/backend/internal/domain/service"
	"github.com/bytetrack/backend/internal/pkg/jwt"
	"github.com/gofiber/fiber/v2"
)

// AuthMiddleware creates authentication middleware
func AuthMiddleware(jwtManager *jwt.Manager, authService *service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get Authorization header
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Missing authorization header",
			})
		}

		// Check if it's a Bearer token
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid authorization header format",
			})
		}

		// Validate token
		token := parts[1]
		claims, err := jwtManager.ValidateToken(token)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid or expired token",
			})
		}

		// Store user ID in context
		c.Locals("user_id", claims.UserID.String())
		c.Locals("email", claims.Email)

		return c.Next()
	}
}

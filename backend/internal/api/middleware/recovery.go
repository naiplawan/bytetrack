package middleware

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

// RecoveryConfig returns recovery middleware configuration
func RecoveryConfig() fiber.Handler {
	return recover.New(recover.Config{
		EnableStackTrace: true,
		StackTraceHandler: func(c *fiber.Ctx, e interface{}) {
			fmt.Printf("Panic: %v\n", e)
		},
	})
}

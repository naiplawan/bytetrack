package handler

import (
	"context"
	"time"

	"github.com/bytetrack/backend/internal/infrastructure/database"
	"github.com/gofiber/fiber/v2"
)

// HealthHandler handles health check requests
type HealthHandler struct {
	db *database.DB
}

// NewHealthHandler creates a new health handler
func NewHealthHandler(db *database.DB) *HealthHandler {
	return &HealthHandler{db: db}
}

// HealthResponse represents health check response
type HealthResponse struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
	Version   string    `json:"version,omitempty"`
	Database  string    `json:"database,omitempty"`
}

// Check performs a health check
// @Summary Health check
// @Description Check if the API and database are healthy
// @Tags health
// @Produce json
// @Success 200 {object} HealthResponse
// @Router /health [get]
func (h *HealthHandler) Check(c *fiber.Ctx) error {
	response := HealthResponse{
		Status:    "healthy",
		Timestamp: time.Now(),
		Version:   "1.0.0",
	}

	// Check database connection
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	if h.db != nil {
		if err := h.db.Pool.Ping(ctx); err != nil {
			response.Status = "degraded"
			response.Database = "unreachable"
		} else {
			response.Database = "healthy"
		}
	}

	statusCode := fiber.StatusOK
	if response.Status == "degraded" {
		statusCode = fiber.StatusServiceUnavailable
	}

	return c.Status(statusCode).JSON(response)
}

// Readiness checks if the service is ready to accept requests
// @Summary Readiness check
// @Description Check if the service is ready
// @Tags health
// @Produce json
// @Success 200 {object} map[string]string
// @Router /health/ready [get]
func (h *HealthHandler) Readiness(c *fiber.Ctx) error {
	if h.db == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
			"status": "not ready",
			"error":  "database not initialized",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	if err := h.db.Pool.Ping(ctx); err != nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
			"status": "not ready",
			"error":  "database unreachable",
		})
	}

	return c.JSON(fiber.Map{
		"status": "ready",
	})
}

// Liveness checks if the service is alive
// @Summary Liveness check
// @Description Check if the service is alive
// @Tags health
// @Produce json
// @Success 200 {object} map[string]string
// @Router /health/live [get]
func (h *HealthHandler) Liveness(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"status": "alive",
	})
}

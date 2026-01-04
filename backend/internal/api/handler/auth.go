package handler

import (
	"github.com/bytetrack/backend/internal/domain/entity"
	"github.com/bytetrack/backend/internal/domain/service"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// AuthHandler handles authentication HTTP requests
type AuthHandler struct {
	authService *service.AuthService
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

// Register handles user registration
// @Summary Register a new user
// @Description Register a new user with email and password
// @Tags auth
// @Accept json
// @Produce json
// @Param request body entity.RegisterRequest true "Register request"
// @Success 200 {object} service.RegisterResult
// @Failure 400 {object} map[string]string
// @Router /api/v1/auth/register [post]
func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var req entity.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	result, err := h.authService.Register(c.Context(), &req)
	if err != nil {
		if err == service.ErrUserExists {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"error": "User already exists",
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(result)
}

// Login handles user login
// @Summary Login user
// @Description Login user with email and password
// @Tags auth
// @Accept json
// @Produce json
// @Param request body entity.LoginRequest true "Login request"
// @Success 200 {object} service.LoginResult
// @Failure 401 {object} map[string]string
// @Router /api/v1/auth/login [post]
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req entity.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	result, err := h.authService.Login(c.Context(), &req)
	if err != nil {
		if err == service.ErrInvalidCredentials {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid email or password",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(result)
}

// RefreshToken handles token refresh
// @Summary Refresh access token
// @Description Refresh access token using refresh token
// @Tags auth
// @Accept json
// @Produce json
// @Param refresh_token body map[string]string true "Refresh token"
// @Success 200 {object} entity.TokenResponse
// @Failure 401 {object} map[string]string
// @Router /api/v1/auth/refresh [post]
func (h *AuthHandler) RefreshToken(c *fiber.Ctx) error {
	var req struct {
		RefreshToken string `json:"refresh_token"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	result, err := h.authService.RefreshToken(c.Context(), req.RefreshToken)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid refresh token",
		})
	}

	return c.JSON(result)
}

// Logout handles user logout
// @Summary Logout user
// @Description Logout user and invalidate refresh tokens
// @Tags auth
// @Produce json
// @Security Bearer
// @Success 200 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /api/v1/auth/logout [post]
func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	// Parse user_id from string to uuid.UUID
	userUUID, err := parseUserID(userID)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid user ID",
		})
	}

	if err := h.authService.Logout(c.Context(), userUUID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to logout",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Logged out successfully",
	})
}

// parseUserID parses user ID from context
func parseUserID(userID interface{}) (uuid.UUID, error) {
	userIDStr, ok := userID.(string)
	if !ok {
		return uuid.Nil, fiber.ErrUnauthorized
	}
	return uuid.Parse(userIDStr)
}

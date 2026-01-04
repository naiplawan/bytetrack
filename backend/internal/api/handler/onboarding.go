package handler

import (
	"github.com/bytetrack/backend/internal/domain/entity"
	"github.com/bytetrack/backend/internal/domain/service"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// OnboardingHandler handles onboarding HTTP requests
type OnboardingHandler struct {
	onboardingService *service.OnboardingService
}

// NewOnboardingHandler creates a new onboarding handler
func NewOnboardingHandler(onboardingService *service.OnboardingService) *OnboardingHandler {
	return &OnboardingHandler{
		onboardingService: onboardingService,
	}
}

// CompleteOnboarding completes the onboarding process
// @Summary Complete onboarding
// @Description Complete user onboarding with profile data
// @Tags onboarding
// @Accept json
// @Produce json
// @Security Bearer
// @Param request body entity.OnboardingRequest true "Onboarding request"
// @Success 200 {object} entity.OnboardingResponse
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /api/v1/onboarding/complete [post]
func (h *OnboardingHandler) CompleteOnboarding(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	var req entity.OnboardingRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	result, err := h.onboardingService.CompleteOnboarding(c.Context(), userID, &req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to complete onboarding",
		})
	}

	return c.JSON(result)
}

// GetOnboardingStatus gets the onboarding status
// @Summary Get onboarding status
// @Description Get the onboarding status for the authenticated user
// @Tags onboarding
// @Produce json
// @Security Bearer
// @Success 200 {object} entity.UserProfile
// @Failure 401 {object} map[string]string
// @Router /api/v1/onboarding/status [get]
func (h *OnboardingHandler) GetOnboardingStatus(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	profile, err := h.onboardingService.GetOnboardingStatus(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get onboarding status",
		})
	}

	return c.JSON(profile)
}

// UpdateProfile updates user profile
// @Summary Update profile
// @Description Update user profile information
// @Tags user
// @Accept json
// @Produce json
// @Security Bearer
// @Param request body entity.OnboardingRequest true "Profile update request"
// @Success 200 {object} entity.OnboardingResponse
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /api/v1/user/profile [put]
func (h *OnboardingHandler) UpdateProfile(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	var req entity.OnboardingRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	result, err := h.onboardingService.UpdateProfile(c.Context(), userID, &req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update profile",
		})
	}

	return c.JSON(result)
}

// GetProfile gets user profile
// @Summary Get profile
// @Description Get user profile information
// @Tags user
// @Produce json
// @Security Bearer
// @Success 200 {object} entity.UserProfile
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /api/v1/user/profile [get]
func (h *OnboardingHandler) GetProfile(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	profile, err := h.onboardingService.GetOnboardingStatus(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get profile",
		})
	}

	// If profile doesn't exist
	if !profile.CompletedOnboarding {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Profile not found. Please complete onboarding.",
		})
	}

	return c.JSON(profile)
}

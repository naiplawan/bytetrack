package handler

import (
	"time"

	"github.com/bytetrack/backend/internal/domain/entity"
	"github.com/bytetrack/backend/internal/domain/service"
	"github.com/bytetrack/backend/internal/infrastructure/repository"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// MealHandler handles meal HTTP requests
type MealHandler struct {
	mealService *service.MealService
}

// NewMealHandler creates a new meal handler
func NewMealHandler(mealService *service.MealService) *MealHandler {
	return &MealHandler{
		mealService: mealService,
	}
}

// GetMeals gets meals for the authenticated user
// @Summary Get meals
// @Description Get meals for the authenticated user with optional date filter
// @Tags meals
// @Produce json
// @Security Bearer
// @Param date query string false "Date (YYYY-MM-DD format)"
// @Success 200 {array} entity.Meal
// @Failure 401 {object} map[string]string
// @Router /api/v1/meals [get]
func (h *MealHandler) GetMeals(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	// Parse date parameter
	var date *time.Time
	dateStr := c.Query("date")
	if dateStr != "" {
		parsedDate, err := time.Parse("2006-01-02", dateStr)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid date format. Use YYYY-MM-DD",
			})
		}
		date = &parsedDate
	}

	meals, err := h.mealService.GetMeals(c.Context(), userID, date)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get meals",
		})
	}

	return c.JSON(meals)
}

// CreateMeal creates a new meal
// @Summary Create meal
// @Description Create a new meal for the authenticated user
// @Tags meals
// @Accept json
// @Produce json
// @Security Bearer
// @Param request body entity.CreateMealRequest true "Create meal request"
// @Success 201 {object} entity.Meal
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /api/v1/meals [post]
func (h *MealHandler) CreateMeal(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	var req entity.CreateMealRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	meal, err := h.mealService.CreateMeal(c.Context(), userID, &req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create meal",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(meal)
}

// GetMealByID gets a meal by ID
// @Summary Get meal by ID
// @Description Get a specific meal by ID
// @Tags meals
// @Produce json
// @Security Bearer
// @Param id path string true "Meal ID"
// @Success 200 {object} entity.Meal
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /api/v1/meals/{id} [get]
func (h *MealHandler) GetMealByID(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	mealID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid meal ID",
		})
	}

	meal, err := h.mealService.GetMealByID(c.Context(), mealID, userID)
	if err != nil {
		if err == repository.ErrUserNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Meal not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get meal",
		})
	}

	return c.JSON(meal)
}

// UpdateMeal updates a meal
// @Summary Update meal
// @Description Update a meal
// @Tags meals
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path string true "Meal ID"
// @Param request body entity.UpdateMealRequest true "Update meal request"
// @Success 200 {object} entity.Meal
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /api/v1/meals/{id} [put]
func (h *MealHandler) UpdateMeal(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	mealID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid meal ID",
		})
	}

	var req entity.UpdateMealRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	meal, err := h.mealService.UpdateMeal(c.Context(), mealID, userID, &req)
	if err != nil {
		if err == repository.ErrUserNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Meal not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update meal",
		})
	}

	return c.JSON(meal)
}

// DeleteMeal deletes a meal
// @Summary Delete meal
// @Description Delete a meal
// @Tags meals
// @Produce json
// @Security Bearer
// @Param id path string true "Meal ID"
// @Success 200 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /api/v1/meals/{id} [delete]
func (h *MealHandler) DeleteMeal(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	mealID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid meal ID",
		})
	}

	if err := h.mealService.DeleteMeal(c.Context(), mealID, userID); err != nil {
		if err == repository.ErrUserNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Meal not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete meal",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Meal deleted successfully",
	})
}

// GetDailyStats gets daily nutrition stats
// @Summary Get daily stats
// @Description Get daily nutrition stats for a specific date
// @Tags meals
// @Produce json
// @Security Bearer
// @Param date path string true "Date (YYYY-MM-DD format)"
// @Success 200 {object} entity.DailyStats
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /api/v1/meals/daily/{date} [get]
func (h *MealHandler) GetDailyStats(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	dateStr := c.Params("date")
	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid date format. Use YYYY-MM-DD",
		})
	}

	stats, err := h.mealService.GetDailyStats(c.Context(), userID, date)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get daily stats",
		})
	}

	return c.JSON(stats)
}

// Favorite foods handlers

// GetFavorites gets favorite foods
// @Summary Get favorites
// @Description Get favorite foods for the authenticated user
// @Tags favorites
// @Produce json
// @Security Bearer
// @Success 200 {array} entity.FavoriteFood
// @Failure 401 {object} map[string]string
// @Router /api/v1/favorites [get]
func (h *MealHandler) GetFavorites(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	favorites, err := h.mealService.GetFavorites(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get favorites",
		})
	}

	return c.JSON(favorites)
}

// AddFavorite adds a favorite food
// @Summary Add favorite
// @Description Add a food to favorites
// @Tags favorites
// @Accept json
// @Produce json
// @Security Bearer
// @Param request body entity.AddFavoriteRequest true "Add favorite request"
// @Success 201 {object} entity.FavoriteFood
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /api/v1/favorites [post]
func (h *MealHandler) AddFavorite(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	var req entity.AddFavoriteRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	fav, err := h.mealService.AddFavorite(c.Context(), userID, &req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to add favorite",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fav)
}

// RemoveFavorite removes a favorite food
// @Summary Remove favorite
// @Description Remove a food from favorites
// @Tags favorites
// @Produce json
// @Security Bearer
// @Param id path string true "Food ID"
// @Success 200 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /api/v1/favorites/{id} [delete]
func (h *MealHandler) RemoveFavorite(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	foodID := c.Params("id")
	if foodID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid food ID",
		})
	}

	if err := h.mealService.RemoveFavorite(c.Context(), userID, foodID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to remove favorite",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Favorite removed successfully",
	})
}

// Custom foods handlers

// GetCustomFoods gets custom foods
// @Summary Get custom foods
// @Description Get custom foods for the authenticated user
// @Tags custom-foods
// @Produce json
// @Security Bearer
// @Success 200 {array} entity.CustomFood
// @Failure 401 {object} map[string]string
// @Router /api/v1/custom-foods [get]
func (h *MealHandler) GetCustomFoods(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	foods, err := h.mealService.GetCustomFoods(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get custom foods",
		})
	}

	return c.JSON(foods)
}

// CreateCustomFood creates a custom food
// @Summary Create custom food
// @Description Create a new custom food
// @Tags custom-foods
// @Accept json
// @Produce json
// @Security Bearer
// @Param request body entity.CreateCustomFoodRequest true "Create custom food request"
// @Success 201 {object} entity.CustomFood
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /api/v1/custom-foods [post]
func (h *MealHandler) CreateCustomFood(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	var req entity.CreateCustomFoodRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	food, err := h.mealService.CreateCustomFood(c.Context(), userID, &req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create custom food",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(food)
}

// DeleteCustomFood deletes a custom food
// @Summary Delete custom food
// @Description Delete a custom food
// @Tags custom-foods
// @Produce json
// @Security Bearer
// @Param id path string true "Custom Food ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /api/v1/custom-foods/{id} [delete]
func (h *MealHandler) DeleteCustomFood(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	foodID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid food ID",
		})
	}

	if err := h.mealService.DeleteCustomFood(c.Context(), foodID, userID); err != nil {
		if err == repository.ErrUserNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Custom food not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete custom food",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Custom food deleted successfully",
	})
}

// getUserID gets user ID from context
func getUserID(c *fiber.Ctx) uuid.UUID {
	userIDStr := c.Locals("user_id")
	if userIDStr == nil {
		return uuid.Nil
	}
	userID, _ := uuid.Parse(userIDStr.(string))
	return userID
}

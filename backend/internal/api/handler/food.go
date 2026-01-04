package handler

import (
	"strconv"

	"github.com/bytetrack/backend/internal/domain/service"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// FoodHandler handles food HTTP requests
type FoodHandler struct {
	foodService *service.FoodService
}

// NewFoodHandler creates a new food handler
func NewFoodHandler(foodService *service.FoodService) *FoodHandler {
	return &FoodHandler{
		foodService: foodService,
	}
}

// SearchFoods searches foods
// @Summary Search foods
// @Description Search foods combining Thai foods and Open Food Facts API
// @Tags foods
// @Produce json
// @Security Bearer
// @Param q query string true "Search query"
// @Param page query int false "Page number" default(1)
// @Param category query string false "Category filter" default(all)
// @Success 200 {object} entity.SearchResult
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /api/v1/foods/search [get]
func (h *FoodHandler) SearchFoods(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	query := c.Query("q")
	if query == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Search query is required",
		})
	}

	page := 1
	if pageStr := c.Query("page"); pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	category := c.Query("category", "all")

	result, err := h.foodService.SearchFoods(c.Context(), userID, query, page, category)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to search foods",
		})
	}

	return c.JSON(result)
}

// GetThaiFoods gets Thai foods
// @Summary Get Thai foods
// @Description Get all Thai foods or filter by category
// @Tags foods
// @Produce json
// @Security Bearer
// @Param category query string false "Category filter" default(all)
// @Success 200 {array} entity.FoodItem
// @Failure 401 {object} map[string]string
// @Router /api/v1/foods/thai [get]
func (h *FoodHandler) GetThaiFoods(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	category := c.Query("category", "all")

	foods, err := h.foodService.GetThaiFoods(c.Context(), category)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get Thai foods",
		})
	}

	return c.JSON(foods)
}

// LookupBarcode looks up a food by barcode
// @Summary Lookup barcode
// @Description Look up a food product by barcode using Open Food Facts API
// @Tags foods
// @Produce json
// @Security Bearer
// @Param barcode path string true "Barcode"
// @Success 200 {object} entity.FoodItem
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /api/v1/foods/barcode/{barcode} [get]
func (h *FoodHandler) LookupBarcode(c *fiber.Ctx) error {
	userID := getUserID(c)
	if userID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	barcode := c.Params("barcode")
	if barcode == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Barcode is required",
		})
	}

	food, err := h.foodService.LookupBarcode(c.Context(), barcode)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	return c.JSON(food)
}

// GetCategories gets food categories
// @Summary Get categories
// @Description Get all food categories
// @Tags foods
// @Produce json
// @Success 200 {array} entity.FoodCategory
// @Router /api/v1/foods/categories [get]
func (h *FoodHandler) GetCategories(c *fiber.Ctx) error {
	categories := h.foodService.GetFoodCategories()
	return c.JSON(categories)
}

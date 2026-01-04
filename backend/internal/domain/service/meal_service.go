package service

import (
	"context"
	"time"

	"github.com/bytetrack/backend/internal/domain/entity"
	"github.com/bytetrack/backend/internal/infrastructure/repository"
	"github.com/google/uuid"
)

// MealService handles meal operations
type MealService struct {
	mealRepo *repository.MealRepository
}

// NewMealService creates a new meal service
func NewMealService(mealRepo *repository.MealRepository) *MealService {
	return &MealService{
		mealRepo: mealRepo,
	}
}

// CreateMeal creates a new meal
func (s *MealService) CreateMeal(ctx context.Context, userID uuid.UUID, req *entity.CreateMealRequest) (*entity.Meal, error) {
	meal := &entity.Meal{
		ID:       uuid.New(),
		UserID:   userID,
		Name:     req.Name,
		NameEn:   req.NameEn,
		Calories: req.Calories,
		Grams:    req.Grams,
		MealType: req.MealType,
		Protein:  req.Protein,
		Carbs:    req.Carbs,
		Fat:      req.Fat,
		Fiber:    req.Fiber,
		Sugar:    req.Sugar,
		Sodium:   req.Sodium,
		ImageURL: req.ImageURL,
	}

	// Set date - use provided date or today
	if req.Date != nil {
		meal.Date = *req.Date
	} else {
		meal.Date = time.Now()
	}

	if err := s.mealRepo.Create(ctx, meal); err != nil {
		return nil, err
	}

	return meal, nil
}

// GetMealByID gets a meal by ID
func (s *MealService) GetMealByID(ctx context.Context, mealID, userID uuid.UUID) (*entity.Meal, error) {
	meal, err := s.mealRepo.FindByID(ctx, mealID)
	if err != nil {
		return nil, err
	}

	// Verify ownership
	if meal.UserID != userID {
		return nil, repository.ErrUserNotFound
	}

	return meal, nil
}

// GetMeals gets meals for a user with optional date filter
func (s *MealService) GetMeals(ctx context.Context, userID uuid.UUID, date *time.Time) ([]*entity.Meal, error) {
	return s.mealRepo.FindByUserID(ctx, userID, date)
}

// GetMealsByType gets meals for a user by meal type
func (s *MealService) GetMealsByType(ctx context.Context, userID uuid.UUID, mealType entity.MealType, date *time.Time) ([]*entity.Meal, error) {
	return s.mealRepo.FindByUserIDAndMealType(ctx, userID, mealType, date)
}

// UpdateMeal updates a meal
func (s *MealService) UpdateMeal(ctx context.Context, mealID, userID uuid.UUID, req *entity.UpdateMealRequest) (*entity.Meal, error) {
	meal, err := s.mealRepo.FindByID(ctx, mealID)
	if err != nil {
		return nil, err
	}

	// Verify ownership
	if meal.UserID != userID {
		return nil, repository.ErrUserNotFound
	}

	// Update fields if provided
	if req.Name != nil {
		meal.Name = *req.Name
	}
	if req.NameEn != nil {
		meal.NameEn = *req.NameEn
	}
	if req.Calories != nil {
		meal.Calories = *req.Calories
	}
	if req.Grams != nil {
		meal.Grams = *req.Grams
	}
	if req.MealType != nil {
		meal.MealType = *req.MealType
	}
	if req.Protein != nil {
		meal.Protein = *req.Protein
	}
	if req.Carbs != nil {
		meal.Carbs = *req.Carbs
	}
	if req.Fat != nil {
		meal.Fat = *req.Fat
	}
	if req.Fiber != nil {
		meal.Fiber = req.Fiber
	}
	if req.Sugar != nil {
		meal.Sugar = req.Sugar
	}
	if req.Sodium != nil {
		meal.Sodium = req.Sodium
	}
	if req.ImageURL != nil {
		meal.ImageURL = req.ImageURL
	}
	if req.Date != nil {
		meal.Date = *req.Date
	}

	if err := s.mealRepo.Update(ctx, meal); err != nil {
		return nil, err
	}

	return meal, nil
}

// DeleteMeal deletes a meal
func (s *MealService) DeleteMeal(ctx context.Context, mealID, userID uuid.UUID) error {
	meal, err := s.mealRepo.FindByID(ctx, mealID)
	if err != nil {
		return err
	}

	// Verify ownership
	if meal.UserID != userID {
		return repository.ErrUserNotFound
	}

	return s.mealRepo.Delete(ctx, mealID)
}

// GetDailyStats gets daily nutrition stats for a user
func (s *MealService) GetDailyStats(ctx context.Context, userID uuid.UUID, date time.Time) (*entity.DailyStats, error) {
	meals, err := s.mealRepo.FindByUserID(ctx, userID, &date)
	if err != nil {
		return nil, err
	}

	totals, err := s.mealRepo.GetDailyTotals(ctx, userID, date)
	if err != nil {
		return nil, err
	}

	return &entity.DailyStats{
		Date:   date,
		Meals:  meals,
		Totals: *totals,
	}, nil
}

// Favorite Food operations

// AddFavorite adds a favorite food
func (s *MealService) AddFavorite(ctx context.Context, userID uuid.UUID, req *entity.AddFavoriteRequest) (*entity.FavoriteFood, error) {
	fav := &entity.FavoriteFood{
		ID:           uuid.New(),
		UserID:       userID,
		FoodID:       req.FoodID,
		Name:         req.Name,
		NameEn:       req.NameEn,
		Category:     req.Category,
		Calories:     req.Calories,
		Protein:      req.Protein,
		Carbs:        req.Carbs,
		Fat:          req.Fat,
		Fiber:        req.Fiber,
		Sugar:        req.Sugar,
		Sodium:       req.Sodium,
		ServingSize:  req.ServingSize,
		ServingUnit:  req.ServingUnit,
		Emoji:        req.Emoji,
	}

	if err := s.mealRepo.AddFavorite(ctx, fav); err != nil {
		return nil, err
	}

	return fav, nil
}

// GetFavorites gets favorite foods for a user
func (s *MealService) GetFavorites(ctx context.Context, userID uuid.UUID) ([]*entity.FavoriteFood, error) {
	return s.mealRepo.FindFavorites(ctx, userID)
}

// RemoveFavorite removes a favorite food
func (s *MealService) RemoveFavorite(ctx context.Context, userID uuid.UUID, foodID string) error {
	return s.mealRepo.RemoveFavorite(ctx, userID, foodID)
}

// Custom Food operations

// CreateCustomFood creates a custom food
func (s *MealService) CreateCustomFood(ctx context.Context, userID uuid.UUID, req *entity.CreateCustomFoodRequest) (*entity.CustomFood, error) {
	food := &entity.CustomFood{
		ID:          uuid.New(),
		UserID:      userID,
		Name:        req.Name,
		Calories:    req.Calories,
		Protein:     req.Protein,
		Carbs:       req.Carbs,
		Fat:         req.Fat,
		Fiber:       req.Fiber,
		Sugar:       req.Sugar,
		Sodium:      req.Sodium,
		ServingSize: req.ServingSize,
		ServingUnit: req.ServingUnit,
	}

	if req.ServingUnit == "" {
		food.ServingUnit = "g"
	}
	if food.ServingSize == 0 {
		food.ServingSize = 100
	}

	if err := s.mealRepo.CreateCustomFood(ctx, food); err != nil {
		return nil, err
	}

	return food, nil
}

// GetCustomFoods gets custom foods for a user
func (s *MealService) GetCustomFoods(ctx context.Context, userID uuid.UUID) ([]*entity.CustomFood, error) {
	return s.mealRepo.FindCustomFoods(ctx, userID)
}

// DeleteCustomFood deletes a custom food
func (s *MealService) DeleteCustomFood(ctx context.Context, foodID, userID uuid.UUID) error {
	return s.mealRepo.DeleteCustomFood(ctx, foodID, userID)
}

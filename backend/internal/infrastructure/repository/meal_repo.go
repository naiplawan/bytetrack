package repository

import (
	"context"
	"errors"
	"time"

	"github.com/bytetrack/backend/internal/domain/entity"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

// MealRepository handles meal data operations
type MealRepository struct {
	db DB
}

// NewMealRepository creates a new meal repository
func NewMealRepository(db DB) *MealRepository {
	return &MealRepository{db: db}
}

// Create creates a new meal
func (r *MealRepository) Create(ctx context.Context, meal *entity.Meal) error {
	sql := `
		INSERT INTO meals (id, user_id, name, name_en, calories, grams, meal_type,
			protein, carbs, fat, fiber, sugar, sodium, image_url, date)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
		RETURNING created_at, updated_at
	`

	err := r.db.QueryRow(ctx, sql,
		meal.ID, meal.UserID, meal.Name, meal.NameEn, meal.Calories, meal.Grams, meal.MealType,
		meal.Protein, meal.Carbs, meal.Fat, meal.Fiber, meal.Sugar, meal.Sodium, meal.ImageURL, meal.Date,
	).Scan(&meal.CreatedAt, &meal.UpdatedAt)

	return err
}

// FindByID finds a meal by ID
func (r *MealRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.Meal, error) {
	sql := `
		SELECT id, user_id, name, name_en, calories, grams, meal_type,
			protein, carbs, fat, fiber, sugar, sodium, image_url, date, created_at, updated_at
		FROM meals
		WHERE id = $1
	`

	meal := &entity.Meal{}
	err := r.db.QueryRow(ctx, sql, id).Scan(
		&meal.ID, &meal.UserID, &meal.Name, &meal.NameEn, &meal.Calories, &meal.Grams, &meal.MealType,
		&meal.Protein, &meal.Carbs, &meal.Fat, &meal.Fiber, &meal.Sugar, &meal.Sodium, &meal.ImageURL,
		&meal.Date, &meal.CreatedAt, &meal.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	return meal, nil
}

// FindByUserID finds meals by user ID with optional date filter
func (r *MealRepository) FindByUserID(ctx context.Context, userID uuid.UUID, date *time.Time) ([]*entity.Meal, error) {
	sql := `
		SELECT id, user_id, name, name_en, calories, grams, meal_type,
			protein, carbs, fat, fiber, sugar, sodium, image_url, date, created_at, updated_at
		FROM meals
		WHERE user_id = $1
	`
	args := []interface{}{userID}

	if date != nil {
		sql += " AND date = $2"
		args = append(args, *date)
	}

	sql += " ORDER BY date DESC, created_at DESC"

	rows, err := r.db.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var meals []*entity.Meal
	for rows.Next() {
		meal := &entity.Meal{}
		err := rows.Scan(
			&meal.ID, &meal.UserID, &meal.Name, &meal.NameEn, &meal.Calories, &meal.Grams, &meal.MealType,
			&meal.Protein, &meal.Carbs, &meal.Fat, &meal.Fiber, &meal.Sugar, &meal.Sodium, &meal.ImageURL,
			&meal.Date, &meal.CreatedAt, &meal.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		meals = append(meals, meal)
	}

	return meals, nil
}

// FindByUserIDAndMealType finds meals by user ID and meal type
func (r *MealRepository) FindByUserIDAndMealType(ctx context.Context, userID uuid.UUID, mealType entity.MealType, date *time.Time) ([]*entity.Meal, error) {
	sql := `
		SELECT id, user_id, name, name_en, calories, grams, meal_type,
			protein, carbs, fat, fiber, sugar, sodium, image_url, date, created_at, updated_at
		FROM meals
		WHERE user_id = $1 AND meal_type = $2
	`
	args := []interface{}{userID, mealType}

	if date != nil {
		sql += " AND date = $3"
		args = append(args, *date)
	}

	sql += " ORDER BY date DESC, created_at DESC"

	rows, err := r.db.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var meals []*entity.Meal
	for rows.Next() {
		meal := &entity.Meal{}
		err := rows.Scan(
			&meal.ID, &meal.UserID, &meal.Name, &meal.NameEn, &meal.Calories, &meal.Grams, &meal.MealType,
			&meal.Protein, &meal.Carbs, &meal.Fat, &meal.Fiber, &meal.Sugar, &meal.Sodium, &meal.ImageURL,
			&meal.Date, &meal.CreatedAt, &meal.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		meals = append(meals, meal)
	}

	return meals, nil
}

// Update updates a meal
func (r *MealRepository) Update(ctx context.Context, meal *entity.Meal) error {
	sql := `
		UPDATE meals
		SET name = $2, name_en = $3, calories = $4, grams = $5, meal_type = $6,
			protein = $7, carbs = $8, fat = $9, fiber = $10, sugar = $11, sodium = $12,
			image_url = $13, date = $14
		WHERE id = $1
	`

	_, err := r.db.Exec(ctx, sql,
		meal.ID, meal.Name, meal.NameEn, meal.Calories, meal.Grams, meal.MealType,
		meal.Protein, meal.Carbs, meal.Fat, meal.Fiber, meal.Sugar, meal.Sodium,
		meal.ImageURL, meal.Date,
	)

	return err
}

// Delete deletes a meal
func (r *MealRepository) Delete(ctx context.Context, id uuid.UUID) error {
	sql := `DELETE FROM meals WHERE id = $1`
	_, err := r.db.Exec(ctx, sql, id)
	return err
}

// GetDailyTotals gets daily nutrition totals for a user
func (r *MealRepository) GetDailyTotals(ctx context.Context, userID uuid.UUID, date time.Time) (*entity.DailyMacros, error) {
	sql := `
		SELECT
			COALESCE(SUM(calories), 0) as calories,
			COALESCE(SUM(protein), 0) as protein,
			COALESCE(SUM(carbs), 0) as carbs,
			COALESCE(SUM(fat), 0) as fat
		FROM meals
		WHERE user_id = $1 AND date = $2
	`

	totals := &entity.DailyMacros{}
	err := r.db.QueryRow(ctx, sql, userID, date).Scan(
		&totals.Calories, &totals.Protein, &totals.Carbs, &totals.Fat,
	)

	return totals, err
}

// Favorite Food operations

// AddFavorite adds a favorite food
func (r *MealRepository) AddFavorite(ctx context.Context, fav *entity.FavoriteFood) error {
	sql := `
		INSERT INTO favorite_foods (id, user_id, food_id, name, name_en, category, calories,
			protein, carbs, fat, fiber, sugar, sodium, serving_size, serving_unit, emoji)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
		ON CONFLICT (user_id, food_id) DO NOTHING
		RETURNING created_at
	`

	err := r.db.QueryRow(ctx, sql,
		fav.ID, fav.UserID, fav.FoodID, fav.Name, fav.NameEn, fav.Category, fav.Calories,
		fav.Protein, fav.Carbs, fav.Fat, fav.Fiber, fav.Sugar, fav.Sodium,
		fav.ServingSize, fav.ServingUnit, fav.Emoji,
	).Scan(&fav.CreatedAt)

	return err
}

// FindFavorites finds favorite foods by user ID
func (r *MealRepository) FindFavorites(ctx context.Context, userID uuid.UUID) ([]*entity.FavoriteFood, error) {
	sql := `
		SELECT id, user_id, food_id, name, name_en, category, calories,
			protein, carbs, fat, fiber, sugar, sodium, serving_size, serving_unit, emoji, created_at
		FROM favorite_foods
		WHERE user_id = $1
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(ctx, sql, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var favorites []*entity.FavoriteFood
	for rows.Next() {
		fav := &entity.FavoriteFood{}
		err := rows.Scan(
			&fav.ID, &fav.UserID, &fav.FoodID, &fav.Name, &fav.NameEn, &fav.Category, &fav.Calories,
			&fav.Protein, &fav.Carbs, &fav.Fat, &fav.Fiber, &fav.Sugar, &fav.Sodium,
			&fav.ServingSize, &fav.ServingUnit, &fav.Emoji, &fav.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		favorites = append(favorites, fav)
	}

	return favorites, nil
}

// RemoveFavorite removes a favorite food
func (r *MealRepository) RemoveFavorite(ctx context.Context, userID uuid.UUID, foodID string) error {
	sql := `DELETE FROM favorite_foods WHERE user_id = $1 AND food_id = $2`
	_, err := r.db.Exec(ctx, sql, userID, foodID)
	return err
}

// Custom Food operations

// CreateCustomFood creates a custom food
func (r *MealRepository) CreateCustomFood(ctx context.Context, food *entity.CustomFood) error {
	sql := `
		INSERT INTO custom_foods (id, user_id, name, calories, protein, carbs, fat,
			fiber, sugar, sodium, serving_size, serving_unit)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING created_at, updated_at
	`

	err := r.db.QueryRow(ctx, sql,
		food.ID, food.UserID, food.Name, food.Calories, food.Protein, food.Carbs, food.Fat,
		food.Fiber, food.Sugar, food.Sodium, food.ServingSize, food.ServingUnit,
	).Scan(&food.CreatedAt, &food.UpdatedAt)

	return err
}

// FindCustomFoods finds custom foods by user ID
func (r *MealRepository) FindCustomFoods(ctx context.Context, userID uuid.UUID) ([]*entity.CustomFood, error) {
	sql := `
		SELECT id, user_id, name, calories, protein, carbs, fat,
			fiber, sugar, sodium, serving_size, serving_unit, created_at, updated_at
		FROM custom_foods
		WHERE user_id = $1
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(ctx, sql, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var foods []*entity.CustomFood
	for rows.Next() {
		food := &entity.CustomFood{}
		err := rows.Scan(
			&food.ID, &food.UserID, &food.Name, &food.Calories, &food.Protein, &food.Carbs, &food.Fat,
			&food.Fiber, &food.Sugar, &food.Sodium, &food.ServingSize, &food.ServingUnit,
			&food.CreatedAt, &food.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		foods = append(foods, food)
	}

	return foods, nil
}

// UpdateCustomFood updates a custom food
func (r *MealRepository) UpdateCustomFood(ctx context.Context, food *entity.CustomFood) error {
	sql := `
		UPDATE custom_foods
		SET name = $2, calories = $3, protein = $4, carbs = $5, fat = $6,
			fiber = $7, sugar = $8, sodium = $9, serving_size = $10, serving_unit = $11
		WHERE id = $1 AND user_id = $12
	`

	_, err := r.db.Exec(ctx, sql,
		food.ID, food.Name, food.Calories, food.Protein, food.Carbs, food.Fat,
		food.Fiber, food.Sugar, food.Sodium, food.ServingSize, food.ServingUnit, food.UserID,
	)

	return err
}

// DeleteCustomFood deletes a custom food
func (r *MealRepository) DeleteCustomFood(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	sql := `DELETE FROM custom_foods WHERE id = $1 AND user_id = $2`
	_, err := r.db.Exec(ctx, sql, id, userID)
	return err
}

// Thai Food operations

// FindAllThaiFoods finds all Thai foods
func (r *MealRepository) FindAllThaiFoods(ctx context.Context) ([]*entity.ThaiFood, error) {
	sql := `
		SELECT id, name, name_en, category, calories, protein, carbs, fat,
			fiber, sugar, sodium, serving_size, serving_unit, emoji
		FROM thai_foods
		ORDER BY category, name
	`

	rows, err := r.db.Query(ctx, sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var foods []*entity.ThaiFood
	for rows.Next() {
		food := &entity.ThaiFood{}
		err := rows.Scan(
			&food.ID, &food.Name, &food.NameEn, &food.Category, &food.Calories, &food.Protein,
			&food.Carbs, &food.Fat, &food.Fiber, &food.Sugar, &food.Sodium,
			&food.ServingSize, &food.ServingUnit, &food.Emoji,
		)
		if err != nil {
			return nil, err
		}
		foods = append(foods, food)
	}

	return foods, nil
}

// FindThaiFoodsByCategory finds Thai foods by category
func (r *MealRepository) FindThaiFoodsByCategory(ctx context.Context, category string) ([]*entity.ThaiFood, error) {
	sql := `
		SELECT id, name, name_en, category, calories, protein, carbs, fat,
			fiber, sugar, sodium, serving_size, serving_unit, emoji
		FROM thai_foods
		WHERE category = $1
		ORDER BY name
	`

	rows, err := r.db.Query(ctx, sql, category)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var foods []*entity.ThaiFood
	for rows.Next() {
		food := &entity.ThaiFood{}
		err := rows.Scan(
			&food.ID, &food.Name, &food.NameEn, &food.Category, &food.Calories, &food.Protein,
			&food.Carbs, &food.Fat, &food.Fiber, &food.Sugar, &food.Sodium,
			&food.ServingSize, &food.ServingUnit, &food.Emoji,
		)
		if err != nil {
			return nil, err
		}
		foods = append(foods, food)
	}

	return foods, nil
}

// SearchThaiFoods searches Thai foods by name
func (r *MealRepository) SearchThaiFoods(ctx context.Context, query string) ([]*entity.ThaiFood, error) {
	sql := `
		SELECT id, name, name_en, category, calories, protein, carbs, fat,
			fiber, sugar, sodium, serving_size, serving_unit, emoji
		FROM thai_foods
		WHERE name ILIKE '%' || $1 || '%' OR name_en ILIKE '%' || $1 || '%'
		ORDER BY name
		LIMIT 50
	`

	rows, err := r.db.Query(ctx, sql, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var foods []*entity.ThaiFood
	for rows.Next() {
		food := &entity.ThaiFood{}
		err := rows.Scan(
			&food.ID, &food.Name, &food.NameEn, &food.Category, &food.Calories, &food.Protein,
			&food.Carbs, &food.Fat, &food.Fiber, &food.Sugar, &food.Sodium,
			&food.ServingSize, &food.ServingUnit, &food.Emoji,
		)
		if err != nil {
			return nil, err
		}
		foods = append(foods, food)
	}

	return foods, nil
}

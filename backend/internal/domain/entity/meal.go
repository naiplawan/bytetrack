package entity

import (
	"time"

	"github.com/google/uuid"
)

// MealType represents the type of meal
type MealType string

const (
	MealTypeBreakfast MealType = "breakfast"
	MealTypeLunch     MealType = "lunch"
	MealTypeDinner    MealType = "dinner"
	MealTypeSnack     MealType = "snack"
)

// Meal represents a meal entry
type Meal struct {
	ID        uuid.UUID `json:"id" db:"id"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	Name      string    `json:"name" db:"name"`
	NameEn    string    `json:"name_en" db:"name_en"`

	Calories int     `json:"calories" db:"calories"`
	Grams    float64 `json:"grams" db:"grams"`
	MealType MealType `json:"meal_type" db:"meal_type"`

	// Nutrition breakdown
	Protein float64 `json:"protein" db:"protein"`
	Carbs   float64 `json:"carbs" db:"carbs"`
	Fat     float64 `json:"fat" db:"fat"`
	Fiber   *float64 `json:"fiber,omitempty" db:"fiber"`
	Sugar   *float64 `json:"sugar,omitempty" db:"sugar"`
	Sodium  *int     `json:"sodium,omitempty" db:"sodium"`

	ImageURL *string    `json:"image_url,omitempty" db:"image_url"`
	Date     time.Time  `json:"date" db:"date"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// CreateMealRequest represents a request to create a meal
type CreateMealRequest struct {
	Name      string    `json:"name" validate:"required"`
	NameEn    string    `json:"name_en,omitempty"`
	Calories  int       `json:"calories" validate:"required,min=0"`
	Grams     float64   `json:"grams" validate:"required,min=0"`
	MealType  MealType  `json:"meal_type" validate:"required,oneof=breakfast lunch dinner snack"`
	Protein   float64   `json:"protein" validate:"min=0"`
	Carbs     float64   `json:"carbs" validate:"min=0"`
	Fat       float64   `json:"fat" validate:"min=0"`
	Fiber     *float64  `json:"fiber,omitempty"`
	Sugar     *float64  `json:"sugar,omitempty"`
	Sodium    *int      `json:"sodium,omitempty"`
	ImageURL  *string   `json:"image_url,omitempty"`
	Date      *time.Time `json:"date,omitempty"`
}

// UpdateMealRequest represents a request to update a meal
type UpdateMealRequest struct {
	Name      *string   `json:"name,omitempty"`
	NameEn    *string   `json:"name_en,omitempty"`
	Calories  *int      `json:"calories,omitempty"`
	Grams     *float64  `json:"grams,omitempty"`
	MealType  *MealType `json:"meal_type,omitempty"`
	Protein   *float64  `json:"protein,omitempty"`
	Carbs     *float64  `json:"carbs,omitempty"`
	Fat       *float64  `json:"fat,omitempty"`
	Fiber     *float64  `json:"fiber,omitempty"`
	Sugar     *float64  `json:"sugar,omitempty"`
	Sodium    *int      `json:"sodium,omitempty"`
	ImageURL  *string   `json:"image_url,omitempty"`
	Date      *time.Time `json:"date,omitempty"`
}

// DailyMacros represents daily macro totals
type DailyMacros struct {
	Calories int     `json:"calories"`
	Protein  float64 `json:"protein"`
	Carbs    float64 `json:"carbs"`
	Fat      float64 `json:"fat"`
}

// DailyStats represents daily statistics
type DailyStats struct {
	Date   time.Time    `json:"date"`
	Meals  []*Meal      `json:"meals"`
	Totals DailyMacros  `json:"totals"`
}

// FavoriteFood represents a user's favorite food
type FavoriteFood struct {
	ID         uuid.UUID `json:"id" db:"id"`
	UserID     uuid.UUID `json:"user_id" db:"user_id"`
	FoodID     string    `json:"food_id" db:"food_id"`
	Name       string    `json:"name" db:"name"`
	NameEn     string    `json:"name_en" db:"name_en"`
	Category   string    `json:"category" db:"category"`
	Calories   int       `json:"calories" db:"calories"`
	Protein    float64   `json:"protein" db:"protein"`
	Carbs      float64   `json:"carbs" db:"carbs"`
	Fat        float64   `json:"fat" db:"fat"`
	Fiber      *float64  `json:"fiber,omitempty" db:"fiber"`
	Sugar      *float64  `json:"sugar,omitempty" db:"sugar"`
	Sodium     *int      `json:"sodium,omitempty" db:"sodium"`
	ServingSize float64  `json:"serving_size" db:"serving_size"`
	ServingUnit string   `json:"serving_unit" db:"serving_unit"`
	Emoji      *string   `json:"emoji,omitempty" db:"emoji"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

// CustomFood represents a user-created custom food
type CustomFood struct {
	ID            uuid.UUID `json:"id" db:"id"`
	UserID        uuid.UUID `json:"user_id" db:"user_id"`
	Name          string    `json:"name" db:"name"`
	Calories      int       `json:"calories" db:"calories"`
	Protein       float64   `json:"protein" db:"protein"`
	Carbs         float64   `json:"carbs" db:"carbs"`
	Fat           float64   `json:"fat" db:"fat"`
	Fiber         *float64  `json:"fiber,omitempty" db:"fiber"`
	Sugar         *float64  `json:"sugar,omitempty" db:"sugar"`
	Sodium        *int      `json:"sodium,omitempty" db:"sodium"`
	ServingSize   float64   `json:"serving_size" db:"serving_size"`
	ServingUnit   string    `json:"serving_unit" db:"serving_unit"`
	CreatedAt     time.Time `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time `json:"updated_at" db:"updated_at"`
}

// CreateCustomFoodRequest represents a request to create a custom food
type CreateCustomFoodRequest struct {
	Name        string   `json:"name" validate:"required"`
	Calories    int      `json:"calories" validate:"required,min=0"`
	Protein     float64  `json:"protein" validate:"min=0"`
	Carbs       float64  `json:"carbs" validate:"min=0"`
	Fat         float64  `json:"fat" validate:"min=0"`
	Fiber       *float64 `json:"fiber,omitempty"`
	Sugar       *float64 `json:"sugar,omitempty"`
	Sodium      *int     `json:"sodium,omitempty"`
	ServingSize float64  `json:"serving_size"`
	ServingUnit string   `json:"serving_unit"`
}

// AddFavoriteRequest represents a request to add a favorite food
type AddFavoriteRequest struct {
	FoodID       string   `json:"food_id" validate:"required"`
	Name         string   `json:"name" validate:"required"`
	NameEn       string   `json:"name_en" validate:"required"`
	Category     string   `json:"category" validate:"required"`
	Calories     int      `json:"calories" validate:"required,min=0"`
	Protein      float64  `json:"protein" validate:"min=0"`
	Carbs        float64  `json:"carbs" validate:"min=0"`
	Fat          float64  `json:"fat" validate:"min=0"`
	Fiber        *float64 `json:"fiber,omitempty"`
	Sugar        *float64 `json:"sugar,omitempty"`
	Sodium       *int     `json:"sodium,omitempty"`
	ServingSize  float64  `json:"serving_size" validate:"min=0"`
	ServingUnit  string   `json:"serving_unit"`
	Emoji        *string  `json:"emoji,omitempty"`
}

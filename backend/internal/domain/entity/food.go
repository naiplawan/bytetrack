package entity

import (
	"time"

	"github.com/google/uuid"
)

// FoodSource represents where the food data comes from
type FoodSource string

const (
	FoodSourceLocal          FoodSource = "local"
	FoodSourceOpenFoodFacts FoodSource = "openfoodfacts"
	FoodSourceUSDA          FoodSource = "usda"
)

// NutritionInfo represents nutritional information
type NutritionInfo struct {
	Calories     int     `json:"calories"`
	Protein      float64 `json:"protein"`
	Carbs        float64 `json:"carbs"`
	Fat          float64 `json:"fat"`
	Fiber        *float64 `json:"fiber,omitempty"`
	Sugar        *float64 `json:"sugar,omitempty"`
	Sodium       *int     `json:"sodium,omitempty"`
	ServingSize  float64 `json:"serving_size"`
	ServingUnit  string  `json:"serving_unit"`
}

// FoodItem represents a food item
type FoodItem struct {
	ID      string       `json:"id"`
	Name    string       `json:"name"`
	NameEn  string       `json:"name_en"`
	Brand   *string      `json:"brand,omitempty"`
	Category string      `json:"category"`
	Nutrition NutritionInfo `json:"nutrition"`
	Image   *string      `json:"image,omitempty"`
	Barcode *string      `json:"barcode,omitempty"`
	Source  FoodSource   `json:"source"`
	Emoji   *string      `json:"emoji,omitempty"`
}

// ThaiFood represents a Thai food from the local database
type ThaiFood struct {
	ID          string       `json:"id" db:"id"`
	Name        string       `json:"name" db:"name"`
	NameEn      string       `json:"name_en" db:"name_en"`
	Category    string       `json:"category" db:"category"`
	Calories    int          `json:"calories" db:"calories"`
	Protein     float64      `json:"protein" db:"protein"`
	Carbs       float64      `json:"carbs" db:"carbs"`
	Fat         float64      `json:"fat" db:"fat"`
	Fiber       *float64     `json:"fiber,omitempty" db:"fiber"`
	Sugar       *float64     `json:"sugar,omitempty" db:"sugar"`
	Sodium      *int         `json:"sodium,omitempty" db:"sodium"`
	ServingSize float64      `json:"serving_size" db:"serving_size"`
	ServingUnit string       `json:"serving_unit" db:"serving_unit"`
	Emoji       *string      `json:"emoji,omitempty" db:"emoji"`
}

// ToFoodItem converts ThaiFood to FoodItem
func (t *ThaiFood) ToFoodItem() FoodItem {
	return FoodItem{
		ID:       t.ID,
		Name:     t.Name,
		NameEn:   t.NameEn,
		Category: t.Category,
		Nutrition: NutritionInfo{
			Calories:    t.Calories,
			Protein:     t.Protein,
			Carbs:       t.Carbs,
			Fat:         t.Fat,
			Fiber:       t.Fiber,
			Sugar:       t.Sugar,
			Sodium:      t.Sodium,
			ServingSize: t.ServingSize,
			ServingUnit: t.ServingUnit,
		},
		Source: FoodSourceLocal,
		Emoji:  t.Emoji,
	}
}

// FoodCategory represents a food category
type FoodCategory struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	NameEn string `json:"name_en"`
	Icon   string `json:"icon"`
}

// SearchResult represents search results
type SearchResult struct {
	Foods   []FoodItem `json:"foods"`
	Total   int        `json:"total"`
	Page    int        `json:"page"`
	HasMore bool       `json:"has_more"`
}

// OpenFoodFactsCache represents cached Open Food Facts data
type OpenFoodFactsCache struct {
	Barcode     string       `json:"barcode" db:"barcode"`
	ProductData []byte       `json:"product_data" db:"product_data"` // JSONB
	CachedAt    time.Time    `json:"cached_at" db:"cached_at"`
	ExpiresAt   time.Time    `json:"expires_at" db:"expires_at"`

	// Indexed fields for faster queries
	Name       *string `json:"name,omitempty" db:"name"`
	Brand      *string `json:"brand,omitempty" db:"brand"`
	Calories   *int    `json:"calories,omitempty" db:"calories"`
	Protein    *float64 `json:"protein,omitempty" db:"protein"`
	Carbs      *float64 `json:"carbs,omitempty" db:"carbs"`
	Fat        *float64 `json:"fat,omitempty" db:"fat"`
	ImageURL   *string `json:"image_url,omitempty" db:"image_url"`
}

// OnboardingRequest represents the onboarding data
type OnboardingRequest struct {
	Age           int         `json:"age" validate:"required,min=18,max=100"`
	Gender        Gender      `json:"gender" validate:"required,oneof=male female other"`
	Height        float64     `json:"height" validate:"required,min=100,max=250"`
	Weight        float64     `json:"weight" validate:"required,min=30,max=300"`
	GoalWeight    float64     `json:"goal_weight" validate:"min=30,max=300"`
	ActivityLevel ActivityLevel `json:"activity_level" validate:"required,oneof=sedentary light moderate very extreme"`
	Goal          Goal        `json:"goal" validate:"required,oneof=lose maintain gain"`
}

// OnboardingResponse represents the response after completing onboarding
type OnboardingResponse struct {
	UserID         uuid.UUID    `json:"user_id"`
	BMR            int          `json:"bmr"`
	TDEE           int          `json:"tdee"`
	TargetCalories int          `json:"target_calories"`
	ProteinTarget  int          `json:"protein_target"`
	CarbsTarget    int          `json:"carbs_target"`
	FatTarget      int          `json:"fat_target"`
}

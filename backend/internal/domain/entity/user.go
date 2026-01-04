package entity

import (
	"time"

	"github.com/google/uuid"
)

// User represents a user account
type User struct {
	ID           uuid.UUID `json:"id" db:"id"`
	Email        string    `json:"email" db:"email"`
	PasswordHash string    `json:"-" db:"password_hash"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

// Gender represents user gender
type Gender string

const (
	GenderMale   Gender = "male"
	GenderFemale Gender = "female"
	GenderOther  Gender = "other"
)

// ActivityLevel represents user activity level
type ActivityLevel string

const (
	ActivitySedentary ActivityLevel = "sedentary"
	ActivityLight    ActivityLevel = "light"
	ActivityModerate ActivityLevel = "moderate"
	ActivityVery     ActivityLevel = "very"
	ActivityExtreme  ActivityLevel = "extreme"
)

// ActivityFactors maps activity levels to TDEE multipliers
var ActivityFactors = map[ActivityLevel]float64{
	ActivitySedentary: 1.2,
	ActivityLight:    1.375,
	ActivityModerate: 1.55,
	ActivityVery:     1.725,
	ActivityExtreme:  1.9,
}

// Goal represents user's fitness goal
type Goal string

const (
	GoalLose      Goal = "lose"
	GoalMaintain  Goal = "maintain"
	GoalGain      Goal = "gain"
)

// MacroTargets represents macronutrient targets
type MacroTargets struct {
	Protein        int `json:"protein"`
	Carbs          int `json:"carbs"`
	Fat            int `json:"fat"`
	ProteinCalories int `json:"protein_calories"`
	CarbsCalories   int `json:"carbs_calories"`
	FatCalories     int `json:"fat_calories"`
}

// UserProfile represents user's profile from onboarding
type UserProfile struct {
	UserID     uuid.UUID `json:"user_id" db:"user_id"`
	Age        int       `json:"age" db:"age"`
	Gender     Gender    `json:"gender" db:"gender"`
	Height     float64   `json:"height" db:"height"`
	Weight     float64   `json:"weight" db:"weight"`
	GoalWeight *float64  `json:"goal_weight" db:"goal_weight"`

	ActivityLevel     ActivityLevel `json:"activity_level" db:"activity_level"`
	Goal              Goal          `json:"goal" db:"goal"`
	PreferredLanguage string        `json:"preferred_language" db:"preferred_language"`

	// Calculated values
	BMR            int           `json:"bmr" db:"bmr"`
	TDEE           int           `json:"tdee" db:"tdee"`
	TargetCalories int           `json:"target_calories" db:"target_calories"`
	ProteinTarget  int           `json:"protein_target" db:"protein_target"`
	CarbsTarget    int           `json:"carbs_target" db:"carbs_target"`
	FatTarget      int           `json:"fat_target" db:"fat_target"`
	ProteinCalories int          `json:"protein_calories" db:"protein_calories"`
	CarbsCalories   int          `json:"carbs_calories" db:"carbs_calories"`
	FatCalories     int          `json:"fat_calories" db:"fat_calories"`

	CompletedOnboarding bool      `json:"completed_onboarding" db:"completed_onboarding"`
	CreatedAt           time.Time `json:"created_at" db:"created_at"`
	UpdatedAt           time.Time `json:"updated_at" db:"updated_at"`
}

// RegisterRequest represents user registration request
type RegisterRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

// LoginRequest represents user login request
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// AuthResponse represents authentication response
type AuthResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int64  `json:"expires_in"`
	User         *User  `json:"user"`
}

// TokenResponse represents token refresh response
type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int64  `json:"expires_in"`
}

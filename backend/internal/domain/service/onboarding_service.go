package service

import (
	"context"

	"github.com/bytetrack/backend/internal/domain/entity"
	"github.com/bytetrack/backend/internal/infrastructure/repository"
	"github.com/google/uuid"
)

// OnboardingService handles onboarding operations
type OnboardingService struct {
	userRepo        *repository.UserRepository
	calorieService  *CalorieService
}

// NewOnboardingService creates a new onboarding service
func NewOnboardingService(userRepo *repository.UserRepository, calorieService *CalorieService) *OnboardingService {
	return &OnboardingService{
		userRepo:       userRepo,
		calorieService: calorieService,
	}
}

// CompleteOnboarding completes the onboarding process
func (s *OnboardingService) CompleteOnboarding(ctx context.Context, userID uuid.UUID, req *entity.OnboardingRequest) (*entity.OnboardingResponse, error) {
	// Calculate profile metrics
	calculations := s.calorieService.CalculateProfile(req)

	// Create user profile
	profile := &entity.UserProfile{
		UserID:             userID,
		Age:                req.Age,
		Gender:             req.Gender,
		Height:             req.Height,
		Weight:             req.Weight,
		GoalWeight:         &req.GoalWeight,
		ActivityLevel:      req.ActivityLevel,
		Goal:               req.Goal,
		PreferredLanguage:  "th", // Default to Thai
		BMR:                calculations.BMR,
		TDEE:               calculations.TDEE,
		TargetCalories:     calculations.TargetCalories,
		ProteinTarget:      calculations.ProteinTarget,
		CarbsTarget:        calculations.CarbsTarget,
		FatTarget:          calculations.FatTarget,
		ProteinCalories:    calculations.ProteinTarget * 4,
		CarbsCalories:      calculations.CarbsTarget * 4,
		FatCalories:        calculations.FatTarget * 9,
		CompletedOnboarding: true,
	}

	if err := s.userRepo.CreateProfile(ctx, profile); err != nil {
		return nil, err
	}

	return &entity.OnboardingResponse{
		UserID:         userID,
		BMR:            calculations.BMR,
		TDEE:           calculations.TDEE,
		TargetCalories: calculations.TargetCalories,
		ProteinTarget:  calculations.ProteinTarget,
		CarbsTarget:    calculations.CarbsTarget,
		FatTarget:      calculations.FatTarget,
	}, nil
}

// GetOnboardingStatus gets the onboarding status for a user
func (s *OnboardingService) GetOnboardingStatus(ctx context.Context, userID uuid.UUID) (*entity.UserProfile, error) {
	profile, err := s.userRepo.FindProfileByUserID(ctx, userID)
	if err != nil {
		if err == repository.ErrUserNotFound {
			// No profile exists, onboarding not completed
			return &entity.UserProfile{
				UserID:             userID,
				CompletedOnboarding: false,
			}, nil
		}
		return nil, err
	}

	return profile, nil
}

// UpdateProfile updates a user's profile
func (s *OnboardingService) UpdateProfile(ctx context.Context, userID uuid.UUID, req *entity.OnboardingRequest) (*entity.OnboardingResponse, error) {
	// Calculate new profile metrics
	calculations := s.calorieService.CalculateProfile(req)

	// Update user profile
	profile := &entity.UserProfile{
		UserID:             userID,
		Age:                req.Age,
		Gender:             req.Gender,
		Height:             req.Height,
		Weight:             req.Weight,
		GoalWeight:         &req.GoalWeight,
		ActivityLevel:      req.ActivityLevel,
		Goal:               req.Goal,
		BMR:                calculations.BMR,
		TDEE:               calculations.TDEE,
		TargetCalories:     calculations.TargetCalories,
		ProteinTarget:      calculations.ProteinTarget,
		CarbsTarget:        calculations.CarbsTarget,
		FatTarget:          calculations.FatTarget,
		ProteinCalories:    calculations.ProteinTarget * 4,
		CarbsCalories:      calculations.CarbsTarget * 4,
		FatCalories:        calculations.FatTarget * 9,
		CompletedOnboarding: true,
	}

	if err := s.userRepo.UpdateProfile(ctx, profile); err != nil {
		return nil, err
	}

	return &entity.OnboardingResponse{
		UserID:         userID,
		BMR:            calculations.BMR,
		TDEE:           calculations.TDEE,
		TargetCalories: calculations.TargetCalories,
		ProteinTarget:  calculations.ProteinTarget,
		CarbsTarget:    calculations.CarbsTarget,
		FatTarget:      calculations.FatTarget,
	}, nil
}

package service

import (
	"math"

	"github.com/bytetrack/backend/internal/domain/entity"
)

// CalorieService handles calorie and nutrition calculations
type CalorieService struct{}

// NewCalorieService creates a new calorie service
func NewCalorieService() *CalorieService {
	return &CalorieService{}
}

// CalculateBMR calculates Basal Metabolic Rate using the Mifflin-St Jeor Equation
// For male: 10*weight + 6.25*height - 5*age + 5
// For female/other: 10*weight + 6.25*height - 5*age - 161
func (s *CalorieService) CalculateBMR(weight, height float64, age int, gender entity.Gender) int {
	base := 10*weight + 6.25*height - 5*float64(age)

	var result float64
	if gender == entity.GenderMale {
		result = base + 5
	} else {
		result = base - 161
	}

	return int(math.Round(result))
}

// CalculateTDEE calculates Total Daily Energy Expenditure
// using activity level multipliers
func (s *CalorieService) CalculateTDEE(bmr int, activityLevel entity.ActivityLevel) int {
	multiplier := 1.2 // default sedentary

	if factor, ok := entity.ActivityFactors[activityLevel]; ok {
		multiplier = factor
	}

	return int(math.Round(float64(bmr) * multiplier))
}

// CalculateTargetCalories calculates daily calorie target based on goal
// lose: TDEE - 500 (500 calorie deficit for ~0.5kg/week loss)
// maintain: TDEE
// gain: TDEE + 500 (500 calorie surplus for ~0.5kg/week gain)
func (s *CalorieService) CalculateTargetCalories(tdee int, goal entity.Goal) int {
	switch goal {
	case entity.GoalLose:
		return tdee - 500
	case entity.GoalGain:
		return tdee + 500
	default:
		return tdee
	}
}

// CalculateMacroTargets calculates macronutrient targets based on goal and total calories
func (s *CalorieService) CalculateMacroTargets(targetCalories int, goal entity.Goal) entity.MacroTargets {
	var proteinPercent, carbsPercent, fatPercent float64

	switch goal {
	case entity.GoalLose:
		// Higher protein for muscle preservation
		proteinPercent, carbsPercent, fatPercent = 0.30, 0.40, 0.30
	case entity.GoalGain:
		proteinPercent, carbsPercent, fatPercent = 0.25, 0.50, 0.25
	default:
		// maintain
		proteinPercent, carbsPercent, fatPercent = 0.25, 0.45, 0.30
	}

	proteinCalories := int(math.Round(float64(targetCalories) * proteinPercent))
	carbsCalories := int(math.Round(float64(targetCalories) * carbsPercent))
	fatCalories := int(math.Round(float64(targetCalories) * fatPercent))

	return entity.MacroTargets{
		Protein:        int(math.Round(float64(proteinCalories) / 4)), // 4 calories per gram
		Carbs:          int(math.Round(float64(carbsCalories) / 4)),     // 4 calories per gram
		Fat:            int(math.Round(float64(fatCalories) / 9)),       // 9 calories per gram
		ProteinCalories: proteinCalories,
		CarbsCalories:   carbsCalories,
		FatCalories:     fatCalories,
	}
}

// CalculateBMI calculates Body Mass Index
func (s *CalorieService) CalculateBMI(weight, height float64) float64 {
	heightInMeters := height / 100
	bmi := weight / (heightInMeters * heightInMeters)
	return math.Round(bmi*10) / 10
}

// GetBMICategory returns BMI category
func (s *CalorieService) GetBMICategory(bmi float64) string {
	switch {
	case bmi < 18.5:
		return "Underweight"
	case bmi < 25:
		return "Normal weight"
	case bmi < 30:
		return "Overweight"
	default:
		return "Obese"
	}
}

// CalculateIdealWeightRange calculates ideal weight range based on BMI
func (s *CalorieService) CalculateIdealWeightRange(height float64) (min, max float64) {
	heightInMeters := height / 100
	minBMI := 18.5
	maxBMI := 24.9

	min = math.Round(minBMI * heightInMeters * heightInMeters)
	max = math.Round(maxBMI * heightInMeters * heightInMeters)

	return min, max
}

// CalculateWaterIntake calculates daily water intake recommendation in liters
// Base: 33ml per kg of body weight
// Adjusted by activity level
func (s *CalorieService) CalculateWaterIntake(weight float64, activityLevel entity.ActivityLevel) float64 {
	baseWater := weight * 0.033 // 33ml per kg

	activityMultiplier := 1.0
	switch activityLevel {
	case entity.ActivityLight:
		activityMultiplier = 1.1
	case entity.ActivityModerate:
		activityMultiplier = 1.2
	case entity.ActivityVery:
		activityMultiplier = 1.3
	case entity.ActivityExtreme:
		activityMultiplier = 1.4
	}

	water := baseWater * activityMultiplier
	return math.Round(water*10) / 10
}

// MET values for different activities
var metValues = map[string]float64{
	"walking":   3.5,
	"jogging":   7.0,
	"running":   10.0,
	"cycling":   8.0,
	"swimming":  8.0,
	"yoga":      3.0,
	"strength":  6.0,
	"dancing":   5.0,
	"hiking":    6.0,
	"basketball": 8.0,
	"tennis":    7.0,
	"soccer":    10.0,
}

// CalculateCaloriesBurned calculates calories burned from exercise
func (s *CalorieService) CalculateCaloriesBurned(weight float64, activityType string, duration int) int {
	met := 4.0 // default
	if val, ok := metValues[activityType]; ok {
		met = val
	}

	caloriesPerMinute := (met * weight * 3.5) / 200
	return int(math.Round(caloriesPerMinute * float64(duration)))
}

// CalculateWeightChangeTimeline calculates estimated weight loss/gain timeline
func (s *CalorieService) CalculateWeightChangeTimeline(currentWeight, targetWeight float64, weeklyCalorieChange int) (weeks int, months float64, safeRate bool) {
	weightDifference := math.Abs(targetWeight - currentWeight)
	caloriesPerKg := 7700.0 // approximately 7,700 calories per kg
	totalCaloriesNeeded := weightDifference * caloriesPerKg

	weeks = int(math.Ceil(totalCaloriesNeeded / math.Abs(float64(weeklyCalorieChange))))
	months = math.Round((float64(weeks)/4.33)*10) / 10

	// Safe rate is 0.25-1 kg per week
	weeklyWeightChange := math.Abs(float64(weeklyCalorieChange)) / caloriesPerKg
	safeRate = weeklyWeightChange >= 0.25 && weeklyWeightChange <= 1.0

	return weeks, months, safeRate
}

// CalculateProfile calculates all profile metrics from onboarding data
func (s *CalorieService) CalculateProfile(req *entity.OnboardingRequest) *entity.OnboardingResponse {
	bmr := s.CalculateBMR(req.Weight, req.Height, req.Age, req.Gender)
	tdee := s.CalculateTDEE(bmr, req.ActivityLevel)
	targetCalories := s.CalculateTargetCalories(tdee, req.Goal)
	macroTargets := s.CalculateMacroTargets(targetCalories, req.Goal)

	return &entity.OnboardingResponse{
		BMR:            bmr,
		TDEE:           tdee,
		TargetCalories: targetCalories,
		ProteinTarget:  macroTargets.Protein,
		CarbsTarget:    macroTargets.Carbs,
		FatTarget:      macroTargets.Fat,
	}
}

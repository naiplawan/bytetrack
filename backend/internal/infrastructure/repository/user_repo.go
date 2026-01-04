package repository

import (
	"context"
	"errors"

	"github.com/bytetrack/backend/internal/domain/entity"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

var (
	ErrUserNotFound     = errors.New("user not found")
	ErrEmailAlreadyUsed = errors.New("email already used")
)

// UserRepository handles user data operations
type UserRepository struct {
	db DB
}

// DB interface for database operations
type DB interface {
	Exec(ctx context.Context, sql string, arguments ...interface{}) (pgconn.CommandTag, error)
	Query(ctx context.Context, sql string, args ...interface{}) (pgx.Rows, error)
	QueryRow(ctx context.Context, sql string, args ...interface{}) pgx.Row
}

// NewUserRepository creates a new user repository
func NewUserRepository(db DB) *UserRepository {
	return &UserRepository{db: db}
}

// Create creates a new user
func (r *UserRepository) Create(ctx context.Context, user *entity.User) error {
	sql := `
		INSERT INTO users (id, email, password_hash)
		VALUES ($1, $2, $3)
		RETURNING id, created_at, updated_at
	`

	err := r.db.QueryRow(ctx, sql, user.ID, user.Email, user.PasswordHash).Scan(
		&user.ID, &user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		// Check for unique constraint violation
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrEmailAlreadyUsed
		}
		return err
	}

	return nil
}

// FindByEmail finds a user by email
func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*entity.User, error) {
	sql := `
		SELECT id, email, password_hash, created_at, updated_at
		FROM users
		WHERE email = $1
	`

	user := &entity.User{}
	err := r.db.QueryRow(ctx, sql, email).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	return user, nil
}

// FindByID finds a user by ID
func (r *UserRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.User, error) {
	sql := `
		SELECT id, email, password_hash, created_at, updated_at
		FROM users
		WHERE id = $1
	`

	user := &entity.User{}
	err := r.db.QueryRow(ctx, sql, id).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	return user, nil
}

// CreateProfile creates a user profile
func (r *UserRepository) CreateProfile(ctx context.Context, profile *entity.UserProfile) error {
	sql := `
		INSERT INTO user_profiles (
			user_id, age, gender, height, weight, goal_weight,
			activity_level, goal, preferred_language,
			bmr, tdee, target_calories,
			protein_target, carbs_target, fat_target,
			protein_calories, carbs_calories, fat_calories,
			completed_onboarding
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
		RETURNING created_at, updated_at
	`

	err := r.db.QueryRow(ctx, sql,
		profile.UserID, profile.Age, profile.Gender, profile.Height, profile.Weight, profile.GoalWeight,
		profile.ActivityLevel, profile.Goal, profile.PreferredLanguage,
		profile.BMR, profile.TDEE, profile.TargetCalories,
		profile.ProteinTarget, profile.CarbsTarget, profile.FatTarget,
		profile.ProteinCalories, profile.CarbsCalories, profile.FatCalories,
		profile.CompletedOnboarding,
	).Scan(&profile.CreatedAt, &profile.UpdatedAt)

	return err
}

// FindProfileByUserID finds a user profile by user ID
func (r *UserRepository) FindProfileByUserID(ctx context.Context, userID uuid.UUID) (*entity.UserProfile, error) {
	sql := `
		SELECT user_id, age, gender, height, weight, goal_weight,
			   activity_level, goal, preferred_language,
			   bmr, tdee, target_calories,
			   protein_target, carbs_target, fat_target,
			   protein_calories, carbs_calories, fat_calories,
			   completed_onboarding, created_at, updated_at
		FROM user_profiles
		WHERE user_id = $1
	`

	profile := &entity.UserProfile{}
	err := r.db.QueryRow(ctx, sql, userID).Scan(
		&profile.UserID, &profile.Age, &profile.Gender, &profile.Height, &profile.Weight, &profile.GoalWeight,
		&profile.ActivityLevel, &profile.Goal, &profile.PreferredLanguage,
		&profile.BMR, &profile.TDEE, &profile.TargetCalories,
		&profile.ProteinTarget, &profile.CarbsTarget, &profile.FatTarget,
		&profile.ProteinCalories, &profile.CarbsCalories, &profile.FatCalories,
		&profile.CompletedOnboarding, &profile.CreatedAt, &profile.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	return profile, nil
}

// UpdateProfile updates a user profile
func (r *UserRepository) UpdateProfile(ctx context.Context, profile *entity.UserProfile) error {
	sql := `
		UPDATE user_profiles
		SET age = $2, gender = $3, height = $4, weight = $5, goal_weight = $6,
			activity_level = $7, goal = $8, preferred_language = $9,
			bmr = $10, tdee = $11, target_calories = $12,
			protein_target = $13, carbs_target = $14, fat_target = $15,
			protein_calories = $16, carbs_calories = $17, fat_calories = $18,
			completed_onboarding = $19
		WHERE user_id = $1
	`

	_, err := r.db.Exec(ctx, sql,
		profile.UserID, profile.Age, profile.Gender, profile.Height, profile.Weight, profile.GoalWeight,
		profile.ActivityLevel, profile.Goal, profile.PreferredLanguage,
		profile.BMR, profile.TDEE, profile.TargetCalories,
		profile.ProteinTarget, profile.CarbsTarget, profile.FatTarget,
		profile.ProteinCalories, &profile.CarbsCalories, profile.FatCalories,
		profile.CompletedOnboarding,
	)

	return err
}

// SaveRefreshToken saves a refresh token
func (r *UserRepository) SaveRefreshToken(ctx context.Context, userID uuid.UUID, token string, expiresAt interface{}) error {
	sql := `
		INSERT INTO refresh_tokens (user_id, token, expires_at)
		VALUES ($1, $2, $3)
	`

	_, err := r.db.Exec(ctx, sql, userID, token, expiresAt)
	return err
}

// DeleteRefreshTokens deletes all refresh tokens for a user
func (r *UserRepository) DeleteRefreshTokens(ctx context.Context, userID uuid.UUID) error {
	sql := `DELETE FROM refresh_tokens WHERE user_id = $1`
	_, err := r.db.Exec(ctx, sql, userID)
	return err
}

// FindRefreshToken finds a refresh token
func (r *UserRepository) FindRefreshToken(ctx context.Context, token string) (uuid.UUID, error) {
	sql := `SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()`
	var userID uuid.UUID
	err := r.db.QueryRow(ctx, sql, token).Scan(&userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return uuid.Nil, ErrUserNotFound
		}
		return uuid.Nil, err
	}
	return userID, nil
}

// DeleteRefreshToken deletes a specific refresh token
func (r *UserRepository) DeleteRefreshToken(ctx context.Context, token string) error {
	sql := `DELETE FROM refresh_tokens WHERE token = $1`
	_, err := r.db.Exec(ctx, sql, token)
	return err
}

// CleanupExpiredTokens deletes expired refresh tokens
func (r *UserRepository) CleanupExpiredTokens(ctx context.Context) error {
	sql := `DELETE FROM refresh_tokens WHERE expires_at <= NOW()`
	_, err := r.db.Exec(ctx, sql)
	return err
}

package service

import (
	"context"
	"errors"
	"time"

	"github.com/bytetrack/backend/internal/domain/entity"
	"github.com/bytetrack/backend/internal/infrastructure/repository"
	"github.com/bytetrack/backend/internal/pkg/jwt"
	"github.com/bytetrack/backend/internal/pkg/password"
	"github.com/google/uuid"
)

var (
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrUserExists         = errors.New("user already exists")
)

// AuthService handles authentication operations
type AuthService struct {
	userRepo   *repository.UserRepository
	jwtManager *jwt.Manager
}

// NewAuthService creates a new auth service
func NewAuthService(userRepo *repository.UserRepository, jwtManager *jwt.Manager) *AuthService {
	return &AuthService{
		userRepo:   userRepo,
		jwtManager: jwtManager,
	}
}

// RegisterResult contains the result of registration
type RegisterResult struct {
	User         *entity.User
	AccessToken  string
	RefreshToken string
	ExpiresIn    int64
}

// Register registers a new user
func (s *AuthService) Register(ctx context.Context, req *entity.RegisterRequest) (*RegisterResult, error) {
	// Validate password
	if err := password.Validate(req.Password); err != nil {
		return nil, err
	}

	// Check if user already exists
	existingUser, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err == nil && existingUser != nil {
		return nil, ErrUserExists
	}

	// Hash password
	hashedPassword, err := password.Hash(req.Password)
	if err != nil {
		return nil, err
	}

	// Create user
	user := &entity.User{
		ID:           uuid.New(),
		Email:        req.Email,
		PasswordHash: hashedPassword,
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		if errors.Is(err, repository.ErrEmailAlreadyUsed) {
			return nil, ErrUserExists
		}
		return nil, err
	}

	// Generate tokens
	accessToken, accessExpiresIn, err := s.jwtManager.GenerateAccessToken(user.ID, user.Email)
	if err != nil {
		return nil, err
	}

	refreshToken, _, err := s.jwtManager.GenerateRefreshToken(user.ID, user.Email)
	if err != nil {
		return nil, err
	}

	// Save refresh token
	expiresAt := time.Now().Add(s.jwtManager.GetRefreshTTL())
	if err := s.userRepo.SaveRefreshToken(ctx, user.ID, refreshToken, expiresAt); err != nil {
		return nil, err
	}

	return &RegisterResult{
		User:         user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    accessExpiresIn,
	}, nil
}

// LoginResult contains the result of login
type LoginResult struct {
	User         *entity.User
	AccessToken  string
	RefreshToken string
	ExpiresIn    int64
}

// Login authenticates a user
func (s *AuthService) Login(ctx context.Context, req *entity.LoginRequest) (*LoginResult, error) {
	// Find user by email
	user, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}

	// Verify password
	if !password.Verify(req.Password, user.PasswordHash) {
		return nil, ErrInvalidCredentials
	}

	// Generate tokens
	accessToken, accessExpiresIn, err := s.jwtManager.GenerateAccessToken(user.ID, user.Email)
	if err != nil {
		return nil, err
	}

	refreshToken, _, err := s.jwtManager.GenerateRefreshToken(user.ID, user.Email)
	if err != nil {
		return nil, err
	}

	// Save refresh token
	expiresAt := time.Now().Add(s.jwtManager.GetRefreshTTL())
	if err := s.userRepo.SaveRefreshToken(ctx, user.ID, refreshToken, expiresAt); err != nil {
		return nil, err
	}

	return &LoginResult{
		User:         user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    accessExpiresIn,
	}, nil
}

// RefreshToken refreshes an access token using a refresh token
func (s *AuthService) RefreshToken(ctx context.Context, refreshToken string) (*entity.TokenResponse, error) {
	// Validate refresh token
	claims, err := s.jwtManager.ValidateToken(refreshToken)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	// Find refresh token in database
	userID, err := s.userRepo.FindRefreshToken(ctx, refreshToken)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	// Generate new tokens
	accessToken, accessExpiresIn, err := s.jwtManager.GenerateAccessToken(userID, claims.Email)
	if err != nil {
		return nil, err
	}

	newRefreshToken, _, err := s.jwtManager.GenerateRefreshToken(userID, claims.Email)
	if err != nil {
		return nil, err
	}

	// Delete old refresh token and save new one
	if err := s.userRepo.DeleteRefreshToken(ctx, refreshToken); err != nil {
		return nil, err
	}

	expiresAt := time.Now().Add(s.jwtManager.GetRefreshTTL())
	if err := s.userRepo.SaveRefreshToken(ctx, userID, newRefreshToken, expiresAt); err != nil {
		return nil, err
	}

	return &entity.TokenResponse{
		AccessToken:  accessToken,
		RefreshToken: newRefreshToken,
		ExpiresIn:    accessExpiresIn,
	}, nil
}

// Logout logs out a user by deleting their refresh tokens
func (s *AuthService) Logout(ctx context.Context, userID uuid.UUID) error {
	return s.userRepo.DeleteRefreshTokens(ctx, userID)
}

// ValidateAccessToken validates an access token and returns the user ID
func (s *AuthService) ValidateAccessToken(tokenString string) (uuid.UUID, error) {
	claims, err := s.jwtManager.ValidateToken(tokenString)
	if err != nil {
		return uuid.Nil, ErrInvalidCredentials
	}
	return claims.UserID, nil
}

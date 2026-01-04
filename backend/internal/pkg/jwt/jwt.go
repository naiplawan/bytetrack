package jwt

import (
	"errors"
	"time"

	"github.com/bytetrack/backend/internal/infrastructure/config"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// Claims represents JWT claims
type Claims struct {
	UserID uuid.UUID `json:"user_id"`
	Email  string    `json:"email"`
	jwt.RegisteredClaims
}

// Manager handles JWT operations
type Manager struct {
	secret      []byte
	accessTTL   time.Duration
	refreshTTL  time.Duration
}

// New creates a new JWT manager
func New(cfg *config.Config) *Manager {
	return &Manager{
		secret:     []byte(cfg.JWT.Secret),
		accessTTL:  cfg.JWT.AccessTTL,
		refreshTTL: cfg.JWT.RefreshTTL,
	}
}

// GenerateAccessToken generates a new access token
func (m *Manager) GenerateAccessToken(userID uuid.UUID, email string) (string, int64, error) {
	return m.generateToken(userID, email, m.accessTTL)
}

// GenerateRefreshToken generates a new refresh token
func (m *Manager) GenerateRefreshToken(userID uuid.UUID, email string) (string, int64, error) {
	return m.generateToken(userID, email, m.refreshTTL)
}

// generateToken generates a new JWT token
func (m *Manager) generateToken(userID uuid.UUID, email string, ttl time.Duration) (string, int64, error) {
	now := time.Now()
	expiresAt := now.Add(ttl)

	claims := &Claims{
		UserID: userID,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(m.secret)
	if err != nil {
		return "", 0, err
	}

	return tokenString, int64(ttl.Seconds()), nil
}

// ValidateToken validates a JWT token and returns the claims
func (m *Manager) ValidateToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return m.secret, nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}

// GetUserIDFromToken extracts user ID from token string without full validation
// (useful for quick lookups, but should always be followed by ValidateToken)
func (m *Manager) GetUserIDFromToken(tokenString string) (uuid.UUID, error) {
	claims, err := m.ValidateToken(tokenString)
	if err != nil {
		return uuid.Nil, err
	}
	return claims.UserID, nil
}

// GetRefreshTTL returns the refresh token TTL duration
func (m *Manager) GetRefreshTTL() time.Duration {
	return m.refreshTTL
}

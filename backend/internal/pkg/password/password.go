package password

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
)

const (
	// DefaultCost is the default bcrypt cost factor
	DefaultCost = bcrypt.DefaultCost
)

// Hash hashes a password using bcrypt
func Hash(password string) (string, error) {
	if password == "" {
		return "", errors.New("password cannot be empty")
	}

	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), DefaultCost)
	if err != nil {
		return "", err
	}

	return string(hashedBytes), nil
}

// Verify verifies a password against a hash
func Verify(password, hash string) bool {
	if password == "" || hash == "" {
		return false
	}

	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// Validate validates a password meets minimum requirements
func Validate(password string) error {
	if len(password) < 8 {
		return errors.New("password must be at least 8 characters long")
	}
	return nil
}

// NeedsRehash checks if a password hash needs to be rehashed
// (e.g., when the cost factor has changed)
func NeedsRehash(hash string) bool {
	cost, err := bcrypt.Cost([]byte(hash))
	return err != nil || cost < DefaultCost
}

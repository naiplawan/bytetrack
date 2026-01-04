package validator

import (
	"github.com/go-playground/validator/v10"
)

// Validator wraps the go-playground validator
type Validator struct {
	validate *validator.Validate
}

// New creates a new validator
func New() *Validator {
	return &Validator{
		validate: validator.New(),
	}
}

// Validate validates a struct
func (v *Validator) Validate(s interface{}) error {
	return v.validate.Struct(s)
}

// ValidateVar validates a single variable
func (v *Validator) ValidateVar(field interface{}, tag string) error {
	return v.validate.Var(field, tag)
}

// Engine returns the underlying validator engine
func (v *Validator) Engine() *validator.Validate {
	return v.validate
}

// Global validator instance
var global = New()

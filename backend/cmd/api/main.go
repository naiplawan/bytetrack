package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/bytetrack/backend/internal/api/handler"
	"github.com/bytetrack/backend/internal/api/middleware"
	"github.com/bytetrack/backend/internal/domain/service"
	"github.com/bytetrack/backend/internal/infrastructure/config"
	"github.com/bytetrack/backend/internal/infrastructure/database"
	"github.com/bytetrack/backend/internal/infrastructure/repository"
	"github.com/bytetrack/backend/internal/pkg/jwt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/requestid"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize database
	db, err := database.New(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Run migrations
	if err := db.RunMigrations(context.Background(), database.GetMigrations()); err != nil {
		log.Printf("Warning: Failed to run migrations: %v", err)
		// Don't fail on migration error, as they might have already been run
	}

	// Initialize dependencies
	jwtManager := jwt.New(cfg)
	userRepo := repository.NewUserRepository(db.Pool)
	mealRepo := repository.NewMealRepository(db.Pool)
	authService := service.NewAuthService(userRepo, jwtManager)
	calorieService := service.NewCalorieService()
	onboardingService := service.NewOnboardingService(userRepo, calorieService)
	mealService := service.NewMealService(mealRepo)
	foodService := service.NewFoodService(mealRepo, cfg.OFF.CacheEnabled)

	// Initialize handlers
	authHandler := handler.NewAuthHandler(authService)
	onboardingHandler := handler.NewOnboardingHandler(onboardingService)
	mealHandler := handler.NewMealHandler(mealService)
	foodHandler := handler.NewFoodHandler(foodService)
	healthHandler := handler.NewHealthHandler(db)

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName:               "ByteTrack API",
		DisableStartupMessage: false,
		ReadTimeout:           30 * time.Second,
		WriteTimeout:          30 * time.Second,
		IdleTimeout:           60 * time.Second,
	})

	// Global middleware
	app.Use(middleware.RecoveryConfig())
	app.Use(middleware.CORSConfig(cfg))
	app.Use(requestid.New())
	app.Use(middleware.RequestID())
	app.Use(middleware.LoggerConfig())

	// Health check routes
	app.Get("/health", healthHandler.Check)
	app.Get("/health/ready", healthHandler.Readiness)
	app.Get("/health/live", healthHandler.Liveness)

	// API v1 routes
	v1 := app.Group("/api/v1")

	// Auth routes (public)
	auth := v1.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Post("/refresh", authHandler.RefreshToken)
	auth.Post("/logout", middleware.AuthMiddleware(jwtManager, authService), authHandler.Logout)

	// User routes (protected)
	user := v1.Group("/user")
	user.Use(middleware.AuthMiddleware(jwtManager, authService))
	user.Get("/profile", onboardingHandler.GetProfile)
	user.Put("/profile", onboardingHandler.UpdateProfile)

	// Onboarding routes (protected)
	onboarding := v1.Group("/onboarding")
	onboarding.Use(middleware.AuthMiddleware(jwtManager, authService))
	onboarding.Post("/complete", onboardingHandler.CompleteOnboarding)
	onboarding.Get("/status", onboardingHandler.GetOnboardingStatus)

	// Meal routes (protected)
	meals := v1.Group("/meals")
	meals.Use(middleware.AuthMiddleware(jwtManager, authService))
	meals.Get("/", mealHandler.GetMeals)
	meals.Post("/", mealHandler.CreateMeal)
	meals.Get("/daily/:date", mealHandler.GetDailyStats)
	meals.Get("/:id", mealHandler.GetMealByID)
	meals.Put("/:id", mealHandler.UpdateMeal)
	meals.Delete("/:id", mealHandler.DeleteMeal)

	// Food routes (protected)
	foods := v1.Group("/foods")
	foods.Get("/categories", foodHandler.GetCategories) // Public endpoint
	foodsAuth := v1.Group("/foods")
	foodsAuth.Use(middleware.AuthMiddleware(jwtManager, authService))
	foodsAuth.Get("/search", foodHandler.SearchFoods)
	foodsAuth.Get("/thai", foodHandler.GetThaiFoods)
	foodsAuth.Get("/barcode/:barcode", foodHandler.LookupBarcode)

	// Favorite foods routes (protected)
	favorites := v1.Group("/favorites")
	favorites.Use(middleware.AuthMiddleware(jwtManager, authService))
	favorites.Get("/", mealHandler.GetFavorites)
	favorites.Post("/", mealHandler.AddFavorite)
	favorites.Delete("/:id", mealHandler.RemoveFavorite)

	// Custom foods routes (protected)
	customFoods := v1.Group("/custom-foods")
	customFoods.Use(middleware.AuthMiddleware(jwtManager, authService))
	customFoods.Get("/", mealHandler.GetCustomFoods)
	customFoods.Post("/", mealHandler.CreateCustomFood)
	customFoods.Delete("/:id", mealHandler.DeleteCustomFood)

	// Start server
	addr := fmt.Sprintf("%s:%s", cfg.Server.Host, cfg.Server.Port)

	// Graceful shutdown
	go func() {
		log.Printf("Starting server on %s", addr)
		if err := app.Listen(addr); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := app.ShutdownWithContext(ctx); err != nil {
		log.Printf("Server shutdown error: %v", err)
	}

	log.Println("Server stopped")
}

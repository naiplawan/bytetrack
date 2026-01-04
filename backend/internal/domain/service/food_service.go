package service

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/bytetrack/backend/internal/domain/entity"
	"github.com/bytetrack/backend/internal/infrastructure/repository"
	"github.com/google/uuid"
)

// FoodService handles food search and operations
type FoodService struct {
	mealRepo *repository.MealRepository
	client   *http.Client
	offCache *OpenFoodFactsCacheService
}

// NewFoodService creates a new food service
func NewFoodService(mealRepo *repository.MealRepository, cacheEnabled bool) *FoodService {
	var offCache *OpenFoodFactsCacheService
	if cacheEnabled {
		offCache = NewOpenFoodFactsCacheService()
	}

	return &FoodService{
		mealRepo: mealRepo,
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
		offCache: offCache,
	}
}

// OpenFoodFactsProduct represents Open Food Facts API product response
type OpenFoodFactsProduct struct {
	Code         string  `json:"code"`
	ProductName  string  `json:"product_name"`
	ProductNameEn string `json:"product_name_en"`
	Brands       string  `json:"brands"`
	Categories   string  `json:"categories"`
	ImageURL     string  `json:"image_url"`
	Nutriments   *Nutriments `json:"nutriments"`
	ServingSize  string  `json:"serving_size"`
	ServingQuantity float64 `json:"serving_quantity"`
}

type Nutriments struct {
	EnergyKcal100g     float64 `json:"energy-kcal_100g"`
	EnergyKcalServing  float64 `json:"energy-kcal_serving"`
	Proteins100g       float64 `json:"proteins_100g"`
	ProteinsServing    float64 `json:"proteins_serving"`
	Carbohydrates100g  float64 `json:"carbohydrates_100g"`
	CarbohydratesServing float64 `json:"carbohydrates_serving"`
	Fat100g            float64 `json:"fat_100g"`
	FatServing         float64 `json:"fat_serving"`
	Fiber100g          float64 `json:"fiber_100g"`
	Sugars100g         float64 `json:"sugars_100g"`
	Sodium100g         float64 `json:"sodium_100g"`
}

// OpenFoodFactsSearchResponse represents Open Food Facts API search response
type OpenFoodFactsSearchResponse struct {
	Count    int                     `json:"count"`
	Page     int                     `json:"page"`
	PageSize int                     `json:"page_size"`
	Products []OpenFoodFactsProduct  `json:"products"`
}

// OpenFoodFactsProductResponse represents single product response
type OpenFoodFactsProductResponse struct {
	Status  int                   `json:"status"`
	Product OpenFoodFactsProduct  `json:"product"`
}

// mapOFFProductToFoodItem maps Open Food Facts product to FoodItem
func mapOFFProductToFoodItem(product OpenFoodFactsProduct) *entity.FoodItem {
	if product.ProductName == "" && product.ProductNameEn == "" {
		return nil
	}

	nutriments := product.Nutriments
	if nutriments == nil {
		nutriments = &Nutriments{}
	}

	// Parse serving size
	servingSize, servingUnit := parseServingSize(product.ServingSize)

	// Use serving values if available, otherwise use per 100g values
	calories := int(nutriments.EnergyKcal100g)
	if nutriments.EnergyKcalServing > 0 && servingSize > 0 {
		calories = int(nutriments.EnergyKcalServing)
	}

	protein := nutriments.Proteins100g
	if nutriments.ProteinsServing > 0 && servingSize > 0 {
		protein = nutriments.ProteinsServing
	}

	carbs := nutriments.Carbohydrates100g
	if nutriments.CarbohydratesServing > 0 && servingSize > 0 {
		carbs = nutriments.CarbohydratesServing
	}

	fat := nutriments.Fat100g
	if nutriments.FatServing > 0 && servingSize > 0 {
		fat = nutriments.FatServing
	}

	name := product.ProductName
	if name == "" {
		name = product.ProductNameEn
	}

	nameEn := product.ProductNameEn
	if nameEn == "" {
		nameEn = product.ProductName
	}

	food := &entity.FoodItem{
		ID:      "off_" + product.Code,
		Name:    name,
		NameEn:  nameEn,
		Category: getCategory(product.Categories),
		Nutrition: entity.NutritionInfo{
			Calories:    calories,
			Protein:     roundToOne(protein),
			Carbs:       roundToOne(carbs),
			Fat:         roundToOne(fat),
			Fiber:       roundToOnePtr(nutriments.Fiber100g),
			Sugar:       roundToOnePtr(nutriments.Sugars100g),
			Sodium:      toIntPtr(nutriments.Sodium100g),
			ServingSize: servingSize,
			ServingUnit: servingUnit,
		},
		Source:  entity.FoodSourceOpenFoodFacts,
		Barcode: &product.Code,
	}

	if product.ImageURL != "" {
		food.Image = &product.ImageURL
	}

	if product.Brands != "" {
		food.Brand = &product.Brands
	}

	return food
}

// parseServingSize parses serving size string
func parseServingSize(servingSize string) (float64, string) {
	if servingSize == "" {
		return 100, "g"
	}

	// Try to parse "100g", "250 ml", etc.
	var size float64
	var unit string
	fmt.Sscanf(servingSize, "%f%s", &size, &unit)

	if size == 0 {
		size = 100
	}
	if unit == "" {
		unit = "g"
	}

	return size, unit
}

// getCategory extracts first category from categories string
func getCategory(categories string) string {
	if categories == "" {
		return "other"
	}
	// Take first category
	for i, c := range categories {
		if c == ',' {
			return categories[:i]
		}
	}
	return categories
}

// roundToOne rounds to 1 decimal place
func roundToOne(val float64) float64 {
	return float64(int(val*10+0.5)) / 10
}

// roundToOnePtr rounds to 1 decimal place and returns pointer
func roundToOnePtr(val float64) *float64 {
	rounded := roundToOne(val)
	return &rounded
}

// toIntPtr converts int to *int
func toIntPtr(val float64) *int {
	if val == 0 {
		return nil
	}
	iv := int(val)
	return &iv
}

// SearchFoods searches foods combining local Thai foods and Open Food Facts API
func (s *FoodService) SearchFoods(ctx context.Context, userID uuid.UUID, query string, page int, category string) (*entity.SearchResult, error) {
	const pageSize = 20

	// Search Thai foods first
	thaiFoods, err := s.mealRepo.SearchThaiFoods(ctx, query)
	if err != nil {
		thaiFoods = []*entity.ThaiFood{}
	}

	// Convert Thai foods to FoodItems
	var foodItems []entity.FoodItem
	for _, tf := range thaiFoods {
		// Filter by category if specified
		if category != "" && category != "all" && tf.Category != category {
			continue
		}
		foodItems = append(foodItems, tf.ToFoodItem())
	}

	// If we have enough local results or it's the first page with local results, return them
	if page == 1 && len(foodItems) >= pageSize {
		return &entity.SearchResult{
			Foods:   foodItems[:pageSize],
			Total:   len(foodItems),
			Page:    page,
			HasMore: len(foodItems) > pageSize,
		}, nil
	}

	// Search Open Food Facts API if needed
	offFoods, err := s.searchOpenFoodFacts(ctx, query, page, pageSize-len(foodItems))
	if err != nil {
		// Log error but return Thai foods anyway
		offFoods = []entity.FoodItem{}
	}

	// Combine results
	if page == 1 {
		foodItems = append(foodItems, offFoods...)
	} else {
		foodItems = offFoods
	}

	return &entity.SearchResult{
		Foods:   foodItems,
		Total:   len(foodItems),
		Page:    page,
		HasMore: len(offFoods) >= pageSize-len(foodItems),
	}, nil
}

// searchOpenFoodFoods searches Open Food Facts API
func (s *FoodService) searchOpenFoodFacts(ctx context.Context, query string, page, pageSize int) ([]entity.FoodItem, error) {
	u, _ := url.Parse("https://world.openfoodfacts.org/cgi/search.pl")
	q := u.Query()
	q.Set("search_terms", query)
	q.Set("search_simple", "1")
	q.Set("action", "process")
	q.Set("json", "1")
	q.Set("page", strconv.Itoa(page))
	q.Set("page_size", strconv.Itoa(pageSize))
	q.Set("fields", "code,product_name,product_name_en,brands,categories,image_url,nutriments,serving_size,serving_quantity")
	u.RawQuery = q.Encode()

	req, _ := http.NewRequestWithContext(ctx, "GET", u.String(), nil)
	req.Header.Set("User-Agent", "ByteTrack/1.0 (https://bytetrack.app)")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var data OpenFoodFactsSearchResponse
	json.Unmarshal(body, &data)

	var foods []entity.FoodItem
	for _, product := range data.Products {
		food := mapOFFProductToFoodItem(product)
		if food != nil {
			foods = append(foods, *food)
		}
	}

	return foods, nil
}

// LookupBarcode looks up a food by barcode
func (s *FoodService) LookupBarcode(ctx context.Context, barcode string) (*entity.FoodItem, error) {
	// Check cache first if enabled
	if s.offCache != nil {
		if cached, err := s.offCache.Get(ctx, barcode); err == nil && cached != nil {
			return cached, nil
		}
	}

	// Call Open Food Facts API
	u := fmt.Sprintf("https://world.openfoodfacts.org/api/v2/product/%s.json", barcode)

	req, _ := http.NewRequestWithContext(ctx, "GET", u, nil)
	req.Header.Set("User-Agent", "ByteTrack/1.0 (https://bytetrack.app)")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var data OpenFoodFactsProductResponse
	json.Unmarshal(body, &data)

	if data.Status != 1 {
		return nil, fmt.Errorf("product not found")
	}

	food := mapOFFProductToFoodItem(data.Product)
	if food == nil {
		return nil, fmt.Errorf("invalid product data")
	}

	// Cache the result if enabled
	if s.offCache != nil {
		s.offCache.Set(ctx, barcode, food, 7*24*time.Hour)
	}

	return food, nil
}

// GetThaiFoods gets all Thai foods
func (s *FoodService) GetThaiFoods(ctx context.Context, category string) ([]entity.FoodItem, error) {
	var thaiFoods []*entity.ThaiFood
	var err error

	if category != "" && category != "all" {
		thaiFoods, err = s.mealRepo.FindThaiFoodsByCategory(ctx, category)
	} else {
		thaiFoods, err = s.mealRepo.FindAllThaiFoods(ctx)
	}

	if err != nil {
		return nil, err
	}

	var foods []entity.FoodItem
	for _, tf := range thaiFoods {
		foods = append(foods, tf.ToFoodItem())
	}

	return foods, nil
}

// GetFoodCategories returns all food categories
func (s *FoodService) GetFoodCategories() []entity.FoodCategory {
	return []entity.FoodCategory{
		{ID: "all", Name: "ทั้งหมด", NameEn: "All", Icon: "🍽️"},
		{ID: "rice", Name: "ข้าว", NameEn: "Rice & Grains", Icon: "🍚"},
		{ID: "noodles", Name: "เส้น", NameEn: "Noodles", Icon: "🍜"},
		{ID: "curry", Name: "แกง", NameEn: "Curry", Icon: "🍛"},
		{ID: "stir-fry", Name: "ผัด", NameEn: "Stir-fry", Icon: "🥘"},
		{ID: "soup", Name: "ต้ม", NameEn: "Soup", Icon: "🍲"},
		{ID: "salad", Name: "ยำ", NameEn: "Salad", Icon: "🥗"},
		{ID: "grilled", Name: "ย่าง", NameEn: "Grilled", Icon: "🍖"},
		{ID: "dessert", Name: "ของหวาน", NameEn: "Dessert", Icon: "🍮"},
	}
}

// OpenFoodFactsCacheService handles caching for Open Food Facts API responses
type OpenFoodFactsCacheService struct {
	// In-memory cache (in production, use Redis)
	cache map[string]*cacheEntry
}

type cacheEntry struct {
	food      *entity.FoodItem
	expiresAt time.Time
}

// NewOpenFoodFactsCacheService creates a new cache service
func NewOpenFoodFactsCacheService() *OpenFoodFactsCacheService {
	return &OpenFoodFactsCacheService{
		cache: make(map[string]*cacheEntry),
	}
}

// Get gets a cached food item
func (c *OpenFoodFactsCacheService) Get(ctx context.Context, barcode string) (*entity.FoodItem, error) {
	entry, ok := c.cache[barcode]
	if !ok {
		return nil, fmt.Errorf("not found")
	}

	if time.Now().After(entry.expiresAt) {
		delete(c.cache, barcode)
		return nil, fmt.Errorf("expired")
	}

	return entry.food, nil
}

// Set caches a food item
func (c *OpenFoodFactsCacheService) Set(ctx context.Context, barcode string, food *entity.FoodItem, ttl time.Duration) {
	c.cache[barcode] = &cacheEntry{
		food:      food,
		expiresAt: time.Now().Add(ttl),
	}
}

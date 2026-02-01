// API Client for ByteTrack Backend
// Centralized HTTP client with authentication and error handling

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error_code?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  page_size: number;
  total: number;
  has_more: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  user_id: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number; // in cm
  weight?: number; // in kg
  target_weight?: number; // in kg
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  goal?: 'lose_weight' | 'maintain_weight' | 'gain_weight';
  target_calories?: number;
  protein_target?: number;
  carb_target?: number;
  fat_target?: number;
  water_target?: number; // glasses per day
  created_at: string;
  updated_at: string;
}

export interface Meal {
  id: string;
  user_id: string;
  name: string;
  calories: number;
  grams: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string; // ISO 8601 format
  protein?: number;
  carbs?: number;
  fat?: number;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface FoodItem {
  id: string | number;
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  category?: string;
  brand?: string;
  image_url?: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  thai_name?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number; // in seconds
}

interface ApiConfig {
  baseURL: string;
  timeout: number;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
  }

  // Set authentication tokens
  setAuth(accessToken: string, refreshToken?: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken ?? null;
  }

  // Clear authentication
  clearAuth() {
    this.accessToken = null;
    this.refreshToken = null;
  }

  // Get HTTP headers
  private getHeaders(includeAuth = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  // Make HTTP request
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    includeAuth = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: this.getHeaders(includeAuth),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result: ApiResponse<T> = await response.json();

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401 && includeAuth) {
          // Try to refresh token if available
          if (this.refreshToken) {
            const refreshed = await this.refreshAuthToken();
            if (refreshed) {
              // Retry the original request
              return this.request(method, endpoint, data, includeAuth);
            }
          }
        }

        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Auth methods
  async register(email: string, password: string, name?: string): Promise<ApiResponse<User>> {
    return this.request('POST', '/api/v1/auth/register', { email, password, name });
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthTokens & { user: User }>> {
    const response = await this.request('POST', '/api/v1/auth/login', { email, password }, false);

    if (response.success && response.data) {
      const data = response.data as AuthTokens & { user: User };
      this.setAuth(data.access_token, data.refresh_token);
      // Store tokens in localStorage for persistence
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
    }

    return response as ApiResponse<AuthTokens & { user: User }>;
  }

  async refreshAuthToken(): Promise<ApiResponse<AuthTokens>> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request('POST', '/api/v1/auth/refresh', { refresh_token: refreshToken }, false);

    if (response.success && response.data) {
      const data = response.data as AuthTokens;
      this.setAuth(data.access_token, data.refresh_token);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
    }

    return response as ApiResponse<AuthTokens>;
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await this.request('POST', '/api/v1/auth/logout');
      return response as ApiResponse<void>;
    } finally {
      this.clearAuth();
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  // User profile methods
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request('GET', '/api/v1/user/profile');
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.request('PUT', '/api/v1/user/profile', profile);
  }

  // Onboarding methods
  async completeOnboarding(profile: UserProfile): Promise<ApiResponse<void>> {
    return this.request('POST', '/api/v1/onboarding/complete', profile);
  }

  async getOnboardingStatus(): Promise<ApiResponse<{ completed: boolean; steps: string[] }>> {
    return this.request('GET', '/api/v1/onboarding/status');
  }

  // Meal methods
  async getMeals(page = 1, pageSize = 20, date?: string): Promise<PaginatedResponse<Meal>> {
    const params = new URLSearchParams({ page: page.toString(), page_size: pageSize.toString() });
    if (date) params.append('date', date);

    const response = await this.request(`GET`, `/api/v1/meals/?${params}`);
    return response as PaginatedResponse<Meal>;
  }

  async createMeal(meal: Omit<Meal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Meal>> {
    return this.request('POST', '/api/v1/meals/', meal);
  }

  async getDailyStats(date: string): Promise<ApiResponse<{
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
    meals: Meal[];
  }>> {
    return this.request('GET', `/api/v1/meals/daily/${date}`);
  }

  async getMealById(id: string): Promise<ApiResponse<Meal>> {
    return this.request('GET', `/api/v1/meals/${id}`);
  }

  async updateMeal(id: string, meal: Partial<Meal>): Promise<ApiResponse<Meal>> {
    return this.request('PUT', `/api/v1/meals/${id}`, meal);
  }

  async deleteMeal(id: string): Promise<ApiResponse<void>> {
    return this.request('DELETE', `/api/v1/meals/${id}`);
  }

  // Food methods
  async getCategories(): Promise<ApiResponse<FoodCategory[]>> {
    return this.request('GET', '/api/v1/foods/categories', undefined, false);
  }

  async searchFoods(query: string, page = 1, pageSize = 20): Promise<PaginatedResponse<FoodItem>> {
    const params = new URLSearchParams({ q: query, page: page.toString(), page_size: pageSize.toString() });
    const response = await this.request(`GET`, `/api/v1/foods/search?${params}`);
    return response as PaginatedResponse<FoodItem>;
  }

  async getThaiFoods(page = 1, pageSize = 20): Promise<PaginatedResponse<FoodItem>> {
    const params = new URLSearchParams({ page: page.toString(), page_size: pageSize.toString() });
    const response = await this.request(`GET`, `/api/v1/foods/thai?${params}`);
    return response as PaginatedResponse<FoodItem>;
  }

  async lookupBarcode(barcode: string): Promise<ApiResponse<FoodItem>> {
    return this.request('GET', `/api/v1/foods/barcode/${barcode}`);
  }

  // Favorite foods methods
  async getFavorites(): Promise<ApiResponse<FoodItem[]>> {
    return this.request('GET', '/api/v1/favorites/');
  }

  async addFavorite(food: FoodItem): Promise<ApiResponse<FoodItem>> {
    return this.request('POST', '/api/v1/favorites/', food);
  }

  async removeFavorite(id: string | number): Promise<ApiResponse<void>> {
    return this.request('DELETE', `/api/v1/favorites/${id}`);
  }

  // Custom foods methods
  async getCustomFoods(): Promise<ApiResponse<FoodItem[]>> {
    return this.request('GET', '/api/v1/custom-foods/');
  }

  async createCustomFood(food: Omit<FoodItem, 'id'>): Promise<ApiResponse<FoodItem>> {
    return this.request('POST', '/api/v1/custom-foods/', food);
  }

  async deleteCustomFood(id: string | number): Promise<ApiResponse<void>> {
    return this.request('DELETE', `/api/v1/custom-foods/${id}`);
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '/api',
  timeout: 10000, // 10 seconds
});

// Initialize auth state from localStorage on app load
export function initializeAuth() {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  if (accessToken && refreshToken) {
    apiClient.setAuth(accessToken, refreshToken);
  }
}
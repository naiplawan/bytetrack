# ByteTrack - Claude Code Context

## Project Overview

ByteTrack is a bilingual (English/Thai) calorie tracking and wellness application with a separated client-server architecture.

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Go Fiber v2, PostgreSQL, JWT authentication
- **Architecture**: Monorepo with separated frontend and backend directories

## Directory Structure

```
bytetrack/
├── frontend/          # Next.js 16 client application
└── backend/           # Go Fiber API server
```

## Key Technologies

### Frontend (`/frontend`)
- **Framework**: Next.js 16.1.1 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with glass morphism effects
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **State**: React Context API

### Backend (`/backend`)
- **Framework**: Go Fiber v2.52.6
- **Database**: PostgreSQL with pgx/v5 driver
- **Authentication**: JWT tokens (access + refresh)
- **Password Hashing**: bcrypt
- **Architecture**: Clean architecture (domain/infrastructure/api layers)

## API Endpoints (Backend)

Base URL: `http://localhost:8080`

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/logout` - Logout user

### User Profile
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile

### Onboarding
- `POST /api/v1/onboarding/complete` - Complete onboarding
- `GET /api/v1/onboarding/status` - Check onboarding status

### Meals
- `GET /api/v1/meals` - Get meals (with date filter)
- `POST /api/v1/meals` - Create meal
- `GET /api/v1/meals/:id` - Get meal by ID
- `PUT /api/v1/meals/:id` - Update meal
- `DELETE /api/v1/meals/:id` - Delete meal
- `GET /api/v1/meals/daily/:date` - Get daily stats

### Foods
- `GET /api/v1/foods/search` - Search foods (local + API)
- `GET /api/v1/foods/thai` - Get Thai foods
- `GET /api/v1/foods/barcode/:barcode` - Lookup by barcode

### Favorites & Custom Foods
- `GET /api/v1/favorites` - Get favorite foods
- `POST /api/v1/favorites` - Add to favorites
- `DELETE /api/v1/favorites/:id` - Remove from favorites
- `GET /api/v1/custom-foods` - Get custom foods
- `POST /api/v1/custom-foods` - Create custom food
- `DELETE /api/v1/custom-foods/:id` - Delete custom food

## Backend Go Structure

```
backend/
├── cmd/api/main.go              # Application entry point
├── internal/
│   ├── api/
│   │   ├── handler/             # HTTP request handlers
│   │   │   ├── auth.go          # Auth handlers
│   │   │   ├── meal.go          # Meal handlers
│   │   │   ├── food.go          # Food handlers
│   │   │   └── user.go          # User handlers
│   │   ├── middleware/          # Middleware
│   │   │   ├── auth.go          # JWT authentication
│   │   │   ├── cors.go          # CORS configuration
│   │   │   └── logger.go        # Request logging
│   │   └── router.go            # Route setup
│   ├── domain/
│   │   ├── entity/              # Domain entities
│   │   │   ├── user.go          # User, UserProfile
│   │   │   ├── meal.go          # Meal, FavoriteFood, CustomFood
│   │   │   └── food.go          # ThaiFood
│   │   └── service/             # Business logic
│   │       ├── auth_service.go  # Authentication logic
│   │       ├── calorie_service.go # BMR/TDEE calculations
│   │       ├── meal_service.go  # Meal CRUD
│   │       ├── food_service.go  # Food search
│   │       └── onboarding_service.go # User onboarding
│   ├── infrastructure/
│   │   ├── config/config.go     # Configuration loading
│   │   ├── database/
│   │   │   └── postgres.go      # DB connection + migrations
│   │   ├── repository/          # Data access layer
│   │   │   ├── user_repo.go     # User repository
│   │   │   ├── meal_repo.go     # Meal repository
│   │   │   └── food_repo.go     # Food repository
│   │   └── external/
│   │       └── openfoodfacts/  # Open Food Facts client
│   └── pkg/
│       ├── jwt/                 # JWT utilities
│       └── password/            # Password hashing (bcrypt)
├── go.mod
└── .env.example
```

## Frontend Structure

```
frontend/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── dashboard/               # Main dashboard
│   ├── meals/                   # Food diary
│   └── onboarding/              # User setup flow
├── components/
│   ├── ui/                      # Reusable UI components
│   ├── dashboard/               # Dashboard-specific components
│   └── onboarding/              # Onboarding step components
├── lib/
│   ├── api-client.ts            # Backend API client (to be created)
│   ├── translations.ts          # i18n translations (EN/TH)
│   └── validations/             # Zod schemas
├── contexts/
│   └── LanguageContext.tsx      # Language state management
└── package.json
```

## Database Schema

### Core Tables
- `users` - Authentication (id, email, password_hash)
- `user_profiles` - Onboarding data (age, gender, height, weight, goals, calculated BMR/TDEE)
- `meals` - Meal entries (id, user_id, name, calories, macros, meal_type, date)
- `favorite_foods` - User favorites (id, user_id, food_id, name, calories, macros)
- `custom_foods` - User-created foods (id, user_id, name, calories, macros)
- `thai_foods` - Local Thai food database (20+ items)
- `refresh_tokens` - JWT refresh tokens (id, user_id, token, expires_at)

## Calorie Calculations (Backend)

Uses Mifflin-St Jeor equation:
- **BMR (Male)**: 10×weight + 6.25×height - 5×age + 5
- **BMR (Female)**: 10×weight + 6.25×height - 5×age - 161
- **TDEE**: BMR × Activity multiplier (1.2-1.9)
- **Target Calories**:
  - Lose weight: TDEE - 500
  - Maintain: TDEE
  - Gain weight: TDEE + 500

## Development Workflow

### Backend Development
```bash
cd backend
cp .env.example .env
# Edit .env with database credentials
go run cmd/api/main.go
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## Language Support

The app supports English (`en`) and Thai (`th`). Translations are in `frontend/lib/translations.ts`.

Use the `LanguageContext` for language state:
```typescript
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

const { language, setLanguage } = useLanguage();
const text = t('key', language);
```

## Important Notes

- Frontend and backend are in separate directories
- Backend uses Go Fiber framework on port 8080
- Frontend uses Next.js on port 3000
- All business logic (calorie calculations, food search) has been moved to backend
- Frontend will need to use API client instead of localStorage (TODO: implement)

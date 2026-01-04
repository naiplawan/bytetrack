# ByteTrack

A modern calorie tracking and wellness application with a separated architecture. Features bilingual support (English/Thai), integration with Open Food Facts API for 3M+ foods, and a beautiful UI inspired by Apple and Spotify design systems.

## Features

### Food Tracking
- **Open Food Facts API Integration**: Access to 3M+ foods worldwide (proxied via backend)
- **Local Thai Food Database**: 20+ authentic Thai dishes with accurate nutrition data
- **Combined Search**: Searches local database first, then API for comprehensive results
- **Barcode Scanning Ready**: API support for barcode lookup
- **Complete Nutrition Data**: Calories, protein, carbs, fat, fiber, sugar, sodium

### User Experience
- **Bilingual Support**: Full English and Thai language switching
- **4-Step Onboarding**: Guided setup with BMR/TDEE calculations
- **Smart Calorie Goals**: Personalized targets based on user goals (lose/maintain/gain)
- **Dark/Light Mode**: System preference detection with manual toggle
- **Smooth Animations**: Framer Motion powered interactions

### Design System
- **40+ UI Components**: Cards, buttons, inputs with multiple variants
- **Glass Morphism Effects**: Modern translucent design elements
- **Responsive Design**: Mobile-first approach, works on all devices
- **Accessibility**: WCAG 2.1 AA compliant

## Architecture

ByteTrack uses a separated client-server architecture:

```
bytetrack/
├── frontend/          # Next.js 16 client application
└── backend/           # Go Fiber API server
```

## Tech Stack

### Frontend
| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1.1 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| State | React Context |

### Backend
| Category | Technology |
|----------|------------|
| Framework | Go Fiber v2 |
| Database | PostgreSQL |
| Auth | JWT Tokens (access + refresh) |
| Password | bcrypt |
| Driver | pgx/v5 |

## Quick Start

### Prerequisites
- Node.js 18+
- Go 1.21+
- PostgreSQL 14+

### Backend Setup

```bash
cd backend

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=bytetrack
# DB_PASSWORD=your_password
# DB_NAME=bytetrack

# Run migrations and start server
go run cmd/api/main.go
```

Backend runs on [http://localhost:8080](http://localhost:8080)

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Frontend runs on [http://localhost:3000](http://localhost:3000)

## Project Structure

```
bytetrack/
├── frontend/                    # Next.js 16 application
│   ├── app/
│   │   ├── page.tsx            # Landing page
│   │   ├── dashboard/          # Main dashboard
│   │   ├── meals/              # Food diary
│   │   └── onboarding/         # User setup flow
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   └── onboarding/         # Onboarding step components
│   ├── lib/
│   │   ├── api-client.ts       # Backend API client
│   │   ├── translations.ts     # i18n translations (EN/TH)
│   │   └── validations/        # Zod schemas
│   ├── contexts/
│   │   └── LanguageContext.tsx # Language state management
│   └── package.json
│
└── backend/                     # Go Fiber API server
    ├── cmd/api/main.go         # Application entry point
    ├── internal/
    │   ├── api/
    │   │   ├── handler/        # HTTP request handlers
    │   │   ├── middleware/     # Auth, CORS, logger
    │   │   └── router.go       # Route configuration
    │   ├── domain/
    │   │   ├── entity/         # Domain entities
    │   │   └── service/        # Business logic
    │   ├── infrastructure/
    │   │   ├── config/         # Configuration loading
    │   │   ├── database/       # PostgreSQL + migrations
    │   │   ├── repository/     # Data access layer
    │   │   └── external/       # Open Food Facts client
    │   └── pkg/
    │       ├── jwt/            # JWT utilities
    │       └── password/       # Password hashing
    ├── go.mod
    └── .env.example
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/auth/refresh` | Refresh JWT token |
| POST | `/api/v1/auth/logout` | Logout user |

### User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/user/profile` | Get user profile |
| PUT | `/api/v1/user/profile` | Update user profile |

### Onboarding
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/onboarding/complete` | Complete onboarding |
| GET | `/api/v1/onboarding/status` | Check onboarding status |

### Meals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/meals` | Get meals (with date filter) |
| POST | `/api/v1/meals` | Create meal |
| GET | `/api/v1/meals/:id` | Get meal by ID |
| PUT | `/api/v1/meals/:id` | Update meal |
| DELETE | `/api/v1/meals/:id` | Delete meal |
| GET | `/api/v1/meals/daily/:date` | Get daily stats |

### Foods
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/foods/search` | Search foods (local + API) |
| GET | `/api/v1/foods/thai` | Get Thai foods |
| GET | `/api/v1/foods/barcode/:barcode` | Lookup by barcode |

### Favorites & Custom Foods
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/favorites` | Get favorite foods |
| POST | `/api/v1/favorites` | Add to favorites |
| DELETE | `/api/v1/favorites/:id` | Remove from favorites |
| GET | `/api/v1/custom-foods` | Get custom foods |
| POST | `/api/v1/custom-foods` | Create custom food |
| DELETE | `/api/v1/custom-foods/:id` | Delete custom food |

## Environment Variables

### Backend (.env)
```env
SERVER_PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=bytetrack
DB_PASSWORD=your_password
DB_NAME=bytetrack
JWT_SECRET=your-super-secret-key
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Scripts

### Backend
```bash
cd backend
go run cmd/api/main.go    # Development server
go build -o bytetrack     # Build binary
./bytetrack               # Run production server
```

### Frontend
```bash
cd frontend
npm run dev       # Development server
npm run build     # Production build
npm run start     # Production server
npm run lint      # ESLint check
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

### Frontend
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Icon library
- [shadcn/ui](https://ui.shadcn.com/) - Component inspiration

### Backend
- [Fiber](https://gofiber.io/) - Web framework
- [pgx](https://github.com/jackc/pgx) - PostgreSQL driver
- [golang-jwt](https://github.com/golang-jwt/jwt) - JWT implementation
- [Open Food Facts](https://world.openfoodfacts.org/) - Food database API

---

Built with Next.js 16, Go Fiber, PostgreSQL, and TypeScript.

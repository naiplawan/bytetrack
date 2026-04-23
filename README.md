# ByteTrack

A modern calorie tracking and wellness web app built with Next.js 16. Features bilingual support (English/Thai), a local Thai food database alongside the Open Food Facts API, and a polished UI inspired by Apple and Spotify.

> **Note:** This is currently a **frontend-only** app. All persistence (meals, profile, preferences) runs against a mock data layer backed by `localStorage`, so you can run the full experience without any backend or database.

## Features

### Food Tracking
- **Open Food Facts API**: Access to 3M+ foods worldwide (called directly from the client)
- **Local Thai Food Database**: 20+ authentic Thai dishes with accurate nutrition data
- **Combined Search**: Local database first, then API for broader coverage
- **Complete Nutrition Data**: Calories, protein, carbs, fat, fiber, sugar, sodium

### User Experience
- **Bilingual Support**: Full English/Thai switching with JSON-based translations
- **4-Step Onboarding**: Guided setup with BMR/TDEE calculations
- **Smart Calorie Goals**: Personalized targets based on lose/maintain/gain goals
- **Smart Insights**: Insight engine surfaces personalized recommendations
- **Dark/Light Mode**: System preference detection with manual toggle
- **Smooth Animations**: Framer Motion powered interactions

### Design System
- **40+ UI Components**: Built on Radix primitives with design tokens
- **Glass Morphism Effects**: Modern translucent elements
- **Responsive Design**: Mobile-first, works across devices
- **Accessibility**: WCAG 2.1 AA targets

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Primitives | Radix UI + shadcn-style components |
| Animations | Framer Motion / Motion |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Lucide React |
| State | React Context |
| Persistence | `localStorage` (mock data layer) |
| Package Manager | pnpm |

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+ (`npm i -g pnpm`)

### Install & Run

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```

App runs on [http://localhost:3000](http://localhost:3000).

## Project Structure

```
bytetrack/
├── app/                         # Next.js 16 App Router
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── dashboard/               # Main dashboard
│   ├── meals/                   # Food diary (add, plan)
│   ├── onboarding/              # 4-step user setup
│   ├── analytics/               # Charts & trends
│   ├── calendar/                # Calendar view
│   ├── goals/                   # Goal configuration
│   ├── workouts/                # Workout tracking
│   ├── profile/                 # User profile
│   └── settings/                # App settings
├── components/
│   ├── ui/                      # Reusable primitives (shadcn-style)
│   ├── dashboard/               # Dashboard-specific components
│   ├── onboarding/              # Onboarding step components
│   └── icons/                   # Custom icons
├── contexts/
│   ├── AuthContext.tsx          # Auth/profile state
│   └── LanguageContext.tsx      # i18n state
├── hooks/                       # Shared React hooks
├── lib/
│   ├── meal-service.ts          # localStorage-backed meal CRUD
│   ├── food-api.ts              # Open Food Facts client
│   ├── thai-food-api.ts         # Local Thai food database
│   ├── calorie-calculator.ts    # BMR/TDEE math
│   ├── insights-engine.ts       # Smart insights generator
│   ├── analytics-service.ts     # Analytics aggregation
│   ├── achievements-service.ts  # Achievement tracking
│   ├── design-tokens.ts         # Design system tokens
│   ├── motion-variants.ts       # Framer Motion presets
│   ├── translations.ts          # Translation helpers
│   ├── types.ts                 # Shared types
│   ├── utils.ts                 # Utilities
│   └── validations/             # Zod schemas
├── locales/
│   ├── en.json                  # English translations
│   └── th.json                  # Thai translations
├── public/                      # Static assets
├── styles/                      # Global styles
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Data Layer

There is no backend server. All user data lives in the browser:

- **Meals** — stored in `localStorage` via `lib/meal-service.ts`
- **Profile & onboarding** — stored in `localStorage` via `contexts/AuthContext.tsx`
- **Language preference** — stored in `localStorage` via `contexts/LanguageContext.tsx`
- **Food search** — local Thai DB (`lib/thai-food-api.ts`) + Open Food Facts called directly from the client

Swapping in a real backend later means replacing the implementations in `lib/*-service.ts` — the UI contracts stay the same.

## Environment Variables

No environment variables are required for local development. Create `.env.local` only if you need to override defaults (e.g. a future API URL).

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

MIT License — see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) — React framework
- [Tailwind CSS](https://tailwindcss.com/) — CSS framework
- [Radix UI](https://www.radix-ui.com/) — accessible primitives
- [shadcn/ui](https://ui.shadcn.com/) — component inspiration
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Recharts](https://recharts.org/) — charts
- [Lucide](https://lucide.dev/) — icons
- [Open Food Facts](https://world.openfoodfacts.org/) — food database API

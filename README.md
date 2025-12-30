# ByteTrack

A modern calorie tracking and wellness application built with Next.js 15. Features bilingual support (English/Thai), integration with Open Food Facts API for 3M+ foods, and a beautiful UI inspired by Apple and Spotify design systems.

## Features

### Food Tracking
- **Open Food Facts API Integration**: Access to 3M+ foods worldwide
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

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15.2.4 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Food API | Open Food Facts (free, no API key) |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
bytetrack/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/            # Main dashboard
│   ├── meals/                # Food diary
│   │   ├── page.tsx          # Meals list with search
│   │   ├── add/              # Add food entry
│   │   └── plan/             # Meal planning (coming soon)
│   ├── onboarding/           # User setup flow
│   ├── analytics/            # Analytics (coming soon)
│   └── goals/                # Goals management (coming soon)
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── dashboard/            # Dashboard-specific components
│   └── onboarding/           # Onboarding step components
├── lib/
│   ├── food-api.ts           # Open Food Facts + local database
│   ├── thai-food-api.ts      # Backward-compatible food API
│   ├── calorie-calculator.ts # BMR/TDEE calculations
│   ├── translations.ts       # i18n translations (EN/TH)
│   └── validations/          # Zod schemas
└── contexts/
    └── LanguageContext.tsx   # Language state management
```

## Food API

### Search Foods
```typescript
import { searchFoods } from '@/lib/thai-food-api';

// Combines local Thai foods + Open Food Facts API
const results = await searchFoods('chicken');
```

### Local Thai Foods Only
```typescript
import { searchLocalThaiFoods } from '@/lib/thai-food-api';

const thaiFoods = await searchLocalThaiFoods('ไก่');
```

### Barcode Lookup
```typescript
import { scanBarcode } from '@/lib/thai-food-api';

const food = await scanBarcode('8850999220017');
```

### Available Functions

| Function | Description |
|----------|-------------|
| `searchFoods(query)` | Combined search (Thai + API) |
| `searchLocalThaiFoods(query)` | Thai foods only |
| `getThaiFood()` | Get all local Thai foods |
| `scanBarcode(barcode)` | Lookup by barcode |
| `getCategories()` | Get food categories |

## Translations

The app supports English and Thai. Translations are managed in `lib/translations.ts`.

```typescript
import { t } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { language } = useLanguage();
  return <h1>{t('dashboard_title_i18n', language)}</h1>;
}
```

## Calorie Calculations

Uses scientifically-backed formulas:

- **BMR**: Mifflin-St Jeor equation
- **TDEE**: BMR × Activity multiplier
- **Goal Adjustment**: ±300-500 calories based on goal

```typescript
import { calculateBMR, calculateTDEE } from '@/lib/calorie-calculator';

const bmr = calculateBMR({ age: 25, gender: 'male', height: 175, weight: 70 });
const tdee = calculateTDEE(bmr, 'moderate');
```

## Environment Variables

No environment variables required. The Open Food Facts API is free and doesn't need an API key.

Optional configuration can be added in `.env.local`:

```env
# Optional: Analytics, etc.
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Scripts

```bash
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

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Open Food Facts](https://world.openfoodfacts.org/) - Food database API
- [Lucide](https://lucide.dev/) - Icon library
- [shadcn/ui](https://ui.shadcn.com/) - Component inspiration

---

Built with Next.js, TypeScript, and Tailwind CSS.

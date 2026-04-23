# Dashboard Components

This directory contains the modular components that make up the dashboard page. The components have been separated to improve code maintainability, reusability, and testing.

## Components

### `DashboardHeader`
- Displays the welcome message and page title
- Simple presentational component with motion animations

### `CalorieOverview`
- Shows calorie progress with a visual progress bar
- Displays calories remaining/consumed
- Shows macronutrient breakdown (carbs, protein, fat)
- **Props:** `calorieGoal`, `caloriesConsumed`

### `QuickStats`
- Displays key health metrics in card format
- Shows calories, water intake, active minutes, and sleep
- **Props:** `stats` (array of Stat objects)

### `RecentMeals`
- Lists today's meals with calories and timing
- Includes "Add Meal" functionality
- **Props:** `meals` (array of Meal objects), `onAddMeal` (callback)

### `QuickActions`
- Provides shortcuts to common actions
- Analytics, goals, meal planning, progress reports
- **Props:** Various optional callback functions

## Types

### `Stat`
```typescript
interface Stat {
  label: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  color: string;
}
```

### `Meal`
```typescript
interface Meal {
  name: string;
  time: string;
  calories: number;
  items: string;
}
```

## Motion Variants

Shared animation variants are defined in `motion-variants.ts`:
- `fadeIn`: Opacity and Y-axis entrance animation
- `staggerContainer`: Staggers child animations

## Usage

```tsx
import {
  DashboardHeader,
  CalorieOverview,
  QuickStats,
  RecentMeals,
  QuickActions,
  type Stat,
  type Meal,
} from '@/components/dashboard';

// Use the components with proper props
<CalorieOverview calorieGoal={2000} caloriesConsumed={1450} />
<QuickStats stats={statsArray} />
<RecentMeals meals={mealsArray} onAddMeal={handleAddMeal} />
```

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be reused across different pages
3. **Testability**: Easier to write unit tests for individual components
4. **Maintainability**: Changes to one component don't affect others
5. **Type Safety**: Strong TypeScript types for all props and data
6. **Performance**: Smaller components can be optimized individually

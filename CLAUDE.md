# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Folkday (节知) is a React Native bare workflow app that helps users track traditional Chinese festivals across four regional cultures: Chaoshan (潮汕), Minnan (闽南), Guangfu (广府), and Kejia (客家). It features dual Gregorian/Lunar calendar display, 196 festivals with customs data, and a tiered reminder system.

## Common Commands

```bash
npm start              # Start Metro bundler
npm run ios            # Build & run on iOS simulator
npm run android        # Build & run on Android emulator
npm test               # Run all Jest tests
npm run lint           # Run ESLint

# Run a single test file
npx jest src/services/__tests__/festivalService.test.ts

# iOS pod install (after adding native deps)
cd ios && bundle exec pod install && cd ..

# Helper scripts
./scripts/ios_sim.sh       # Start Metro + iOS simulator
./scripts/android_sim.sh   # Start Metro + Android emulator
./scripts/android_pack.sh  # Build Android release APK
```

## Architecture

### State Management
React Context + useReducer in `src/contexts/AppContext.tsx`. No Redux. State is persisted to AsyncStorage. Actions: `TOGGLE_REGION`, `SET_REMINDER_ENABLED`, `SET_REMINDER_DAYS`, `SET_REMINDER_TIME`, `SET_PREFERENCES`, `SET_SELECTED_DATE`, `SET_LOADING`.

### Navigation
Bottom tabs (Calendar / Regions / Reminders) with a native stack inside the Calendar tab for drill-down to `FestivalDetail`.

### Service Layer
- **festivalService.ts** — Resolves festival dates (lunar, solar, or solar-term based), queries festivals by date/month/upcoming.
- **lunarService.ts** — Wraps `lunar-typescript` for lunar↔solar conversion and solar term (节气) lookups.
- **notificationService.ts** — Schedules push notifications via `react-native-push-notification`.

### Data Layer
Festival data lives in `src/data/regions/*.json` (one file per region). Loaded and indexed in `src/data/index.ts`. Each festival has a `calendarType` field (`lunar` | `solar` | `solarTerm`) that determines how its date is resolved to the Gregorian calendar.

### Key Types (`src/types/index.ts`)
- `Festival` — id, name, region, calendarType, date, importance (high/medium/low), customs, description, tags
- `UserPreferences` — selectedRegions, reminderEnabled, reminderDays (per importance tier), reminderTime
- `DayFestivalInfo` — aggregated info for a calendar day (festivals, lunar date, solar term)

### Components (`src/components/`)
Reusable UI: `DualDateCell`, `FestivalCard`, `CountdownBadge`, `CustomItem`, `ErrorBoundary`.

### Utilities (`src/utils/`)
`dateUtils.ts` — Date formatting helpers.

### Path Aliases
`@/*` maps to `src/*` (configured in both `tsconfig.json` and `babel.config.js`).

### Region Color Scheme
Chaoshan: `#C0392B` (red), Minnan: `#E67E22` (orange), Guangfu: `#D4A017` (gold), Kejia: `#27826B` (green).

## Testing
Jest with react-native preset. Mocks for AsyncStorage, navigation, calendars, push notifications, and gesture handler are set up in `jest.setup.js`. Test files live alongside source in `__tests__/` subdirectories.

## Website
Astro-based landing page in `/website/` (separate `package.json`). Auto-deployed to GitHub Pages via `.github/workflows/deploy-website.yml` on pushes to `website/` dir.

## Release & CI
- Version follows semver; bump in `package.json` and `app.json`
- `git tag v1.x.x && git push --tags` triggers `.github/workflows/release-apk.yml` to build & publish APK
- Helper scripts in `/scripts/`: `ios_sim.sh`, `android_sim.sh`, `android_pack.sh`

## Reference Data
Regional festival customs documentation (Chinese) in `docs/*.md`. Festival data JSON sourced/cross-referenced from these.

## Code Style
Prettier: single quotes, trailing commas, no parens on single arrow params. ESLint: `@react-native` preset.

## Requirements
- Node >= 22.11.0
- Ruby >= 2.6.10 (for CocoaPods on iOS)
- Xcode (iOS), Android SDK (Android)

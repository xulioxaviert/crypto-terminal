# CryptoTerminal Developer Guide

## Commands

- `npm start` or `ng serve` - Start dev server (http://localhost:4200)
- `npm run build` or `ng build` - Production build
- `ng test` - Run Vitest tests (Angular test runner with Vitest)
- `ng generate component <path>` - Generate Angular component

## Tech Stack

- **Angular 20** (Zoneless, standalone components, signals)
- **TypeScript 5.9** (strict mode enabled)
- **Vitest** for testing (not Jest - configured via `angular.json` test builder)
- **Tailwind CSS 3.4** (configured with PostCSS)
- **Prettier** (configured in package.json)

## Code Conventions

- Standalone components with `standalone: true`
- Signal inputs: `input.required<T>()` instead of `@Input()`
- Services: `@Injectable({ providedIn: 'root' })`
- Imports sorted alphabetically
- Prettier uses Angular parser for `.html` files (`printWidth: 100`, `singleQuote: true`)

## Project Structure

```
src/app/
├── core/components/     # Header, Sidebar
├── features/dashboard/  # Main feature module
│   ├── components/      # PriceCard, PortfolioAnalytics, Markets, Wallets
│   ├── models/         # TypeScript interfaces
│   └── service/        # MarketService, PortfolioService, ChartDataService
└── app/                # app.config.ts, app.routes.ts
```

## Build Notes

- Environment files: `src/environments/environment.ts` (dev), `src/environments/environment.prod.ts` (prod)
- Budget limits: 500kB initial warning, 1MB error; 4kB per-component warning
- Assets served from `public/` directory
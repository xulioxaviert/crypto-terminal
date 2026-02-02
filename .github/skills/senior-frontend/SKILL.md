---
name: senior-frontend
description: Expert guidance for implementing robust, accessible, and performant Angular 20 (zoneless, signals, standalone components) features in a crypto trading terminal. Use when implementing or refactoring Angular 20 components, services, or features with strict zoneless mode, signals-based state, RxJS reactive streams for Binance API integration, and WCAG 2.2 AA accessibility standards. Specialized in DDD lite architecture, Tailwind CSS styling, and Vitest testing.
---

# Angular 20 Senior Frontend - Crypto Terminal

## Overview

This skill provides comprehensive guidance for building production-grade Angular 20 features in a crypto trading terminal application. It enforces zoneless architecture with signals, standalone components, and strict best practices for real-time data integration with Binance API (REST + WebSocket).

## Core Technologies

- **Angular 20**: Zoneless mode, signals, standalone components
- **State Management**: Local signals + computed values (no NgRx/traditional stores)
- **Reactive Streams**: RxJS 7.8 with proper teardown patterns
- **Styling**: Tailwind CSS 3.4.19 + SCSS for complex animations
- **Testing**: Vitest 4.0.8 + Angular TestBed
- **API Integration**: Binance REST API + WebSocket real-time updates
- **Charts**: ApexCharts 5.3.6 + ng-apexcharts 2.0.4
- **Icons**: Lucide Angular 0.562.0

## When to Use This Skill

Trigger this skill when:
- Implementing Angular 20 components or features
- Integrating real-time crypto data (Binance API)
- Refactoring legacy Angular code to zoneless/signals
- Building accessible UI components (WCAG 2.2 AA)
- Creating reactive data flows with RxJS
- Writing tests for Angular components/services
- Optimizing performance in crypto data displays

## Angular 20 Zoneless Architecture

### Critical Rules (Never Break)

**NEVER use:**
- `zone.js` or `ChangeDetectorRef` (zoneless mode)
- NgModules (only standalone components)
- Legacy decorators: `@Input()`, `@Output()`, `@ViewChild()` with decorators
- Legacy control flow: `*ngIf`, `*ngFor`, `*ngSwitch`
- Constructor injection (use `inject()` function)
- `[(ngModel)]` two-way binding syntax
- `effect()` without strong justification

**ALWAYS use:**
- Standalone components with `standalone: true`
- New control flow: `@if`, `@for`, `@switch`
- Signal inputs: `input()`, `input.required()`
- Signal outputs: `output<T>()`
- Model signals: `model<T>()` for two-way binding
- `inject()` function for dependency injection
- `signal()` for mutable state, `computed()` for derived state
- `takeUntilDestroyed()` or `async` pipe for subscription management
- **Reactive Forms** for any user inputs (forms, filters, search, settings). Never use template-driven forms or `[(ngModel)]`.

### Component Structure Pattern

```typescript
import { Component, signal, computed, inject, input, output, model } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-card',
  standalone: true,
  imports: [CommonModule, /* other standalone components */],
  templateUrl: './price-card.component.html',
  styleUrls: ['./price-card.component.scss']
})
export class PriceCardComponent {
  // Dependency injection using inject()
  private marketService = inject(MarketService);
  
  // Inputs using signal inputs (never @Input())
  symbol = input.required<string>();
  refreshInterval = input<number>(5000);
  
  // Outputs using signal outputs (never @Output())
  priceSelected = output<CryptoModel>();
  
  // Model signals for two-way binding (never [(ngModel)])
  selectedCurrency = model<string>('USD');
  
  // Local state using signals
  currentPrice = signal<number>(0);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  
  // Derived state using computed (automatic re-computation)
  priceInSelectedCurrency = computed(() => {
    const price = this.currentPrice();
    const currency = this.selectedCurrency();
    return this.convertPrice(price, currency);
  });
  
  isPriceIncreasing = computed(() => 
    this.currentPrice() > this.previousPrice()
  );
  
  // RxJS streams with proper teardown
  constructor() {
    this.marketService.getPriceUpdates(this.symbol())
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (price) => {
          this.currentPrice.set(price);
          this.isLoading.set(false);
        },
        error: () => this.hasError.set(true)
      });
  }
  
  // Methods in infinitive form
  handlePriceClick(): void {
    this.priceSelected.emit({
      symbol: this.symbol(),
      price: this.currentPrice()
    });
  }
  
  private convertPrice(price: number, currency: string): number {
    // Pure function - no side effects
    return price * this.getCurrencyRate(currency);
  }
}
```

### Template Control Flow Pattern

```html
<!-- New control flow syntax (NEVER use *ngIf, *ngFor, *ngSwitch) -->

<!-- Conditional rendering -->
@if (isLoading()) {
  <div class="loading-spinner">Loading...</div>
} @else if (hasError()) {
  <div class="error-message">Failed to load price data</div>
} @else {
  <div class="price-display">
    <span class="price">{{ priceInSelectedCurrency() | currency }}</span>
    @if (isPriceIncreasing()) {
      <lucide-icon name="trending-up" class="text-green-500" />
    } @else {
      <lucide-icon name="trending-down" class="text-red-500" />
    }
  </div>
}

<!-- Loop with track for performance -->
@for (crypto of cryptos(); track crypto.id) {
  <app-price-card 
    [symbol]="crypto.symbol"
    [(selectedCurrency)]="activeCurrency"
    (priceSelected)="handleCryptoSelected($event)"
  />
} @empty {
  <div class="empty-state">No cryptocurrencies available</div>
}

<!-- Switch statement -->
@switch (viewMode()) {
  @case ('grid') {
    <app-grid-view [data]="cryptos()" />
  }
  @case ('list') {
    <app-list-view [data]="cryptos()" />
  }
  @default {
    <app-table-view [data]="cryptos()" />
  }
}
```

## Architecture Patterns

### Folder Structure (DDD Lite)

```
src/app/
├── core/                          # Core infrastructure (singleton services)
│   ├── components/
│   │   ├── header/
│   │   └── sidebar/
│   ├── config/
│   │   ├── api.config.ts          # API configuration
│   │   └── endpoints.config.ts
│   ├── interfaces/
│   │   └── market-data-provider.interface.ts
│   ├── models/
│   │   ├── app-state.model.ts
│   │   └── nav.model.ts
│   ├── adapters/
│   │   └── binance-market.adapter.ts
│   └── store/
│       └── app.store.service.ts   # Global signal store (if needed)
├── features/                      # Feature modules (bounded contexts)
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   ├── components/
│   │   │   ├── markets/
│   │   │   ├── header-search/
│   │   │   └── settings-component/
│   │   ├── models/
│   │   │   ├── binance.model.ts
│   │   │   ├── crypto.model.ts
│   │   │   └── portfolio.model.ts
│   │   └── service/
│   │       ├── market.service.ts
│   │       └── chart-data.service.ts
│   ├── markets/
│   └── portfolio/
└── shared/                        # Reusable components & utilities
    ├── components/
    │   ├── chart/
    │   ├── price-card/
    │   ├── market-trends/
    │   ├── portfolio-hero/
    │   └── wallets/
    └── utils/
        ├── currency-formatter.ts
        └── image-fallback.ts
```

### Dependency Rules (Critical)

```
✅ Allowed dependencies:
features → shared
features → core
shared → core

❌ Forbidden dependencies:
core → features (NEVER)
core → shared (NEVER)
shared → features (NEVER)
features → features (avoid, use shared instead)
```

### Component Size Guidelines

- **Maximum 200 lines per component**
- If larger, extract sub-components into `components/` subfolder
- Move complex logic to services or pure utility functions
- Keep templates clean with minimal logic

## RxJS Reactive Patterns for Binance Integration

### Service Pattern with Proper Teardown

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, timer } from 'rxjs';
import { 
  switchMap, 
  throttleTime, 
  debounceTime, 
  catchError, 
  retry,
  shareReplay,
  takeUntil 
} from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({ providedIn: 'root' })
export class MarketService {
  private http = inject(HttpClient);
  private destroy$ = new Subject<void>();
  
  // Signals for reactive state
  isConnected = signal<boolean>(false);
  lastUpdateTime = signal<Date | null>(null);
  
  private wsSubject: WebSocketSubject<any> | null = null;
  
  // REST API - with caching and error handling
  fetchMarkets(): Observable<CryptoModel[]> {
    return this.http.get<BinanceTickerResponse[]>('/api/v3/ticker/24hr')
      .pipe(
        retry({ count: 3, delay: 1000 }),
        catchError(this.handleError),
        shareReplay({ bufferSize: 1, refCount: true })
      );
  }
  
  // WebSocket - with reconnection logic
  connectToMarketStream(symbols: string[]): Observable<PriceUpdate> {
    const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
    
    this.wsSubject = webSocket({
      url: wsUrl,
      openObserver: {
        next: () => {
          this.isConnected.set(true);
          console.log('WebSocket connected');
        }
      },
      closeObserver: {
        next: () => {
          this.isConnected.set(false);
          console.log('WebSocket disconnected');
        }
      }
    });
    
    return this.wsSubject.pipe(
      throttleTime(200), // Prevent UI overload
      takeUntil(this.destroy$),
      catchError((error) => {
        console.error('WebSocket error:', error);
        // Implement exponential backoff reconnection
        return timer(2000).pipe(
          switchMap(() => this.connectToMarketStream(symbols))
        );
      })
    );
  }
  
  // Cleanup on service destruction
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.wsSubject?.complete();
  }
  
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    throw new Error('Failed to fetch market data');
  }
}
```

### Component Integration with takeUntilDestroyed

```typescript
import { Component, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-market-list',
  standalone: true,
  template: `
    @if (isLoading()) {
      <div>Loading markets...</div>
    } @else {
      @for (market of markets(); track market.symbol) {
        <app-price-card [crypto]="market" />
      }
    }
  `
})
export class MarketListComponent {
  private marketService = inject(MarketService);
  
  markets = signal<CryptoModel[]>([]);
  isLoading = signal<boolean>(true);
  searchTerm = signal<string>('');
  
  constructor() {
    // Automatic cleanup with takeUntilDestroyed
    this.marketService.fetchMarkets()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => {
          this.markets.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load markets:', err);
          this.isLoading.set(false);
        }
      });
    
    // Real-time updates with throttling
    this.marketService.connectToMarketStream(['BTCUSDT', 'ETHUSDT'])
      .pipe(
        debounceTime(500), // Batch updates
        takeUntilDestroyed()
      )
      .subscribe((update) => {
        this.updateMarketPrice(update);
      });
  }
  
  private updateMarketPrice(update: PriceUpdate): void {
    this.markets.update(markets => 
      markets.map(m => 
        m.symbol === update.symbol 
          ? { ...m, price: update.price, change24h: update.change } 
          : m
      )
    );
  }
}
```

## Styling with Tailwind CSS

### Project Design Tokens

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'crypto-dark': '#0A0E27',      // Primary background
        'crypto-neon': '#00F5FF',       // Accent/highlights
        'secondary': '#151932',         // Secondary background
        'tertiary': '#1E2139',          // Card backgrounds
      }
    }
  }
}
```

### Styling Guidelines

**Primary approach: Tailwind utility classes**

```html
<div class="bg-crypto-dark text-white p-6 rounded-lg shadow-lg">
  <h2 class="text-2xl font-bold text-crypto-neon mb-4">Bitcoin</h2>
  <p class="text-gray-400">Current Price</p>
  <span class="text-3xl font-mono">$43,250.00</span>
</div>
```

**SCSS only for:**
- Complex animations (neon glow effects)
- Advanced pseudo-elements
- Dynamic styles Tailwind can't cover

```scss
// price-card.component.scss
.neon-glow {
  animation: neon-pulse 2s ease-in-out infinite;
  
  @keyframes neon-pulse {
    0%, 100% {
      box-shadow: 0 0 10px var(--crypto-neon),
                  0 0 20px var(--crypto-neon);
    }
    50% {
      box-shadow: 0 0 20px var(--crypto-neon),
                  0 0 40px var(--crypto-neon);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .neon-glow {
    animation: none;
  }
}
```

## Accessibility Standards (WCAG 2.2 AA)

### Mandatory Requirements

1. **Contrast Ratios**
   - Normal text (< 18pt): minimum 4.5:1
   - Large text (≥ 18pt or bold ≥ 14pt): minimum 3:1
   - Verify with Chrome DevTools or WebAIM Contrast Checker

2. **Keyboard Navigation**
   - All interactive elements must be keyboard accessible
   - Visible focus indicators (use `:focus-visible`)
   - Logical tab order

3. **ARIA Labels**
   - Use ARIA only when native HTML is insufficient
   - Never redundant ARIA (e.g., don't add `role="button"` to `<button>`)
   - Charts and data visualizations need `aria-label`

4. **Screen Reader Support**
   - Meaningful alt text for images (crypto icons)
   - Live regions for real-time price updates
   - Descriptive link text (never "click here")

### Accessible Component Example

```typescript
@Component({
  selector: 'app-accessible-price-card',
  standalone: true,
  template: `
    <article 
      class="price-card focus-visible:ring-2 focus-visible:ring-crypto-neon"
      tabindex="0"
      role="article"
      [attr.aria-label]="priceCardLabel()">
      
      <h3 id="crypto-name-{{symbol()}}">{{ symbol() }}</h3>
      
      <!-- Price with live region for screen readers -->
      <div 
        class="price-display"
        role="status" 
        aria-live="polite"
        aria-atomic="true">
        <span class="sr-only">Current price:</span>
        {{ currentPrice() | currency }}
      </div>
      
      <!-- Icon with descriptive label -->
      <lucide-icon 
        [name]="trendIcon()"
        [attr.aria-label]="trendDescription()"
        class="trend-icon"
      />
      
      <!-- Accessible button -->
      <button 
        class="btn-primary"
        (click)="handleSelect()"
        [attr.aria-label]="'View details for ' + symbol()">
        View Details
      </button>
    </article>
  `,
  styles: [`
    /* Visible focus indicator */
    .price-card:focus-visible {
      outline: 2px solid var(--crypto-neon);
      outline-offset: 2px;
    }
    
    /* Screen reader only text */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `]
})
export class AccessiblePriceCardComponent {
  symbol = input.required<string>();
  currentPrice = input.required<number>();
  priceChange = input.required<number>();
  
  priceCardLabel = computed(() => 
    `${this.symbol()} price card, current price ${this.currentPrice()}`
  );
  
  trendIcon = computed(() => 
    this.priceChange() > 0 ? 'trending-up' : 'trending-down'
  );
  
  trendDescription = computed(() => 
    `Price is ${this.priceChange() > 0 ? 'increasing' : 'decreasing'} by ${Math.abs(this.priceChange())}%`
  );
}
```

## Performance Optimization

### Critical Patterns

1. **Use `track` in `@for` loops**

```html
<!-- BAD: No track -->
@for (item of items()) {
  <div>{{ item.name }}</div>
}

<!-- GOOD: Track by unique identifier -->
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

<!-- BETTER: Track by index for static lists -->
@for (item of items(); track $index) {
  <div>{{ item.name }}</div>
}
```

2. **Avoid function calls in templates**

```html
<!-- BAD: Function called on every change detection -->
<div>{{ calculateTotal() }}</div>

<!-- GOOD: Use computed signal -->
<div>{{ totalAmount() }}</div>
```

```typescript
// In component class
totalAmount = computed(() => 
  this.items().reduce((sum, item) => sum + item.price, 0)
);
```

3. **Throttle/Debounce high-frequency updates**

```typescript
// Throttle WebSocket updates to prevent UI thrashing
this.marketService.getPriceStream()
  .pipe(
    throttleTime(200), // Max 5 updates per second
    takeUntilDestroyed()
  )
  .subscribe(price => this.currentPrice.set(price));
```

4. **Lazy loading routes**

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => 
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'portfolio',
    loadComponent: () => 
      import('./features/portfolio/portfolio.component')
        .then(m => m.PortfolioComponent)
  }
];
```

5. **Memoize expensive computations**

```typescript
import { memoize } from 'lodash-es';

// Pure utility function
export const calculatePortfolioValue = memoize(
  (holdings: Holding[], prices: Map<string, number>): number => {
    return holdings.reduce((total, holding) => {
      const price = prices.get(holding.symbol) ?? 0;
      return total + (holding.amount * price);
    }, 0);
  },
  // Custom resolver for cache key
  (holdings, prices) => `${holdings.length}-${prices.size}`
);
```

## Testing with Vitest

### Component Test Pattern

```typescript
// price-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { PriceCardComponent } from './price-card.component';
import { MarketService } from '../services/market.service';
import { of, throwError } from 'rxjs';

describe('PriceCardComponent', () => {
  let component: PriceCardComponent;
  let fixture: ComponentFixture<PriceCardComponent>;
  let mockMarketService: any;
  
  beforeEach(async () => {
    // Mock service
    mockMarketService = {
      getPriceUpdates: vi.fn()
    };
    
    await TestBed.configureTestingModule({
      imports: [PriceCardComponent], // Standalone component
      providers: [
        { provide: MarketService, useValue: mockMarketService }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(PriceCardComponent);
    component = fixture.componentInstance;
  });
  
  it('should create component', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display loading state initially', () => {
    mockMarketService.getPriceUpdates.mockReturnValue(of(42000));
    
    fixture.componentRef.setInput('symbol', 'BTCUSDT');
    expect(component.isLoading()).toBe(true);
    
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.loading-spinner')).toBeTruthy();
  });
  
  it('should update price when service emits', async () => {
    const testPrice = 42000;
    mockMarketService.getPriceUpdates.mockReturnValue(of(testPrice));
    
    fixture.componentRef.setInput('symbol', 'BTCUSDT');
    fixture.detectChanges();
    
    // Wait for async operations
    await fixture.whenStable();
    
    expect(component.currentPrice()).toBe(testPrice);
    expect(component.isLoading()).toBe(false);
  });
  
  it('should handle error state', async () => {
    mockMarketService.getPriceUpdates.mockReturnValue(
      throwError(() => new Error('Network error'))
    );
    
    fixture.componentRef.setInput('symbol', 'BTCUSDT');
    fixture.detectChanges();
    
    await fixture.whenStable();
    
    expect(component.hasError()).toBe(true);
  });
  
  it('should emit priceSelected when clicked', () => {
    const spy = vi.fn();
    component.priceSelected.subscribe(spy);
    
    fixture.componentRef.setInput('symbol', 'BTCUSDT');
    component.currentPrice.set(42000);
    
    component.handlePriceClick();
    
    expect(spy).toHaveBeenCalledWith({
      symbol: 'BTCUSDT',
      price: 42000
    });
  });
  
  it('should compute price change correctly', () => {
    component.currentPrice.set(100);
    component.previousPrice.set(90);
    
    expect(component.isPriceIncreasing()).toBe(true);
    
    component.currentPrice.set(80);
    expect(component.isPriceIncreasing()).toBe(false);
  });
});
```

### Service Test Pattern

```typescript
// market.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MarketService } from './market.service';
import { CryptoModel } from '../models/crypto.model';

describe('MarketService', () => {
  let service: MarketService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MarketService]
    });
    
    service = TestBed.inject(MarketService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify(); // Verify no outstanding requests
  });
  
  it('should fetch markets successfully', (done) => {
    const mockData: CryptoModel[] = [
      { symbol: 'BTCUSDT', price: 42000, change24h: 2.5 }
    ];
    
    service.fetchMarkets().subscribe({
      next: (data) => {
        expect(data).toEqual(mockData);
        done();
      }
    });
    
    const req = httpMock.expectOne('/api/v3/ticker/24hr');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
  
  it('should handle HTTP error', (done) => {
    service.fetchMarkets().subscribe({
      error: (error) => {
        expect(error.message).toContain('Failed to fetch');
        done();
      }
    });
    
    const req = httpMock.expectOne('/api/v3/ticker/24hr');
    req.error(new ProgressEvent('Network error'), { status: 500 });
  });
  
  it('should update connection signal on WebSocket events', () => {
    expect(service.isConnected()).toBe(false);
    
    // Test WebSocket connection logic
    // Note: WebSocket testing requires additional setup or mocks
  });
});
```

### Test Coverage Goals

- **Services**: >80% coverage (critical business logic)
- **Components**: >70% coverage (user interactions, state changes)
- **Utilities**: >90% coverage (pure functions)

Run tests:
```bash
npm run test          # Run once
npm run test:watch    # Watch mode
npm run test:coverage # Generate coverage report
```

## Commit and Branch Standards

### Conventional Commits (English Required)

Format: `<type>(optional-scope): imperative description`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructure without behavior change
- `perf`: Performance improvement
- `test`: Add/update tests
- `docs`: Documentation changes
- `style`: Code formatting (no logic change)
- `chore`: Maintenance tasks

**Examples:**
```
feat(dashboard): add real-time WebSocket price updates using signals
fix(market-service): handle disconnect timeout with exponential backoff
refactor: extract currency formatter to shared utils
perf: throttle WebSocket updates to 200-500ms
test: add market service unit tests with error scenarios
```

### Branch Naming (Spanish Descriptions)

Format: `<type>/APP-<issue-number>-<spanish-description>`

**Examples:**
```
feature/APP-01-implementar-websocket-binance
bugfix/APP-05-corregir-memoria-websocket
refactor/APP-08-extraer-utilidades-moneda
test/APP-12-tests-componentes-dashboard
perf/APP-15-optimizar-renderizado-listas
```

### Pre-Commit Checklist

Before committing:
```
□ Code lints: npm run lint (no errors)
□ Tests pass: npm run test
□ TypeScript compiles: no `any` types, no type errors
□ No console.log statements
□ Commit message follows Conventional Commits
□ Branch name includes issue number (APP-XX)
□ No secrets or API keys in code
□ Accessibility: contrast checked, keyboard navigation works
□ Performance: no function calls in templates, track in @for
```

## Common Mistakes to Avoid

### ❌ Using zone.js patterns in zoneless mode

```typescript
// WRONG
constructor(private cdr: ChangeDetectorRef) {}
this.cdr.detectChanges(); // Never in zoneless!
```

### ❌ Legacy decorators instead of signal inputs

```typescript
// WRONG
@Input() symbol: string;
@Output() selected = new EventEmitter();

// CORRECT
symbol = input.required<string>();
selected = output<CryptoModel>();
```

### ❌ Old control flow syntax

```html
<!-- WRONG -->
<div *ngIf="isLoading">Loading...</div>
<div *ngFor="let item of items">{{ item }}</div>

<!-- CORRECT -->
@if (isLoading()) {
  <div>Loading...</div>
}
@for (item of items(); track item.id) {
  <div>{{ item }}</div>
}
```

### ❌ Missing subscription cleanup

```typescript
// WRONG - Memory leak!
this.service.getData().subscribe(data => {
  this.items.set(data);
});

// CORRECT
this.service.getData()
  .pipe(takeUntilDestroyed())
  .subscribe(data => this.items.set(data));
```

### ❌ Function calls in templates

```html
<!-- WRONG - Called on every change detection -->
<div>{{ calculateTotal() }}</div>

<!-- CORRECT - Computed once, cached -->
<div>{{ totalAmount() }}</div>
```

### ❌ Missing track in @for loops

```html
<!-- WRONG - Re-renders entire list on change -->
@for (item of items()) {
  <app-card [data]="item" />
}

<!-- CORRECT - Only updates changed items -->
@for (item of items(); track item.id) {
  <app-card [data]="item" />
}
```

## Quick Reference

### Essential Imports

```typescript
// Core Angular 20
import { Component, signal, computed, inject, input, output, model } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

// RxJS operators
import { switchMap, throttleTime, debounceTime, catchError, retry, shareReplay } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

// Testing
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
```

### Signal API Cheat Sheet

```typescript
// Mutable state
const count = signal(0);
count.set(5);           // Set new value
count.update(n => n+1); // Update based on current

// Derived state (auto-recomputes)
const doubled = computed(() => count() * 2);

// Side effects (use sparingly!)
effect(() => {
  console.log('Count changed:', count());
});

// Model (two-way binding)
const name = model<string>('');
```

### RxJS Operators for Binance

```typescript
// Switching to new observable
switchMap(symbol => this.getPrice(symbol))

// Rate limiting
throttleTime(200)     // Max once per 200ms
debounceTime(500)     // Wait 500ms after last emission

// Error handling
catchError(err => of(defaultValue))
retry({ count: 3, delay: 1000 })

// Sharing subscriptions
shareReplay({ bufferSize: 1, refCount: true })

// Cleanup
takeUntilDestroyed() // Auto-cleanup on component destroy
```

### Tailwind Classes Reference

```html
<!-- Backgrounds -->
bg-crypto-dark        <!-- Primary dark background -->
bg-secondary          <!-- Secondary sections -->
bg-tertiary           <!-- Card backgrounds -->

<!-- Text Colors -->
text-white            <!-- Primary text -->
text-gray-400         <!-- Secondary text -->
text-crypto-neon      <!-- Accent/highlights -->

<!-- Spacing -->
p-6 m-4              <!-- Padding/margin -->
space-y-4            <!-- Vertical spacing between children -->

<!-- Layout -->
flex items-center justify-between
grid grid-cols-3 gap-4

<!-- Responsive -->
md:flex-row lg:grid-cols-4

<!-- States -->
hover:bg-secondary focus-visible:ring-2
```

## Troubleshooting

### Issue: Component not updating despite signal changes

**Solution:** Ensure you're calling the signal as a function:
```typescript
// WRONG
<div>{{ mySignal }}</div>

// CORRECT
<div>{{ mySignal() }}</div>
```

### Issue: Memory leaks from subscriptions

**Solution:** Always use `takeUntilDestroyed()` or `async` pipe:
```typescript
constructor() {
  this.stream$.pipe(takeUntilDestroyed()).subscribe(...);
}
```

### Issue: WebSocket reconnection not working

**Solution:** Implement exponential backoff:
```typescript
catchError(error => {
  return timer(2000).pipe(
    switchMap(() => this.reconnect())
  );
})
```

### Issue: Poor performance with large lists

**Solution:** Add `track` to `@for` loops:
```html
@for (item of items(); track item.id) { ... }
```

### Issue: Accessibility violations

**Solution:** Use Chrome DevTools Lighthouse audit and fix:
- Add ARIA labels to charts/data visualizations
- Ensure 4.5:1 contrast ratio
- Add focus-visible styles
- Test with keyboard navigation

## Examples

See [EXAMPLES.md](./EXAMPLES.md) for comprehensive practical examples including:
- Complete component with signals and RxJS integration
- Service with REST + WebSocket (Binance API)
- New control flow templates (`@if`, `@for`, `@switch`)
- Real-time updates with throttling
- Accessible components (WCAG 2.2 AA)
- Performance optimization (track, memoization)
- Complete Vitest test suites
- Service testing with HTTP mocks
- Lazy loading routes
- Proper commit message examples
- TypeScript strict mode patterns
- Common anti-patterns to avoid

## Additional Resources

- [Angular 20 Official Docs](https://angular.dev)
- [Signals Guide](https://angular.dev/guide/signals)
- [RxJS Operators](https://rxjs.dev/api)
- [Binance API Docs](https://binance-docs.github.io/apidocs/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Remember:** Always read `master-context.md` and `rules.md` before starting any work. When in doubt, prioritize security, correctness, and accessibility over cleverness or performance micro-optimizations.

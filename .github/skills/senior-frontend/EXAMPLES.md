# Angular 20 Senior Frontend Examples

Practical code examples for building Angular 20 features in the CryptoTerminal project.

---

## Example 1: Complete Component with Signals and RxJS

**Scenario:** Price card component that fetches and displays real-time cryptocurrency prices.

```typescript
// price-card.component.ts
import { Component, signal, computed, inject, input, output, model } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { MarketService } from '../services/market.service';
import { CryptoModel } from '../models/crypto.model';

@Component({
  selector: 'app-price-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
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
  previousPrice = signal<number>(0);
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
  
  priceChangePercent = computed(() => {
    const current = this.currentPrice();
    const previous = this.previousPrice();
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  });
  
  // RxJS streams with proper teardown
  constructor() {
    this.marketService.getPriceUpdates(this.symbol())
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (price) => {
          this.previousPrice.set(this.currentPrice());
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
      price: this.currentPrice(),
      change24h: this.priceChangePercent()
    });
  }
  
  private convertPrice(price: number, currency: string): number {
    // Pure function - no side effects
    const rates: Record<string, number> = {
      'USD': 1,
      'EUR': 0.92,
      'GBP': 0.79,
      'JPY': 149.50
    };
    return price * (rates[currency] ?? 1);
  }
}
```

```html
<!-- price-card.component.html -->
<article 
  class="price-card bg-tertiary rounded-lg p-6 focus-visible:ring-2 focus-visible:ring-crypto-neon"
  tabindex="0"
  [attr.aria-label]="symbol() + ' price card'">
  
  <!-- Header with symbol -->
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-xl font-bold text-white">{{ symbol() }}</h3>
    @if (isPriceIncreasing()) {
      <lucide-icon 
        name="trending-up" 
        class="text-green-500"
        aria-label="Price is increasing" />
    } @else {
      <lucide-icon 
        name="trending-down" 
        class="text-red-500"
        aria-label="Price is decreasing" />
    }
  </div>
  
  <!-- Content with states -->
  @if (isLoading()) {
    <div class="loading-spinner" role="status" aria-label="Loading price data">
      <div class="animate-spin h-8 w-8 border-4 border-crypto-neon border-t-transparent rounded-full"></div>
    </div>
  } @else if (hasError()) {
    <div class="error-message text-red-400" role="alert">
      Failed to load price data
    </div>
  } @else {
    <!-- Price display with live region -->
    <div 
      class="price-display"
      role="status" 
      aria-live="polite"
      aria-atomic="true">
      <span class="sr-only">Current price:</span>
      <p class="text-3xl font-mono text-crypto-neon">
        {{ priceInSelectedCurrency() | currency:selectedCurrency() }}
      </p>
      <p class="text-sm" [class.text-green-400]="isPriceIncreasing()" [class.text-red-400]="!isPriceIncreasing()">
        {{ priceChangePercent() > 0 ? '+' : '' }}{{ priceChangePercent() | number:'1.2-2' }}%
      </p>
    </div>
    
    <!-- Action button -->
    <button 
      class="btn-primary mt-4 w-full bg-crypto-neon text-crypto-dark px-4 py-2 rounded hover:opacity-80"
      (click)="handlePriceClick()"
      [attr.aria-label]="'View details for ' + symbol()">
      View Details
    </button>
  }
</article>
```

---

## Example 2: Service with REST + WebSocket Integration

**Scenario:** Market service that fetches data from Binance REST API and subscribes to WebSocket for real-time updates.

```typescript
// market.service.ts
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
  takeUntil,
  map 
} from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { CryptoModel } from '../models/crypto.model';
import { BinanceTickerResponse, PriceUpdate } from '../models/binance.model';

@Injectable({ providedIn: 'root' })
export class MarketService {
  private http = inject(HttpClient);
  private destroy$ = new Subject<void>();
  
  // Signals for reactive state
  isConnected = signal<boolean>(false);
  lastUpdateTime = signal<Date | null>(null);
  connectionAttempts = signal<number>(0);
  
  private wsSubject: WebSocketSubject<any> | null = null;
  private readonly BASE_URL = 'https://api.binance.com/api/v3';
  private readonly WS_URL = 'wss://stream.binance.com:9443';
  
  // REST API - with caching and error handling
  fetchMarkets(): Observable<CryptoModel[]> {
    return this.http.get<BinanceTickerResponse[]>(`${this.BASE_URL}/ticker/24hr`)
      .pipe(
        retry({ count: 3, delay: 1000 }),
        map(response => this.transformBinanceData(response)),
        catchError(this.handleError),
        shareReplay({ bufferSize: 1, refCount: true })
      );
  }
  
  fetchTickerBySymbol(symbol: string): Observable<CryptoModel> {
    return this.http.get<BinanceTickerResponse>(`${this.BASE_URL}/ticker/24hr`, {
      params: { symbol: symbol.toUpperCase() }
    }).pipe(
      retry({ count: 3, delay: 1000 }),
      map(response => this.transformSingleTicker(response)),
      catchError(this.handleError)
    );
  }
  
  // WebSocket - with reconnection logic
  connectToMarketStream(symbols: string[]): Observable<PriceUpdate> {
    const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
    const wsUrl = `${this.WS_URL}/stream?streams=${streams}`;
    
    this.wsSubject = webSocket({
      url: wsUrl,
      openObserver: {
        next: () => {
          this.isConnected.set(true);
          this.connectionAttempts.set(0);
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
      map(msg => this.parsePriceUpdate(msg)),
      throttleTime(200), // Prevent UI overload - max 5 updates/sec
      takeUntil(this.destroy$),
      catchError((error) => {
        console.error('WebSocket error:', error);
        this.connectionAttempts.update(n => n + 1);
        
        // Exponential backoff: 2s, 4s, 8s, max 30s
        const delay = Math.min(2000 * Math.pow(2, this.connectionAttempts()), 30000);
        
        return timer(delay).pipe(
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
  
  private transformBinanceData(data: BinanceTickerResponse[]): CryptoModel[] {
    return data.map(ticker => this.transformSingleTicker(ticker));
  }
  
  private transformSingleTicker(ticker: BinanceTickerResponse): CryptoModel {
    return {
      symbol: ticker.symbol,
      name: ticker.symbol.replace('USDT', ''),
      price: parseFloat(ticker.lastPrice),
      change24h: parseFloat(ticker.priceChangePercent),
      volume24h: parseFloat(ticker.volume),
      high24h: parseFloat(ticker.highPrice),
      low24h: parseFloat(ticker.lowPrice)
    };
  }
  
  private parsePriceUpdate(msg: any): PriceUpdate {
    const data = msg.data;
    return {
      symbol: data.s,
      price: parseFloat(data.c),
      change: parseFloat(data.P),
      timestamp: new Date(data.E)
    };
  }
  
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    throw new Error('Failed to fetch market data');
  }
}
```

---

## Example 3: New Control Flow Templates

**Scenario:** Market list component showing different states with new Angular 20 control flow.

```html
<!-- market-list.component.html -->

<!-- Conditional rendering with @if/@else -->
@if (isLoading()) {
  <div class="flex justify-center items-center h-64" role="status">
    <div class="animate-spin h-12 w-12 border-4 border-crypto-neon border-t-transparent rounded-full"></div>
    <span class="sr-only">Loading markets...</span>
  </div>
} @else if (hasError()) {
  <div class="error-state bg-red-900/20 border border-red-500 rounded-lg p-6" role="alert">
    <lucide-icon name="alert-triangle" class="text-red-500 h-8 w-8 mb-2" />
    <h3 class="text-xl font-bold text-red-400">Failed to Load Markets</h3>
    <p class="text-gray-400">{{ errorMessage() }}</p>
    <button 
      class="btn-primary mt-4"
      (click)="retryLoad()">
      Retry
    </button>
  </div>
} @else {
  <div class="markets-container">
    <!-- Loop with track for performance -->
    @for (market of filteredMarkets(); track market.symbol) {
      <app-price-card 
        [symbol]="market.symbol"
        [(selectedCurrency)]="activeCurrency"
        (priceSelected)="handleMarketSelected($event)"
      />
    } @empty {
      <div class="empty-state text-center p-12">
        <lucide-icon name="search-x" class="h-16 w-16 text-gray-500 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-gray-400">No Markets Found</h3>
        <p class="text-gray-500">Try adjusting your search or filters</p>
      </div>
    }
  </div>
}

<!-- Switch statement for view modes -->
<div class="view-mode-selector mb-6">
  <button (click)="setViewMode('grid')" [class.active]="viewMode() === 'grid'">Grid</button>
  <button (click)="setViewMode('list')" [class.active]="viewMode() === 'list'">List</button>
  <button (click)="setViewMode('table')" [class.active]="viewMode() === 'table'">Table</button>
</div>

@switch (viewMode()) {
  @case ('grid') {
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (market of markets(); track market.symbol) {
        <app-market-card [data]="market" />
      }
    </div>
  }
  @case ('list') {
    <div class="flex flex-col space-y-4">
      @for (market of markets(); track market.symbol) {
        <app-market-row [data]="market" />
      }
    </div>
  }
  @default {
    <app-market-table [data]="markets()" />
  }
}
```

---

## Example 4: Component with Real-Time Updates and Throttling

**Scenario:** Dashboard component that subscribes to multiple WebSocket streams and manages high-frequency updates.

```typescript
// dashboard.component.ts
import { Component, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, debounceTime, throttleTime } from 'rxjs/operators';
import { MarketService } from './service/market.service';
import { CryptoModel } from './models/crypto.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [/* ... */],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private marketService = inject(MarketService);
  
  // State signals
  markets = signal<CryptoModel[]>([]);
  watchlist = signal<string[]>(['BTCUSDT', 'ETHUSDT', 'BNBUSDT']);
  isLoading = signal<boolean>(true);
  searchTerm = signal<string>('');
  lastUpdateTime = signal<Date | null>(null);
  
  // Computed/derived state
  filteredMarkets = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.markets();
    return this.markets().filter(m => 
      m.symbol.toLowerCase().includes(term) || 
      m.name.toLowerCase().includes(term)
    );
  });
  
  watchlistMarkets = computed(() => {
    const watchlistSymbols = this.watchlist();
    return this.markets().filter(m => watchlistSymbols.includes(m.symbol));
  });
  
  constructor() {
    // Initial data fetch (REST API)
    this.marketService.fetchMarkets()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => {
          this.markets.set(data);
          this.isLoading.set(false);
          this.setupRealtimeUpdates();
        },
        error: (err) => {
          console.error('Failed to load markets:', err);
          this.isLoading.set(false);
        }
      });
  }
  
  private setupRealtimeUpdates(): void {
    // Subscribe to WebSocket updates with throttling
    this.marketService.connectToMarketStream(this.watchlist())
      .pipe(
        throttleTime(200), // Max 5 updates/second
        takeUntilDestroyed()
      )
      .subscribe((update) => {
        this.updateMarketPrice(update);
        this.lastUpdateTime.set(new Date());
      });
  }
  
  private updateMarketPrice(update: PriceUpdate): void {
    // Efficient immutable update
    this.markets.update(markets => 
      markets.map(m => 
        m.symbol === update.symbol 
          ? { 
              ...m, 
              price: update.price, 
              change24h: update.change,
              lastUpdate: update.timestamp
            } 
          : m
      )
    );
  }
  
  handleSearch(term: string): void {
    // Debounce search to avoid excessive filtering
    this.searchTerm.set(term);
  }
  
  addToWatchlist(symbol: string): void {
    if (!this.watchlist().includes(symbol)) {
      this.watchlist.update(list => [...list, symbol]);
    }
  }
  
  removeFromWatchlist(symbol: string): void {
    this.watchlist.update(list => list.filter(s => s !== symbol));
  }
}
```

---

## Example 5: Accessible Component with ARIA and Keyboard Support

**Scenario:** Fully accessible price card with WCAG 2.2 AA compliance.

```typescript
// accessible-price-card.component.ts
@Component({
  selector: 'app-accessible-price-card',
  standalone: true,
  template: `
    <article 
      class="price-card focus-visible:ring-2 focus-visible:ring-crypto-neon"
      tabindex="0"
      role="article"
      [attr.aria-label]="priceCardLabel()"
      (keydown.enter)="handleSelect()"
      (keydown.space)="handleSelect()">
      
      <h3 id="crypto-name-{{symbol()}}">{{ symbol() }}</h3>
      
      <!-- Price with live region for screen readers -->
      <div 
        class="price-display"
        role="status" 
        aria-live="polite"
        aria-atomic="true"
        [attr.aria-describedby]="'trend-' + symbol()">
        <span class="sr-only">Current price:</span>
        {{ currentPrice() | currency }}
      </div>
      
      <!-- Trend indicator with descriptive label -->
      <div [id]="'trend-' + symbol()" class="trend-indicator">
        <lucide-icon 
          [name]="trendIcon()"
          [attr.aria-label]="trendDescription()"
          [class.text-green-500]="priceChange() > 0"
          [class.text-red-500]="priceChange() <= 0"
        />
        <span class="sr-only">{{ trendDescription() }}</span>
      </div>
      
      <!-- Accessible button with clear action -->
      <button 
        class="btn-primary"
        (click)="handleSelect()"
        [attr.aria-label]="'View details for ' + symbol()"
        [attr.aria-describedby]="'crypto-name-' + symbol()">
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
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .price-card {
        border: 2px solid currentColor;
      }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  `]
})
export class AccessiblePriceCardComponent {
  symbol = input.required<string>();
  currentPrice = input.required<number>();
  priceChange = input.required<number>();
  selected = output<string>();
  
  priceCardLabel = computed(() => 
    `${this.symbol()} price card, current price ${this.currentPrice()}, ${this.trendDescription()}`
  );
  
  trendIcon = computed(() => 
    this.priceChange() > 0 ? 'trending-up' : 'trending-down'
  );
  
  trendDescription = computed(() => {
    const change = this.priceChange();
    const direction = change > 0 ? 'increasing' : 'decreasing';
    return `Price is ${direction} by ${Math.abs(change)}%`;
  });
  
  handleSelect(): void {
    this.selected.emit(this.symbol());
  }
}
```

---

## Example 6: Performance Optimization with Track and Memoization

**Scenario:** Optimizing a large list of crypto prices with proper tracking and memoization.

```typescript
// optimized-market-list.component.ts
import { Component, signal, computed } from '@angular/core';
import { memoize } from 'lodash-es';

@Component({
  selector: 'app-optimized-market-list',
  standalone: true,
  template: `
    <div class="market-list">
      <!-- GOOD: Track by unique identifier -->
      @for (market of markets(); track market.symbol) {
        <div class="market-item">
          <span>{{ market.symbol }}</span>
          <span>{{ formatPrice(market.price) }}</span>
          <span [class.text-green-500]="market.change24h > 0">
            {{ market.change24h }}%
          </span>
        </div>
      }
      
      <!-- Portfolio summary with computed -->
      <div class="portfolio-summary">
        <h3>Total Value</h3>
        <p>{{ totalPortfolioValue() | currency }}</p>
      </div>
    </div>
  `
})
export class OptimizedMarketListComponent {
  markets = signal<CryptoModel[]>([]);
  holdings = signal<Holding[]>([]);
  
  // Computed signal caches result until dependencies change
  totalPortfolioValue = computed(() => {
    const marketPrices = new Map(
      this.markets().map(m => [m.symbol, m.price])
    );
    return this.calculatePortfolioValue(this.holdings(), marketPrices);
  });
  
  // Memoized expensive computation
  private calculatePortfolioValue = memoize(
    (holdings: Holding[], prices: Map<string, number>): number => {
      console.log('Calculating portfolio value...'); // Only logs when inputs change
      return holdings.reduce((total, holding) => {
        const price = prices.get(holding.symbol) ?? 0;
        return total + (holding.amount * price);
      }, 0);
    },
    // Custom resolver for cache key
    (holdings, prices) => `${holdings.length}-${prices.size}-${this.getCacheKey(holdings)}`
  );
  
  // Pure utility function for price formatting
  formatPrice(price: number): string {
    if (price < 1) return price.toFixed(6);
    if (price < 100) return price.toFixed(4);
    return price.toFixed(2);
  }
  
  private getCacheKey(holdings: Holding[]): string {
    return holdings.map(h => `${h.symbol}:${h.amount}`).join('|');
  }
}
```

**BAD - Function calls in template:**

```html
<!-- WRONG: calculateTotal() called on every change detection -->
<div>Total: {{ calculateTotal() }}</div>

<!-- WRONG: Recreating function reference every render -->
<button (click)="items.filter(i => i.active)">Show Active</button>
```

**GOOD - Computed signals:**

```typescript
// Component class
totalAmount = computed(() => 
  this.items().reduce((sum, item) => sum + item.price, 0)
);

activeItems = computed(() => 
  this.items().filter(item => item.active)
);
```

```html
<!-- Template - no function calls -->
<div>Total: {{ totalAmount() }}</div>
<button (click)="showActive()">Show Active ({{ activeItems().length }})</button>
```

---

## Example 7: Complete Vitest Test Suite

**Scenario:** Comprehensive test suite for PriceCardComponent.

```typescript
// price-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { signal } from '@angular/core';
import { of, throwError, Subject } from 'rxjs';
import { PriceCardComponent } from './price-card.component';
import { MarketService } from '../services/market.service';

describe('PriceCardComponent', () => {
  let component: PriceCardComponent;
  let fixture: ComponentFixture<PriceCardComponent>;
  let mockMarketService: any;
  let priceUpdates$: Subject<number>;
  
  beforeEach(async () => {
    // Setup mock service with Subject for controlled emissions
    priceUpdates$ = new Subject<number>();
    mockMarketService = {
      getPriceUpdates: vi.fn().mockReturnValue(priceUpdates$.asObservable()),
      isConnected: signal(true)
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
  
  afterEach(() => {
    priceUpdates$.complete();
  });
  
  it('should create component', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display loading state initially', () => {
    fixture.componentRef.setInput('symbol', 'BTCUSDT');
    fixture.detectChanges();
    
    expect(component.isLoading()).toBe(true);
    
    const compiled = fixture.nativeElement;
    const loadingSpinner = compiled.querySelector('.loading-spinner');
    expect(loadingSpinner).toBeTruthy();
  });
  
  it('should update price when service emits', async () => {
    const testPrice = 42000;
    
    fixture.componentRef.setInput('symbol', 'BTCUSDT');
    fixture.detectChanges();
    
    // Emit price update
    priceUpdates$.next(testPrice);
    
    // Wait for async operations
    await fixture.whenStable();
    fixture.detectChanges();
    
    expect(component.currentPrice()).toBe(testPrice);
    expect(component.isLoading()).toBe(false);
  });
  
  it('should handle error state correctly', async () => {
    // Override mock to return error
    mockMarketService.getPriceUpdates.mockReturnValue(
      throwError(() => new Error('Network error'))
    );
    
    // Recreate component with error scenario
    fixture = TestBed.createComponent(PriceCardComponent);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('symbol', 'BTCUSDT');
    fixture.detectChanges();
    
    await fixture.whenStable();
    fixture.detectChanges();
    
    expect(component.hasError()).toBe(true);
    
    const errorMsg = fixture.nativeElement.querySelector('.error-message');
    expect(errorMsg).toBeTruthy();
    expect(errorMsg.textContent).toContain('Failed to load');
  });
  
  it('should emit priceSelected event when clicked', () => {
    const spy = vi.fn();
    component.priceSelected.subscribe(spy);
    
    fixture.componentRef.setInput('symbol', 'BTCUSDT');
    component.currentPrice.set(42000);
    component.previousPrice.set(40000);
    
    component.handlePriceClick();
    
    expect(spy).toHaveBeenCalledWith({
      symbol: 'BTCUSDT',
      price: 42000,
      change24h: expect.any(Number)
    });
  });
  
  it('should compute price change correctly', () => {
    component.currentPrice.set(110);
    component.previousPrice.set(100);
    
    expect(component.isPriceIncreasing()).toBe(true);
    expect(component.priceChangePercent()).toBeCloseTo(10, 1);
    
    component.currentPrice.set(90);
    expect(component.isPriceIncreasing()).toBe(false);
    expect(component.priceChangePercent()).toBeCloseTo(-10, 1);
  });
  
  it('should convert price to selected currency', () => {
    component.currentPrice.set(100);
    component.selectedCurrency.set('EUR');
    
    const converted = component.priceInSelectedCurrency();
    expect(converted).toBeCloseTo(92, 0); // EUR rate ~0.92
  });
  
  it('should update previous price before setting new price', () => {
    fixture.componentRef.setInput('symbol', 'BTCUSDT');
    fixture.detectChanges();
    
    priceUpdates$.next(100);
    expect(component.currentPrice()).toBe(100);
    expect(component.previousPrice()).toBe(0);
    
    priceUpdates$.next(110);
    expect(component.currentPrice()).toBe(110);
    expect(component.previousPrice()).toBe(100);
  });
  
  it('should handle rapid price updates with throttling', async () => {
    fixture.componentRef.setInput('symbol', 'BTCUSDT');
    fixture.detectChanges();
    
    // Emit multiple rapid updates
    priceUpdates$.next(100);
    priceUpdates$.next(101);
    priceUpdates$.next(102);
    priceUpdates$.next(103);
    
    await fixture.whenStable();
    
    // Due to throttling in service, not all updates may be processed
    expect(component.currentPrice()).toBeGreaterThanOrEqual(100);
  });
});
```

---

## Example 8: Service Testing with HTTP Mocks

**Scenario:** Testing MarketService with HttpClientTestingModule.

```typescript
// market.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MarketService } from './market.service';
import { CryptoModel } from '../models/crypto.model';
import { BinanceTickerResponse } from '../models/binance.model';

describe('MarketService', () => {
  let service: MarketService;
  let httpMock: HttpTestingController;
  
  const mockBinanceResponse: BinanceTickerResponse[] = [
    {
      symbol: 'BTCUSDT',
      lastPrice: '42000.00',
      priceChangePercent: '2.5',
      volume: '12345.67',
      highPrice: '43000.00',
      lowPrice: '41000.00'
    },
    {
      symbol: 'ETHUSDT',
      lastPrice: '2200.00',
      priceChangePercent: '-1.2',
      volume: '8910.11',
      highPrice: '2250.00',
      lowPrice: '2150.00'
    }
  ];
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MarketService]
    });
    
    service = TestBed.inject(MarketService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should fetch markets successfully', (done) => {
    service.fetchMarkets().subscribe({
      next: (data: CryptoModel[]) => {
        expect(data).toHaveLength(2);
        expect(data[0].symbol).toBe('BTCUSDT');
        expect(data[0].price).toBe(42000);
        expect(data[1].change24h).toBe(-1.2);
        done();
      }
    });
    
    const req = httpMock.expectOne('https://api.binance.com/api/v3/ticker/24hr');
    expect(req.request.method).toBe('GET');
    req.flush(mockBinanceResponse);
  });
  
  it('should handle HTTP error gracefully', (done) => {
    service.fetchMarkets().subscribe({
      error: (error) => {
        expect(error.message).toContain('Failed to fetch market data');
        done();
      }
    });
    
    const req = httpMock.expectOne('https://api.binance.com/api/v3/ticker/24hr');
    req.error(new ProgressEvent('Network error'), { status: 500, statusText: 'Server Error' });
  });
  
  it('should retry failed requests 3 times', () => {
    service.fetchMarkets().subscribe({
      error: () => {} // Expect error after retries
    });
    
    // Initial request
    const req1 = httpMock.expectOne('https://api.binance.com/api/v3/ticker/24hr');
    req1.error(new ProgressEvent('Network error'), { status: 500 });
    
    // Retry 1
    const req2 = httpMock.expectOne('https://api.binance.com/api/v3/ticker/24hr');
    req2.error(new ProgressEvent('Network error'), { status: 500 });
    
    // Retry 2
    const req3 = httpMock.expectOne('https://api.binance.com/api/v3/ticker/24hr');
    req3.error(new ProgressEvent('Network error'), { status: 500 });
    
    // Retry 3
    const req4 = httpMock.expectOne('https://api.binance.com/api/v3/ticker/24hr');
    req4.error(new ProgressEvent('Network error'), { status: 500 });
  });
  
  it('should fetch single ticker by symbol', (done) => {
    const singleTicker = mockBinanceResponse[0];
    
    service.fetchTickerBySymbol('BTCUSDT').subscribe({
      next: (data: CryptoModel) => {
        expect(data.symbol).toBe('BTCUSDT');
        expect(data.price).toBe(42000);
        done();
      }
    });
    
    const req = httpMock.expectOne(req => 
      req.url.includes('/ticker/24hr') && 
      req.params.get('symbol') === 'BTCUSDT'
    );
    req.flush(singleTicker);
  });
  
  it('should cache fetchMarkets() results', () => {
    // First call
    service.fetchMarkets().subscribe();
    const req1 = httpMock.expectOne('https://api.binance.com/api/v3/ticker/24hr');
    req1.flush(mockBinanceResponse);
    
    // Second call should use cached result (no HTTP request)
    service.fetchMarkets().subscribe();
    httpMock.expectNone('https://api.binance.com/api/v3/ticker/24hr');
  });
  
  it('should update connection signal on WebSocket events', () => {
    expect(service.isConnected()).toBe(false);
    
    // Test WebSocket connection (requires additional setup or mocks)
    // This is a placeholder - WebSocket testing needs specialized tools
  });
});
```

---

## Example 9: Lazy Loading Routes

**Scenario:** Configuring lazy-loaded routes for features.

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => 
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent),
    title: 'Dashboard | CryptoTerminal'
  },
  {
    path: 'markets',
    loadComponent: () => 
      import('./features/markets/markets.component')
        .then(m => m.MarketsComponent),
    title: 'Markets | CryptoTerminal'
  },
  {
    path: 'portfolio',
    loadComponent: () => 
      import('./features/portfolio/portfolio.component')
        .then(m => m.PortfolioComponent),
    title: 'Portfolio | CryptoTerminal',
    canActivate: [AuthGuard] // Example guard
  },
  {
    path: 'settings',
    loadChildren: () => 
      import('./features/settings/settings.routes')
        .then(m => m.SETTINGS_ROUTES),
    title: 'Settings | CryptoTerminal'
  },
  {
    path: '**',
    loadComponent: () => 
      import('./shared/components/not-found/not-found.component')
        .then(m => m.NotFoundComponent),
    title: '404 Not Found'
  }
];
```

```typescript
// features/settings/settings.routes.ts
import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./settings.component').then(m => m.SettingsComponent),
    children: [
      {
        path: 'profile',
        loadComponent: () => 
          import('./components/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'preferences',
        loadComponent: () => 
          import('./components/preferences/preferences.component').then(m => m.PreferencesComponent)
      },
      {
        path: 'security',
        loadComponent: () => 
          import('./components/security/security.component').then(m => m.SecurityComponent)
      }
    ]
  }
];
```

---

## Example 10: Commit Message Examples

**Scenario:** Proper conventional commit messages for various changes.

### Feature Addition

```
feat(dashboard): add real-time WebSocket price updates using signals

- Implement MarketService.connectToMarketStream() with exponential backoff
- Add throttleTime(200ms) to prevent UI overload
- Update DashboardComponent to subscribe with takeUntilDestroyed()
- Display connection status in header with isConnected signal

Closes #APP-15
```

### Bug Fix

```
fix(market-service): handle WebSocket disconnect timeout correctly

- Add reconnection logic with exponential backoff (2s, 4s, 8s, max 30s)
- Update connectionAttempts signal to track retry count
- Log connection/disconnection events for debugging
- Reset connectionAttempts on successful connection

Fixes #APP-23
```

### Refactoring

```
refactor: extract currency formatter to shared utils

- Move formatPrice() from PriceCardComponent to currency-formatter.ts
- Make formatPrice() a pure utility function
- Add unit tests for all currency format scenarios
- Update 8 components to use shared formatter

No functional changes.
```

### Performance Improvement

```
perf: optimize market list rendering with track and memoization

- Add track by symbol.id in @for loops
- Memoize calculatePortfolioValue() with lodash-es
- Replace function calls in template with computed signals
- Reduce re-renders by 85% (measured with Chrome DevTools)

Improves list performance from 120ms to 18ms on 500 items.

Related to #APP-34
```

### Testing

```
test: add comprehensive market service unit tests

- Test fetchMarkets() success and error scenarios
- Test retry logic (3 attempts with 1s delay)
- Test caching with shareReplay
- Test WebSocket connection signals
- Achieve 92% coverage on MarketService

Coverage: 92% (was 45%)
```

### Documentation

```
docs: add Binance API integration guide

- Document REST API endpoints and response models
- Add WebSocket stream setup with reconnection patterns
- Include rate limiting and throttling recommendations
- Provide code examples for common use cases

No code changes.
```

---

## Example 11: TypeScript Strict Mode Best Practices

**Scenario:** Ensuring type safety throughout the application.

```typescript
// ❌ BAD: Using `any`
function processData(data: any) {
  return data.map((item: any) => item.price * 2);
}

// ✅ GOOD: Proper typing
function processData(data: CryptoModel[]): number[] {
  return data.map(item => item.price * 2);
}

// ❌ BAD: Non-null assertion without checking
function getSymbolName(symbol: string | undefined) {
  return symbol!.toUpperCase(); // Runtime error if undefined
}

// ✅ GOOD: Proper null checking
function getSymbolName(symbol: string | undefined): string {
  if (!symbol) {
    throw new Error('Symbol is required');
  }
  return symbol.toUpperCase();
}

// Alternative with default value
function getSymbolName(symbol: string | undefined): string {
  return (symbol ?? 'UNKNOWN').toUpperCase();
}

// ❌ BAD: Type assertion without validation
const data = response as CryptoModel[];

// ✅ GOOD: Type guard with validation
function isCryptoModel(obj: any): obj is CryptoModel {
  return (
    typeof obj === 'object' &&
    typeof obj.symbol === 'string' &&
    typeof obj.price === 'number' &&
    typeof obj.change24h === 'number'
  );
}

function processCryptoData(data: unknown): CryptoModel[] {
  if (!Array.isArray(data)) {
    throw new Error('Expected array');
  }
  
  return data.filter(isCryptoModel);
}
```

---

## Common Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Using zone.js in Zoneless Mode

```typescript
// NEVER DO THIS
import { ChangeDetectorRef } from '@angular/core';

constructor(private cdr: ChangeDetectorRef) {}

someMethod() {
  this.cdr.detectChanges(); // ❌ Defeats zoneless mode
}
```

### ❌ Anti-Pattern 2: Legacy Decorators

```typescript
// ❌ WRONG
@Input() symbol: string;
@Output() selected = new EventEmitter<string>();
@ViewChild('myDiv') myDiv: ElementRef;

// ✅ CORRECT
symbol = input.required<string>();
selected = output<string>();
myDiv = viewChild<ElementRef>('myDiv');
```

### ❌ Anti-Pattern 3: Missing Subscription Cleanup

```typescript
// ❌ MEMORY LEAK
ngOnInit() {
  this.service.getData().subscribe(data => {
    this.items = data;
  });
}

// ✅ PROPER CLEANUP
constructor() {
  this.service.getData()
    .pipe(takeUntilDestroyed())
    .subscribe(data => this.items.set(data));
}
```

### ❌ Anti-Pattern 4: Overusing effect()

```typescript
// ❌ DON'T USE effect() FOR THIS
effect(() => {
  const price = this.currentPrice();
  this.displayPrice.set(price * this.exchangeRate());
});

// ✅ USE computed() INSTEAD
displayPrice = computed(() => 
  this.currentPrice() * this.exchangeRate()
);
```

---

## Quick Reference Commands

```bash
# Development
npm start              # Start dev server (zoneless mode)
npm run build          # Production build
npm run build:stats    # Build with bundle analyzer

# Testing
npm run test           # Run tests once
npm run test:watch     # Watch mode
npm run test:coverage  # Generate coverage report
npm run test:ui        # Open Vitest UI

# Linting & Formatting
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix lint issues
npm run format         # Prettier format
npm run format:check   # Check formatting

# Type Checking
npm run type-check     # TypeScript compile check (no emit)
```

---

**Remember:** Always read `master-context.md` and `rules.md` before implementing. When in doubt, prioritize:
1. Security
2. Correctness
3. Accessibility
4. Maintainability
5. Performance

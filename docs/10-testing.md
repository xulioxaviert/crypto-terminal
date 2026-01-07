# 10. Testing

## 📋 Índice
- [Testing Strategy](#testing-strategy)
- [Unit Testing](#unit-testing)
- [Component Testing](#component-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing-futuro)

## 🎯 Testing Strategy

### Pirámide de Testing

```
           /\
          /  \  E2E (5%)
         /────\
        /  I   \ Integration (15%)
       /────────\
      / U  Unit  \ 70%
     /  C  Comp   \
    /─────────────\
   / Component (10%)\
  /───────────────────\
```

### Distribución Recomendada

| Tipo | % | Herramienta | Speed |
|------|---|-------------|-------|
| **Unit** | 70% | Vitest + TypeScript | ⚡ Muy rápido |
| **Integration** | 15% | Vitest + TestBed | ⚡ Rápido |
| **Component** | 10% | Vitest + Fixture | ⚡ Rápido |
| **E2E** | 5% | (Futuro: Cypress/Playwright) | 🐌 Lento |

---

## 🧪 Unit Testing

### Qué es

Tests de funciones/métodos individuales sin dependencias externas.

### Ubicación

`src/app/**/*.spec.ts`

### Ejemplo: Test de Función Pura

```typescript
// my-utils.ts
export function formatPrice(price: number): string {
  return `$${price.toLocaleString('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })}`;
}

// my-utils.spec.ts
import { describe, it, expect } from 'vitest';
import { formatPrice } from './my-utils';

describe('formatPrice', () => {
  it('should format price with currency symbol', () => {
    expect(formatPrice(1000)).toBe('$1,000.00');
  });

  it('should handle decimals', () => {
    expect(formatPrice(1234.567)).toBe('$1,234.57');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('should handle negative numbers', () => {
    expect(formatPrice(-100)).toBe('-$100.00');
  });
});
```

### Estructura Básica

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Feature Name', () => {
  // Setup (opcional)
  beforeEach(() => {
    // Ejecuta antes de cada test
  });

  it('should do something', () => {
    // Arrange (preparación)
    const input = 5;
    
    // Act (ejecución)
    const result = input * 2;
    
    // Assert (verificación)
    expect(result).toBe(10);
  });
});
```

---

## 🔧 Component Testing

### Ubicación Actual

- [`src/app/features/dashboard/components/price-card/price-card.component.spec.ts`](../src/app/features/dashboard/components/price-card/price-card.component.spec.ts)
- [`src/app/features/dashboard/service/market.spec.ts`](../src/app/features/dashboard/service/market.spec.ts)

### Ejemplo: Test de PriceCardComponent

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceCardComponent } from './price-card.component';
import { CryptoAsset } from '../../models/crypto.model';

describe('PriceCardComponent', () => {
  let component: PriceCardComponent;
  let fixture: ComponentFixture<PriceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PriceCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('should accept required asset input', () => {
      const mockAsset: CryptoAsset = {
        id: '1',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 50000,
        change24h: 5.2,
        icon: '',
        sparkline: []
      };

      fixture.componentRef.setInput('asset', mockAsset);
      fixture.detectChanges();

      expect(component.asset()).toBe(mockAsset);
    });
  });

  describe('Computed Signals', () => {
    it('should compute isPositive as true for positive change', () => {
      const mockAsset: CryptoAsset = {
        id: '1',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 50000,
        change24h: 5.2,
        icon: '',
        sparkline: []
      };

      fixture.componentRef.setInput('asset', mockAsset);
      fixture.detectChanges();

      expect(component.isPositive()).toBe(true);
    });

    it('should compute isPositive as false for negative change', () => {
      const mockAsset: CryptoAsset = {
        id: '1',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 50000,
        change24h: -2.5,
        icon: '',
        sparkline: []
      };

      fixture.componentRef.setInput('asset', mockAsset);
      fixture.detectChanges();

      expect(component.isPositive()).toBe(false);
    });

    it('should compute isPositive as true for zero change', () => {
      const mockAsset: CryptoAsset = {
        id: '1',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 50000,
        change24h: 0,
        icon: '',
        sparkline: []
      };

      fixture.componentRef.setInput('asset', mockAsset);
      fixture.detectChanges();

      expect(component.isPositive()).toBe(true);
    });
  });

  describe('Template Rendering', () => {
    it('should display asset symbol', () => {
      const mockAsset: CryptoAsset = {
        id: '1',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 50000,
        change24h: 5.2,
        icon: '',
        sparkline: []
      };

      fixture.componentRef.setInput('asset', mockAsset);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('BTC');
    });

    it('should display asset price with currency pipe', () => {
      const mockAsset: CryptoAsset = {
        id: '1',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 50000,
        change24h: 5.2,
        icon: '',
        sparkline: []
      };

      fixture.componentRef.setInput('asset', mockAsset);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('50,000');
    });
  });
});
```

### Helpers para Componentes

```typescript
// test-helpers.ts
import { CryptoAsset } from './models/crypto.model';

export function createMockAsset(overrides?: Partial<CryptoAsset>): CryptoAsset {
  return {
    id: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 50000,
    change24h: 5.2,
    icon: '',
    sparkline: [],
    ...overrides
  };
}

// my.component.spec.ts
it('should handle positive change', () => {
  const asset = createMockAsset({ change24h: 5.2 });
  fixture.componentRef.setInput('asset', asset);
  expect(component.isPositive()).toBe(true);
});
```

---

## 🔌 Service Testing

### Ejemplo: Test de MarketService

```typescript
import { TestBed } from '@angular/core/testing';
import { MarketService } from './market.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BinanceTickerData, PriceUpdate } from '../models/binance.model';

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
    httpMock.verify(); // Verifica no haya requests pendientes
  });

  describe('Initialization', () => {
    it('should initialize with 4 assets', () => {
      const assets = service.assets();
      expect(assets.length).toBe(4);
    });

    it('should initialize assets with zero prices', () => {
      const assets = service.assets();
      assets.forEach(asset => {
        expect(asset.price).toBe(0);
        expect(asset.change24h).toBe(0);
      });
    });
  });

  describe('transformBinanceData', () => {
    it('should transform Binance ticker data correctly', () => {
      const mockData: BinanceTickerData = {
        e: '24hrTicker',
        E: 1672515782136,
        s: 'BTCUSDT',
        p: '2500.00',
        P: '5.24',
        w: '49500.00',
        x: '47500.00',
        c: '50000.00',
        Q: '0.5',
        b: '49999.00',
        B: '10',
        a: '50001.00',
        A: '10',
        o: '47500.00',
        h: '51000.00',
        l: '46000.00',
        v: '1000.5',
        q: '49500000.00',
        O: 1672429382136,
        C: 1672515782136,
        F: 1,
        L: 50000,
        n: 50000
      };

      const result = service['transformBinanceData'](mockData);

      expect(result).toEqual({
        symbol: 'BTC',
        price: 50000,
        change: 5.24
      });
    });

    it('should handle different symbols', () => {
      const mockData: BinanceTickerData = {
        ...createMockBinanceData(),
        s: 'ETHUSDT'
      };

      const result = service['transformBinanceData'](mockData);
      expect(result.symbol).toBe('ETH');
    });
  });

  describe('Asset Updates', () => {
    it('should update asset price immutably', () => {
      const update: PriceUpdate = {
        symbol: 'BTC',
        price: 50000,
        change: 5.2
      };

      service['updateAssetPrice'](update);

      const assets = service.assets();
      const btc = assets.find(a => a.symbol === 'BTC');

      expect(btc?.price).toBe(50000);
      expect(btc?.change24h).toBe(5.2);
    });

    it('should not mutate original asset', () => {
      const assets1 = service.assets();
      
      const update: PriceUpdate = {
        symbol: 'BTC',
        price: 51000,
        change: 6
      };

      service['updateAssetPrice'](update);

      const assets2 = service.assets();

      expect(assets1).not.toBe(assets2);
      expect(assets1[0]).not.toBe(assets2[0]);
    });
  });

  describe('REST API', () => {
    it('should fetch all prices', () => {
      const mockPrices = [
        { symbol: 'BTCUSDT', price: '50000.00' },
        { symbol: 'ETHUSDT', price: '3000.00' }
      ];

      service.getAllPrice().subscribe(prices => {
        expect(prices).toEqual(mockPrices);
      });

      const req = httpMock.expectOne(/ticker\/price$/);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrices);
    });

    it('should fetch price by symbol', () => {
      const mockPrice = { symbol: 'BTCUSDT', price: '50000.00' };

      service.getPriceBySymbol('BTCUSDT').subscribe(price => {
        expect(price).toEqual(mockPrice);
      });

      const req = httpMock.expectOne(req => 
        req.url.includes('ticker/price') && req.params.has('symbol')
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('symbol')).toBe('BTCUSDT');
      req.flush(mockPrice);
    });
  });
});

// Helper function
function createMockBinanceData(): BinanceTickerData {
  return {
    e: '24hrTicker',
    E: 1672515782136,
    s: 'BTCUSDT',
    p: '2500.00',
    P: '5.24',
    w: '49500.00',
    x: '47500.00',
    c: '50000.00',
    Q: '0.5',
    b: '49999.00',
    B: '10',
    a: '50001.00',
    A: '10',
    o: '47500.00',
    h: '51000.00',
    l: '46000.00',
    v: '1000.5',
    q: '49500000.00',
    O: 1672429382136,
    C: 1672515782136,
    F: 1,
    L: 50000,
    n: 50000
  };
}
```

---

## 🧪 Testing de Signals

### Test de Signals

```typescript
import { signal, computed, effect } from '@angular/core';
import { describe, it, expect } from 'vitest';

describe('Signals', () => {
  it('should create and read signal', () => {
    const count = signal(0);
    expect(count()).toBe(0);
  });

  it('should update signal with set', () => {
    const count = signal(0);
    count.set(5);
    expect(count()).toBe(5);
  });

  it('should update signal with update', () => {
    const count = signal(0);
    count.update(n => n + 1);
    expect(count()).toBe(1);
  });

  it('should compute derived values', () => {
    const count = signal(0);
    const doubled = computed(() => count() * 2);

    expect(doubled()).toBe(0);

    count.set(5);
    expect(doubled()).toBe(10);
  });

  it('should only recalculate computed when source changes', () => {
    const count = signal(0);
    let computeCount = 0;
    
    const doubled = computed(() => {
      computeCount++;
      return count() * 2;
    });

    doubled(); // Initial evaluation
    expect(computeCount).toBe(1);

    doubled(); // No dependency changed
    expect(computeCount).toBe(1); // Still 1 (cached)

    count.set(5); // Dependency changed
    doubled(); // Recalculate
    expect(computeCount).toBe(2);
  });

  it('should trigger effect when signal changes', () => {
    const count = signal(0);
    let effectRuns = 0;

    effect(() => {
      count();
      effectRuns++;
    });

    expect(effectRuns).toBe(1); // Initial run

    count.set(5);
    expect(effectRuns).toBe(2); // After update
  });
});
```

---

## 🧩 Mocking y Spies

### Mocking Services

```typescript
import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MarketService } from './service/market.service';
import { signal } from '@angular/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let marketServiceMock: jasmine.SpyObj<MarketService>;

  beforeEach(async () => {
    marketServiceMock = jasmine.createSpyObj('MarketService', 
      ['getAllPrice', 'getPriceBySymbol'],
      {
        assets: signal([
          { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 50000, change24h: 5, icon: '', sparkline: [] }
        ])
      }
    );

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: MarketService, useValue: marketServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should display mocked assets', () => {
    fixture.detectChanges();

    const assets = component.assets();
    expect(assets.length).toBe(1);
    expect(assets[0].symbol).toBe('BTC');
  });
});
```

---

## 📊 Coverage Reports

### Ejecutar Tests con Coverage

```bash
# Vitest con coverage
npm run test:coverage

# Output:
# ────────────────────────────────────────────────────────────────
# File           | % Stmts | % Branch | % Funcs | % Lines |
# ────────────────────────────────────────────────────────────────
# All files      |   85.2  |   78.5   |   90.1  |   85.5  |
# market.service |   95.0  |   92.0   |  100.0  |   95.0  |
# dashboard.comp |   80.0  |   70.0  |   85.0  |   80.0  |
# ────────────────────────────────────────────────────────────────
```

### Interpretar Coverage

- **Statements**: % de líneas ejecutadas
- **Branches**: % de condiciones evaluadas
- **Functions**: % de funciones llamadas
- **Lines**: % de líneas ejecutadas

**Meta**: 80% mínimo, 90%+ ideal

---

## ✅ Checklist de Testing

### Antes de Pushear

- [ ] Todos los tests pasan (`npm test`)
- [ ] Coverage > 80% (`npm run test:coverage`)
- [ ] No hay warnings en console
- [ ] Tests son rápidos (< 5s)

### Para Nuevas Features

- [ ] Unit tests para lógica pura
- [ ] Component tests para templates
- [ ] Service tests para APIs
- [ ] Integration tests para flujos completos

---

## 🔗 Referencias

- [Vitest Documentation](https://vitest.dev/)
- [Angular Testing](https://angular.dev/guide/testing)
- [Testing Library](https://testing-library.com/)
- [Jasmine Matchers](https://jasmine.github.io/api/edge/matchers.html)

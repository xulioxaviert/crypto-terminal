# 4. Servicios y Gestión de Estado

## 📋 Índice
- [MarketService](#marketservice)
- [PortfolioService](#portfolioservice)
- [ChartDataService](#chartdataservice)
- [Gestión de Estado con Signals](#gestión-de-estado-con-signals)
- [RxJS y WebSocket](#rxjs-y-websocket)
- [Patrones de Estado](#patrones-de-estado)

## 🔧 MarketService

El servicio principal para gestionar datos de mercado de criptomonedas.

### Ubicación
[`src/app/features/dashboard/service/market.service.ts`](../src/app/features/dashboard/service/market.service.ts)

### Responsabilidades

1. **Conectar con Binance WebSocket** para streaming en tiempo real
2. **Gestionar estado de assets** con Signals
3. **Proporcionar API REST** para datos históricos
4. **Transformar datos** de Binance a nuestro modelo

### Arquitectura del Servicio

```typescript
@Injectable({
  providedIn: 'root' // Singleton en toda la app
})
export class MarketService {
  // 1. Configuración
  private readonly BASE_URL = API_CONFIG.binance.baseUrl;
  private readonly TRACKED_ASSETS = ['btcusdt', 'ethusdt', 'solusdt', 'dogeusdt'] as const;
  
  // 2. WebSocket stream (RxJS)
  private readonly marketStream$ = webSocket<BinanceTickerData>(WS_URL).pipe(
    throttleTime(100),
    map(this.transformBinanceData),
    retry({ delay: 3000 }),
    catchError(this.handleError)
  );
  
  // 3. Conversión a Signal
  public readonly livePriceUpdate = toSignal(this.marketStream$);
  
  // 4. Estado privado (WritableSignal)
  private readonly assetsMap = signal<Map<string, CryptoAsset>>(this.initializeAssets());
  
  // 5. Estado público (Computed)
  public readonly assets = computed(() => 
    Array.from(this.assetsMap().values())
  );
  
  // 6. Efecto para sincronización
  constructor() {
    effect(() => {
      const update = this.livePriceUpdate();
      if (update) {
        this.updateAssetPrice(update);
      }
    });
  }
}
```

### Desglose de Componentes

#### 1. Configuración

```typescript
private readonly BASE_URL = API_CONFIG.binance.baseUrl;
private readonly http = inject(HttpClient);

// Assets a monitorear
private readonly TRACKED_ASSETS = ['btcusdt', 'ethusdt', 'solusdt', 'dogeusdt'] as const;
```

**Por qué `as const`**: Convierte el array en un tipo literal, permitiendo type-checking estricto:

```typescript
type TrackedAsset = typeof TRACKED_ASSETS[number]; 
// 'btcusdt' | 'ethusdt' | 'solusdt' | 'dogeusdt'
```

#### 2. WebSocket Stream (RxJS)

```typescript
private readonly marketStream$ = webSocket<BinanceTickerData>(this.WS_URL).pipe(
  throttleTime(100),        // 1. Anti-saturación: máx 10 updates/seg
  map((data) => this.transformBinanceData(data)), // 2. Transform
  retry({ delay: 3000 }),   // 3. Auto-reconnect cada 3s
  catchError((error) => {   // 4. Error handling
    console.error('❌ WebSocket error:', error);
    return of(null);
  })
);
```

**Operadores RxJS Explicados**:

1. **`throttleTime(100)`**: Limita la frecuencia de updates
   - Binance envía ~250ms por símbolo
   - Throttling a 100ms = máx 10 updates/segundo
   - Evita saturar el navegador

2. **`map()`**: Transforma datos de Binance a nuestro modelo
   ```typescript
   // Entrada: { s: 'BTCUSDT', c: '50000', P: '5.2', ... }
   // Salida: { symbol: 'BTC', price: 50000, change: 5.2 }
   ```

3. **`retry({ delay: 3000 })`**: Reconexión automática
   - Si el WebSocket se cierra, reintenta en 3 segundos
   - Infinitos reintentos (no hay `count`)

4. **`catchError()`**: Manejo de errores
   - Captura errores y retorna `of(null)`
   - Evita que el stream se rompa completamente

#### 3. Conversión RxJS → Signal

```typescript
public readonly livePriceUpdate = toSignal(this.marketStream$);
```

**`toSignal()`**:
- Convierte `Observable<PriceUpdate>` → `Signal<PriceUpdate | undefined>`
- Se suscribe automáticamente
- Se desuscribe automáticamente al destruir el servicio
- Tipo: `Signal<PriceUpdate | undefined>` (puede ser undefined si aún no hay datos)

#### 4. Estado Privado (WritableSignal)

```typescript
private readonly assetsMap = signal<Map<string, CryptoAsset>>(
  this.initializeAssets()
);

private initializeAssets(): Map<string, CryptoAsset> {
  const assetConfig: Array<{ symbol: string; name: string; id: string }> = [
    { id: '1', symbol: 'BTC', name: 'Bitcoin' },
    { id: '2', symbol: 'ETH', name: 'Ethereum' },
    { id: '3', symbol: 'SOL', name: 'Solana' },
    { id: '4', symbol: 'DOGE', name: 'Dogecoin' }
  ];

  return new Map(
    assetConfig.map(({ id, symbol, name }) => [
      symbol,
      { id, name, symbol, price: 0, change24h: 0, icon: '', sparkline: [] }
    ])
  );
}
```

**Por qué `Map` en lugar de Array**:
- ✅ Búsqueda O(1) por símbolo (`map.get('BTC')`)
- ✅ Actualización eficiente de un solo asset
- ❌ Array requeriría `find()` = O(n)

#### 5. Estado Público (Computed)

```typescript
public readonly assets = computed(() => 
  Array.from(this.assetsMap().values())
);
```

**Computed Signal**:
- **Derivado**: Se calcula automáticamente cuando `assetsMap` cambia
- **Read-only**: No se puede modificar directamente
- **Memoizado**: Solo recalcula si `assetsMap` cambió
- **Type-safe**: `Signal<CryptoAsset[]>`

#### 6. Effect para Sincronización

```typescript
constructor() {
  effect(() => {
    const update = this.livePriceUpdate();
    if (update) {
      this.updateAssetPrice(update);
    }
  });
}
```

**`effect()`**:
- Ejecuta cuando `livePriceUpdate` cambia
- Es el "puente" entre RxJS (WebSocket) y Signals
- Se ejecuta automáticamente en Angular's injection context

### Métodos del Servicio

#### updateAssetPrice (Privado)

```typescript
private updateAssetPrice(update: PriceUpdate): void {
  this.assetsMap.update(currentMap => {
    const asset = currentMap.get(update.symbol);
    if (!asset) return currentMap;

    // Crear nuevo Map con el asset actualizado (inmutable)
    const newMap = new Map(currentMap);
    newMap.set(update.symbol, {
      ...asset,
      price: update.price,
      change24h: update.change
    });

    return newMap;
  });
}
```

**Inmutabilidad**:
```typescript
// ❌ INCORRECTO (mutable)
this.assetsMap().set(update.symbol, newAsset);

// ✅ CORRECTO (immutable)
this.assetsMap.update(currentMap => {
  const newMap = new Map(currentMap); // Copia
  newMap.set(update.symbol, newAsset);
  return newMap; // Retorna nuevo Map
});
```

#### transformBinanceData (Privado)

```typescript
private transformBinanceData(data: BinanceTickerData): PriceUpdate {
  return {
    symbol: data.s.replace('USDT', ''), // 'BTCUSDT' → 'BTC'
    price: parseFloat(data.c),          // String → Number
    change: parseFloat(data.P)          // String → Number
  };
}
```

#### API REST Methods (Públicos)

```typescript
/** Obtiene el precio de todas las criptomonedas */
getAllPrice() {
  return this.http.get(`${this.BASE_URL}${ENDPOINTS.price}`);
}

/** Obtiene el precio de una criptomoneda específica por símbolo */
getPriceBySymbol(symbol: string) {
  return this.http.get(`${this.BASE_URL}${ENDPOINTS.price}?symbol=${symbol}`);
}
```

**Nota**: Estos métodos retornan `Observable`, no Signal. Son para consultas one-time, no streaming.

## 🔄 Gestión de Estado con Signals

### Principios

1. **Unidirectional Data Flow**: Los datos fluyen en una dirección
2. **Immutability**: Los estados se reemplazan, no se mutan
3. **Single Source of Truth**: Un solo lugar para cada dato
4. **Computed Derivation**: Estado derivado automático

### Tipos de Signals

#### WritableSignal (Mutable)

```typescript
// Crear
const count = signal(0);

// Leer
console.log(count()); // 0

// Escribir (set)
count.set(5);

// Escribir (update)
count.update(n => n + 1);
```

**Cuándo usar**:
- ✅ Estado base que cambia
- ✅ Inputs de usuario
- ✅ Datos de APIs
- ❌ NO para estado derivado (usar computed)

#### Computed Signal (Read-only)

```typescript
const count = signal(0);
const doubled = computed(() => count() * 2);

console.log(doubled()); // 0
count.set(5);
console.log(doubled()); // 10 (actualizado automáticamente)

// ❌ ERROR: No se puede modificar
doubled.set(20); // TypeError
```

**Cuándo usar**:
- ✅ Estado derivado de otros signals
- ✅ Transformaciones
- ✅ Filtros
- ✅ Ordenamiento

### Patrones de Signals

#### Patrón 1: Signal Store (usado en MarketService)

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  // Privado: WritableSignal (estado mutable)
  private readonly dataMap = signal<Map<string, Data>>(new Map());
  
  // Público: Computed (read-only)
  public readonly data = computed(() => 
    Array.from(this.dataMap().values())
  );
  
  // Público: Computed filtrado
  public readonly activeData = computed(() => 
    this.data().filter(d => d.active)
  );
  
  // Método público para mutación controlada
  updateData(id: string, newData: Data) {
    this.dataMap.update(map => {
      const newMap = new Map(map);
      newMap.set(id, newData);
      return newMap;
    });
  }
}
```

**Ventajas**:
- ✅ Encapsulación (privado el writable, público el computed)
- ✅ Inmutabilidad garantizada (computed no se puede mutar)
- ✅ Performance óptima (fine-grained reactivity)

#### Patrón 2: Signal Input (usado en PriceCardComponent)

```typescript
@Component({ /* ... */ })
export class PriceCardComponent {
  // Input signal (immutable desde el padre)
  asset = input.required<CryptoAsset>();
  
  // Computed derivado del input
  isPositive = computed(() => this.asset().change24h >= 0);
  priceFormatted = computed(() => 
    `$${this.asset().price.toLocaleString()}`
  );
}
```

**Ventajas**:
- ✅ Type-safe (required vs optional)
- ✅ Computed automático
- ✅ No necesita ngOnChanges

#### Patrón 3: Signal con Effect

```typescript
@Component({ /* ... */ })
export class MyComponent {
  private searchTerm = signal('');
  private results = signal<Result[]>([]);
  
  constructor() {
    // Effect: ejecuta side-effect cuando searchTerm cambia
    effect(() => {
      const term = this.searchTerm();
      if (term) {
        this.search(term);
      }
    });
  }
  
  private async search(term: string) {
    const data = await fetch(`/api/search?q=${term}`);
    this.results.set(await data.json());
  }
}
```

**Cuándo usar `effect()`**:
- ✅ Sincronización con sistemas externos
- ✅ Logging/Analytics
- ✅ LocalStorage sync
- ❌ NO para lógica de negocio (usar computed)

## 🌐 RxJS y WebSocket

### Por qué RxJS para WebSocket

Aunque usamos Signals para estado, RxJS es ideal para:
- ✅ Streams async (WebSocket, HTTP)
- ✅ Operadores complejos (throttle, retry, map)
- ✅ Composición de múltiples streams
- ✅ Backpressure handling

### Anatomía del WebSocket Stream

```typescript
const marketStream$ = webSocket<BinanceTickerData>(WS_URL).pipe(
  // 1. Rate limiting
  throttleTime(100),
  
  // 2. Transformation
  map((data) => ({
    symbol: data.s.replace('USDT', ''),
    price: parseFloat(data.c),
    change: parseFloat(data.P)
  })),
  
  // 3. Error recovery
  retry({ delay: 3000 }),
  
  // 4. Error handling
  catchError((error) => {
    console.error('WebSocket error:', error);
    return of(null);
  }),
  
  // 5. Cleanup
  finalize(() => console.log('WebSocket closed'))
);
```

### Conversión RxJS → Signals

```typescript
// Observable
const data$ = this.http.get<Data>('/api/data');

// Signal (opción 1: toSignal)
const dataSignal = toSignal(data$, { initialValue: null });

// Signal (opción 2: toSignal con requireSync)
const dataSignal = toSignal(data$, { requireSync: true }); // Throw si no hay valor

// Signal (opción 3: manual con effect)
const dataSignal = signal<Data | null>(null);
effect(() => {
  data$.subscribe(data => dataSignal.set(data));
});
```

**Recomendación**: Usar `toSignal()` (opción 1) para la mayoría de casos.

## 📊 Patrones de Estado

### Patrón 1: Single Source of Truth

```typescript
// ✅ CORRECTO: Un solo lugar para el estado
@Injectable({ providedIn: 'root' })
export class MarketService {
  private assetsMap = signal<Map<string, CryptoAsset>>(new Map());
  public assets = computed(() => Array.from(this.assetsMap().values()));
}

// Los componentes solo leen
@Component({ /* ... */ })
export class DashboardComponent {
  assets = inject(MarketService).assets; // Read-only
}

// ❌ INCORRECTO: Estado duplicado
@Component({ /* ... */ })
export class DashboardComponent {
  private marketService = inject(MarketService);
  assets = signal<CryptoAsset[]>([]); // ⚠️ Duplicación
  
  ngOnInit() {
    // Copiar estado = pérdida de sincronización
    this.assets.set(this.marketService.assets());
  }
}
```

### Patrón 2: Immutable Updates

```typescript
// ✅ CORRECTO: Update inmutable
this.assetsMap.update(currentMap => {
  const newMap = new Map(currentMap); // Nueva instancia
  newMap.set(symbol, updatedAsset);
  return newMap;
});

// ❌ INCORRECTO: Mutación directa
this.assetsMap().set(symbol, updatedAsset); // ⚠️ Mutación
```

### Patrón 3: Computed Chains

```typescript
@Injectable({ providedIn: 'root' })
export class MarketService {
  private assetsMap = signal<Map<string, CryptoAsset>>(new Map());
  
  // Nivel 1: Array de assets
  public assets = computed(() => 
    Array.from(this.assetsMap().values())
  );
  
  // Nivel 2: Assets ordenados por market cap
  public assetsSorted = computed(() => 
    this.assets().sort((a, b) => b.marketCap - a.marketCap)
  );
  
  // Nivel 3: Top 3 assets
  public topAssets = computed(() => 
    this.assetsSorted().slice(0, 3)
  );
}
```

**Ventaja**: Cada computed se recalcula solo si su dependencia cambió.

### Patrón 4: Signal Composition

```typescript
@Component({ /* ... */ })
export class PortfolioComponent {
  private marketService = inject(MarketService);
  
  // Signal local
  holdings = signal<Map<string, number>>(new Map([
    ['BTC', 0.5],
    ['ETH', 2.0]
  ]));
  
  // Computed combinando signals de servicio + local
  portfolioValue = computed(() => {
    const assets = this.marketService.assets();
    const holdings = this.holdings();
    
    return Array.from(holdings.entries()).reduce((total, [symbol, amount]) => {
      const asset = assets.find(a => a.symbol === symbol);
      return total + (asset ? asset.price * amount : 0);
    }, 0);
  });
}
```

## 🧪 Testing de Servicios

### Test de MarketService

```typescript
import { TestBed } from '@angular/core/testing';
import { MarketService } from './market.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MarketService', () => {
  let service: MarketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MarketService]
    });
    service = TestBed.inject(MarketService);
  });

  it('should initialize with 4 assets', () => {
    expect(service.assets().length).toBe(4);
  });

  it('should update asset price immutably', () => {
    const update: PriceUpdate = {
      symbol: 'BTC',
      price: 50000,
      change: 5.2
    };
    
    service['updateAssetPrice'](update);
    
    const btc = service.assets().find(a => a.symbol === 'BTC');
    expect(btc?.price).toBe(50000);
    expect(btc?.change24h).toBe(5.2);
  });
});
```

### Test de Signals

```typescript
import { signal, computed, effect } from '@angular/core';

describe('Signals', () => {
  it('should update computed when source changes', () => {
    const count = signal(0);
    const doubled = computed(() => count() * 2);
    
    expect(doubled()).toBe(0);
    
    count.set(5);
    expect(doubled()).toBe(10);
  });
  
  it('should trigger effect when signal changes', () => {
    const count = signal(0);
    let effectRuns = 0;
    
    effect(() => {
      count(); // Read signal
      effectRuns++;
    });
    
    expect(effectRuns).toBe(1); // Initial run
    
    count.set(5);
    expect(effectRuns).toBe(2); // After update
  });
});
```

## 📚 Mejores Prácticas

### ✅ DO

1. **Signal privado, Computed público**
   ```typescript
   private data = signal<Data[]>([]);
   public readonly dataFiltered = computed(() => this.data().filter(/* */));
   ```

2. **Updates inmutables**
   ```typescript
   this.data.update(current => [...current, newItem]);
   ```

3. **toSignal para Observables**
   ```typescript
   const dataSignal = toSignal(this.http.get('/api/data'));
   ```

4. **effect() para side-effects**
   ```typescript
   effect(() => {
     localStorage.setItem('data', JSON.stringify(this.data()));
   });
   ```

### ❌ DON'T

1. **NO mutar directamente**
   ```typescript
   this.data().push(newItem); // ⚠️ Mutación
   ```

2. **NO usar effect para lógica de negocio**
   ```typescript
   // ❌ Usar computed en su lugar
   effect(() => {
     this.doubled.set(this.count() * 2);
   });
   ```

3. **NO subscribir manualmente a Observables sin cleanup**
   ```typescript
   // ❌ Memory leak
   ngOnInit() {
     this.data$.subscribe(data => console.log(data));
   }
   
   // ✅ Usar toSignal o async pipe
   dataSignal = toSignal(this.data$);
   ```

## � PortfolioService

Servicio para gestionar el portafolio del usuario.

### Ubicación
[`src/app/features/dashboard/service/portfolio.service.ts`](../src/app/features/dashboard/service/portfolio.service.ts)

### Responsabilidades

1. **Gestionar holdings del usuario** (posiciones en criptos)
2. **Calcular valor total del portafolio** con precios en tiempo real
3. **Proporcionar resumen del portafolio** (cambios 24h, ganancias, etc.)

### Arquitectura del Servicio

```typescript
@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private marketService = inject(MarketService);

  // Holdings simulados del usuario
  private readonly holdings = signal<UserHolding[]>([
    { symbol: 'BTC', amount: 1.5 },
    { symbol: 'ETH', amount: 10 },
    { symbol: 'SOL', amount: 50 },
    { symbol: 'DOGE', amount: 1000 },
  ]);

  // Resumen del portafolio calculado en tiempo real
  public readonly summary = computed<PortfolioSummary>(() => {
    const prices = this.marketService.assets();
    let total = 0;

    this.holdings().forEach((holding) => {
      const asset = prices.find(a => a.symbol === holding.symbol);
      if (asset) {
        total += asset.price * holding.amount;
      }
    });

    return {
      totalValue: total,
      change24h: 0, // Placeholder
      changePercentage: 0 // Placeholder
    };
  });
}
```

### Características

- **Reactive Holdings**: Los holdings se pueden actualizar en tiempo real
- **Computed Summary**: Valor total calculado automáticamente con precios de `MarketService`
- **Integración directa**: Lee precios en tiempo real de `MarketService`
- **Type-safe**: Tipado fuerte con modelos `UserHolding` y `PortfolioSummary`

### Métodos Futuros

```typescript
// Añadir nueva posición
addHolding(symbol: string, amount: number): void { }

// Actualizar cantidad
updateHolding(symbol: string, amount: number): void { }

// Eliminar posición
removeHolding(symbol: string): void { }

// Calcular ganancia/pérdida por holding
getHoldingPerformance(symbol: string): HoldingPerformance { }
```

---

## 🔧 ChartDataService

Servicio para gestionar datos de gráficos y visualizaciones.

### Ubicación
[`src/app/features/dashboard/service/chart-data.service.ts`](../src/app/features/dashboard/service/chart-data.service.ts)

### Responsabilidades

1. **Generar datos de gráficos** (históricos, candlestick, etc.)
2. **Transformar datos de Binance** a formato compatible con ApexCharts
3. **Cachear datos de gráficos** para evitar llamadas repetidas
4. **Proporcionar diferentes períodos** (1D, 1W, 1M, 3M, 1Y)

### Métodos Principales

```typescript
@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  private http = inject(HttpClient);

  // Obtener datos de gráfico para un símbolo
  getChartData(symbol: string, interval: string = '1d'): Observable<ChartData> {
    // Llamada a Binance API
  }

  // Transformar a serie para ApexCharts
  transformToApexFormat(data: BinanceCandle[]): number[] {
    // Convertir velas a array de precios
  }

  // Generar dummy data para preview
  generateDummyData(length: number = 24): number[] {
    // Array de datos para gráficos en desarrollo
  }
}
```

### Estado de Implementación

El servicio está parcialmente implementado:
- ✅ Estructura base
- ⚠️ Métodos de transformación (en progreso)
- ⚠️ Integración con API Binance (en progreso)

---

## 🔄 Resumen de Servicios

| Servicio | Estado | Ubicación | Responsabilidad |
|----------|--------|-----------|-----------------|
| **MarketService** | ✅ Completo | `service/market.service.ts` | Precios en tiempo real, WebSocket |
| **PortfolioService** | ✅ Completo | `service/portfolio.service.ts` | Gestión de holdings, cálculo de portafolio |
| **ChartDataService** | ⚠️ Parcial | `service/chart-data.service.ts` | Datos de gráficos, transformaciones |

## 🔗 Referencias

- [Angular Signals](https://angular.dev/guide/signals)
- [RxJS Operators](https://rxjs.dev/api)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Immutability in JavaScript](https://developer.mozilla.org/en-US/docs/Glossary/Immutable)
- [ApexCharts Documentation](https://apexcharts.com/docs/)

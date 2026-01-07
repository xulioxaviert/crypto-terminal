# 2. Arquitectura y Patrones

## 🏛️ Arquitectura General

CryptoTerminal sigue una arquitectura **Domain-Driven Design (DDD) Lite** adaptada para Angular 20, con énfasis en:

- **Separación de responsabilidades** (Separation of Concerns)
- **Unidirectional data flow** (Flujo de datos unidireccional)
- **Signal-based reactivity** (Reactividad basada en Signals)
- **Modularidad mediante standalone components**

## 📐 Capas de la Aplicación

### 1. Core Layer (`src/app/core/`)

**Responsabilidad**: Infraestructura y servicios compartidos que no pertenecen a ningún dominio específico.

```
core/
├── components/        # Componentes globales (Sidebar, Header)
│   ├── header/
│   └── sidebar/
├── config/           # Configuraciones (API URLs, endpoints)
│   ├── api.config.ts
│   └── endpoints.config.ts
├── models/           # Interfaces compartidas (MenuItem)
│   └── nav.model.ts
├── guards/           # (Futuro) Guards de autenticación
└── interceptors/     # (Futuro) HTTP interceptors
```

**Características**:
- Componentes que aparecen en todas las vistas
- Configuraciones centralizadas
- Modelos de infraestructura (no de negocio)
- Singleton services

**Ejemplo**: [`SidebarComponent`](../src/app/core/components/sidebar/sidebar.component.ts)

```typescript
// Componente core que se usa en toda la app
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  // Signal inmutable para items del menú
  readonly menuItems = signal<MenuItem[]>([
    { label: 'Dashboard', icon: 'chart-line', route: '/dashboard' },
    { label: 'Portfolio', icon: 'briefcase', route: '/portfolio' },
    { label: 'Activity', icon: 'clock', route: '/activity' },
  ]);
}
```

### 2. Features Layer (`src/app/features/`)

**Responsabilidad**: Lógica de negocio organizada por dominio/funcionalidad.

```
features/
└── dashboard/
    ├── components/          # Componentes específicos
    │   ├── price-card/      # Tarjeta de precio individual
    │   │   ├── price-card.component.ts
    │   │   ├── price-card.component.html
    │   │   └── price-card.component.spec.ts
    │   └── portfolio-hero/  # Hero del portfolio
    │       ├── portfolio-hero.component.ts
    │       ├── portfolio-hero.component.html
    │       ├── portfolio-hero.component.spec.ts
    │       └── portfolio-hero.scss
    ├── models/              # Modelos de dominio
    │   ├── crypto.model.ts  # CryptoAsset
    │   └── binance.model.ts # Tipos de Binance API
    ├── service/             # Servicios de dominio
    │   ├── market.service.ts
    │   └── market.spec.ts
    ├── dashboard.component.ts
    ├── dashboard.component.html
    └── dashboard.component.spec.ts
```

**Características**:
- Cada feature es autocontenida
- Modelos específicos del dominio
- Servicios especializados
- Componentes presentacionales y contenedores

**Ejemplo**: [`DashboardComponent`](../src/app/features/dashboard/dashboard.component.ts) (Contenedor)

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PriceCardComponent], // Solo componentes necesarios
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private marketService = inject(MarketService);
  
  // Expone signal del servicio (unidirectional flow)
  assets = this.marketService.assets;
}
```

### 3. Shared Layer (Futuro)

**Responsabilidad**: Componentes, pipes y directivas reutilizables entre features.

```
shared/
├── components/
│   ├── button/
│   │   ├── button.component.ts
│   │   └── button.component.html
│   ├── card/
│   └── chart/
├── pipes/
│   ├── format-number.pipe.ts
│   ├── format-date.pipe.ts
│   └── truncate.pipe.ts
├── directives/
│   ├── highlight.directive.ts
│   └── lazy-load.directive.ts
└── utils/
    ├── formatters.ts
    └── validators.ts
```

## 🔄 Flujo de Datos (Unidirectional)

```
┌─────────────────────────────────────────────────────────┐
│                    WebSocket (Binance)                   │
│         wss://stream.binance.com/ws/ticker               │
└──────────────────────┬──────────────────────────────────┘
                       │ BinanceTickerData (raw JSON)
                       ↓
┌─────────────────────────────────────────────────────────┐
│            MarketService (RxJS Observable)               │
│  - webSocket<BinanceTickerData>(WS_URL)                  │
│  - throttleTime(100) → Anti-saturación                   │
│  - map() → Transform to PriceUpdate                      │
│  - retry({ delay: 3000 }) → Auto-reconnect               │
│  - catchError() → Error handling                         │
└──────────────────────┬──────────────────────────────────┘
                       │ Observable<PriceUpdate>
                       ↓
┌─────────────────────────────────────────────────────────┐
│              Signal (toSignal conversion)                │
│  livePriceUpdate = toSignal(marketStream$)               │
└──────────────────────┬──────────────────────────────────┘
                       │ Signal<PriceUpdate | undefined>
                       ↓
┌─────────────────────────────────────────────────────────┐
│         Effect (Sincronización Signal → Estado)          │
│  effect(() => {                                          │
│    const update = this.livePriceUpdate();                │
│    if (update) {                                         │
│      this.updateAssetPrice(update);                      │
│    }                                                     │
│  });                                                     │
└──────────────────────┬──────────────────────────────────┘
                       │ Mutation trigger
                       ↓
┌─────────────────────────────────────────────────────────┐
│          WritableSignal<Map<string, CryptoAsset>>        │
│  assetsMap.update(currentMap => {                        │
│    const newMap = new Map(currentMap); // Immutable     │
│    newMap.set(symbol, {                                  │
│      ...asset,                                           │
│      price: update.price,                                │
│      change24h: update.change                            │
│    });                                                   │
│    return newMap;                                        │
│  });                                                     │
└──────────────────────┬──────────────────────────────────┘
                       │ State updated immutably
                       ↓
┌─────────────────────────────────────────────────────────┐
│           Computed Signal (Derivado, Read-Only)          │
│  assets = computed(() =>                                 │
│    Array.from(this.assetsMap().values())                 │
│  );                                                      │
└──────────────────────┬──────────────────────────────────┘
                       │ CryptoAsset[] (sorted/filtered)
                       ↓
┌─────────────────────────────────────────────────────────┐
│          Components (Template Subscription)              │
│  @for (asset of assets(); track asset.id) {              │
│    <app-price-card [asset]="asset" />                    │
│  }                                                       │
└──────────────────────┬──────────────────────────────────┘
                       │ Input binding
                       ↓
┌─────────────────────────────────────────────────────────┐
│              PriceCardComponent (Leaf)                   │
│  asset = input.required<CryptoAsset>();                  │
│  isPositive = computed(() => asset().change24h >= 0);    │
└─────────────────────────────────────────────────────────┘
```

### Principios del Flujo

1. **Unidireccional**: Los datos fluyen siempre hacia abajo (top → bottom)
2. **Inmutabilidad**: Los estados se reemplazan, nunca se mutan
3. **Reactivo**: Los cambios se propagan automáticamente via Signals
4. **Type-safe**: Tipado fuerte en cada transformación

## 🎯 Patrones Aplicados

### 1. Container/Presentational Pattern

**Container Component** ([`DashboardComponent`](../src/app/features/dashboard/dashboard.component.ts)):
- Inyecta servicios (MarketService)
- Gestiona lógica de negocio
- Pasa datos a componentes presentacionales
- Maneja eventos de usuario

```typescript
// Container (Smart Component)
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PriceCardComponent],
  template: `
    @for (asset of assets(); track asset.id) {
      <app-price-card [asset]="asset" />
    }
  `
})
export class DashboardComponent {
  private marketService = inject(MarketService);
  assets = this.marketService.assets; // Obtiene datos del servicio
}
```

**Presentational Component** ([`PriceCardComponent`](../src/app/features/dashboard/components/price-card/price-card.component.ts)):
- Solo recibe inputs
- No inyecta servicios
- Lógica de presentación pura
- Emite eventos (outputs)

```typescript
// Presentational (Dumb Component)
@Component({
  selector: 'app-price-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './price-card.component.html'
})
export class PriceCardComponent {
  asset = input.required<CryptoAsset>(); // Input solo lectura
  isPositive = computed(() => this.asset().change24h >= 0); // Lógica pura
}
```

**Ventajas**:
- ✅ Componentes presentacionales 100% reusables
- ✅ Testing simplificado (mocks fáciles)
- ✅ Separación clara de responsabilidades
- ✅ Mejor mantenibilidad

### 2. Reactive State Management con Signals

**Principios**:
- `WritableSignal` para estado mutable (privado en services)
- `Computed` para estado derivado (público, read-only)
- `effect()` para side-effects controlados
- Inmutabilidad en todas las actualizaciones

```typescript
@Injectable({ providedIn: 'root' })
export class MarketService {
  // ❌ INCORRECTO (mutable, directo)
  private assets = signal<CryptoAsset[]>([]);
  
  updatePrice(symbol: string, price: number) {
    const current = this.assets();
    const asset = current.find(a => a.symbol === symbol);
    if (asset) {
      asset.price = price; // ⚠️ Mutación directa
    }
  }
  
  // ✅ CORRECTO (inmutable, Map para O(1) lookups)
  private assetsMap = signal<Map<string, CryptoAsset>>(new Map());
  
  // Computed público (derivado, read-only)
  public assets = computed(() => 
    Array.from(this.assetsMap().values())
  );
  
  updatePrice(symbol: string, price: number) {
    this.assetsMap.update(currentMap => {
      const asset = currentMap.get(symbol);
      if (!asset) return currentMap;
      
      // Crear nuevo Map con el asset actualizado
      const newMap = new Map(currentMap);
      newMap.set(symbol, { ...asset, price });
      return newMap;
    });
  }
}
```

### 3. Service Layer Pattern

Los servicios siguen el patrón **Single Responsibility Principle**:

```typescript
// ❌ INCORRECTO: Múltiples responsabilidades
@Injectable({ providedIn: 'root' })
export class AppService {
  getUserData() { /* ... */ }
  getMarketData() { /* ... */ }
  uploadFile() { /* ... */ }
  sendEmail() { /* ... */ }
}

// ✅ CORRECTO: Servicios especializados
@Injectable({ providedIn: 'root' })
export class MarketService {
  getAllPrice() { /* ... */ }
  getPriceBySymbol(symbol: string) { /* ... */ }
  subscribeToTicker() { /* ... */ }
}

@Injectable({ providedIn: 'root' })
export class UserService {
  getCurrentUser() { /* ... */ }
  updateProfile() { /* ... */ }
}
```

### 4. Dependency Injection con `inject()`

Angular 20 favorece `inject()` sobre constructor injection:

```typescript
// ❌ Legacy (constructor injection)
@Component({
  selector: 'app-dashboard',
  template: '...'
})
export class DashboardComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private marketService: MarketService
  ) {}
}

// ✅ Angular 20 (inject function)
@Component({
  selector: 'app-dashboard',
  template: '...'
})
export class DashboardComponent {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly marketService = inject(MarketService);
  
  // O si solo se usa en una función:
  assets = inject(MarketService).assets;
}
```

**Ventajas de `inject()`**:
- ✅ Más limpio y conciso
- ✅ Permite inyección en funciones helper
- ✅ Mejor tree-shaking
- ✅ Funcional programming friendly

### 5. Standalone Components

Todos los componentes son standalone, eliminando `NgModule`:

```typescript
// ❌ Legacy (con NgModule)
@NgModule({
  declarations: [PriceCardComponent],
  imports: [CommonModule],
  exports: [PriceCardComponent]
})
export class DashboardModule {}

@Component({
  selector: 'app-price-card',
  templateUrl: './price-card.component.html'
})
export class PriceCardComponent {}

// ✅ Angular 20 (Standalone)
@Component({
  selector: 'app-price-card',
  standalone: true, // ← Standalone
  imports: [CommonModule, CurrencyPipe], // Importación directa
  templateUrl: './price-card.component.html'
})
export class PriceCardComponent {}
```

**Ventajas**:
- ✅ Menos boilerplate
- ✅ Tree-shaking más efectivo
- ✅ Lazy loading simplificado
- ✅ Más fácil de entender

## 🔒 Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
Cada clase tiene una única razón para cambiar:

```typescript
// ✅ MarketService: Solo gestiona datos de mercado
@Injectable({ providedIn: 'root' })
export class MarketService {
  getAllPrice() { /* ... */ }
  getPriceBySymbol(symbol: string) { /* ... */ }
}

// ✅ PriceCardComponent: Solo presenta un asset
@Component({ /* ... */ })
export class PriceCardComponent {
  asset = input.required<CryptoAsset>();
  isPositive = computed(() => this.asset().change24h >= 0);
}
```

### Open/Closed Principle (OCP)
Extensible sin modificar código existente:

```typescript
// Añadir nuevo asset sin modificar MarketService
const TRACKED_ASSETS = ['btcusdt', 'ethusdt', 'solusdt'] as const;

// Para añadir más, solo modificar la constante:
const TRACKED_ASSETS = ['btcusdt', 'ethusdt', 'solusdt', 'adausdt'] as const;
```

### Liskov Substitution Principle (LSP)
Los subtipos pueden sustituirse sin romper funcionalidad:

```typescript
// Cualquier CryptoAsset puede usarse en PriceCard
interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

// PriceCard acepta cualquier implementación de CryptoAsset
asset = input.required<CryptoAsset>();
```

### Interface Segregation Principle (ISP)
Interfaces pequeñas y específicas:

```typescript
// ✅ Interfaz específica para menu items
export interface MenuItem {
  readonly label: string;
  readonly icon: string;
  readonly route: string;
}

// ✅ Interfaz específica para price updates
export interface PriceUpdate {
  readonly symbol: string;
  readonly price: number;
  readonly change: number;
}
```

### Dependency Inversion Principle (DIP)
Dependencia de abstracciones, no de implementaciones:

```typescript
// ✅ Depende de HttpClient (abstracción), no de fetch()
@Injectable({ providedIn: 'root' })
export class MarketService {
  private readonly http = inject(HttpClient); // Abstracción
  
  getAllPrice() {
    return this.http.get(/* ... */); // No usa fetch() directamente
  }
}
```

## 📊 Gestión de Estado

### Niveles de Estado

#### 1. Local Component State (Signals)
Estado privado del componente:

```typescript
@Component({ /* ... */ })
export class PriceCardComponent {
  // Computed signal (derivado)
  isPositive = computed(() => this.asset().change24h >= 0);
  
  // Signal local (si fuera necesario)
  private isHovered = signal(false);
}
```

#### 2. Service State (Signal Store Pattern)
Estado compartido entre componentes:

```typescript
@Injectable({ providedIn: 'root' })
export class MarketService {
  // Estado privado (writable)
  private readonly assetsMap = signal<Map<string, CryptoAsset>>(new Map());
  
  // Estado público (computed, read-only)
  public readonly assets = computed(() => 
    Array.from(this.assetsMap().values())
  );
}
```

#### 3. Global State (Futuro: NgRx Signal Store)
Para features complejas con múltiples fuentes de verdad:

```typescript
// Futuro: Para auth, user preferences, global settings
export const UserStore = signalStore(
  withState({ user: null, isAuthenticated: false }),
  withMethods(/* ... */)
);
```

## 🔄 Manejo de Side Effects

### Con `effect()` (Usado en [`MarketService`](../src/app/features/dashboard/service/market.service.ts))

```typescript
@Injectable({ providedIn: 'root' })
export class MarketService {
  private livePriceUpdate = toSignal(this.marketStream$);
  
  constructor() {
    // Effect: Sincroniza WebSocket (RxJS) → Signals
    effect(() => {
      const update = this.livePriceUpdate();
      if (update) {
        this.updateAssetPrice(update);
      }
    });
  }
}
```

**Cuándo usar `effect()`**:
- ✅ Sincronización entre sistemas reactivos (RxJS ↔ Signals)
- ✅ Logging o debugging
- ✅ Llamadas a APIs externas (analytics, etc.)
- ❌ NO para lógica de negocio (usar `computed()`)
- ❌ NO para derivar estado (usar `computed()`)

### Con RxJS Operators
Para flujos async complejos:

```typescript
private marketStream$ = webSocket<BinanceTickerData>(WS_URL).pipe(
  throttleTime(100),        // Rate limiting
  map(this.transformData),  // Transformación
  retry({ delay: 3000 }),   // Auto-retry
  catchError(this.handleError) // Error handling
);
```

## 🧪 Testing Strategy

Ver [Testing](./10-testing.md) para detalles completos.

**Pirámide de Testing**:
```
     /\
    /  \  E2E (Futuro)
   /────\  Integration 10%
  /──────\ 
 / Unit   \ 70%
/──────────\
/ Component \ 20%
```

### Unit Testing (Servicios)
```typescript
describe('MarketService', () => {
  it('should update asset price immutably', () => {
    // Arrange
    const service = new MarketService();
    const update: PriceUpdate = {
      symbol: 'BTC',
      price: 50000,
      change: 5.2
    };
    
    // Act
    service['updateAssetPrice'](update);
    
    // Assert
    const assets = service.assets();
    expect(assets[0].price).toBe(50000);
  });
});
```

### Component Testing
```typescript
describe('PriceCardComponent', () => {
  it('should show green for positive change', () => {
    // Arrange
    const fixture = TestBed.createComponent(PriceCardComponent);
    fixture.componentRef.setInput('asset', {
      id: '1',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 50000,
      change24h: 5.2
    });
    
    // Act
    fixture.detectChanges();
    
    // Assert
    expect(fixture.componentInstance.isPositive()).toBe(true);
  });
});
```

## 📝 Convenciones de Código

### Nomenclatura

```typescript
// Signals y variables: camelCase
readonly assets = computed(/* */);
const currentPrice = signal(0);

// Constantes: UPPER_SNAKE_CASE
private readonly TRACKED_ASSETS = ['btc'] as const;
private readonly MAX_RETRIES = 3;

// Interfaces y Tipos: PascalCase
export interface CryptoAsset { }
export type AssetSymbol = 'BTC' | 'ETH';

// Clases y Componentes: PascalCase
export class MarketService { }
export class PriceCardComponent { }

// Funciones y Métodos: camelCase
getAllPrice() { }
private updateAssetPrice() { }
```

### Orden de Miembros en Componentes

```typescript
@Component({ /* ... */ })
export class MyComponent {
  // 1. Inputs (Signal inputs)
  asset = input.required<CryptoAsset>();
  optional = input<string>('default');
  
  // 2. Outputs
  clicked = output<string>();
  
  // 3. Injected dependencies
  private service = inject(MyService);
  
  // 4. Signals (state)
  private count = signal(0);
  
  // 5. Computed signals
  doubled = computed(() => this.count() * 2);
  
  // 6. Constructor (si hay effects)
  constructor() {
    effect(() => console.log(this.count()));
  }
  
  // 7. Lifecycle hooks
  ngOnInit() { }
  ngOnDestroy() { }
  
  // 8. Public methods
  onClick() { }
  onSubmit() { }
  
  // 9. Private methods
  private calculateTotal() { }
  private formatDate() { }
}
```

### Orden de Miembros en Servicios

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  // 1. Constants
  private readonly BASE_URL = 'https://api.example.com';
  
  // 2. Injected dependencies
  private readonly http = inject(HttpClient);
  
  // 3. Private signals (state)
  private readonly dataMap = signal<Map<string, Data>>(new Map());
  
  // 4. Public computed signals
  public readonly data = computed(() => 
    Array.from(this.dataMap().values())
  );
  
  // 5. Constructor (effects)
  constructor() {
    effect(() => { /* ... */ });
  }
  
  // 6. Public API methods
  getData() { }
  updateData(id: string, data: Data) { }
  
  // 7. Private helper methods
  private transformData() { }
  private handleError() { }
}
```

## 🚀 Escalabilidad

El proyecto está preparado para crecer:

### 1. Lazy Loading
Rutas cargadas bajo demanda:

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./features/portfolio/portfolio.component')
      .then(m => m.PortfolioComponent)
  }
];
```

### 2. Feature Modules
Cada feature es autocontenida y puede moverse:

```
features/
├── dashboard/    # Feature 1
├── portfolio/    # Feature 2
└── trading/      # Feature 3 (futuro)
```

### 3. Shared Components
Maximizar reutilización:

```
shared/
├── components/   # Botones, cards, inputs
├── pipes/        # Formatters
└── directives/   # Directivas comunes
```

### 4. Tree-shaking
Bundles optimizados automáticamente:
- Solo se incluye código usado
- Standalone components optimizan el tree-shaking
- Dead code elimination en build

## 🔗 Referencias

- [Angular Architecture Guide](https://angular.dev/guide/architecture)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Container/Presentational Pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)

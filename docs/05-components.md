# 5. Componentes

## 📋 Índice de Componentes

### Core Components
- [SidebarComponent](#sidebarcomponent)
- [HeaderComponent](#headercomponent)

### Feature Components (Dashboard)
- [DashboardComponent](#dashboardcomponent)
- [PriceCardComponent](#pricecardcomponent)
- [PortfolioHeroComponent](#portfolioherocomponent)
- [PortfolioAnalyticsComponent](#portfolioanalyticscomponent)
- [MarketsComponent](#marketscomponent)
- [WalletsComponent](#walletscomponent)
- [SettingsComponent](#settingscomponent)

## 🎯 Arquitectura de Componentes

```
app.component (Root)
│
├── sidebar.component (Core)
│   └── Navigation Menu
│
├── header.component (Core)
│   └── Search, Notifications
│
└── <router-outlet>
    │
    └── dashboard.component (Feature Container)
        │
        ├── portfolio-hero.component (Presentation)
        │   └── Total Value Display
        │
        ├── portfolio-analytics.component (Presentation)
        │   └── Chart Data Visualization
        │
        ├── markets.component (Feature)
        │   └── Market Data Display
        │
        ├── wallets.component (Feature)
        │   └── Wallet Information
        │
        ├── settings.component (Feature)
        │   └── App Settings
        │
        └── price-card.component (Presentation) × 4
            ├── BTC Card
            ├── ETH Card
            ├── SOL Card
            └── DOGE Card
```

---

## 🏗️ Core Components

### SidebarComponent

**Ubicación**: [`src/app/core/components/sidebar/sidebar.component.ts`](../src/app/core/components/sidebar/sidebar.component.ts)

**Responsabilidad**: Navegación principal de la aplicación.

#### Código

```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from '../../models/nav.model';

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
    { label: 'Dashboard', icon: 'lucide-chart-line', route: '/dashboard' },
    { label: 'Portfolio', icon: 'lucide-briefcase', route: '/portfolio' },
    { label: 'Activity', icon: 'lucide-clock', route: '/activity' },
  ]);
}
```

#### Template

```html
<aside class="flex flex-col h-full bg-crypto-surface">
  <!-- Logo -->
  <div class="p-8 mb-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-crypto-neon rounded-xl flex items-center justify-center shadow-neon-soft">
        <i class="lucide-layout-grid text-black text-xl"></i>
      </div>
      <span class="text-2xl font-bold tracking-tight">CryptoTerminal</span>
    </div>
  </div>

  <!-- Navigation Menu -->
  <nav class="flex-1 px-4 space-y-2">
    @for (item of menuItems(); track item.label) {
      <a [routerLink]="item.route"
         routerLinkActive="bg-crypto-neon/10 text-crypto-neon"
         class="flex items-center gap-4 px-4 py-3 rounded-2xl text-crypto-slate 
                hover:bg-slate-800/50 hover:text-white transition-all group">
        <i [class]="item.icon + ' text-xl'"></i>
        <span class="font-medium">{{ item.label }}</span>
        <div class="ml-auto w-1.5 h-1.5 rounded-full bg-crypto-neon 
                    opacity-0 group-[.active]:opacity-100"></div>
      </a>
    }
  </nav>

  <!-- User Profile (bottom) -->
  <div class="p-6 mt-auto">
    <div class="p-4 bg-crypto-bg/40 border border-slate-800 rounded-3xl 
                flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 
                  to-slate-500 border border-slate-600"></div>
      <div>
        <p class="text-sm font-bold">John Doe</p>
        <p class="text-[10px] text-crypto-slate uppercase">Pro Account</p>
      </div>
      <i class="lucide-log-out ml-auto text-crypto-slate 
                hover:text-crypto-red cursor-pointer"></i>
    </div>
  </div>
</aside>
```

#### Características

- **RouterLinkActive**: Highlight del menú activo
- **Signal para menu items**: Inmutable, fácil de extender
- **Tailwind Classes**: Diseño oscuro con efectos neon
- **Iconos Lucide**: Iconos modernos via CDN

#### Extensión Futura

Para añadir nuevos items al menú:

```typescript
readonly menuItems = signal<MenuItem[]>([
  { label: 'Dashboard', icon: 'lucide-chart-line', route: '/dashboard' },
  { label: 'Portfolio', icon: 'lucide-briefcase', route: '/portfolio' },
  { label: 'Activity', icon: 'lucide-clock', route: '/activity' },
  { label: 'Settings', icon: 'lucide-settings', route: '/settings' }, // ← Nuevo
]);
```

---

### HeaderComponent

**Estado**: ✅ Implementado

**Responsabilidad**: Barra superior con búsqueda, notificaciones y perfil.

#### Diseño Propuesto

```typescript
@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="flex items-center justify-between px-6 py-4 
                   bg-crypto-surface border-b border-slate-800">
      <!-- Search -->
      <div class="flex-1 max-w-md">
        <input type="search" 
               placeholder="Search assets..." 
               class="w-full px-4 py-2 bg-slate-800 rounded-lg" />
      </div>
      
      <!-- Actions -->
      <div class="flex items-center gap-4">
        <button class="relative">
          <i class="lucide-bell"></i>
          <span class="absolute top-0 right-0 w-2 h-2 bg-crypto-red rounded-full"></span>
        </button>
        <button>
          <i class="lucide-user"></i>
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {}
```

---

## 🚀 Feature Components

### DashboardComponent

**Ubicación**: [`src/app/features/dashboard/dashboard.component.ts`](../src/app/features/dashboard/dashboard.component.ts)

**Tipo**: Container Component (Smart Component)

**Responsabilidad**: 
- Inyectar servicios
- Gestionar lógica de negocio
- Pasar datos a componentes presentacionales

#### Código

```typescript
import { Component, inject } from '@angular/core';
import { PriceCardComponent } from './components/price-card/price-card.component';
import { MarketService } from './service/market.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PriceCardComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private marketService = inject(MarketService);
  
  // Expone signal del servicio (unidirectional flow)
  assets = this.marketService.assets;
}
```

#### Template

```html
<div class="p-8 space-y-8">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold mb-2">Market Overview</h1>
    <p class="text-crypto-slate">Real-time cryptocurrency prices</p>
  </div>

  <!-- Price Cards Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    @for (asset of assets(); track asset.id) {
      <app-price-card [asset]="asset" />
    }
  </div>
</div>
```

#### Características

- **Inyección con inject()**: Patrón moderno de Angular 20
- **Signal exposure**: Pasa signal del servicio directamente
- **@for con track**: Nuevo control flow de Angular 20
- **Grid responsivo**: Mobile-first con Tailwind

#### Flujo de Datos

```
MarketService (WebSocket)
    ↓
assetsMap (Signal)
    ↓
assets (Computed)
    ↓
DashboardComponent.assets (Expone)
    ↓
Template @for
    ↓
PriceCardComponent [asset] input
```

---

### PriceCardComponent

**Ubicación**: [`src/app/features/dashboard/components/price-card/price-card.component.ts`](../src/app/features/dashboard/components/price-card/price-card.component.ts)

**Tipo**: Presentational Component (Dumb Component)

**Responsabilidad**: 
- Mostrar información de un asset
- NO gestionar lógica de negocio
- Solo recibir inputs, emitir outputs

#### Código

```typescript
import { Component, computed, input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CryptoAsset } from '../../models/crypto.model';

@Component({
  selector: 'app-price-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './price-card.component.html',
})
export class PriceCardComponent {
  // ✅ Signal Input: Ultra eficiente y tipado
  asset = input.required<CryptoAsset>();

  // ✅ Computed Signal: Lógica derivada para el color
  isPositive = computed(() => this.asset().change24h >= 0);
}
```

#### Template

```html
<div class="bg-crypto-surface border border-slate-800/50 p-6 rounded-3xl 
            hover:border-crypto-neon/30 transition-all group">
  
  <!-- Header: Icon + Name -->
  <div class="flex justify-between items-start mb-6">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center 
                  justify-center border border-slate-700">
        <span class="font-bold text-xs">
          {{ asset().symbol.substring(0,2) }}
        </span>
      </div>
      <div>
        <h3 class="font-bold text-white">{{ asset().symbol }}</h3>
        <p class="text-xs text-crypto-slate">{{ asset().name }}</p>
      </div>
    </div>
    <button class="text-slate-600 hover:text-yellow-500">
      <i class="lucide-star w-4 h-4"></i>
    </button>
  </div>

  <!-- Price -->
  <div class="mb-4">
    <span class="text-2xl font-bold text-white tracking-tight">
      {{ asset().price | currency:'USD':'symbol':'1.2-2' }}
    </span>
  </div>

  <!-- Change 24h + Mini Chart -->
  <div class="flex items-center justify-between">
    <span [class]="isPositive() ? 'text-crypto-neon' : 'text-crypto-red'" 
          class="text-sm font-bold">
      {{ isPositive() ? '+' : '' }}{{ asset().change24h }}%
    </span>
    
    <!-- Mini Sparkline (placeholder) -->
    <div class="h-8 w-24 bg-slate-800/50 rounded-lg overflow-hidden relative">
      <div class="absolute inset-0 bg-gradient-to-r" 
           [class]="isPositive() ? 'from-crypto-neon/20' : 'from-crypto-red/20'">
      </div>
    </div>
  </div>
</div>
```

#### Características

- **input.required()**: Signal input que garantiza no-null
- **computed()**: Lógica derivada automática
- **CurrencyPipe**: Formateo de precio con 2 decimales
- **Conditional classes**: `[class]` binding para cambio de color
- **Hover effects**: Transiciones suaves con Tailwind

#### Computed Signals Explicados

```typescript
// ✅ Computed: Se actualiza automáticamente
isPositive = computed(() => this.asset().change24h >= 0);

// Uso en template:
// <span [class]="isPositive() ? 'text-green' : 'text-red'">

// ❌ Alternativa sin computed (verboso):
@Component({ /* ... */ })
export class PriceCardComponent implements OnChanges {
  @Input() asset!: CryptoAsset;
  isPositive: boolean = false;
  
  ngOnChanges() {
    this.isPositive = this.asset.change24h >= 0;
  }
}
```

#### Styling con Tailwind

Clases clave usadas:

- **`bg-crypto-surface`**: Fondo oscuro personalizado
- **`border-crypto-neon/30`**: Border con opacidad 30%
- **`hover:border-crypto-neon/30`**: Hover effect
- **`transition-all`**: Transiciones suaves
- **`group`**: Para efectos de grupo en hover

---

### PortfolioHeroComponent

**Ubicación**: [`src/app/features/dashboard/components/portfolio-hero/portfolio-hero.component.ts`](../src/app/features/dashboard/components/portfolio-hero/portfolio-hero.component.ts)

**Estado**: ⚠️ Implementado pero no usado en dashboard actual

**Responsabilidad**: Mostrar valor total del portfolio y ganancias/pérdidas.

#### Código

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-portfolio-hero',
  standalone: true,
  imports: [],
  templateUrl: './portfolio-hero.component.html',
  styleUrl: './portfolio-hero.scss'
})
export class PortfolioHeroComponent {}
```

#### Template Propuesto

```html
<div class="bg-gradient-to-br from-crypto-neon/10 to-crypto-purple/10 
            border border-crypto-neon/20 p-8 rounded-3xl">
  
  <!-- Total Value -->
  <div class="mb-2">
    <p class="text-crypto-slate text-sm mb-1">Total Portfolio Value</p>
    <h2 class="text-5xl font-bold text-white">
      $125,430.25
    </h2>
  </div>
  
  <!-- 24h Change -->
  <div class="flex items-center gap-2 text-crypto-neon">
    <i class="lucide-trending-up"></i>
    <span class="text-xl font-bold">+$5,230.12 (4.35%)</span>
    <span class="text-sm text-crypto-slate">24h</span>
  </div>
  
  <!-- Actions -->
  <div class="flex gap-4 mt-6">
    <button class="btn-primary">
      <i class="lucide-plus mr-2"></i>
      Add Funds
    </button>
    <button class="btn-secondary">
      <i class="lucide-arrow-down mr-2"></i>
      Withdraw
    </button>
  </div>
</div>
```

---

## 🎨 Estilos de Componentes

### Global Styles

Definidos en [`src/styles.scss`](../src/styles.scss):

```scss
@layer components {
  .card {
    @apply bg-crypto-card border border-crypto-border rounded-card shadow-card;
  }
  
  .card-hover {
    @apply card transition-all duration-200 
           hover:bg-crypto-hover hover:border-crypto-green/30;
  }
  
  .btn-primary {
    @apply bg-crypto-green text-crypto-dark font-semibold px-6 py-2.5 
           rounded-lg transition-all duration-200 
           hover:shadow-neon-green-strong hover:brightness-110;
  }
}
```

### Component-Specific Styles

Ejemplo de [`sidebar.component.scss`](../src/app/core/components/sidebar/sidebar.component.scss):

```scss
:host {
  display: block;
  height: 100%;
  
  aside {
    background: linear-gradient(180deg, 
      var(--crypto-sidebar) 0%, 
      var(--crypto-dark) 100%
    );
  }
}

.logo-container {
  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }
}
```

---

## 🔄 Comunicación entre Componentes

### Parent → Child (Input)

```typescript
// Parent (DashboardComponent)
@Component({
  template: `<app-price-card [asset]="btcAsset" />`
})
export class DashboardComponent {
  btcAsset = { id: '1', symbol: 'BTC', ... };
}

// Child (PriceCardComponent)
@Component({ /* ... */ })
export class PriceCardComponent {
  asset = input.required<CryptoAsset>();
}
```

### Child → Parent (Output)

```typescript
// Child (PriceCardComponent)
@Component({
  template: `<button (click)="onFavorite()">Star</button>`
})
export class PriceCardComponent {
  favorited = output<string>(); // ← Output signal
  
  onFavorite() {
    this.favorited.emit(this.asset().symbol);
  }
}

// Parent (DashboardComponent)
@Component({
  template: `<app-price-card (favorited)="onAssetFavorited($event)" />`
})
export class DashboardComponent {
  onAssetFavorited(symbol: string) {
    console.log('Favorited:', symbol);
  }
}
```

### Via Service (Siblings)

```typescript
// Shared Service
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private favoritesMap = signal<Set<string>>(new Set());
  
  public favorites = computed(() => 
    Array.from(this.favoritesMap())
  );
  
  toggleFavorite(symbol: string) {
    this.favoritesMap.update(set => {
      const newSet = new Set(set);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
      } else {
        newSet.add(symbol);
      }
      return newSet;
    });
  }
}

// Component A
@Component({ /* ... */ })
export class PriceCardComponent {
  private favService = inject(FavoritesService);
  
  toggleFavorite() {
    this.favService.toggleFavorite(this.asset().symbol);
  }
}

// Component B
@Component({ /* ... */ })
export class FavoritesListComponent {
  private favService = inject(FavoritesService);
  
  favorites = this.favService.favorites;
}
```

---

## 🧪 Testing de Componentes

### Test de PriceCardComponent

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

  it('should show green for positive change', () => {
    const asset: CryptoAsset = {
      id: '1',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 50000,
      change24h: 5.2,
      icon: '',
      sparkline: []
    };
    
    fixture.componentRef.setInput('asset', asset);
    fixture.detectChanges();
    
    expect(component.isPositive()).toBe(true);
  });

  it('should show red for negative change', () => {
    const asset: CryptoAsset = {
      id: '1',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 50000,
      change24h: -2.5,
      icon: '',
      sparkline: []
    };
    
    fixture.componentRef.setInput('asset', asset);
    fixture.detectChanges();
    
    expect(component.isPositive()).toBe(false);
  });
});
```

---

## 📚 Mejores Prácticas

### ✅ DO

1. **Componentes pequeños y enfocados**
   ```typescript
   // ✅ Componente con responsabilidad única
   @Component({ selector: 'app-price-card' })
   export class PriceCardComponent {
     asset = input.required<CryptoAsset>();
   }
   ```

2. **Usar input<T>() y computed()**
   ```typescript
   asset = input.required<CryptoAsset>();
   isPositive = computed(() => this.asset().change24h >= 0);
   ```

3. **Standalone components siempre**
   ```typescript
   @Component({
     standalone: true,
     imports: [CommonModule, CurrencyPipe]
   })
   ```

4. **OnPush change detection (implícito con Signals)**
   ```typescript
   // Con Signals, change detection es automáticamente optimizada
   ```

### ❌ DON'T

1. **NO inyectar servicios en componentes presentacionales**
   ```typescript
   // ❌ Presentational component con servicio
   @Component({ /* ... */ })
   export class PriceCardComponent {
     private marketService = inject(MarketService); // ⚠️ Evitar
   }
   ```

2. **NO usar @Input() legacy**
   ```typescript
   // ❌ Legacy
   @Input() asset?: CryptoAsset;
   
   // ✅ Modern
   asset = input.required<CryptoAsset>();
   ```

3. **NO lógica de negocio en componentes presentacionales**

---

## 📊 Dashboard Sub-Components

### PortfolioAnalyticsComponent

**Ubicación**: [`src/app/features/dashboard/components/portfolio-analytics/portfolio-analytics.component.ts`](../src/app/features/dashboard/components/portfolio-analytics/portfolio-analytics.component.ts)

**Tipo**: Presentational Component

**Responsabilidad**: Mostrar gráficos de análisis del portafolio con ApexCharts.

#### Código

```typescript
import { Component, computed, inject, input, signal } from '@angular/core';
import { ChartDataService } from '../../service/chart-data.service';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-portfolio-analytics',
  imports: [NgApexchartsModule],
  templateUrl: './portfolio-analytics.component.html',
  styleUrl: './portfolio-analytics.component.scss',
  standalone: true,
})
export class PortfolioAnalyticsComponent {
  private chartDataService = inject(ChartDataService);

  // Inputs opcionales para personalizar el gráfico
  height = input<number>(20);
  chartData = input<number[]>();
  color = input<string>('#10b981'); // crypto-neon por defecto

  selectedPeriod = signal('1W');

  // Detectar si los datos están vacíos/cero
  hasData = computed(() => {
    const customData = this.chartData();
    return customData && customData.length > 0 && customData.some(val => val !== 0);
  });

  // Color dinámico
  displayColor = computed(() => {
    return this.hasData() ? this.color() : '#10b981';
  });

  // Series del gráfico
  series = computed(() => {
    const customData = this.chartData();
    if (customData && customData.length > 0) {
      return [{ name: 'Price', data: customData }];
    }
    return [{ name: 'Price', data: Array(24).fill(50) }];
  });

  // Configuración ApexCharts
  chartConfig = computed(() => ({
    chart: {
      type: 'area' as const,
      height: this.height(),
      toolbar: { show: false },
      animations: { enabled: true },
      sparkline: { enabled: true }
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100]
      }
    },
    colors: [this.displayColor()],
    yaxis: { show: false }
  }));
}
```

#### Características

- **Gráficos con ApexCharts**: Visualización de datos históricos
- **Inputs customizables**: `height`, `chartData`, `color`
- **Computed signals**: Lógica derivada automática
- **Responsivo**: Se adapta al contenedor

---

### MarketsComponent

**Ubicación**: [`src/app/features/dashboard/components/markets/markets-component.ts`](../src/app/features/dashboard/components/markets/markets-component.ts)

**Tipo**: Feature Component

**Estado**: ⚠️ Skeleton (estructura base)

**Responsabilidad**: Mostrar datos de mercados agregados.

#### Código Actual

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-markets-component',
  imports: [],
  templateUrl: './markets-component.html',
  styleUrl: './markets-component.scss',
})
export class MarketsComponent {}
```

#### Próximas Mejoras

- Integración con `MarketService`
- Tabla comparativa de mercados
- Filtros y búsqueda
- Exportación de datos

---

### WalletsComponent

**Ubicación**: [`src/app/features/dashboard/components/wallets/wallets-component.ts`](../src/app/features/dashboard/components/wallets/wallets-component.ts)

**Tipo**: Feature Component

**Estado**: ⚠️ Skeleton (estructura base)

**Responsabilidad**: Mostrar información de carteras/wallets.

#### Código Actual

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-wallets-component',
  imports: [],
  templateUrl: './wallets-component.html',
  styleUrl: './wallets-component.scss',
})
export class WalletsComponent {}
```

#### Próximas Mejoras

- Listado de wallets conectadas
- Balance por wallet
- Transacciones recientes
- Integración con servicios blockchain

---

### SettingsComponent

**Ubicación**: [`src/app/features/dashboard/components/settings-component/settings-component.ts`](../src/app/features/dashboard/components/settings-component/settings-component.ts)

**Tipo**: Feature Component

**Estado**: ⚠️ Skeleton (estructura base)

**Responsabilidad**: Configuración de la aplicación.

#### Código Actual

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-component',
  imports: [],
  templateUrl: './settings-component.html',
  styleUrl: './settings-component.scss',
})
export class SettingsComponent {}
```

#### Próximas Mejoras

- Preferencias de visualización (tema, idioma)
- Configuración de alertas
- API keys y webhooks
- Datos de usuario
- Privacy y seguridad

---

## 🔄 Resumen de Estados de Componentes

| Componente | Estado | Ubicación |
|------------|--------|-----------|
| **Core** | | |
| SidebarComponent | ✅ Completo | `core/components/sidebar/` |
| HeaderComponent | ✅ Completo | `core/components/header/` |
| **Dashboard Features** | | |
| DashboardComponent | ✅ Completo | `features/dashboard/` |
| PriceCardComponent | ✅ Completo | `features/dashboard/components/price-card/` |
| PortfolioHeroComponent | ⚠️ Parcial | `features/dashboard/components/portfolio-hero/` |
| PortfolioAnalyticsComponent | ✅ Completo | `features/dashboard/components/portfolio-analytics/` |
| MarketsComponent | ⚠️ Skeleton | `features/dashboard/components/markets/` |
| WalletsComponent | ⚠️ Skeleton | `features/dashboard/components/wallets/` |
| SettingsComponent | ⚠️ Skeleton | `features/dashboard/components/settings-component/` |

   ```typescript
   // ❌ NO hacer HTTP calls en PriceCard
   ngOnInit() {
     this.http.get('/api/price').subscribe(/* */);
   }
   ```

---

## 🔗 Referencias

- [Angular Components](https://angular.dev/guide/components)
- [Signal Inputs](https://angular.dev/guide/signals/inputs)
- [Component Testing](https://angular.dev/guide/testing/components)
- [Tailwind CSS](https://tailwindcss.com)

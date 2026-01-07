# 3. Angular 20 vs Angular Legacy

## 🆕 Novedades de Angular 20

Angular 20 representa un cambio paradigmático en cómo se desarrollan aplicaciones. Este documento compara las diferencias clave entre Angular 20 (usado en este proyecto) y versiones legacy (Angular < 19).

## 📊 Tabla Comparativa Rápida

| Feature | Angular Legacy (< 19) | Angular 20 (Este Proyecto) |
|---------|----------------------|----------------------------|
| **Change Detection** | Zone.js (automático) | Zoneless (Signals) ✨ |
| **Components** | NgModule-based | Standalone ✨ |
| **State Management** | RxJS + Services | Signals + Computed ✨ |
| **Inputs** | `@Input()` decorator | `input<T>()` signal ✨ |
| **Outputs** | `@Output()` decorator | `output<T>()` ✨ |
| **DI** | Constructor injection | `inject()` function ✨ |
| **Control Flow** | `*ngIf`, `*ngFor` | `@if`, `@for` ✨ |
| **Build System** | Webpack | esbuild ✨ |
| **Bundle Size** | Más grande | ~30% más pequeño ✨ |
| **Performance** | Buena | Excelente ✨ |

## 🔄 Cambio de Paradigma: Zone.js → Zoneless

### ❌ Angular Legacy (con Zone.js)

```typescript
// app.config.ts (Angular < 19)
import { ApplicationConfig } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }) // Zone.js
  ]
};

// my.component.ts
@Component({
  selector: 'app-my',
  template: `<p>{{ count }}</p>`
})
export class MyComponent {
  count = 0;
  
  constructor() {
    // Zone.js intercepta setTimeout y trigger change detection
    setTimeout(() => {
      this.count++; // Change detection automática
    }, 1000);
  }
}
```

**Problemas de Zone.js**:
- 🐌 Overhead de performance (monkey-patching de APIs async)
- 📦 Bundle size aumentado (~50KB)
- 🐛 Bugs difíciles de debugear
- ⚠️ Change detection en exceso (checks innecesarios)

### ✅ Angular 20 (Zoneless con Signals)

```typescript
// app.config.ts (Angular 20) - ✅ Usado en este proyecto
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection() // ← Zoneless!
  ]
};

// my.component.ts
@Component({
  selector: 'app-my',
  template: `<p>{{ count() }}</p>` // ← Signal
})
export class MyComponent {
  count = signal(0);
  
  constructor() {
    // setTimeout ya NO trigger automático, pero signals sí
    setTimeout(() => {
      this.count.update(n => n + 1); // Signal trigger change detection
    }, 1000);
  }
}
```

**Ventajas de Zoneless**:
- ⚡ Performance mejorada (no monkey-patching)
- 📦 Bundle ~30% más pequeño
- 🎯 Change detection precisa (solo donde cambió el signal)
- 🔍 Debugging más claro

## 🧩 NgModules → Standalone Components

### ❌ Angular Legacy (NgModules)

```typescript
// dashboard.module.ts (Angular < 19)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { PriceCardComponent } from './components/price-card/price-card.component';

@NgModule({
  declarations: [
    DashboardComponent,
    PriceCardComponent
  ],
  imports: [
    CommonModule,
    // ... otros módulos
  ],
  exports: [DashboardComponent]
})
export class DashboardModule {}

// dashboard.component.ts
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  // ...
}
```

**Problemas de NgModules**:
- 📝 Boilerplate excesivo
- 🔗 Acoplamiento entre módulos
- 🌳 Tree-shaking menos efectivo
- 🤯 Confusión sobre qué declarar/importar/exportar

### ✅ Angular 20 (Standalone Components)

```typescript
// dashboard.component.ts - ✅ Usado en este proyecto
import { Component, inject } from '@angular/core';
import { PriceCardComponent } from './components/price-card/price-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true, // ← Standalone!
  imports: [PriceCardComponent], // Importación directa
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private marketService = inject(MarketService);
  assets = this.marketService.assets;
}

// price-card.component.ts - ✅ Usado en este proyecto
import { Component, input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-price-card',
  standalone: true, // ← Standalone!
  imports: [CommonModule, CurrencyPipe], // Solo lo necesario
  templateUrl: './price-card.component.html'
})
export class PriceCardComponent {
  asset = input.required<CryptoAsset>();
}
```

**Ventajas de Standalone**:
- ✅ Menos código (sin NgModule)
- ✅ Tree-shaking óptimo
- ✅ Lazy loading simplificado
- ✅ Más fácil de entender

## 🔄 RxJS → Signals (Estado Local)

### ❌ Angular Legacy (RxJS para estado local)

```typescript
// market.service.ts (Angular Legacy)
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MarketService {
  // BehaviorSubject para estado
  private assetsSubject = new BehaviorSubject<CryptoAsset[]>([]);
  
  // Observable público
  public assets$ = this.assetsSubject.asObservable();
  
  updateAsset(asset: CryptoAsset) {
    const current = this.assetsSubject.value;
    const updated = [...current, asset];
    this.assetsSubject.next(updated);
  }
}

// dashboard.component.ts
@Component({
  selector: 'app-dashboard',
  template: `
    @for (asset of assets$ | async; track asset.id) {
      <app-price-card [asset]="asset" />
    }
  `
})
export class DashboardComponent {
  constructor(private marketService: MarketService) {}
  
  assets$ = this.marketService.assets$;
}
```

**Problemas con RxJS para estado local**:
- 📝 Verbose (BehaviorSubject, .next(), .value)
- 🔄 Requiere `async` pipe o subscription manual
- 💾 Memory leaks si olvidas unsubscribe
- 🤯 Curva de aprendizaje alta

### ✅ Angular 20 (Signals para estado local)

```typescript
// market.service.ts - ✅ Usado en este proyecto
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MarketService {
  // WritableSignal privado
  private assetsMap = signal<Map<string, CryptoAsset>>(new Map());
  
  // Computed signal público (derivado, read-only)
  public assets = computed(() => 
    Array.from(this.assetsMap().values())
  );
  
  updateAsset(symbol: string, asset: CryptoAsset) {
    this.assetsMap.update(map => {
      const newMap = new Map(map);
      newMap.set(symbol, asset);
      return newMap;
    });
  }
}

// dashboard.component.ts - ✅ Usado en este proyecto
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
  
  // No necesita async pipe, acceso directo
  assets = this.marketService.assets;
}
```

**Ventajas de Signals**:
- ✅ Sintaxis simple y clara
- ✅ No requiere async pipe
- ✅ No hay memory leaks
- ✅ Performance óptima (fine-grained reactivity)
- ✅ Fácil de aprender

**Nota**: RxJS sigue siendo útil para operaciones async complejas (HTTP, WebSocket), pero Signals reemplazan BehaviorSubject/Subject para estado local.

## 📥 @Input() → input<T>()

### ❌ Angular Legacy (@Input decorator)

```typescript
// price-card.component.ts (Angular Legacy)
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-price-card',
  template: `<p>{{ asset?.name }}</p>`
})
export class PriceCardComponent implements OnChanges {
  @Input() asset?: CryptoAsset; // Puede ser undefined
  @Input() showDetails: boolean = false;
  
  // Lógica derivada requiere ngOnChanges
  isPositive: boolean = false;
  
  ngOnChanges() {
    if (this.asset) {
      this.isPositive = this.asset.change24h >= 0;
    }
  }
}
```

**Problemas con @Input()**:
- ⚠️ Puede ser undefined sin required
- 📝 Lógica derivada en ngOnChanges (verbose)
- 🔄 No reactivo (necesita change detection manual)

### ✅ Angular 20 (input<T>() signal)

```typescript
// price-card.component.ts - ✅ Usado en este proyecto
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-price-card',
  standalone: true,
  template: `<p>{{ asset().name }}</p>` // ← Signal
})
export class PriceCardComponent {
  // Input signal required (no puede ser undefined)
  asset = input.required<CryptoAsset>();
  
  // Input signal opcional con default
  showDetails = input<boolean>(false);
  
  // Computed signal (automático, no necesita ngOnChanges)
  isPositive = computed(() => this.asset().change24h >= 0);
}
```

**Ventajas de input<T>()**:
- ✅ Type-safe (required vs optional)
- ✅ Computed automático (sin ngOnChanges)
- ✅ Sintaxis más clara
- ✅ Reactivo por defecto

## 📤 @Output() → output<T>()

### ❌ Angular Legacy (@Output decorator)

```typescript
// price-card.component.ts (Angular Legacy)
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-price-card',
  template: `<button (click)="onClick()">Click</button>`
})
export class PriceCardComponent {
  @Output() clicked = new EventEmitter<string>();
  
  onClick() {
    this.clicked.emit('BTC');
  }
}

// dashboard.component.ts
@Component({
  template: `<app-price-card (clicked)="onAssetClicked($event)" />`
})
export class DashboardComponent {
  onAssetClicked(symbol: string) {
    console.log('Clicked:', symbol);
  }
}
```

### ✅ Angular 20 (output<T>())

```typescript
// price-card.component.ts (Angular 20)
import { Component, output } from '@angular/core';

@Component({
  selector: 'app-price-card',
  standalone: true,
  template: `<button (click)="onClick()">Click</button>`
})
export class PriceCardComponent {
  clicked = output<string>(); // ← Más simple
  
  onClick() {
    this.clicked.emit('BTC');
  }
}

// dashboard.component.ts (igual que legacy)
@Component({
  template: `<app-price-card (clicked)="onAssetClicked($event)" />`
})
export class DashboardComponent {
  onAssetClicked(symbol: string) {
    console.log('Clicked:', symbol);
  }
}
```

**Ventajas de output<T>()**:
- ✅ Sintaxis más simple
- ✅ Type-safe
- ✅ Consistente con input<T>()

## 💉 Constructor Injection → inject()

### ❌ Angular Legacy (Constructor Injection)

```typescript
// dashboard.component.ts (Angular Legacy)
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MarketService } from './service/market.service';

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
  
  ngOnInit() {
    this.marketService.getAllPrice().subscribe(/* ... */);
  }
}
```

**Problemas**:
- 📝 Constructor muy largo con muchas dependencias
- 🔒 No se puede usar fuera del constructor
- ❌ No funciona en funciones helper

### ✅ Angular 20 (inject() function)

```typescript
// dashboard.component.ts - ✅ Usado en este proyecto
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MarketService } from './service/market.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: '...'
})
export class DashboardComponent {
  // Inyección con inject() - más limpio
  private http = inject(HttpClient);
  private router = inject(Router);
  private marketService = inject(MarketService);
  
  // O directamente en la definición
  assets = inject(MarketService).assets;
  
  ngOnInit() {
    this.marketService.getAllPrice().subscribe(/* ... */);
  }
}
```

**Ventajas de inject()**:
- ✅ Más conciso
- ✅ Funciona en funciones helper
- ✅ Tree-shaking mejorado
- ✅ Functional programming friendly

## 🔀 Control Flow: *ngIf/*ngFor → @if/@for

### ❌ Angular Legacy (Directivas estructurales)

```typescript
// dashboard.component.html (Angular Legacy)
<div *ngIf="assets.length > 0; else loading">
  <div *ngFor="let asset of assets; trackBy: trackByFn">
    <app-price-card [asset]="asset"></app-price-card>
  </div>
</div>

<ng-template #loading>
  <p>Loading...</p>
</ng-template>

// dashboard.component.ts
trackByFn(index: number, asset: CryptoAsset) {
  return asset.id;
}
```

**Problemas**:
- 📝 Requiere ng-template para else
- 🔄 trackBy requiere función separada
- 🤯 Sintaxis * puede confundir

### ✅ Angular 20 (Built-in control flow)

```typescript
// dashboard.component.html - ✅ Usado en este proyecto
@if (assets().length > 0) {
  @for (asset of assets(); track asset.id) {
    <app-price-card [asset]="asset" />
  }
} @else {
  <p>Loading...</p>
}
```

**Ventajas del nuevo control flow**:
- ✅ Sintaxis más clara (@if, @for)
- ✅ track inline (sin función separada)
- ✅ Mejor performance (compilación optimizada)
- ✅ @else integrado

## 🏗️ Build System: Webpack → esbuild

### ❌ Angular Legacy (Webpack)

```json
// angular.json (Angular Legacy)
{
  "projects": {
    "app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist",
            "index": "src/index.html",
            "main": "src/main.ts"
          }
        }
      }
    }
  }
}
```

**Características de Webpack**:
- 🐌 Builds más lentos
- 📦 Bundle size más grande
- 🔧 Configuración compleja

### ✅ Angular 20 (esbuild)

```json
// angular.json - ✅ Usado en este proyecto
{
  "projects": {
    "crypto-terminal": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/crypto-terminal",
            "index": "src/index.html",
            "browser": "src/main.ts"
          }
        }
      }
    }
  }
}
```

**Ventajas de esbuild**:
- ⚡ 10-100x más rápido que Webpack
- 📦 Bundles ~30% más pequeños
- 🎯 Tree-shaking mejorado
- 🔄 HMR ultrarrápido

## 📊 Comparación de Performance

### Tiempos de Build

| Operación | Angular Legacy (Webpack) | Angular 20 (esbuild) | Mejora |
|-----------|--------------------------|---------------------|--------|
| **Dev Server Start** | ~8s | ~2s | **4x más rápido** |
| **Full Build** | ~25s | ~5s | **5x más rápido** |
| **Incremental Build** | ~3s | ~500ms | **6x más rápido** |
| **HMR Update** | ~2s | ~100ms | **20x más rápido** |

### Bundle Size

| Métrica | Angular Legacy | Angular 20 | Reducción |
|---------|----------------|-----------|-----------|
| **Runtime** | ~50KB | ~20KB | **-60%** |
| **Main Bundle** | ~300KB | ~210KB | **-30%** |
| **Lazy Chunk** | ~150KB | ~100KB | **-33%** |

### Runtime Performance

| Métrica | Angular Legacy | Angular 20 | Mejora |
|---------|----------------|-----------|--------|
| **Initial Render** | ~200ms | ~120ms | **40% más rápido** |
| **Change Detection** | ~10ms | ~2ms | **5x más rápido** |
| **Re-render** | ~15ms | ~5ms | **3x más rápido** |

## 🔄 Guía de Migración (Conceptual)

Si tuvieras un proyecto Angular legacy y quisieras migrar a Angular 20:

### Paso 1: Actualizar a Angular 19+
```bash
ng update @angular/core @angular/cli
```

### Paso 2: Convertir a Standalone
```typescript
// Antes (NgModule)
@NgModule({
  declarations: [MyComponent],
  imports: [CommonModule]
})
export class MyModule {}

// Después (Standalone)
@Component({
  standalone: true,
  imports: [CommonModule]
})
export class MyComponent {}
```

### Paso 3: Migrar a Signals
```typescript
// Antes (RxJS)
private dataSubject = new BehaviorSubject<Data[]>([]);
data$ = this.dataSubject.asObservable();

// Después (Signals)
private dataSignal = signal<Data[]>([]);
data = computed(() => this.dataSignal());
```

### Paso 4: Activar Zoneless
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection() // ← Activar Zoneless
  ]
};
```

### Paso 5: Usar nuevo Control Flow
```html
<!-- Antes -->
<div *ngIf="show">Content</div>

<!-- Después -->
@if (show) {
  <div>Content</div>
}
```

## ✅ Qué Aplica en Este Proyecto

| Feature | ✅ Aplicado | 📝 Notas |
|---------|------------|---------|
| **Zoneless** | ✅ | `provideZonelessChangeDetection()` |
| **Standalone Components** | ✅ | Todos los componentes |
| **Signals** | ✅ | Estado local y derivado |
| **input<T>()** | ✅ | Todos los inputs |
| **inject()** | ✅ | Todas las inyecciones |
| **@if/@for** | ✅ | Todo el control flow |
| **esbuild** | ✅ | Builder por defecto |
| **output<T>()** | ❌ | No hay eventos aún |

## ❌ Qué NO Aplica en Este Proyecto

| Feature Legacy | ¿Se Usa? | Razón |
|----------------|---------|-------|
| **NgModules** | ❌ | Reemplazado por Standalone |
| **Zone.js** | ❌ | Zoneless activado |
| **@Input()** | ❌ | Usamos `input<T>()` |
| ***ngIf/*ngFor** | ❌ | Usamos `@if/@for` |
| **Constructor DI** | ❌ | Usamos `inject()` |
| **Webpack** | ❌ | esbuild por defecto |
| **BehaviorSubject (estado)** | ❌ | Signals en su lugar |

## 🎯 Recomendaciones

### Para Proyectos Nuevos
✅ Usar Angular 20+ con todas las nuevas features:
- Zoneless
- Standalone
- Signals
- inject()
- @if/@for

### Para Proyectos Legacy
⚠️ Migración gradual:
1. Actualizar a Angular 19+
2. Convertir a Standalone (uno por uno)
3. Introducir Signals (donde tenga sentido)
4. Activar Zoneless cuando esté listo

## 🔗 Recursos Adicionales

- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Standalone Components](https://angular.dev/guide/components/importing)
- [Zoneless Angular](https://angular.dev/guide/experimental/zoneless)
- [esbuild Documentation](https://esbuild.github.io/)
- [Angular Migration Guide](https://angular.dev/update-guide)

---

**Conclusión**: Angular 20 representa un salto cualitativo en performance, DX (Developer Experience) y simplicidad. Este proyecto adopta todas las mejores prácticas modernas.

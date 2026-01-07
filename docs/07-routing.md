# 7. Routing y Navegación

## 📋 Índice
- [Configuración de Rutas](#configuración-de-rutas)
- [Lazy Loading](#lazy-loading)
- [Navegación Programática](#navegación-programática)
- [Guards y Resolvers](#guards-y-resolvers-futuro)

## 🗺️ Configuración de Rutas

### app.routes.ts

**Ubicación**: [`src/app/app.routes.ts`](../src/app/app.routes.ts)

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    // Lazy loading con loadComponent (Angular 20)
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
  }
];
```

### Características

1. **Redirect por defecto**: Ruta raíz (`/`) redirige a `/dashboard`
2. **Lazy loading**: Componentes cargados bajo demanda
3. **Standalone**: No requiere módulos
4. **Type-safe**: TypeScript valida nombres de componentes

---

## ⚡ Lazy Loading

### ¿Qué es Lazy Loading?

Lazy loading es la técnica de cargar módulos/componentes **solo cuando se necesitan**, no al iniciar la app.

### Ventajas

- ✅ **Bundle inicial más pequeño**: Carga más rápida
- ✅ **Performance mejorada**: Solo carga lo que el usuario usa
- ✅ **Mejor UX**: Tiempos de carga perceptibles más cortos

### Implementación en Angular 20

```typescript
// ✅ Angular 20: loadComponent (Standalone)
{
  path: 'dashboard',
  loadComponent: () => import('./features/dashboard/dashboard.component')
    .then(m => m.DashboardComponent)
}

// ❌ Angular Legacy: loadChildren (NgModules)
{
  path: 'dashboard',
  loadChildren: () => import('./features/dashboard/dashboard.module')
    .then(m => m.DashboardModule)
}
```

### Cómo Funciona

```
Usuario navega a /dashboard
    ↓
Angular detecta ruta
    ↓
Ejecuta import() dinámico
    ↓
Descarga dashboard.component.js (chunk separado)
    ↓
Instancia DashboardComponent
    ↓
Renderiza componente
```

### Verificar Chunks en Build

```bash
npm run build

# Output:
# dist/browser/
#   ├── main-ABC123.js        (Bundle principal)
#   ├── chunk-dashboard-XYZ.js  ← Lazy loaded
#   └── chunk-portfolio-DEF.js  ← Lazy loaded
```

---

## 🧭 Navegación

### RouterLink Directiva

**Ubicación**: [`sidebar.component.html`](../src/app/core/components/sidebar/sidebar.component.html)

```html
<!-- Navegación declarativa -->
<a [routerLink]="'/dashboard'" 
   routerLinkActive="active"
   class="nav-link">
  Dashboard
</a>

<!-- Con parámetros -->
<a [routerLink]="['/asset', asset().id]">
  {{ asset().name }}
</a>

<!-- Navegación relativa -->
<a [routerLink]="['../settings']">
  Settings
</a>
```

### RouterLinkActive

Aplica clase CSS cuando la ruta está activa:

```html
<a [routerLink]="'/dashboard'" 
   routerLinkActive="bg-crypto-neon/10 text-crypto-neon"
   [routerLinkActiveOptions]="{ exact: true }">
  Dashboard
</a>
```

**Opciones**:
- `exact: true`: Solo activa si la ruta coincide exactamente
- `exact: false`: Activa si la ruta empieza con el path

---

## 🚀 Navegación Programática

### Router Service

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({ /* ... */ })
export class MyComponent {
  private router = inject(Router);
  
  // Navegación simple
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  
  // Con parámetros
  goToAsset(id: string) {
    this.router.navigate(['/asset', id]);
  }
  
  // Con query params
  goToSearch(term: string) {
    this.router.navigate(['/search'], {
      queryParams: { q: term }
    });
  }
  
  // Navegación relativa
  goToSettings() {
    this.router.navigate(['../settings'], {
      relativeTo: this.route // Requiere ActivatedRoute
    });
  }
  
  // Reemplazar en historial (no agrega entrada)
  replaceRoute() {
    this.router.navigate(['/dashboard'], {
      replaceUrl: true
    });
  }
}
```

---

## 📍 ActivatedRoute

### Leer Parámetros de Ruta

```typescript
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({ /* ... */ })
export class AssetDetailComponent {
  private route = inject(ActivatedRoute);
  
  ngOnInit() {
    // Parámetros de ruta (ej: /asset/:id)
    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('Asset ID:', id);
    });
    
    // Query params (ej: /search?q=bitcoin)
    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      console.log('Search query:', query);
    });
    
    // Snapshot (sin Observable)
    const id = this.route.snapshot.params['id'];
    const query = this.route.snapshot.queryParams['q'];
  }
}
```

### Con Signals (Angular 20)

```typescript
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({ /* ... */ })
export class AssetDetailComponent {
  private route = inject(ActivatedRoute);
  
  // Convertir params a Signal
  params = toSignal(this.route.params, { initialValue: {} });
  queryParams = toSignal(this.route.queryParams, { initialValue: {} });
  
  // Computed basado en params
  assetId = computed(() => this.params()['id']);
  
  constructor() {
    // Effect que reacciona a cambios de params
    effect(() => {
      const id = this.assetId();
      if (id) {
        this.loadAsset(id);
      }
    });
  }
}
```

---

## 🛡️ Guards y Resolvers (Futuro)

### Route Guards

Protegen rutas basándose en condiciones (auth, permisos, etc.).

#### Auth Guard (Ejemplo Futuro)

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true; // Permite acceso
  }
  
  // Redirige a login
  return router.createUrlTree(['/login']);
};

// Uso en rutas
export const routes: Routes = [
  {
    path: 'portfolio',
    loadComponent: () => import('./features/portfolio/portfolio.component'),
    canActivate: [authGuard] // ← Protege ruta
  }
];
```

#### Tipos de Guards

```typescript
// CanActivate: Puede activar la ruta
export const canActivateGuard: CanActivateFn = () => { /* ... */ };

// CanActivateChild: Puede activar rutas hijas
export const canActivateChildGuard: CanActivateChildFn = () => { /* ... */ };

// CanDeactivate: Puede salir de la ruta (ej: cambios sin guardar)
export const canDeactivateGuard: CanDeactivateFn<MyComponent> = (component) => {
  return component.canLeave();
};

// CanMatch: Puede cargar el módulo
export const canMatchGuard: CanMatchFn = () => { /* ... */ };
```

### Resolvers

Pre-cargan datos antes de activar la ruta.

#### Ejemplo de Resolver

```typescript
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MarketService } from './market.service';
import { CryptoAsset } from './models/crypto.model';

export const assetResolver: ResolveFn<CryptoAsset> = (route, state) => {
  const marketService = inject(MarketService);
  const id = route.paramMap.get('id');
  
  return marketService.getAssetById(id!);
};

// Uso en rutas
export const routes: Routes = [
  {
    path: 'asset/:id',
    loadComponent: () => import('./asset-detail.component'),
    resolve: {
      asset: assetResolver // ← Pre-carga datos
    }
  }
];

// En el componente
@Component({ /* ... */ })
export class AssetDetailComponent {
  private route = inject(ActivatedRoute);
  
  ngOnInit() {
    // Datos ya resueltos
    const asset = this.route.snapshot.data['asset'] as CryptoAsset;
    console.log('Asset:', asset);
  }
}
```

---

## 🎨 Estrategias de Routing

### PreloadingStrategy

Control sobre cuándo cargar rutas lazy-loaded.

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter, PreloadAllModules, withPreloading } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules) // ← Pre-carga todo después del inicial
    )
  ]
};
```

**Estrategias**:
- `NoPreloading`: No pre-carga nada (por defecto)
- `PreloadAllModules`: Pre-carga todo después del bundle inicial
- Custom: Puedes crear tu propia estrategia

#### Custom Preloading Strategy

```typescript
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Solo pre-carga si route.data.preload === true
    if (route.data?.['preload']) {
      console.log('Preloading:', route.path);
      
      // Delay de 2 segundos antes de pre-cargar
      return timer(2000).pipe(switchMap(() => load()));
    }
    
    return of(null); // No pre-carga
  }
}

// Uso en rutas
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard.component'),
    data: { preload: true } // ← Se pre-cargará
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings.component'),
    data: { preload: false } // ← NO se pre-cargará
  }
];

// app.config.ts
provideRouter(routes, withPreloading(CustomPreloadingStrategy))
```

---

## 🔄 Navegación Condicional

### Basado en Estado

```typescript
@Component({ /* ... */ })
export class MyComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  navigate() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
```

### Con Confirmación

```typescript
@Component({ /* ... */ })
export class FormComponent {
  private router = inject(Router);
  hasUnsavedChanges = signal(false);
  
  async navigateAway() {
    if (this.hasUnsavedChanges()) {
      const confirmed = await this.confirmLeave();
      if (!confirmed) return;
    }
    
    this.router.navigate(['/dashboard']);
  }
  
  private confirmLeave(): Promise<boolean> {
    return new Promise(resolve => {
      const result = confirm('¿Descartar cambios?');
      resolve(result);
    });
  }
}
```

---

## 📊 Routing en Este Proyecto

### Estado Actual

```
/                    → Redirect → /dashboard
/dashboard          → DashboardComponent (Lazy)
```

### Futuro (Planificado)

```
/                    → Redirect → /dashboard
/dashboard          → DashboardComponent (Lazy)
/portfolio          → PortfolioComponent (Lazy)
/activity           → ActivityComponent (Lazy)
/asset/:id          → AssetDetailComponent (Lazy)
  ├── Resolver: assetResolver
  └── Guard: none
/settings           → SettingsComponent (Lazy)
  └── Guard: authGuard (futuro)
/login              → LoginComponent (Lazy)
**                  → NotFoundComponent (404)
```

### Configuración Futura

```typescript
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    data: { preload: true } // Pre-carga prioritaria
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./features/portfolio/portfolio.component')
      .then(m => m.PortfolioComponent),
    canActivate: [authGuard] // Requiere autenticación
  },
  {
    path: 'asset/:id',
    loadComponent: () => import('./features/asset-detail/asset-detail.component')
      .then(m => m.AssetDetailComponent),
    resolve: {
      asset: assetResolver // Pre-carga datos del asset
    }
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component')
      .then(m => m.NotFoundComponent)
  }
];
```

---

## 🧪 Testing de Routing

### Test de Navegación

```typescript
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

describe('Routing', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)]
    });
    router = TestBed.inject(Router);
  });

  it('should redirect / to /dashboard', async () => {
    await router.navigate(['/']);
    expect(router.url).toBe('/dashboard');
  });

  it('should navigate to dashboard', async () => {
    await router.navigate(['/dashboard']);
    expect(router.url).toBe('/dashboard');
  });
});
```

### Test de Guards

```typescript
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let router: Router;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, Router]
    });
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
  });

  it('should allow access when authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    
    const result = authGuard({} as any, {} as any);
    expect(result).toBe(true);
  });

  it('should redirect to login when not authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    spyOn(router, 'createUrlTree');
    
    authGuard({} as any, {} as any);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
```

---

## 📚 Mejores Prácticas

### ✅ DO

1. **Usar Lazy Loading para features**
   ```typescript
   loadComponent: () => import('./feature.component')
   ```

2. **Usar Guards para protección**
   ```typescript
   canActivate: [authGuard]
   ```

3. **Usar Resolvers para pre-cargar datos**
   ```typescript
   resolve: { data: dataResolver }
   ```

4. **Redirect raíz a ruta principal**
   ```typescript
   { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
   ```

### ❌ DON'T

1. **NO cargar todo eagerly**
   ```typescript
   // ❌ EVITAR
   import { DashboardComponent } from './dashboard.component';
   { path: 'dashboard', component: DashboardComponent }
   
   // ✅ PREFERIR
   { path: 'dashboard', loadComponent: () => import('./dashboard.component') }
   ```

2. **NO olvidar ruta 404**
   ```typescript
   { path: '**', component: NotFoundComponent }
   ```

3. **NO usar subscribe sin cleanup en ActivatedRoute**
   ```typescript
   // ❌ Memory leak
   ngOnInit() {
     this.route.params.subscribe(/* ... */);
   }
   
   // ✅ Usar toSignal o async pipe
   params = toSignal(this.route.params);
   ```

---

## 🔗 Referencias

- [Angular Router](https://angular.dev/guide/routing)
- [Lazy Loading](https://angular.dev/guide/routing/common-router-tasks#lazy-loading)
- [Route Guards](https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access)
- [Resolvers](https://angular.dev/guide/routing/common-router-tasks#fetching-route-data)

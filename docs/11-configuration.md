# 11. Configuration

## 📋 Índice
- [Angular CLI Config](#angular-cli-config)
- [TypeScript Config](#typescript-config)
- [Build Configurations](#build-configurations)
- [Environment Setup](#environment-setup)
- [Performance Optimization](#performance-optimization)

---

## 🔧 Angular CLI Config

### Ubicación

[`angular.json`](../angular.json)

### Estructura Completa

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "crypto-terminal": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss"
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": { /* ... */ },
        "serve": { /* ... */ },
        "extract-i18n": { /* ... */ },
        "test": { /* ... */ }
      }
    }
  },
  "cli": {
    "defaultCollection": "@schematics/angular",
    "strict": true
  }
}
```

### Build Configuration

```json
{
  "build": {
    "builder": "@angular-devkit/build-angular:browser-esbuild",
    "options": {
      "outputPath": "dist/crypto-terminal",
      "index": "src/index.html",
      "main": "src/main.ts",
      "polyfills": [
        "zone.js"
      ],
      "tsConfig": "tsconfig.app.json",
      "assets": [
        "src/favicon.ico",
        "src/assets"
      ],
      "styles": [
        "src/styles.scss"
      ],
      "scripts": [],
      "vendorChunk": true,
      "extractLicenses": false,
      "sourceMap": true,
      "optimization": false,
      "buildOptimizer": false,
      "fileReplacements": [],
      "outputHashing": "all",
      "aot": true
    },
    "configurations": {
      "production": {
        "budgets": [
          {
            "type": "initial",
            "maximumWarning": "500kb",
            "maximumError": "1mb"
          },
          {
            "type": "anyComponentStyle",
            "maximumWarning": "2kb",
            "maximumError": "4kb"
          }
        ],
        "outputHashing": "all",
        "optimization": true,
        "buildOptimizer": true,
        "sourceMap": false,
        "namedChunks": false,
        "aot": true,
        "extractLicenses": true,
        "vendorChunk": false
      },
      "development": {
        "buildOptimizer": false,
        "optimization": false,
        "vendorChunk": true,
        "extractLicenses": false,
        "sourceMap": true,
        "namedChunks": true
      }
    },
    "defaultConfiguration": "production"
  }
}
```

### Serve Configuration

```json
{
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "crypto-terminal:build:development",
      "port": 4200
    },
    "configurations": {
      "production": {
        "browserTarget": "crypto-terminal:build:production"
      },
      "development": {
        "browserTarget": "crypto-terminal:build:development",
        "hmr": true,
        "poll": 2000
      }
    },
    "defaultConfiguration": "development"
  }
}
```

### Test Configuration

```json
{
  "test": {
    "builder": "@angular-devkit/build-angular:karma",
    "options": {
      "polyfills": [
        "zone.js",
        "zone.js/testing"
      ],
      "tsConfig": "tsconfig.spec.json",
      "assets": [
        "src/favicon.ico",
        "src/assets"
      ],
      "styles": [
        "src/styles.scss"
      ],
      "scripts": [],
      "karmaConfig": "karma.conf.js"
    }
  }
}
```

---

## 🔤 TypeScript Config

### Ubicación

[`tsconfig.json`](../tsconfig.json)

### Base Configuration

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": [
      "ES2022",
      "dom"
    ],
    "paths": {
      "@app/*": ["src/app/*"],
      "@assets/*": ["src/assets/*"]
    }
  },
  "angularCompilerOptions": {
    "enableI18n": true,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true,
    "fullTemplateTypeCheck": true
  }
}
```

### Path Aliases

```json
{
  "paths": {
    "@app/*": ["src/app/*"],
    "@assets/*": ["src/assets/*"],
    "@core/*": ["src/app/core/*"],
    "@features/*": ["src/app/features/*"],
    "@shared/*": ["src/app/shared/*"]
  }
}
```

**Uso en Código:**

```typescript
// ❌ Evitar
import { MarketService } from '../../../../features/dashboard/service/market.service';

// ✅ Preferir
import { MarketService } from '@features/dashboard/service/market.service';
```

### Application-Specific Config

[`tsconfig.app.json`](../tsconfig.app.json)

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts"
  ],
  "include": [
    "src/**/*.d.ts"
  ]
}
```

### Test-Specific Config

[`tsconfig.spec.json`](../tsconfig.spec.json)

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": [
      "jasmine",
      "vitest"
    ]
  },
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ]
}
```

---

## 🏗️ Build Configurations

### Development Build

```bash
ng build --configuration development

# Características:
# - Source maps incluidos (debugging)
# - No minificación (legibilidad)
# - Vendor chunk separado
# - Lazy loading configurado
# - Tamaño: ~800KB
# - Tiempo: ~2-3 segundos
```

### Production Build

```bash
ng build --configuration production

# Características:
# - Minificación y obfuscación
# - Tree-shaking (elimina código no usado)
# - AoT compilation (Angular Optimizer)
# - Output hashing (cache busting)
# - Source maps EXCLUIDOS
# - Bundle analysis
# - Tamaño: ~250KB (gzip)
# - Tiempo: ~4-6 segundos
```

### Build Analyzer

```bash
# Instalar
npm install -D webpack-bundle-analyzer

# Analizar bundle
ng build --configuration production --stats-json
webpack-bundle-analyzer dist/crypto-terminal/stats.json
```

---

## 📦 Environment Setup

### Environment Files

**Ubicación:**
```
src/
  environments/
    environment.ts        (development)
    environment.prod.ts   (production)
```

### Development Environment

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://api.binance.com/api/v3',
  wsUrl: 'wss://stream.binance.com:9443/ws',
  logLevel: 'debug'
};
```

### Production Environment

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.binance.com/api/v3',
  wsUrl: 'wss://stream.binance.com:9443/ws',
  logLevel: 'error'
};
```

### Usando Environment

```typescript
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  getPrice(): Observable<any> {
    if (environment.production) {
      // Comportamiento de producción
    } else {
      // Comportamiento de desarrollo
    }
    
    return this.http.get(`${environment.apiUrl}/ticker/price`);
  }
}
```

### File Replacements

En `angular.json`:

```json
{
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.prod.ts"
    }
  ]
}
```

---

## 🧪 Testing Configuration

### Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test.ts',
        '**/*.spec.ts'
      ]
    }
  }
});
```

### Test Setup File

```typescript
// src/test.ts
import '@angular/localize/init';
import 'zone.js';
import 'zone.js/testing';
```

---

## 🚀 Performance Optimization

### Bundle Size Optimization

```bash
# Analizar tamaño actual
ng build --configuration production --stats-json

# Ver qué consume espacio
webpack-bundle-analyzer dist/crypto-terminal/stats.json
```

### Lazy Loading Configuration

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./features/portfolio/portfolio.component').then(m => m.PortfolioComponent)
  }
];
```

**Resultado:**
- main chunk: ~100KB
- dashboard chunk: ~50KB
- portfolio chunk: ~40KB

### Tree Shaking

Angular 20 elimina automáticamente:

```typescript
// ❌ Nunca usado - será eliminado
import { UnusedService } from './services/unused.service';

// ✅ Usado - será incluido
import { MarketService } from './services/market.service';

export class MyComponent {
  constructor(private market: MarketService) {}
}
```

### Change Detection Optimization

```typescript
// Zoneless = mejor performance
import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    // ... otros providers
  ]
});
```

**Beneficios:**
- Zona.js no necesaria (-50KB)
- Change detection más predecible
- Menos garbage collection
- 15-20% más rápido

### Component Optimization

```typescript
// ✅ Bueno: computed signals
export class MyComponent {
  items = signal<Item[]>([]);
  
  filteredItems = computed(() => 
    this.items().filter(item => item.active)
  );
}

// ✅ Bueno: OnPush strategy (para components con inputs)
@Component({
  selector: 'app-price-card',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceCardComponent {
  asset = input.required<CryptoAsset>();
}

// ❌ Malo: ngFor sin track
<div *ngFor="let item of items">
  {{item.name}}
</div>

// ✅ Bueno: ngFor con track
@for (item of items; track item.id) {
  <div>{{item.name}}</div>
}
```

---

## 🔗 Comandos Build

```bash
# Build development
npm run build

# Build production
npm run build:prod

# Serve desarrollo
npm start

# Tests
npm test
npm run test:coverage

# Lint
npm run lint
```

---

## 📊 Bundle Analysis Example

```bash
$ ng build --configuration production --stats-json

# Análisis de bundle:
┌────────────────────────────────────────────┐
│ File                    │ Size    │ Gzip   │
├────────────────────────────────────────────┤
│ main.js                 │ 150KB   │ 45KB   │
│ polyfills.js            │ 45KB    │ 12KB   │
│ runtime.js              │ 2KB     │ 1KB    │
│ dashboard.js (lazy)     │ 80KB    │ 22KB   │
├────────────────────────────────────────────┤
│ TOTAL                   │ 277KB   │ 80KB   │
└────────────────────────────────────────────┘

# Explicación:
# - main.js: Angular core + app logic
# - polyfills.js: Zone.js y compatibilidad (NO necesario con Zoneless)
# - dashboard.js: Feature cargada bajo demanda
```

---

## ⚙️ Development Server

### HMR (Hot Module Replacement)

```bash
# HMR habilitado automáticamente en development
ng serve
# La app se refresca cuando cambias código (SIN recargar la página)
```

### Environment Variables

```bash
# .env
BINANCE_API_URL=https://api.binance.com/api/v3
BINANCE_WS_URL=wss://stream.binance.com:9443/ws
```

```typescript
// app.config.ts
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    { 
      provide: 'API_URL', 
      useValue: environment.apiUrl 
    }
  ]
};
```

---

## 🔗 Referencias

- [Angular Build System](https://angular.dev/tools/cli/build)
- [TypeScript Configuration](https://www.typescriptlang.org/tsconfig)
- [esbuild vs Webpack](https://esbuild.github.io/)
- [Bundle Analysis](https://webpack.js.org/plugins/bundle-analyzer/)

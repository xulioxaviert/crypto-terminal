# 12. Development Guide

## 📋 Índice
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style & Conventions](#code-style--conventions)
- [Git Workflow](#git-workflow)
- [Debugging & Troubleshooting](#debugging--troubleshooting)
- [Common Tasks](#common-tasks)
- [Performance Profiling](#performance-profiling)
- [Contributing Guidelines](#contributing-guidelines)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ (recomendado v20 LTS)
- **npm**: v9+
- **Git**: v2.30+
- **VS Code**: (opcional pero recomendado)

### Installation

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/crypto-terminal.git
cd crypto-terminal

# 2. Instalar dependencias
npm install

# 3. Verificar instalación
npm run -v    # Ver versión de npm
node -v       # Ver versión de Node
ng version    # Ver versión de Angular CLI

# 4. Crear rama de desarrollo
git checkout -b develop
```

### First Run

```bash
# Iniciar servidor de desarrollo
npm start

# Navegar a http://localhost:4200
# Deberías ver la aplicación ejecutándose

# En otra terminal, ejecutar tests
npm test

# En otra terminal, revisar linting
npm run lint
```

---

## 🔄 Development Workflow

### Estructura de Carpetas de Trabajo

```bash
crypto-terminal/
├── src/
│   ├── app/
│   │   ├── core/          # Servicios globales, layouts
│   │   ├── features/      # Features modulares
│   │   └── shared/        # (futuro) Componentes compartidos
│   ├── assets/            # Imágenes, íconos, datos
│   ├── environments/      # Configuración por entorno
│   └── styles.scss        # Estilos globales
├── docs/                  # Documentación
├── dist/                  # Build output (generado)
└── node_modules/          # Dependencias (ignorado en git)
```

### Flujo de Desarrollo Típico

#### 1️⃣ Crear Feature Nueva

```bash
# 1. Crear rama
git checkout -b feature/price-alerts

# 2. Generar componente
ng generate component features/alerts/components/alert-card

# 3. Generar servicio si necesita lógica compleja
ng generate service features/alerts/service/alert.service

# 4. Implementar feature
# - Implementar componente
# - Implementar service (si aplica)
# - Escribir tests

# 5. Verificar tests pasan
npm test

# 6. Verificar linting
npm run lint

# 7. Commit de cambios
git add .
git commit -m "feat(alerts): add price alert card component"

# 8. Push a rama
git push origin feature/price-alerts

# 9. Crear Pull Request en GitHub
```

#### 2️⃣ Bugfix Existente

```bash
# 1. Crear rama desde main/develop
git checkout develop
git pull origin develop
git checkout -b fix/websocket-reconnect

# 2. Localizar el bug
# - Usar DevTools
# - Revisar logs en console
# - Ejecutar tests específicos

# 3. Escribir test que falle
npm test -- market.service.spec.ts

# 4. Implementar fix
# - Cambiar código
# - Ejecutar test de nuevo (debe pasar)

# 5. Verificar no romper nada más
npm test

# 6. Commit y Push
git add .
git commit -m "fix(market): improve websocket reconnection logic"
git push origin fix/websocket-reconnect
```

#### 3️⃣ Documentación

```bash
# 1. Crear rama
git checkout -b docs/add-testing-guide

# 2. Editar/crear archivos .md en /docs
# - Usar formato Markdown
# - Incluir ejemplos de código
# - Agregar referencias

# 3. Commit
git commit -m "docs: add comprehensive testing guide"
git push origin docs/add-testing-guide
```

---

## 🎨 Code Style & Conventions

### TypeScript Conventions

```typescript
// ✅ BUENO: Nombres descriptivos
interface CryptoAsset {
  id: string;
  symbol: string;
  price: number;
  change24h: number;
}

// ❌ MALO: Nombres ambiguos
interface CA {
  id: string;
  sym: string;
  p: number;
  c: number;
}

// ✅ BUENO: Tipos explícitos
function calculateProfit(price: number, cost: number): number {
  return price - cost;
}

// ❌ MALO: Tipos implícitos
function calculateProfit(price, cost) {
  return price - cost;
}

// ✅ BUENO: Immutabilidad
const asset: CryptoAsset = {
  ...oldAsset,
  price: 50000
};

// ❌ MALO: Mutación
asset.price = 50000;

// ✅ BUENO: Readonly en interfaces
interface CryptoAsset {
  readonly id: string;
  readonly price: number;
}

// ✅ BUENO: Usar signals correctamente
private count = signal(0);
private doubled = computed(() => this.count() * 2);
private onCountChange = effect(() => {
  console.log('Count changed:', this.count());
});

// ❌ MALO: Usar RxJS para state simple
private count$ = new BehaviorSubject(0);
```

### Angular Component Conventions

```typescript
// ✅ BUENO: Standalone component con signals
@Component({
  selector: 'app-price-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `...`
})
export class PriceCardComponent {
  asset = input.required<CryptoAsset>();
  isPositive = computed(() => this.asset().change24h >= 0);
}

// ❌ MALO: NgModule, no signals
@NgModule({
  declarations: [PriceCardComponent],
  imports: [CommonModule]
})
export class DashboardModule { }

// ✅ BUENO: Service con inject()
@Injectable({ providedIn: 'root' })
export class MarketService {
  private http = inject(HttpClient);
  private router = inject(Router);
}

// ❌ MALO: Constructor injection viejo
export class MarketService {
  constructor(private http: HttpClient, private router: Router) { }
}

// ✅ BUENO: Usar track en @for
@for (asset of assets(); track asset.id) {
  <app-price-card [asset]="asset" />
}

// ❌ MALO: Sin track
<div *ngFor="let asset of assets">
  <app-price-card [asset]="asset" />
</div>
```

### Naming Conventions

| Elemento | Ejemplo | Patrón |
|----------|---------|--------|
| **Classes** | `MarketService` | PascalCase |
| **Interfaces** | `CryptoAsset` | PascalCase, sin prefijo I |
| **Types** | `AssetUpdate` | PascalCase |
| **Functions** | `formatPrice()` | camelCase |
| **Variables** | `assetMap` | camelCase |
| **Constants** | `MAX_RETRY_COUNT` | UPPER_SNAKE_CASE |
| **Private fields** | `#privateField` | camelCase con # (optional chaining) |
| **Signals** | `count = signal()` | camelCase |
| **Observables** | `data$` | camelCase con $ suffix |
| **Booleans** | `isLoading`, `hasError` | is/has prefix |
| **Filenames** | `market.service.ts` | kebab-case |
| **Folders** | `src/features/dashboard/` | kebab-case |

### File Structure

```typescript
// ✅ BUENO: Orden recomendado en archivo

// 1. Imports
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// 2. Tipos e Interfaces
export interface Asset {
  id: string;
  name: string;
}

// 3. Decorador
@Injectable({ providedIn: 'root' })

// 4. Clase
export class MyService {
  // 4a. Inyecciones
  private http = inject(HttpClient);

  // 4b. Propiedades privadas
  private cache = new Map<string, Asset>();

  // 4c. Propiedades públicas
  public readonly assets = signal<Asset[]>([]);

  // 4d. Constructor (si aplica)
  constructor() { }

  // 4e. Métodos públicos
  public getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>('/api/assets');
  }

  // 4f. Métodos privados
  private transformData(data: any): Asset {
    return { id: data.id, name: data.name };
  }
}
```

---

## 🌳 Git Workflow

### Branches

```
main
├── develop (rama de desarrollo principal)
├── feature/precio-alerts
├── feature/portafolio
├── fix/websocket-bug
└── docs/update-readme
```

### Commit Messages

```bash
# Formato: <tipo>(<scope>): <descripción>

# Ejemplos:
git commit -m "feat(market): add price alert component"
git commit -m "fix(websocket): improve reconnection logic"
git commit -m "docs(readme): update installation steps"
git commit -m "refactor(dashboard): improve signal usage"
git commit -m "perf(market-service): optimize data transformation"
git commit -m "test(price-card): add missing unit tests"

# Tipos válidos:
# feat:     Nueva feature
# fix:      Bugfix
# refactor: Cambio de código sin cambiar funcionalidad
# perf:     Mejora de performance
# docs:     Cambios en documentación
# test:     Agregar o cambiar tests
# style:    Cambios de formato (no lógica)
# chore:    Cambios en dependencias o config
```

### Pull Request Template

```markdown
## Descripción
Breve descripción de los cambios

## Cambios Realizados
- [ ] Feature 1
- [ ] Feature 2

## Testing Realizado
- [ ] Tests unitarios pasan
- [ ] Coverage > 80%
- [ ] No regresiones

## Checklist
- [ ] Código sigue las convenciones
- [ ] Documentación actualizada
- [ ] Sin console.log() de debug
- [ ] Sin dependencias innecesarias

## Screenshots (si aplica)
Adjuntar screenshots de la UI

## Issues Relacionados
Closes #123
```

---

## 🔍 Debugging & Troubleshooting

### VS Code Setup

#### Extensiones Recomendadas

```json
{
  "extensions": [
    "Angular.ng-template",
    "TypeScript Vue Plugin",
    "ES7+ React/Redux/React-Native snippets",
    "Tailwind CSS IntelliSense",
    "Thunder Client",
    "GitLens"
  ]
}
```

#### Launch Configuration

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chrome (Angular Dev)",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverride": {
        "webpack:///./src/*": "${webspaceFolder}/src/*"
      }
    }
  ]
}
```

### Common Issues

#### Issue 1: Componente no se renderiza

```typescript
// ❌ PROBLEMA
export class MyComponent {
  // Falta importar CommonModule
  @if (isLoading()) {
    <p>Cargando...</p>
  }
}

// ✅ SOLUCIÓN
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule]
})
export class MyComponent {
  @if (isLoading()) {
    <p>Cargando...</p>
  }
}
```

#### Issue 2: WebSocket no se conecta

```typescript
// ❌ PROBLEMA
private url = 'ws://stream.binance.com:9443/ws'; // HTTP, no HTTPS

// ✅ SOLUCIÓN
private url = 'wss://stream.binance.com:9443/ws'; // WSS = WebSocket Secure
```

#### Issue 3: Tests fallan aleatoriamente

```typescript
// ❌ PROBLEMA: Tests dependientes de tiempo
it('should update signal', (done) => {
  service.update();
  setTimeout(() => {
    expect(component.count()).toBe(1);
    done();
  }, 100);
});

// ✅ SOLUCIÓN: Usar fakeAsync
it('should update signal', fakeAsync(() => {
  service.update();
  tick(100);
  expect(component.count()).toBe(1);
}));
```

#### Issue 4: Signals no actualiza template

```typescript
// ❌ PROBLEMA: Referencia sin llamar función
template: `{{ count }}` // count es una función signal

// ✅ SOLUCIÓN: Llamar la función
template: `{{ count() }}` // Correcto
```

---

## 📋 Common Tasks

### Agregar Nuevo Componente

```bash
# 1. Generar componente
ng generate component features/dashboard/components/asset-detail

# Crea:
# - asset-detail.component.ts
# - asset-detail.component.html
# - asset-detail.component.scss
# - asset-detail.component.spec.ts

# 2. Implementar lógica
# Editar los archivos generados

# 3. Escribir tests
# Completar asset-detail.component.spec.ts

# 4. Usar en otro componente
import { AssetDetailComponent } from './asset-detail.component';

@Component({
  imports: [AssetDetailComponent]
})
export class MyComponent { }
```

### Agregar Servicio con Lógica

```bash
# 1. Generar servicio
ng generate service features/portfolio/service/portfolio

# 2. Implementar lógica
export class PortfolioService {
  private http = inject(HttpClient);
  
  getPortfolio(): Observable<Portfolio> {
    return this.http.get<Portfolio>('/api/portfolio');
  }
}

# 3. Inyectar en componentes
export class PortfolioComponent {
  private service = inject(PortfolioService);
  portfolio = toSignal(this.service.getPortfolio());
}

# 4. Escribir tests para servicio
// portfolio.service.spec.ts
```

### Agregar Ruta

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'portfolio',
    loadComponent: () => 
      import('./features/portfolio/portfolio.component')
        .then(m => m.PortfolioComponent)
  }
];

// Luego usar en template
<a routerLink="/portfolio">Portfolio</a>
```

### Actualizar Dependencias

```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar a versión minor
npm update

# Actualizar a versión major (CUIDADO)
npm install @angular/core@latest

# Verificar que no hay breaking changes
npm test
npm run build
```

---

## 📊 Performance Profiling

### Chrome DevTools

```bash
# 1. Abrir Chrome DevTools (F12 o Cmd+Option+I)

# 2. Performance Tab
# - Grabbar sesión
# - Realizar acción (ej: cargar dashboard)
# - Detener grabación
# - Analizar:
#   - Tiempo de carga (DOMContentLoaded, Load)
#   - Layout thrashing
#   - Scripts que bloquean
#   - Memory usage

# 3. Network Tab
# - Ver requests HTTP
# - Tamaño de bundles
# - Tiempo de respuesta API
# - Throttling network para simular 3G
```

### Angular Profiler

```bash
# En console del navegador:
ng.profiler.timeChangeDetection()

// Output:
// Angular ran 12 change detection cycles
// in 0.5ms
```

### Bundle Analysis

```bash
# Generar análisis
ng build --configuration production --stats-json

# Instalar analizador
npm install -D webpack-bundle-analyzer

# Ejecutar análisis
webpack-bundle-analyzer dist/crypto-terminal/stats.json
```

---

## 📦 Release Process

### Versioning (Semantic Versioning)

```
MAJOR.MINOR.PATCH
1.2.3

- MAJOR: Breaking changes (1.0.0 → 2.0.0)
- MINOR: New features (1.2.0 → 1.3.0)
- PATCH: Bug fixes (1.2.0 → 1.2.1)
```

### Release Steps

```bash
# 1. Actualizar versión en package.json
npm version minor

# 2. Crear tag
git tag v1.2.0

# 3. Push con tags
git push origin develop
git push origin --tags

# 4. Build producción
npm run build

# 5. Deploy (si aplica)
# Usar CI/CD (GitHub Actions, etc)
```

---

## 🤝 Contributing Guidelines

### Setup Local

```bash
# 1. Fork del repositorio en GitHub

# 2. Clonar fork
git clone https://github.com/tu-usuario/crypto-terminal.git

# 3. Agregar upstream
git remote add upstream https://github.com/original-owner/crypto-terminal.git

# 4. Crear rama
git checkout -b feature/my-feature
```

### Antes de Pushear

```bash
# 1. Tests pasan
npm test

# 2. Linting limpio
npm run lint

# 3. Coverage aceptable
npm run test:coverage

# 4. Build production OK
npm run build

# 5. No hay console.log()
grep -r "console.log" src/ --include="*.ts"
```

### Sync con Main

```bash
# Mantener rama actualizada
git fetch upstream
git rebase upstream/develop
git push origin feature/my-feature -f
```

---

## 🔗 Recursos Útiles

- [Angular Documentation](https://angular.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [RxJS Operators](https://rxjs.dev/operator-decision-tree)
- [Signals Guide](https://angular.dev/guide/signals)
- [Git Documentation](https://git-scm.com/doc)
- [Vitest Documentation](https://vitest.dev/)

---

## 📞 Getting Help

1. **Revisar documentación** en `/docs`
2. **Buscar en Stack Overflow** con tags `angular`, `typescript`
3. **GitHub Issues** en el repositorio
4. **Discord/Comunidad** Angular
5. **Reportar bugs** con pasos reproducibles

---

## 🎓 Learning Paths

### Para Principiantes

1. Completar Getting Started
2. Leer 01-project-overview.md
3. Implementar componente simple
4. Escribir tests para ese componente
5. Hacer primer Pull Request

### Para Intermedios

1. Revisar Architecture (02-architecture.md)
2. Implementar servicio con RxJS
3. Agregar testing completo
4. Optimizar performance
5. Documentar cambios

### Para Avanzados

1. Profundizar en Signals y Change Detection
2. Implementar guards y resolvers
3. Configurar CI/CD
4. Performance profiling y optimization
5. Arquitectura de features complejas

---

## ✨ Best Practices Checklist

- [ ] Code sigue convenciones del proyecto
- [ ] Tests incluidos y con coverage > 80%
- [ ] Documentación actualizada
- [ ] No hay breaking changes
- [ ] Commit messages claros
- [ ] PR description detallada
- [ ] Código revisado por otro desarrollador
- [ ] Performance verificado
- [ ] Accesibilidad considerada
- [ ] Cross-browser compatible

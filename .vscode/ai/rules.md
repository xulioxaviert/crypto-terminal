# Reglas del Proyecto — CryptoTerminal

## 🎯 Lectura obligatoria

**ANTES de hacer nada**: Lee **master-context.md** y el archivo del rol solicitado en `.vscode/ai/agents/`.

---

## Angular 20 (Zoneless, Signals)

### Control Flow y Componentes
- **Zoneless**: nunca uses `zone.js` ni `ChangeDetectorRef`; las signals reaccionan automáticamente.
- **Componentes**: siempre standalone; **nunca módulos NgModule**.
- **Control flow**: `@if`, `@for`, `@switch` (nunca `*ngIf`, `*ngFor`, `*ngSwitchCase`).
- **Inputs/Outputs**: `input()`, `output()`, `model()` (nunca `@Input()`, `@Output()`, `[(ngModel)]`).

### Inyección de dependencias
- Usa `inject()` siempre; **nunca constructor injection legado**.
- Servicios: tipados, con responsabilidad única, sin lógica de negocio compleja.

### Estado y Reactividad
- **Local**: `signal()` para estado mutable; `computed()` para derivado (nunca `effect()` a menos que sea imprescindible).
- **Global**: `NgRx Signal Store` para estado compartido (user preferences, watchlist, portfolio snapshot).
- **RxJS**: flujos reactivos con `switchMap`, `throttleTime`, `debounceTime`, `takeUntilDestroyed`, `shareReplay`.
- **Cancelación explícita**: `takeUntilDestroyed()` o `async` pipe; verifica unsubscribe en tests.

---

## Arquitectura y Organización

### Estructura de carpetas
```
core/
  ├── components/ (header, sidebar)
  ├── config/
  ├── models/
features/
  ├── dashboard/
  ├── markets/
  ├── portfolio/
  ├── settings/ (futuro)
shared/
  ├── components/ (price-card, chart, market-trends, header-search, wallets)
  ├── utils/ (currency-formatter, validators)
```

### Principios
- **DDD lite**: bounded features por dominio (dashboard, markets, portfolio).
- **SOLID, DRY**: elimina duplicación, componentes <200 líneas, responsabilidad única.
- **Sin ciclos**: `features → shared/core`, nunca al revés.
- **Composición**: prefiere composición de componentes sobre herencia.

### Componentes
- Máximo 200 líneas; divide en subcomponentes cuando crezcan.
- Lógica compleja en servicios o helpers puros, **no en templates**.
- Track en `@for` para optimizar renderizados: `@for (item of items; track item.id)`.

---

## Estilos y Tailwind

### Tokens del proyecto
- **Backgrounds**: `crypto-dark`, `secondary`, `tertiary`
- **Text**: `text-white`, `text-gray-400`, `text-neon` (crypto-neon)
- **Accents**: `crypto-neon` para highlights, alertas
- **SCSS**: solo para animaciones complejas (neon glow, transiciones finas)

### Accesibilidad (WCAG 2.2 AA)
- Contraste mínimo 4.5:1 (normal) / 3:1 (grande)
- Foco visible en todos los elementos interactivos
- Labels visibles, ARIA correcta (no redundante)
- Navegación por teclado completa
- Respetar `prefers-reduced-motion`

---

## Binance Integration

### REST API
- Endpoints tipados: `fetchMarkets()`, `fetchPortfolio()`, `fetchTicker(symbol)`
- Caché local cuando tenga sentido (últimos 5min)
- Manejo de errores explícito: 4xx (user error), 5xx (server error), timeout

### WebSocket
- Reconexión automática con backoff exponencial
- Throttling: agrupa updates cada 200-500ms
- Parsing tipado: `BinanceModel`, `TickerModel`, `TradeModel`
- Cancelación/cleanup en unsubscribe

### Flujo de datos
```
Binance REST/WS → Services (MarketService, PortfolioService, ChartDataService)
  → Signals/Signal Store → Componentes UI
  → Templates con track en @for, computed para derivados
```

---

## Testing

### Frameworks
- **Runner**: Vitest
- **Components/Services**: Angular TestBed (standalone)
- **E2E** (futuro): Cypress o Playwright
- **No usar**: Karma, Jasmine, Jest, JUnit

### Pirámide
- **Unit** (mayor volumen): formatters, helpers, validators, servicios puros
- **Integration**: componentes con signals, servicios con deps inyectadas
- **E2E**: flujos críticos (búsqueda, watchlist, actualizaciones tiempo real)

### Buenas prácticas
- Cobertura >80% en servicios críticos (Market, Portfolio, ChartData)
- Builders/Factories en `/test-utils` para modelos (CryptoModel, BinanceModel)
- `setInput()` + `detectChanges()` explícita en componentes con signals
- TestScheduler para RxJS; `fakeAsync` para timers
- Tests cortos, enfocados, nombres descriptivos

---

## Performance

### Frontend
- **Lazy loading** de features (routes automáticas)
- **Code splitting** por rutas
- **Signals/computed**: evita renderizados innecesarios
- **Track en @for**: `track item.id`
- **Avoid**: recrear arrays/funciones en templates, lógica pesada en main thread

### Binance/WebSocket
- **Throttling**: 200-500ms en updates de precio
- **Debouncing**: 300-500ms en búsquedas (header-search)
- **Backpressure**: reconexión con límites
- **Parsing eficiente**: validación tipada

### Monitoreo
- Core Web Vitals: LCP, CLS, TTI
- Errores de WS/HTTP
- CPU/memoria navegador
- Herramientas: Chrome DevTools, Lighthouse, OpenTelemetry

---

## Commits y Ramas

### Commits: Convencional Commits (inglés)
```
<tipo>(opcional-scope): descripción breve imperativo

feat: add price alerts
fix(market-service): handle disconnect timeout
refactor: extract currency formatter
docs: binance api integration guide
test: market service unit tests
perf: throttle websocket updates
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `build`, `ci`

### Ramas
```
feature/APP-XX-descripción-en-español
bugfix/APP-XX-descripción-en-español
refactor/APP-XX-descripción-en-español
```

Ejemplo: `feature/APP-01-implementar-busqueda-criptos`

### Issues
```
APP-XX: Título en español

## Contexto
Descripción del problema/necesidad

## Tareas
- [ ] Tarea 1
- [ ] Tarea 2
- [ ] Tarea 3

## Criterios de aceptación
- Criterio 1
- Criterio 2
```

---

## Nombres y Convenciones

### Componentes
```typescript
// Standalone
export default class DashboardComponent { }

// Dentro de features/dashboard/
// dashboard.component.ts
// dashboard.component.html
// dashboard.component.scss
// dashboard.component.spec.ts
```

### Servicios
```typescript
// En features/dashboard/service/
// market.service.ts
// market.spec.ts

export class MarketService {
  // Inyectar servicios con inject()
  private http = inject(HttpClient);
}
```

### Variables y Observables
```typescript
// Observables con sufijo $
prices$ = this.market.fetchPrices$();

// Signals (sin sufijo)
currentPrice = signal(0);
derivedPrice = computed(() => this.currentPrice() * this.exchangeRate());

// Métodos descriptivos
fetchMarketData()
handleWebSocketMessage()
calculatePercentChange()
```

### Modelos/Tipos
```typescript
// En models/
export interface CryptoModel {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  percentChange24h: number;
  // ...
}

export interface BinanceModel {
  // Tipado directo de Binance API
}
```

---

## Documentación

- **Funciones/clases expuestas**: TSDoc (no JSDoc genérico)
- **Decisiones**: ADRs en `/docs` (Contexto, Alternativas, Decisión, Consecuencias)
- **Endpoints Binance**: documentar REST/WebSocket con ejemplos
- **Diagramas**: Mermaid para flujos, arquitectura, user journeys
- **Actualizar**: cuando cambien APIs públicas, contratos Binance, configuración

---

## Seguridad

- **Secrets**: nunca en código; usar variables de entorno
- **Validación**: datos de Binance tipados, sanitización de entradas
- **CORS**: configurado correctamente
- **Dependencias**: `npm audit` regular, actualizar patches críticos
- **Logs**: sin datos sensibles (keys, passwords, tokens)

---

## Devs

- **Lint limpio**: ESLint, Prettier
- **Sin console.log debug**: eliminar antes de commit
- **Tests pasan**: antes de hacer merge
- **TypeScript strict**: nunca `any`, tipado completo
- **Git**: commits limpios, sin squashes accidentales

---

**✅ Resumen**: Lee master-context.md + rol solicitado, aplica estas reglas, prioriza seguridad > correctitud > mantenibilidad > rendimiento > estilo.

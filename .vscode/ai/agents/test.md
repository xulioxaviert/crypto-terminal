# Rol: Testing — CryptoTerminal

## Objetivo
- Garantizar cobertura de calidad y prevenir regresiones sin ralentizar desarrollo ni romper comportamiento observable.

## Frameworks y runner
- Angular 20 zoneless: usa Vitest como runner principal; para componentes/servicios usa Angular TestBed con imports standalone.
- Para servicios HTTP usa HttpClientTestingModule; para flujos RxJS usa TestScheduler/marbles cuando aplique.
- E2E (futuro): Cypress o Playwright; no usar Karma/Jasmine/Jest ni JUnit (proyecto no Java).

## Alcance y pirámide
- **Unit** (mayor volumen): formatters (currencyFormatter), helpers puros, validators (email, amount).
- **Component/Integration**: componentes standalone con signals/inputs (DashboardComponent, PriceCardComponent, ChartComponent), servicios (MarketService, PortfolioService).
- **E2E** (futuro smoke): flujos críticos — búsqueda de mercados, agregar a watchlist, actualización de precios en tiempo real.
- Cubre: casos felices, límites, errores HTTP (4xx/5xx), timeouts WebSocket, datos vacíos, estados cargando.

## Buenas prácticas
- **Evita mocks innecesarios**: usa fixtures reales con datos mínimos (BinanceModel mocks, PortfolioModel fixtures).
- **Builders/Factories**: reutilizables en `/test-utils` para `CryptoModel`, `BinanceModel`, `PortfolioModel`.
- **Signals/Computed**: setInput(), detectChanges() explícita, verifica computed sin depender del DOM.
- **RxJS**: TestScheduler/marbles para operadores (throttle, debounce, switchMap), fakeAsync para timers, verifica teardown/unsubscribe.
- **HTTP**: HttpClientTestingModule para servicios REST (MarketService.fetchMarkets, PortfolioService.updatePortfolio).
- **Tests claros**: nombres descriptivos (`should return prices sorted by change percent`), cortos y enfocados, factoriza setup en beforeEach/helpers.

## Mantenimiento
- Sugiere mejoras en estructura de tests; factoriza datos de prueba para reducir duplicación.
- Mantén cobertura >80% en servicios críticos (Market, Portfolio, ChartData); lint limpio; sin console.log debug.

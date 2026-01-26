# Rol: Senior Frontend — Angular 20

## Objetivo
- Implementar interfaces robustas, accesibles, performantes y mantenibles en Angular 20 zoneless con signals y componentes standalone.

## Responsabilidades
- Implementar componentes standalone con control flow @if/@for/@switch, inputs/output/model(), DI via inject(); nunca zone.js, ChangeDetectorRef, constructor injection.
- Construir features (Dashboard, Markets, Portfolio, Settings) con subcomponentes <200 líneas; reutilizar shared (price-card, chart, header-search, market-trends, wallets).
- Aplicar flujos RxJS para datos de Binance: REST (fetchMarkets, fetchPortfolio) + WebSocket (price updates, trades), con teardown/cancelación explícita y manejo de errores.
- Usar signals para estado local; computed() para derivados (precio en moneda seleccionada, porcentaje cambio, rentabilidad); effect() solo si imprescindible.
- Garantizar accesibilidad (WCAG 2.2 AA): labels, ARIA en gráficos/tablas, navegación por teclado, foco visible.
- Optimizar performance: track() en @for (market lists, portfolio items), lazy loading de vistas, evitar recrear arrays/funciones en templates.
- Escribir tests (Vitest + TestBed) para componentes y servicios: casos felices, límites, errores de red, estados vacío/cargando.

## Estándares del proyecto
- **Templates limpios**: mueve lógica a signals/computed o funciones puras; evita pipes complejos.
- **Tailwind tokens**: crypto-dark, crypto-neon, backgrounds (secondary, tertiary), text colors; SCSS solo para animaciones neon.
- **Nombres descriptivos**: componentes (DashboardComponent, MarketTrendsComponent), servicios (MarketService, PortfolioService), observables sufijo `$`.
- **Commits**: Convencional Commits en inglés (`feat: add price alerts`); ramas `feature/APP-XX-título-español`.
- **Modelos tipados**: `CryptoModel`, `BinanceModel`, `PortfolioModel`, `MarketTrendModel`; contratos claros de API.

# Rol: Arquitecto — CryptoTerminal

## Objetivo
- Diseñar y revisar una arquitectura escalable, mantenible y segura alineada con Angular 20 zoneless, signals, DDD lite y las integraciones de Binance.

## Responsabilidades
- Evaluar la arquitectura actual (core/features/shared) midiendo acoplamiento, cohesión y escalabilidad del dashboard/mercados/cartera.
- Proponer mejoras con patrones adecuados:
  - **Ports/Adapters**: para Binance REST/WS (MarketService, PortfolioService, ChartDataService).
  - **Event-driven**: para streaming de precios y alertas en tiempo real.
  - **DDD lite**: bounded features por dominio (dashboard, markets, portfolio, alerts, settings).
  - **Signal Store**: estado global (user preferences, watchlist, portfolio snapshot).
- Garantizar separación de capas: services → stores → components UI; dependencias dirigidas (features → shared/core, sin ciclos).
- Diseñar flujos de datos críticos:
  - Binance API REST → Market/Portfolio Services → Signal Store → Dashboard/Markets/Portfolio Components.
  - WebSocket Binance → ThrottledEvents → Chart Updates → UI (sin bloquear).
- Crear diagramas Mermaid (flujos, arquitectura de capas, conexión Binance) y registrar ADRs (Contexto, Alternativas, Decisión, Consecuencias).
- Revisar decisiones técnicas importantes (ApexCharts performance, reconexión WS, caché de datos, alertas), priorizando seguridad > correctitud > mantenibilidad.

## Reglas y estándares del proyecto
- **Angular 20 zoneless standalone**: control flow @if/@for/@switch, inputs con input()/output()/model(), DI con inject(); nunca zone.js/ChangeDetectorRef/constructor injection.
- **Estado**: signals/computed para derivado; effect solo imprescindible; NgRx Signal Store para global (market snapshot, portfolio, user settings, watchlist).
- **Componentes**: <200 líneas; dividir en subcomponentes (chart, price-card, market-trends, header-search); reutilizar shared; favorecer composición.
- **Estilos**: tokens Tailwind (crypto-dark, crypto-neon, backgrounds, text colors); SCSS solo para animaciones neon/complejas.
- **Performance**: lazy loading (features por ruta), code splitting automático, track() en @for, signals para derivados; throttling/backoff en WS; parsing eficiente.
- **Seguridad**: validar datos de Binance, sanitizar entradas, no exponer keys/secrets, CORS correcto.

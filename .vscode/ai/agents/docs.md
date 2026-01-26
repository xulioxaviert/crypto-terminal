# Rol: Documentación — CryptoTerminal

## Objetivo
- Crear documentación clara, útil y mantenible alineada al stack Angular 20/TypeScript, RxJS, Binance y las guías de /docs.

## Formato y alcance
- **Markdown** en `/docs` (README.md, architecture.md, setup.md, etc.); **TSDoc** para funciones/clases expuestas (no JSDoc genérico).
- **Decisiones arquitectónicas**: ADRs (Contexto, Alternativas, Decisión, Consecuencias), trade-offs, patrones (ports/adapters, DDD lite, signals, Signal Store).
- **Binance API**: endpoints REST (fetchMarkets, fetchPortfolio), WebSocket (price updates, trades), formatos de datos, reconexión strategy.
- **Modelos/Tipos**: CryptoModel, BinanceModel, PortfolioModel, MarketTrendModel; ejemplos de payloads.
- **Configuración**: endpoints Binance, Tailwind tokens, variables de entorno, secrets management.
- **Features**: descripción, responsabilidades, componentes, servicios, flujos RxJS.
- **Diagramas Mermaid**: flujos de datos (Binance → Services → Store → UI), arquitectura de capas, user journeys.
- **Setup y desarrollo**: instalación, scripts npm (start, build, test), troubleshooting.

## Buenas prácticas
- **Alineación**: nombres y rutas reales (core/features/shared, components standalone, control flow @if/@for/@switch).
- **Snippets**: signals/input()/output()/model(), RxJS (switchMap, throttleTime, takeUntilDestroyed), casos de uso reales.
- **Testing**: estrategia según pirámide (Vitest + TestBed), cobertura >80% en servicios críticos, builders/factories en test-utils.
- **Actualizaciones**: cuando cambien API públicas, contratos Binance, tokens Tailwind, endpoints, o decisiones arquitectónicas.
- **Tono**: profesional, conciso, accionable; prioriza "qué hacer" antes de "por qué" cuando sea obvio.

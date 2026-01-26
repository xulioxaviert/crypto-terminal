# Rol: Refactor — CryptoTerminal

## Objetivo
- Mejorar calidad, legibilidad y mantenibilidad del código sin alterar comportamiento observable ni romper tests.

## Principios base
- **SOLID, Clean Code, DDD lite, DRY**: elimina código muerto, reduce duplicación (extrae helpers, subcomponentes, servicios).
- **Simplifica lógica**: refactoriza templates complejos, servicios con muchas responsabilidades, estados mutables.
- **Tipado estricto**: TypeScript strict mode, modelos `CryptoModel`, `BinanceModel`, `PortfolioModel`; nombres descriptivos; observables sufijo `$`.

## Angular 20 (zoneless, standalone)
- **Signals/control flow**: input()/output()/model(), @if/@for/@switch (nunca *ngIf/*ngFor/zone.js/ChangeDetectorRef).
- **Inyección**: inject() siempre; refactoriza constructor injection legado.
- **Componentes**: <200 líneas; divide en subcomponentes cuando crezcan (chart, price-card, market-trends, wallets, settings).
- **Arquitectura**: core/features/shared; sin dependencias cíclicas; reutiliza shared (formatters, components, utils).

## Estado y RxJS
- **Flujos reactivos**: RxJS sobre promesas; teardown/cancelación explícita (takeUntilDestroyed, async pipe); manejo de errores explícito.
- **Throttling/Debouncing**: búsqueda (header-search 300-500ms), actualizaciones WebSocket (200-500ms), cambios de filtro.
- **Estado global**: NgRx Signal Store para user preferences, watchlist, portfolio snapshot.
- **Derivados**: computed() para estado derivado (precio en moneda, porcentaje cambio); effect() solo si imprescindible.

## UI, estilos y componentes shared
- **Tailwind tokens**: crypto-dark, crypto-neon, backgrounds (secondary, tertiary), text colors; SCSS solo animaciones neon.
- **Componentes shared**: `price-card`, `chart`, `market-trends`, `header-search`, `wallets`, `settings-component`.
- **Helpers puros**: `currency-formatter`, formatters de fecha, validadores; reutilización horizontal.
- **Accesibilidad**: WCAG 2.2 AA incluida; labels, ARIA en gráficos, foco visible.

## Características CryptoTerminal
- **Dashboard**: market overview, gráficos, wallet summary, cambios porcentuales.
- **Markets**: búsqueda, filtros, ordenamiento, watchlist, alertas de precio.
- **Portfolio**: saldo, rentabilidad, histórico, operaciones simuladas.
- **Binance Integration**: REST (fetchMarkets, fetchPortfolio) + WebSocket (price updates, trades), reconexión automática.
- **Settings**: tema, moneda base, alertas, preferencias.

## Pruebas y seguridad
- **Tests pasan**: refactor sin cambiar comportamiento requiere que tests existentes sigan pasando.
- **Actualiza tests**: solo si reflejan API pública cambiada o mejoras significativas.
- **Lint y debug**: elimina console.log debug, confirma linter limpio.
- **Datos Binance**: validar tipos, parseo tipado, sanitización; errores de reconexión/timeout explícitos.

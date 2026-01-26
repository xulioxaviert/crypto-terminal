# CONTEXTO MAESTRO — CryptoTerminal (LEER SIEMPRE ANTES DE HACER NADA)

Este archivo define las reglas, principios, estándares y expectativas que deben aplicarse SIEMPRE en este proyecto **Angular 20 (zoneless, signals, signals store)**, independientemente del rol o agente activo.

---

## 0. Estado del Proyecto

- **Framework**: Angular 20 (Zoneless, Signal-based)
- **Architecture**: Domain-Driven Design (DDD) Lite
- **State Management**: NgRx Signal Store + Local Signals
- **Styling**: Tailwind CSS + SCSS (Hybrid approach)
- **Testing**: Vitest + Angular TestBed (standalone)
- **Integrations**: Binance REST API + WebSocket

---

## 1. Principios fundamentales

- Aplicar SOLID, Clean Code y buenas prácticas de arquitectura.
- Mantener el código simple, legible y modular.
- Evitar duplicación y complejidad innecesaria.
- Priorizar accesibilidad, rendimiento y mantenibilidad.
- Favorecer composición sobre herencia cuando sea posible.
- Evitar “magia” y side effects inesperados.
- Todo cambio debe ser razonable, justificable y explicable.

---

## 2. Estándares de commits (Convencional Commits)

Formato:
- `<tipo>(opcional-scope): descripción breve en imperativo`

Tipos principales:
- `feat:` nueva funcionalidad
- `fix:` corrección de errores
- `docs:` documentación
- `style:` cambios de formato sin lógica
- `refactor:` cambios internos sin alterar comportamiento
- `test:` añadir o modificar tests
- `chore:` tareas de mantenimiento
- `perf:` mejoras de rendimiento
- `build:` cambios en build o dependencias
- `ci:` cambios en pipelines

Ejemplos:
- `feat: add user profile page`
- `fix(auth): handle expired tokens`
- `refactor: extract user service`

---

## 3. Estándares de código por stack

### 3.1 Angular 20 / Frontend (Principal)

**Zoneless y Signals (Strict):**
- Componentes **standalone** siempre; nunca módulos NgModule.
- **Jamás** `zone.js` ni `ChangeDetectorRef`; las signals reaccionan automáticamente.
- Control flow: `@if`, `@for`, `@switch` (nunca `*ngIf`, `*ngFor`, `*ngSwitchCase`).
- Inputs: `input()`, outputs: `output()`, two-way: `model()` (nunca `@Input()`, `@Output()`, `[(ngModel)]`).
- Inyección de dependencias: `inject()` siempre (nunca constructor injection legado).
- Estado local: `signal()` mutable, `computed()` para derivado (nunca `effect()` a menos que sea imprescindible).
- Estado global: **NgRx Signal Store** para compartido (user preferences, watchlist, portfolio snapshot).
- **RxJS flujos reactivos**: `switchMap`, `throttleTime`, `debounceTime`, `takeUntilDestroyed`, `shareReplay`.
- **Teardown explícito**: `takeUntilDestroyed()` o `async` pipe; verifica unsubscribe en tests.

**Arquitectura y límites:**
- Arquitectura **core/features/shared** (sin dependencias cíclicas).
- Componentes **<200 líneas**; dividir en subcomponentes cuando crezcan.
- **SOLID, Clean Code, DRY**: responsabilidad única, nombres descriptivos, sin duplicación.
- Composición sobre herencia; favorecer reutilización en `shared/`.

**Estilos (Tailwind + SCSS Hybrid):**
- Tailwind CSS preferido: tokens del proyecto (`crypto-dark`, `crypto-neon`, backgrounds, text colors).
- SCSS **solo para**:
  - Animaciones complejas (neon glow, transiciones finas)
  - Estilos dinámicos que Tailwind no cubre
  - Pseudo-elementos avanzados
- PostCSS configurado; purge eficaz de Tailwind.
- **Accesibilidad integrada**: contraste 4.5:1 (normal)/3:1 (grande), foco visible, ARIA mínima/correcta.

**Testing:**
- Vitest como runner (no Karma, Jasmine, Jest, JUnit)
- Angular TestBed (standalone) para componentes/servicios
- Pirámide: unit (mayor volumen) > component/integration > E2E (futuro)
- Cobertura >80% en servicios críticos

### 3.2 Integraciones específicas

**Binance (REST + WebSocket):**
- Tipado estricto en modelos; siguiendo `models/binance.model.ts`, `crypto.model.ts`, etc.
- Servicios tipados (`BinanceService`, `MarketService`, `PortfolioService`).
- Reconexión automática, backoff exponencial, manejo de desconexiones.
- Parseo eficiente; caché cuando sea necesario.
- Throttling en eventos para no sobrecargar UI.

**Event-driven (Kafka, si aplica):**
- Productores y consumidores idempotentes.
- Contratos claros y documentados.
- Reintentos con backoff exponencial.

---

## 4. Accesibilidad y UX/UI

- Seguir **WCAG 2.2 AA** como mínimo.
- Garantizar navegación por teclado; focus visible en todos los elementos interactivos.
- Usar ARIA correctamente y solo cuando sea necesario (no redundante).
- Mantener contraste mínimo 4.5:1 para textos normales.
- Evitar animaciones excesivas o mareantes; respetar `prefers-reduced-motion`.
- Formularios con labels, ayudas, mensajes de error útiles y máximo una columna.
- Estados claros: cargando, vacío, error, éxito.

---

## 5. Rendimiento

- **Frontend**: Evitar renderizados innecesarios con signals/computed, `track()` en `@for`, memoización en helpers puros.
- Lazy loading de vistas y code splitting automático por rutas.
- Minimizar payloads JSON y tiempos de respuesta HTTP.
- Throttling/backpressure en websockets para no bloquear UI.
- Monitoreo: LCP, CLS, TTI; logs de rendimiento en desarrollo.
- Perfilar antes de optimizar (Chrome DevTools, Lighthouse).

---

## 6. Roles disponibles

- **Arquitecto**: Diseño de componentes, flujos de datos, scalability.
- **Senior Frontend**: Implementación, refactoring, best practices Angular 20.
- **UX/UI + Accesibilidad**: Diseño, WCAG, tokens Tailwind.
- **Experto en rendimiento**: Optimización, perfilado, métricas.
- **Testing**: Tests unitarios, integración, E2E.
- **Documentación**: Docs, READMEs, guías de desarrollo.
- **DevOps / Infra**: Build, deploy, infraestructura.
- **Git/Workflow**: Commits, ramas, issues, flujo de trabajo.

Cada rol tiene su archivo en `.vscode/ai/agents/`.

---

## 7. Nomenclatura y ramas

### Commits: Convencional Commits (Inglés obligatorio)
- Formato: `<tipo>(scope): descripción imperativo`
- Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `build`, `ci`
- **Ejemplos**:
  - `feat(dashboard): add real-time websocket connection using signals`
  - `fix(market-service): handle disconnect timeout with exponential backoff`
  - `refactor: extract currency formatter utility`
  - `test: add market service unit tests`
  - `perf: throttle websocket updates to 200-500ms`

### Ramas
- Formato: `<tipo>/<APP-XX>-<descripción-en-español>`
- Tipos: `feature`, `bugfix`, `refactor`, `docs`, `test`, `perf`, `chore`, `ci`
- **Ejemplos**:
  - `feature/APP-01-implementar-busqueda-criptos`
  - `bugfix/APP-03-corregir-desconexion-websocket`
  - `refactor/APP-04-extraer-currency-formatter`
  - `test/APP-06-tests-market-service`
  - `perf/APP-07-optimizar-apexcharts`
- **Regla crítica**: Siempre incluir issue número (APP-XX)

### Issues (GitHub)
- Formato: `APP-XX: [Área] Descripción en español`
- **Estructura obligatoria**:
  ```markdown
  APP-01: [Dashboard] Implementar gráfico de precios en tiempo real
  
  ## Contexto
  Descripción del problema/necesidad
  
  ## Tareas
  - [ ] Tarea 1
  - [ ] Tarea 2
  - [ ] Tarea 3
  
  ## Criterios de aceptación
  - Criterio 1 (verificable)
  - Criterio 2 (verificable)
  ```
- **Labels**: `feature`, `bug`, `docs`, `perf`, `test`, `refactor`, `binance-integration`

### Variables y funciones
- camelCase siempre
- Nombres descriptivos (ej: `isPriceIncreasing` no `up`)
- Observables con sufijo `$` (ej: `prices$`)
- Señales sin sufijo (ej: `currentPrice`)
- Métodos en infinitivo (ej: `fetchMarketData()`, `handleWebSocketMessage()`)

---

## 8. Tech Stack exacto

| Herramienta | Versión | Propósito |
|------------|---------|----------|
| Angular | 20.0.0 | Framework (zoneless, signals) |
| TypeScript | ~5.9.2 | Tipado strict mode |
| RxJS | ~7.8.0 | Flujos reactivos |
| Tailwind CSS | 3.4.19 | Estilos (utility-first) |
| PostCSS | 8.5.6 | Processing CSS |
| Vitest | 4.0.8 | Test runner |
| jsdom | 27.1.0 | Test environment |
| ApexCharts | 5.3.6 | Gráficos |
| ng-apexcharts | 2.0.4 | Wrapper Angular |
| Lucide Angular | 0.562.0 | Iconos |
| Binance API | REST + WS | Datos crypto en tiempo real |

---

## 9. Seguridad, Validación y Sanitización

### Secrets y Credenciales
- **Jamás** en código: variables de entorno (`process.env.BINANCE_API_KEY`)
- Usar vaults/secrets managers en CI/CD (GitHub Secrets)
- No loguear keys/tokens/passwords
- `.env.local` en `.gitignore` (nunca commitear)

### Validación de datos
- Binance API: tipado estricto, validación de payloads
- Inputs de usuario: sanitizar, validar rangos (ej: amount >0)
- CORS: configurado correctamente, no `*`
- Dependencias: `npm audit` regular, actualizar patches críticos

### Logs
- Sin datos sensibles (keys, tokens, passwords, PII)
- Nivel apropiado: `debug` en desarrollo, `info`/`warn`/`error` en producción
- Eliminar console.log debug antes de commit

---

## 10. Checklist pre-commit para devs

Antes de hacer `git commit`:

```
□ Cambios lógicamente agrupados
□ Lint pasa: `npm run lint` (ESLint + Prettier)
□ Tests pasan: `npm run test`
□ TypeScript strict: sin `any`, sin errores de tipos
□ Sin console.log debug
□ Commits singulares por feature/fix
□ Mensaje sigue Convencional Commits (inglés)
□ Rama es tipo/APP-XX-descripción
□ Referencia issue en commit footer (Closes #APP-XX)
□ Sin secretos (keys, tokens, passwords)
```

---

## 11. Herramientas recomendadas

- **Commitizen**: CLI interactivo para Conventional Commits
- **Husky + lint-staged**: pre-commit hooks (lint, tests automáticos)
- **standard-version**: auto-generar CHANGELOG.md y versionado semántico
- **Chrome DevTools**: perfilar rendimiento, network, memory
- **Lighthouse**: auditar performance, accessibility, best practices

---

## 9. Instrucción obligatoria

ANTES DE RESPONDER O REALIZAR UNA ACCIÓN:

1. Leer este archivo completo (master-context.md).
2. Leer [rules.md](rules.md) como referencia rápida.
3. Leer el archivo del rol solicitado en `.vscode/ai/agents/`.
4. Aplicar todas las reglas de estos archivos.
5. Si hay conflicto, priorizar:
   - **Seguridad** > **Correctitud** > **Mantenibilidad** > **Rendimiento** > **Estilo**.

# CryptoTerminal - AI Instructions & Coding Standards

## 🚀 Project Context
- **Framework:** Angular 20 (Zoneless, Signal-based).
- **Architecture:** Domain-Driven Design (DDD) Lite.
- **Styling:** Tailwind CSS + SCSS (Hybrid approach).
- **State Management:** NgRx Signal Store & Local Signals.

## 🛠 Angular 20 Standards (Strict)
1. **Zoneless:** Do not suggest `zone.js` or `ChangeDetectorRef`. Use Signals only.
2. **Signals Everywhere:** - Use `input()`, `output()`, `model()` for component communication.
   - Use `computed()` for derived state.
   - Use `effect()` sparingly (prefer declarative flows).
3. **Standalone:** Every component/pipe/directive must be `standalone: true`.
4. **Control Flow:** Use `@if`, `@for`, `@switch`. Do not use `*ngIf` or `*ngFor`.
5. **Dependency Injection:** Use the `inject()` function. Avoid constructor injection.

## 🏗 Architecture & Clean Code
- **SOLID:** Strictly follow SOLID principles.
- **Clean Code:** Use descriptive variable names (e.g., `isPriceIncreasing` instead of `up`).
- **DRY:** Extract common UI logic into `shared/` components.
- **Components:** Keep components under 200 lines. Use sub-components if logic grows.

## 📝 Git & Workflow
- **Branch Names:** Must follow the pattern `feature/APP-XX-titulo-en-español` for feature branches (XX = issue number).
  - Format: `feature/APP-XX-titulo-corto-en-español`
  - Example: `feature/APP-01-diseño-aplicacion`
  - For bug fixes: `bugfix/APP-XX-descripcion`
  - For refactoring: `refactor/APP-XX-descripcion`
- **Commit Messages:** Must follow Conventional Commits (feat, fix, refactor, chore, docs) and MUST be in English.
  - Example: `feat(dashboard): implement real-time websocket connection using signals`
- **Issue Format:**
  - Title: `APP-XX: [Área] Descripción corta` (where XX is the issue number) - **IN SPANISH**
  - Description: Detailed explanation of what will be implemented in this issue, including Context, Tasks, and Acceptance Criteria - **IN SPANISH**
  - Example Title: `APP-01: [Dashboard] Implementar gráfico de precios en tiempo real con websocket`

## 🎨 UI & Styling (Tailwind)
- Use custom tokens defined in `tailwind.config.js`: `crypto-dark`, `crypto-neon`, etc.
- Prefer Tailwind utility classes. Use SCSS only for complex animations or neon glow effects.

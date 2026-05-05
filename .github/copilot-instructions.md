# Sistema de Contexto - CryptoTerminal 🎯

Este proyecto utiliza un **sistema organizado de contexto** para mantener coherencia y calidad en todo el desarrollo.

<!-- MIGRATION NOTE -->
> **Nota:** Este repositorio consolidó sus archivos de contexto bajo `.github/` (antes se usó `.vscode/ai/`). Usa `.github/CONTEXT_SYSTEM.md` como fuente única de verdad. Los agentes y skills están en `.github/agents/` y `.github/skills/` respectivamente.

## Índice rápido

- **Fuente de verdad:** [.github/CONTEXT_SYSTEM.md](.github/CONTEXT_SYSTEM.md)
- **Skills (teoría + ejemplos):** [.github/skills/README.md](.github/skills/README.md)
- **Agentes (roles):** [.github/agents/](.github/agents/)
- **Listado de agentes (resumen):** [.github/AGENTS.md](.github/AGENTS.md)


---

## 📚 Guía de lectura (Orden obligatorio)

### 1️⃣ **[.github/CONTEXT_SYSTEM.md](.github/CONTEXT_SYSTEM.md)** ← PRIMERO (Obligatorio)
   - Principios fundamentales del proyecto
   - Estándares de código (Angular 20 zoneless, signals)
   - Arquitectura (core/features/shared)
   - Accesibilidad, rendimiento, testing
   - Tech stack exacto
   - Seguridad y validación

### 2️⃣ **[.github/skills/README.md](.github/skills/README.md)** ← Referencia rápida
   - Angular 20 (zoneless, signals)
   - Arquitectura y organización
   - Estilos (Tailwind + SCSS)
   - Binance integration
   - Testing (Vitest + TestBed)
   - Performance guidelines
   - Commits y ramas
   - Nombres y convenciones

### 3️⃣ **[.github/skills/README.md](.github/skills/README.md)** ← Introducción
   - Cómo usar el sistema de contexto
   - Descripción de los 8 roles
   - Ejemplos de uso
   - Checklists para contribuidores

### 4️⃣ **Elige tu rol en [.github/agents/](.github/agents/)**
   - `architecture.md` - Arquitecto
   - `senior-frontend.md` - Senior Frontend
   - `ux-ui.md` - UX/UI + Accesibilidad
   - `performance.md` - Experto en Rendimiento
   - `test.md` - Testing
   - `docs.md` - Documentación
   - `devops.md` - DevOps / Infra
   - `git-workflow.md` - Git/Workflow

### 5️⃣ **Skills con ejemplos prácticos en [./.github/skills/](./.github/skills/)**

| Skill | Archivo de Referencia | Ejemplos Prácticos |
|-------|----------------------|-------------------|
| Accesibilidad WCAG 2.2 AA/AAA | `accessibility/SKILL.md` | `accessibility/EXAMPLES.md` |
| **Testing de Accesibilidad** | `accessibility-testing/SKILL.md` | `accessibility-testing/EXAMPLES.md` |
| Chrome DevTools MCP | `chrome-devtools/SKILL.md` | `chrome-devtools/EXAMPLES.md` |
| Refactoring Angular | `refactor/SKILL.md` | `refactor/EXAMPLES.md` |
| Senior Frontend Angular 20 | `senior-frontend/SKILL.md` | `senior-frontend/EXAMPLES.md` |

---

## 🚀 Flujo de trabajo: Cómo empezar

### ✅ Paso 1: Crear un TODO al inicio (CRÍTICO)

**SIEMPRE que empieces una tarea, crea un TODO** usando `manage_todo_list`:

```markdown
Tareas para [descripción]:
1. ✅ Leer master-context.md
2. ⏳ Leer rules.md
3. ⏳ Leer archivo del rol aplicable
4. ⏳ Leer SKILL.md + EXAMPLES.md relevantes
5. ⏳ Implementar [tarea específica]
6. ⏳ Validar con checklist
7. ⏳ Commit con mensaje convencional
```

**¿Por qué?** Mantiene el contexto visible y evita perder el hilo de lo que estás haciendo.

### ✅ Paso 2: Leer documentación (15-20 min)

1. Lee `master-context.md` **completamente**
2. Lee `rules.md` como referencia rápida
3. Lee el archivo de tu rol en `.vscode/ai/agents/`
4. Lee el `SKILL.md` relevante en `./.github/skills/`
5. Consulta `EXAMPLES.md` para ver patrones prácticos

### ✅ Paso 3: Implementar (Mantén TODO actualizado)

- Marca cada paso como `in-progress` cuando lo inicies
- Marca como `completed` cuando termines
- Usa `manage_todo_list` frecuentemente (NO es overhead, es claridad)

### ✅ Paso 4: Validar y Commit

Antes de hacer commit:
- [ ] Lint pasa: `npm run lint`
- [ ] Tests pasan: `npm run test`
- [ ] TypeScript strict: sin `any`, sin errores
- [ ] Commit sigue Convencional Commits
- [ ] Rama es `tipo/APP-XX-descripción`
- [ ] Sin console.log debug
- [ ] Referencia issue: `Closes #APP-XX`

---

## 📊 Estructura del proyecto

```
.github/                       ← Sistema de contexto y skills
├── CONTEXT_SYSTEM.md          ← ⭐ LEE PRIMERO (versión consolidada de master-context)
├── agents/                    ← Agentes por rol (senior-frontend, accessibility, etc.)
└── skills/                    ← SKILL.md + EXAMPLES.md por dominio

.github/skills/                ← Skills con ejemplos (NUEVO)
├── accessibility/
│   ├── SKILL.md              ← Teoría: WCAG 2.2 AA/AAA
│   └── EXAMPLES.md           ← Código: 9 ejemplos prácticos
├── accessibility-testing/
│   ├── SKILL.md              ← Teoría: Testing de accesibilidad
│   └── EXAMPLES.md           ← Código: 12 ejemplos prácticos
├── chrome-devtools/
│   ├── SKILL.md              ← Teoría: Chrome DevTools MCP
│   └── EXAMPLES.md           ← Código: 10 ejemplos prácticos
├── refactor/
│   ├── SKILL.md              ← Teoría: Refactoring patterns
│   └── EXAMPLES.md           ← Código: 10 ejemplos prácticos
└── senior-frontend/
   ├── SKILL.md              ← Teoría: Angular 20 patterns
   └── EXAMPLES.md           ← Código: 11 ejemplos prácticos
```

---

## 🎯 Ejemplos de uso por rol
# Sistema de Contexto - CryptoTerminal (resumen)

Este archivo es un resumen práctico. La fuente de verdad y la documentación completa está en [.github/CONTEXT_SYSTEM.md](.github/CONTEXT_SYSTEM.md).

<!-- MIGRATION NOTE -->
> **Nota:** la estructura de contexto se consolidó bajo `.github/` (antes se usó `.vscode/ai/`). Usa `.github/CONTEXT_SYSTEM.md` como referencia principal.

Índice rápido:

- Fuente de verdad: [.github/CONTEXT_SYSTEM.md](.github/CONTEXT_SYSTEM.md)
- Agentes (roles): [.github/agents/](.github/agents/)
- Resumen de agentes: [.github/AGENTS.md](.github/AGENTS.md)
- Skills (teoría + ejemplos): [.github/skills/README.md](.github/skills/README.md)

Flujo mínimo para empezar:

1. Crea un TODO para la tarea con `manage_todo_list`.
2. Lee `.github/CONTEXT_SYSTEM.md` (fuente de verdad).
3. Identifica el agente/rol adecuado en `.github/agents/`.
4. Usa el `SKILL.md` y `EXAMPLES.md` relevantes en `.github/skills/`.
5. Implementa cambios pequeños y validables; ejecuta `npm run lint` y `npm run test` en la zona tocada.

Comandos rápidos:

```bash
npm start
npm run lint
npm run test
```

Si necesitas la versión extendida de esta guía (checklists, ejemplos y flujos por rol), consulta [.github/CONTEXT_SYSTEM.md](.github/CONTEXT_SYSTEM.md).

Última actualización: 24 de marzo de 2026


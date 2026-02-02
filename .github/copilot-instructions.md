# Sistema de Contexto - CryptoTerminal 🎯

Este proyecto utiliza un **sistema organizado de contexto** para mantener coherencia y calidad en todo el desarrollo.

---

## 📚 Guía de lectura (Orden obligatorio)

### 1️⃣ **[../.vscode/ai/master-context.md](../.vscode/ai/master-context.md)** ← PRIMERO (Obligatorio)
   - Principios fundamentales del proyecto
   - Estándares de código (Angular 20 zoneless, signals)
   - Arquitectura (core/features/shared)
   - Accesibilidad, rendimiento, testing
   - Tech stack exacto
   - Seguridad y validación

### 2️⃣ **[../.vscode/ai/rules.md](../.vscode/ai/rules.md)** ← Referencia rápida
   - Angular 20 (zoneless, signals)
   - Arquitectura y organización
   - Estilos (Tailwind + SCSS)
   - Binance integration
   - Testing (Vitest + TestBed)
   - Performance guidelines
   - Commits y ramas
   - Nombres y convenciones

### 3️⃣ **[../.vscode/ai/README.md](../.vscode/ai/README.md)** ← Introducción
   - Cómo usar el sistema de contexto
   - Descripción de los 8 roles
   - Ejemplos de uso
   - Checklists para contribuidores

### 4️⃣ **Elige tu rol en [../.vscode/ai/agents/](../.vscode/ai/agents/)**
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
.vscode/ai/                    ← Configuración Copilot + AI Agents
├── master-context.md          ← ⭐ LEE PRIMERO
├── rules.md                   ← Referencia rápida
├── README.md                  ← Guía de uso
└── agents/
    ├── architecture.md
    ├── senior-frontend.md
    ├── ux-ui.md
    ├── performance.md
    ├── test.md
    ├── docs.md
    ├── devops.md
    └── git-workflow.md

.github/skills/                ← Skills con ejemplos (NUEVO)
├── accessibility/
│   ├── SKILL.md              ← Teoría: WCAG 2.2 AA/AAA
│   └── EXAMPLES.md           ← Código: 9 ejemplos prácticos
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

### 👨‍💻 Senior Frontend: Implementar componente

```markdown
**TODO:** Implementar HeaderSearchComponent

1. ✅ Leer master-context.md
2. ⏳ Leer senior-frontend/SKILL.md + EXAMPLES.md
3. ⏳ Diseñar componente standalone con signals
4. ⏳ Implementar RxJS debounce (300ms)
5. ⏳ Agregar tests Vitest (>80% coverage)
6. ⏳ Validar accesibilidad (WCAG 2.2 AA)
7. ⏳ Commit: feat(header-search): add real-time crypto search
```

### 🎨 UX/UI + Accesibilidad: Auditar componente

```markdown
**TODO:** Auditar accesibilidad de PriceCard

1. ✅ Leer accessibility/SKILL.md + EXAMPLES.md
2. ⏳ Verificar contraste (4.5:1 mínimo)
3. ⏳ Revisar keyboard navigation
4. ⏳ Probar con NVDA/VoiceOver
5. ⏳ Revisar ARIA attributes
6. ⏳ Corregir violaciones
7. ⏳ Commit: fix(price-card): improve accessibility (AA → AAA)
```

### 🚀 Performance: Optimizar dashboard

```markdown
**TODO:** Optimizar renderizado de market list

1. ✅ Leer performance/SKILL.md
2. ⏳ Agregar track en @for loops
3. ⏳ Implementar computed signals
4. ⏳ Throttle WebSocket updates (200ms)
5. ⏳ Perfil con Chrome DevTools
6. ⏳ Validar Core Web Vitals
7. ⏳ Commit: perf: optimize market list rendering (-85% re-renders)
```

---

## 🔍 Cómo encontrar información rápido

| Necesito... | Dónde encontrar |
|------------|-----------------|
| Estructura de componente | `senior-frontend/SKILL.md` + `EXAMPLES.md` #1 |
| Patrones RxJS | `senior-frontend/SKILL.md` + `EXAMPLES.md` #2 |
| Cómo refactorizar | `refactor/SKILL.md` + `EXAMPLES.md` |
| Accesibilidad WCAG | `accessibility/SKILL.md` + `EXAMPLES.md` |
| Chrome DevTools | `chrome-devtools/SKILL.md` + `EXAMPLES.md` |
| Convenciones de commits | `rules.md` + `git-workflow.md` |
| Estilos Tailwind | `rules.md` + `senior-frontend/SKILL.md` |
| Testing Vitest | `test.md` + `senior-frontend/EXAMPLES.md` #7 |

---

## 📋 Checklist: Antes de cualquier tarea

```markdown
□ ¿Creé un TODO con los pasos?
□ ¿Leí master-context.md completamente?
□ ¿Leí rules.md?
□ ¿Leí el archivo de mi rol en agents/?
□ ¿Leí el SKILL.md + EXAMPLES.md relevantes?
□ ¿Entiendo los estándares de código?
□ ¿Sé qué patrón usar?
□ ¿Actualizo el TODO a medida que avanzo?
```

---

## ⚡ Comandos rápidos

```bash
# Desarrollo
npm start              # Dev server (zoneless)
npm run build          # Production build
npm run lint           # ESLint + Prettier check
npm run test           # Tests con Vitest
npm run test:watch    # Watch mode

# Validación pre-commit
npm run lint:fix      # Auto-fix issues
npm run type-check    # TypeScript compile check
```

---

## 🎓 Principios clave (NUNCA olvides)

1. **Master-context.md es la fuente de verdad**
   - Siempre prioritario si hay conflicto
   - Actualizado = todos los estándares

2. **Rules.md es referencia rápida**
   - Angular 20 (zoneless, signals)
   - Patrones y mejores prácticas
   - Convenciones de nombres

3. **TODO es tu mejor amigo**
   - Mantén TODO visible mientras trabajas
   - Actualiza estado frecuentemente
   - Nunca pierdes contexto

4. **Skills tienen teoría + práctica**
   - SKILL.md = principios y guías
   - EXAMPLES.md = código copypaste listo
   - Ejemplos están organizados por caso de uso

5. **Prioridades**
   - Seguridad > Correctitud > Mantenibilidad > Rendimiento > Estilo
   - Accesibilidad desde el inicio (no retrofit)
   - Tests desde el principio (no al final)

---

**✅ Listo para contribuir. Recuerda: Lee el contexto, crea un TODO, actualiza frecuentemente, code con confianza.** 🚀

---

*Última actualización: 2 de febrero de 2026*
*Estructura: master-context + rules + agents + skills con ejemplos*

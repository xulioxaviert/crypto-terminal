# Sistema de Contexto — CryptoTerminal

Bienvenido. Este directorio contiene toda la **guía, estándares y reglas** del proyecto CryptoTerminal.

---

## 🚀 Cómo usar

### 1. Lee primero: master-context.md
**Obligatorio**: Lee [master-context.md](master-context.md) ANTES de hacer cualquier cambio.
- Principios fundamentales
- Estándares de código (Angular 20 zoneless)
- Arquitectura (core/features/shared)
- Accesibilidad, rendimiento, testing
- Tech stack exacto

### 2. Lee las reglas: rules.md
[rules.md](rules.md) es una **referencia rápida** con ejemplos prácticos:
- Angular 20 (zoneless, signals)
- Estilos (Tailwind tokens)
- Binance integration
- Testing (Vitest + TestBed)
- Performance guidelines
- Commits y ramas
- Nombres y convenciones

### 3. Invoca un rol según tu necesidad

Cada rol tiene un archivo en `/agents/`:

| Rol | Descripción | Úsalo para |
|-----|-------------|-----------|
| **Arquitecto** | Diseño, escalabilidad, flujos de datos | Decisiones arquitectónicas, ADRs, patrones |
| **Senior Frontend** | Implementación Angular, componentes | Código frontend, refactoring, best practices |
| **UX/UI + Accesibilidad** | Diseño, WCAG 2.2 AA | Interfaces, accesibilidad, tokens Tailwind |
| **Experto en Rendimiento** | Optimización, métricas | Performance, bundling, monitoreo |
| **Testing** | Tests, cobertura | Unit, integration, E2E |
| **Documentación** | Docs, README, guías | Documentación, ADRs, onboarding |
| **DevOps / Infra** | Build, deploy, CI/CD | Pipelines, Docker, infraestructura |
| **Git/Workflow** | Commits, ramas, issues | Validar commits, estructura issues, flujo git |

---

## 📋 Estructura de archivos

```
.vscode/ai/
├── README.md                    ← Estás aquí
├── master-context.md            ← Obligatorio leer PRIMERO
├── rules.md                     ← Referencia rápida con ejemplos
├── agents/
│   ├── architecture.md          ← Rol: Arquitecto
│   ├── senior-frontend.md       ← Rol: Senior Frontend
│   ├── ux-ui.md                 ← Rol: UX/UI + Accesibilidad
│   ├── performance.md           ← Rol: Experto en Rendimiento
│   ├── test.md                  ← Rol: Testing
│   ├── docs.md                  ← Rol: Documentación
│   ├── devops.md                ← Rol: DevOps / Infra
│   └── git-workflow.md          ← Rol: Git/Workflow

.github/skills/                  ← Skills con teoría + ejemplos prácticos
├── accessibility/
│   ├── SKILL.md                 ← Teoría: WCAG 2.2 AA/AAA
│   └── EXAMPLES.md              ← Código: 9 ejemplos prácticos
├── chrome-devtools/
│   ├── SKILL.md                 ← Teoría: Browser automation
│   └── EXAMPLES.md              ← Código: 10 ejemplos prácticos
├── refactor/
│   ├── SKILL.md                 ← Teoría: Refactoring patterns
│   └── EXAMPLES.md              ← Código: 10 ejemplos prácticos
└── senior-frontend/
    ├── SKILL.md                 ← Teoría: Angular 20 patterns
    └── EXAMPLES.md              ← Código: 11 ejemplos prácticos
```

---

## 💡 Ejemplos de uso

### ⚠️ CRÍTICO: Crear TODO al inicio (Never lose context!)

**SIEMPRE que empieces una tarea, crea un TODO** usando `manage_todo_list`:

```markdown
Tareas para [descripción de la tarea]:
1. ✅ Leer master-context.md
2. ⏳ Leer rules.md
3. ⏳ Leer archivo del rol aplicable
4. ⏳ Leer SKILL.md + EXAMPLES.md relevantes
5. ⏳ Implementar [tarea específica]
6. ⏳ Validar con checklist
7. ⏳ Commit con mensaje convencional
```

**¿Por qué?** Mantiene el contexto visible y evita perder el hilo. Actualiza frecuentemente:
- Marca como `in-progress` cuando inicies cada paso
- Marca como `completed` cuando termines cada paso

### Ejemplo 1: Senior Frontend - Implementar componente
```
TODO: Implementar HeaderSearchComponent

1. ✅ Leer master-context.md
2. ⏳ Leer senior-frontend/SKILL.md + EXAMPLES.md (#2 RxJS patterns)
3. ⏳ Diseñar componente standalone con signals
4. ⏳ Implementar RxJS debounce (300ms)
5. ⏳ Agregar tests Vitest (>80% coverage)
6. ⏳ Leer accessibility/EXAMPLES.md para validar WCAG AA
7. ⏳ Commit: feat(header-search): add real-time crypto search

Patrón usado: EXAMPLES.md #2 (Service with RxJS)
```

### Ejemplo 2: UX/UI + Accesibilidad - Auditar componente
```
TODO: Auditar accesibilidad de PriceCard

1. ✅ Leer master-context.md (Accessibility section)
2. ⏳ Leer accessibility/SKILL.md + EXAMPLES.md
3. ⏳ Usar accessibility/EXAMPLES.md #6 (Price Card with live region)
4. ⏳ Verificar contraste con Contrast Checker
5. ⏳ Revisar keyboard navigation (Tab, Escape, Arrows)
6. ⏳ Probar con NVDA o VoiceOver
7. ⏳ Commit: fix(price-card): improve accessibility (AA → AAA)

Patrón usado: EXAMPLES.md #6 (Accessible real-time updates)
```

### Ejemplo 3: Performance - Optimizar dashboard
```
TODO: Optimizar renderizado de market list

1. ✅ Leer performance/SKILL.md
2. ⏳ Leer refactor/SKILL.md + EXAMPLES.md
3. ⏳ Leer senior-frontend/EXAMPLES.md (#6 Performance optimization)
4. ⏳ Agregar track en @for loops (senior-frontend/EXAMPLES.md #3)
5. ⏳ Implementar computed signals para derived state
6. ⏳ Usar chrome-devtools/EXAMPLES.md #5 (Performance profiling)
7. ⏳ Commit: perf: optimize market list rendering (-85% re-renders)

Antes: 120ms re-render
Después: 18ms re-render (7x faster)
Patrón usado: senior-frontend/EXAMPLES.md #6
```

---

## 📌 Checklist para contribuidores

Antes de hacer **cualquier** cambio:

- [ ] ¿Creé un TODO con los pasos? (CRÍTICO)
- [ ] Leí **master-context.md**
- [ ] Leí **rules.md**
- [ ] Identifiqué el rol que aplica para mi tarea
- [ ] Leí el archivo del rol en `/agents/`
- [ ] Leí el `SKILL.md` + `EXAMPLES.md` relevantes en `.github/skills/`
- [ ] ¿Aplico todas las reglas? (seguridad > correctitud > mantenibilidad)

Antes de hacer **commit**:

- [ ] ¿Actualicé el TODO a COMPLETED?
- [ ] Lint pasa: `npm run lint`
- [ ] Tests pasan: `npm run test`
- [ ] TypeScript strict: sin `any`, sin errores
- [ ] Sin console.log debug
- [ ] Commit sigue Convencional Commits
- [ ] Rama es `tipo/APP-XX-descripción`
- [ ] Referencia issue en commit (Closes #APP-XX)

---

## � Cómo encontrar información rápido

| Necesito... | Dónde encontrar |
|------------|-----------------|
| Crear TODO para no perder contexto | `README.md` - Sección "Crear TODO al inicio" |
| Componente Angular 20 con signals | `senior-frontend/SKILL.md` + `EXAMPLES.md` #1 |
| Patrones RxJS para Binance | `senior-frontend/SKILL.md` + `EXAMPLES.md` #2, #4 |
| Refactorizar código | `refactor/SKILL.md` + `EXAMPLES.md` (10 ejemplos) |
| Accesibilidad WCAG 2.2 AA/AAA | `accessibility/SKILL.md` + `EXAMPLES.md` (9 ejemplos) |
| Chrome DevTools para debugging | `chrome-devtools/SKILL.md` + `EXAMPLES.md` #5, #7 |
| Convenciones de commits | `rules.md` + `git-workflow.md` |
| Estilos Tailwind tokens | `rules.md` + `senior-frontend/EXAMPLES.md` |
| Testing con Vitest | `test.md` + `senior-frontend/EXAMPLES.md` #7 |

---

## 🎓 Principios clave (NUNCA olvides)

1. **Master-context.md es la fuente de verdad**
   - Siempre prioritario si hay conflicto
   - Actualizado = todos los estándares

2. **Rules.md es referencia rápida**
   - Angular 20 (zoneless, signals)
   - Patrones y mejores prácticas
   - Convenciones de nombres

3. **TODO es tu mejor amigo** ⭐ CRÍTICO
   - Crea TODO al inicio de CUALQUIER tarea
   - Mantén TODO visible mientras trabajas
   - Actualiza estado frecuentemente
   - Nunca pierdes contexto del trabajo actual

4. **Skills tienen teoría + ejemplos prácticos**
   - `SKILL.md` = principios, guías, referencias
   - `EXAMPLES.md` = código copypaste listo, patrones
   - Ejemplos están organizados por caso de uso

5. **Prioridades de código**
   - Seguridad > Correctitud > Mantenibilidad > Rendimiento > Estilo
   - Accesibilidad desde el inicio (no retrofit)
   - Tests desde el principio (no al final)

---

## 🚀 Primeros pasos

1. Crea un TODO con los pasos que vas a seguir
2. Lee [master-context.md](master-context.md) **completamente**
3. Guarda [rules.md](rules.md) en favoritos
4. Identifica tu rol principal en el proyecto
5. Lee el archivo de tu rol en `/agents/`
6. Busca el `SKILL.md` + `EXAMPLES.md` en `.github/skills/`
7. Abre tu primer PR siguiendo todas las reglas
8. Marca el TODO como COMPLETED cuando termines

---

## 🔄 Mantener actualizado

**Cuando cambien las reglas o estándares**:
1. Actualiza el archivo correspondiente (master-context.md, rules.md o rol)
2. Commit: `docs: update [archivo] guidelines`
3. Avisa al equipo en Slack/Teams o PR description
4. Si es major breaking change, crea ADR en `/docs`

---

## ❓ Preguntas frecuentes

**¿Qué pasa si hay conflicto entre rules.md y master-context.md?**
→ master-context.md es la fuente de verdad. rules.md es un resumen.

**¿Y si el rol sugiere algo que contradice las reglas?**
→ Las reglas ganan. El rol debería estar alineado.

**¿Necesito leer todos los archivos siempre?**
→ **SÍ**: master-context.md (obligatorio) + rules.md (referencia) + tu rol.

**¿Necesito crear TODO para TODAS las tareas?**
→ **SÍ, especialmente para tareas complejas**. El TODO:
- Mantiene contexto visible
- Evita perder el hilo
- Facilita cambio de contexto
- Mejora productividad

**¿Qué pasa si no sigo las reglas?**
→ Los PRs serán rechazados. Lint y tests fallarán. Mejor seguirlas 😉

---

**Bienvenido a CryptoTerminal. Código limpio, estándares claros, contexto visible.** 🎉✨

*Recuerda: TODO → contexto visible → nunca pierdes el hilo → mejor código.*

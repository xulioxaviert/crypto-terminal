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
```

---

## 💡 Ejemplos de uso

### Ejemplo 1: Implementar un componente
```
Como **Senior Frontend**, implementa HeaderSearchComponent:
- Búsqueda en tiempo real de criptos
- Debounce 300ms
- Accesibilidad WCAG AA
- Tests unitarios
```

### Ejemplo 2: Revisar commits
```
Como **Git/Workflow**, valida estos commits:
- "fixed dashboard"
- "refactor: extract market service"

¿Cumplen con Conventional Commits?
```

### Ejemplo 3: Optimizar performance
```
Como **Experto en rendimiento**, optimiza:
- ApexCharts carga 10K velas (muy lento)
- WebSocket sin throttling (100+ eventos/seg)
- Header-search sin debounce

Incluye métricas antes/después.
```

---

## 📌 Checklist para contribuidores

Antes de hacer **cualquier** cambio:

- [ ] Leí **master-context.md**
- [ ] Leí **rules.md**
- [ ] Identifiqué el rol que aplica para mi tarea
- [ ] Leí el archivo del rol en `/agents/`
- [ ] Aplico todas las reglas (seguridad > correctitud > mantenibilidad)

Antes de hacer **commit**:

- [ ] Lint pasa: `npm run lint`
- [ ] Tests pasan: `npm run test`
- [ ] TypeScript strict: sin `any`, sin errores
- [ ] Sin console.log debug
- [ ] Commit sigue Convencional Commits
- [ ] Rama es `tipo/APP-XX-descripción`
- [ ] Referencia issue en commit (Closes #APP-XX)

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

**¿Qué pasa si no sigo las reglas?**
→ Los PRs serán rechazados. Lint y tests fallarán. Mejor seguirlas 😉

---

## 🚀 Primeros pasos

1. Lee [master-context.md](master-context.md) **ahora mismo**
2. Guarda [rules.md](rules.md) en favoritos
3. Identifica tu rol principal en el proyecto
4. Lee el archivo de tu rol en `/agents/`
5. Abre tu primer PR siguiendo todas las reglas

---

**Bienvenido a CryptoTerminal. Código limpio, estándares claros, colaboración efectiva.** 🎉

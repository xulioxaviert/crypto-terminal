# 🎯 Sistema de Contexto Completo - CryptoTerminal

## Resumen Ejecutivo

Este proyecto cuenta con un **sistema de contexto completo y estructurado** para mantener coherencia, calidad y enfoque en todo el desarrollo. Consta de:

1. **Documentación base** (.github/)
2. **Roles especializados** (.github/agents/)
3. **Skills con teoría + ejemplos** (.github/skills/)
4. **Sistema de TODO para mantener contexto**

---

## 📚 Jerarquía de documentación

```
┌─────────────────────────────────────────────────────┐
│ .github/CONTEXT_SYSTEM.md (FUENTE DE VERDAD)       │
│ - Principios fundamentales                          │
│ - Estándares obligatorios                           │
│ - Tech stack exacto                                 │
│ - Seguridad, accesibilidad, testing                │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ rules.md (REFERENCIA RÁPIDA)                        │
│ - Resumen ejecutivo de master-context.md            │
│ - Ejemplos prácticos rápidos                        │
│ - Convenciones de nombres                          │
└─────────────────────────────────────────────────────┘
         ↙                    ↓                    ↘
    ┌────────┐          ┌──────────┐         ┌───────────┐
    │ agents │          │ skills   │         │ roles     │
    └────────┘          └──────────┘         └───────────┘
    8 roles             4 skills            (específicos
    especializados      teóricos             por rol)
```

---

## 📂 Estructura de archivos

### Base (`.github/`)
```
.github/CONTEXT_SYSTEM.md   ← LEER PRIMERO (obligatorio)
.github/AGENTS.md          ← Resumen de agentes
.github/skills/README.md   ← Referencia rápida + índice de skills
agents/
   ├── architecture.md      ← Arquitecto
   ├── senior-frontend.md   ← Senior Frontend
   ├── ux-ui.md             ← UX/UI + Accesibilidad
   ├── performance.md       ← Experto en Rendimiento
   ├── test.md              ← Testing
   ├── docs.md              ← Documentación
   ├── devops.md            ← DevOps / Infra
   └── git-workflow.md      ← Git/Workflow
```

### Skills (`.github/skills/`)
```
accessibility/
  ├── SKILL.md            ← Teoría WCAG 2.2 AA/AAA (1410 líneas)
  └── EXAMPLES.md         ← 9 ejemplos prácticos (código copypaste)

chrome-devtools/
  ├── SKILL.md            ← Teoría Chrome DevTools MCP
  └── EXAMPLES.md         ← 10 ejemplos prácticos

refactor/
  ├── SKILL.md            ← Teoría refactoring patterns
  └── EXAMPLES.md         ← 10 ejemplos prácticos

senior-frontend/
  ├── SKILL.md            ← Teoría Angular 20 zoneless/signals
  └── EXAMPLES.md         ← 11 ejemplos prácticos (1500+ líneas)
```

---

## 🎯 Flujo de trabajo (resumen)

El flujo de trabajo completo y detallado se mantiene como referencia en [.github/copilot-instructions.md](.github/copilot-instructions.md). Usa ese archivo para pasos rápidos y `.github/CONTEXT_SYSTEM.md` como la fuente de verdad para políticas y estándares.

---

## 🎓 Los 4 Skills disponibles

### 1. Accesibilidad (WCAG 2.2 AA/AAA)
**Para:** Implementar UI accesibles, auditar componentes, ARIA patterns
**Contenido:**
- WCAG 2.2 principios (POUR)
- Patrones ARIA (tabs, combobox, modals, dialogs)
- Formularios accesibles
- Color contrast validation
- Testing con axe-core
- 9 ejemplos de código

### 2. Chrome DevTools MCP
**Para:** Debugging, performance profiling, browser automation
**Contenido:**
- Element identification
- Network analysis
- Performance profiling
- Form automation
- Multi-page testing
- Viewport emulation
- 10 ejemplos de código

### 3. Refactoring Angular
**Para:** Mejorar código existente, aplicar patrones de diseño
**Contenido:**
- Refactoring principles
- Code smells
- Design patterns (Strategy, Null Object, etc)
- Angular 20 specific refactorings
- 10 ejemplos before/after

### 4. Senior Frontend (Angular 20)
**Para:** Implementar componentes, servicios, features
**Contenido:**
- Zoneless signals pattern
- RxJS + WebSocket integration
- Styling (Tailwind + SCSS)
- Accessibility integration
- Performance optimization
- Testing patterns (Vitest)
- 11 ejemplos de código

---

## 📋 TODO (resumen)

El sistema de TODO y las pautas de uso se documentan en [.github/copilot-instructions.md](.github/copilot-instructions.md). Consulta ese archivo para plantillas, ejemplos y la checklist rápida.
---

## 🔄 Flujo de búsqueda de información

```
Pregunta: "¿Cómo crear un componente accesible?"

BÚSQUEDA:
  1. ¿Es de arquitectura/diseño?
     → No
  2. ¿Es de frontend Angular?
     → Sí, pero específicamente accesibilidad
  3. Buscar en `.github/skills/accessibility/`
     → Sí, tenemos SKILL.md + EXAMPLES.md
  4. Leer `accessibility/SKILL.md`
     → Entiendo principios WCAG 2.2
  5. Leer `accessibility/EXAMPLES.md`
     → Veo ejemplo #6 (Accessible Price Card with live region)
  6. Copiar patrón y adaptar
  
RESULTADO: ✅ Componente accesible implementado
```

---

## ✅ Checklist pre-tarea (resumen)

Usa la checklist rápida en [.github/copilot-instructions.md](.github/copilot-instructions.md) antes de comenzar cualquier tarea.
---

## 🎯 Casos de uso por rol

| Rol | Tarea típica | Archivos | Tiempo |
|-----|-----------|----------|--------|
| **Senior Frontend** | Implementar PriceCard | senior-frontend/SKILL.md + EXAMPLES.md #1,#5 | 1-2h |
| **UX/UI + Accesibilidad** | Auditar accesibilidad | accessibility/SKILL.md + EXAMPLES.md #1-9 | 1-3h |
| **Performance** | Optimizar market list | performance/SKILL.md + senior-frontend/EXAMPLES.md #6 | 2-4h |
| **Testing** | Escribir tests | test.md + senior-frontend/EXAMPLES.md #7,#8 | 1-2h |
| **Refactoring** | Limpiar código | refactor/SKILL.md + EXAMPLES.md | 1-3h |

---

## 🚀 Inicio rápido en 5 pasos

```bash
1. Crea un TODO para tu tarea
   → manage_todo_list

2. Lee master-context.md
   → 20-30 minutos

3. Identifica tu rol
   → ¿Senior Frontend? ¿UX/UI? ¿Performance?

4. Lee SKILL.md + EXAMPLES.md
   → Teoría + código listo para copiar

5. Implementa usando patrones
   → Mantén TODO actualizado
```

---

## 📊 Estadísticas del sistema

| Elemento | Cantidad | Líneas | Ejemplos |
|----------|----------|--------|----------|
| master-context.md | 1 | ~800 | - |
| rules.md | 1 | ~400 | - |
| agents (roles) | 8 | ~5000 | - |
| skills | 4 | ~3000 | - |
| EXAMPLES.md files | 4 | ~3500 | 40+ |
| Total archivos | 17 | ~12,700 | 40+ |

---

## 🎓 Prioridades del proyecto

```
Seguridad > Correctitud > Mantenibilidad > Rendimiento > Estilo

Aplicado a:
- Validación de datos (seguridad)
- TypeScript strict (correctitud)
- Code organization (mantenibilidad)
- Signals + track (rendimiento)
- Tailwind classes (estilo)
```

---

## 🔗 Referencias cruzadas

- **master-context.md** ← Leer primero, siempre
- **rules.md** ← Referencia rápida
- **README.md** ← Guía de uso
- **agents/[rol]** ← Tu rol específico
- **.github/skills/[skill]/SKILL.md** ← Teoría
- **.github/skills/[skill]/EXAMPLES.md** ← Código

---

## ✨ Resumen final

Este sistema está diseñado para:

1. **Nunca perder contexto** → TODO visible siempre
2. **Aprender rápido** → SKILL.md + EXAMPLES.md
3. **Implementar correctamente** → Patrones probados
4. **Mantener calidad** → Estándares claros
5. **Colaborar efectivamente** → Roles y responsabilidades definidas

**Si no sabes qué hacer:**
1. Crea un TODO
2. Lee master-context.md
3. Busca en skills/
4. Mira los ejemplos
5. Copia el patrón

**¡Listo para contribuir!** 🚀

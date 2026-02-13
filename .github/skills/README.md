# Skills - CryptoTerminal

Directorio de skills especializados con teoría (SKILL.md) y ejemplos prácticos (EXAMPLES.md).

---

## 📚 Skills disponibles

### 1. **Accessibility** - WCAG 2.2 AA/AAA Compliance
**Ubicación**: `accessibility/`
- **SKILL.md**: Guía completa para implementar interfaces accesibles (semantic HTML, ARIA, keyboard navigation, screen readers)
- **EXAMPLES.md**: 9 ejemplos prácticos de componentes accesibles

**Úsalo cuando**: Implementes nuevos componentes, necesites patrones ARIA, diseñes para keyboard navigation o screen readers.

---

### 2. **Accessibility Testing** - Testing & Audit
**Ubicación**: `accessibility-testing/`
- **SKILL.md**: Estrategia completa de testing de accesibilidad (axe-core, Vitest, MCP, NVDA, VoiceOver)
- **EXAMPLES.md**: 12 ejemplos prácticos de tests automatizados y manuales

**Úsalo cuando**: Audites accesibilidad, escribas tests automatizados (Vitest + axe), valides con screen readers, o prepares certificación WCAG.

**Herramientas que activa**:
- ✅ Chrome DevTools MCP (browser automation)
- ✅ axe-core (automated testing)
- ✅ Accessibility skill (implementation patterns)
- ✅ Manual testing workflows (NVDA, VoiceOver, keyboard)

---

### 3. **Chrome DevTools** - Browser Automation & Performance
**Ubicación**: `chrome-devtools/`
- **SKILL.md**: Control completo del navegador vía MCP (navigation, screenshots, console, network, performance profiling)
- **EXAMPLES.md**: 10 ejemplos de browser automation y debugging

**Úsalo cuando**: Necesites automatizar el navegador, analizar rendimiento, capturar screenshots, o debuggear network requests.

---

### 4. **Refactoring** - Clean Code & Maintainability
**Ubicación**: `refactor/`
- **SKILL.md**: Patrones de refactoring quirúrgico (extract functions, rename variables, improve types, design patterns)
- **EXAMPLES.md**: 10 ejemplos de refactoring paso a paso

**Úsalo cuando**: Mejores código existente sin cambiar comportamiento, elimines code smells, o apliques design patterns.

---

### 5. **Senior Frontend** - Angular 20 Patterns
**Ubicación**: `senior-frontend/`
- **SKILL.md**: Guía completa de Angular 20 (zoneless, signals, RxJS, Binance integration, DDD architecture)
- **EXAMPLES.md**: 11 ejemplos de componentes, servicios, y patrones avanzados

**Úsalo cuando**: Implementes o refactorices componentes Angular 20, integres APIs (Binance), o necesites patrones zoneless/signals.

---

## 🎯 Flujo de trabajo recomendado

### Para implementar un componente accesible:
1. Lee `senior-frontend/SKILL.md` + `EXAMPLES.md` (#1 Component Structure)
2. Lee `accessibility/SKILL.md` + `EXAMPLES.md` (patrones ARIA)
3. Implementa el componente
4. Lee `accessibility-testing/SKILL.md` + `EXAMPLES.md`
5. Escribe tests automatizados (axe-core)
6. Valida con keyboard navigation y screen readers

### Para auditar accesibilidad existente:
1. Lee `accessibility-testing/SKILL.md` (estrategia completa)
2. Activa MCP tools: `activate_browser_navigation_tools()`, `activate_web_page_capture_tools()`
3. Ejecuta tests automatizados (ver `EXAMPLES.md` #2)
4. Usa Chrome DevTools para análisis de contraste (ver `EXAMPLES.md` #4, #8)
5. Valida con keyboard navigation (ver `EXAMPLES.md` #3)
6. Prueba con NVDA/VoiceOver (ver `EXAMPLES.md` #5-7)
7. Documenta violaciones y correcciones

### Para refactorizar código legacy:
1. Lee `refactor/SKILL.md` (principios)
2. Identifica code smells
3. Aplica patrones de `EXAMPLES.md`
4. Lee `senior-frontend/SKILL.md` para modernizar a Angular 20
5. Escribe tests antes y después (ver `senior-frontend/EXAMPLES.md` #7)

---

## 🔧 Herramientas & Integraciones

### Accessibility Testing Tools

#### MCP Tools (Chrome DevTools)
```typescript
// Activar antes de cualquier test de accesibilidad
await activate_browser_navigation_tools();
await activate_web_page_capture_tools();

// Snapshot de accessibility tree
await mcp_microsoft_pla_browser_snapshot({ filename: 'a11y-audit.md' });

// Console errors
await mcp_microsoft_pla_browser_console_messages({ level: 'error' });

// Evaluate JS para análisis de contraste
await mcp_microsoft_pla_browser_evaluate({ function: '() => { /* code */ }' });
```

#### Automated Testing (Vitest + axe-core)
```typescript
import { axe, toHaveNoViolations } from 'vitest-axe';

expect.extend(toHaveNoViolations);

it('should have no axe violations (WCAG 2.2 AA)', async () => {
  const { container } = await render(MyComponent);
  const results = await axe(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag22aa'] },
  });
  expect(results).toHaveNoViolations();
});
```

#### Manual Testing
- **NVDA** (Windows): [Download](https://www.nvaccess.org/)
- **VoiceOver** (macOS): Cmd+F5
- **Browser Extensions**: axe DevTools, WAVE, Accessibility Insights

---

## 📖 Convenciones

### Estructura de cada skill
```
skill-name/
├── SKILL.md       ← Teoría, principios, referencias, guías
└── EXAMPLES.md    ← Código copypaste listo, 10+ ejemplos prácticos
```

### SKILL.md contiene
- Overview del skill
- Standards & References (WCAG, ARIA, etc.)
- When to Use (casos de uso)
- Best Practices
- Tool Categories
- Integration guidelines

### EXAMPLES.md contiene
- Setup inicial
- 10+ ejemplos de código completo
- Organized por caso de uso
- Copy-paste ready
- Código probado en producción

---

## 🎓 Aprendizaje progresivo

### Nivel 1: Fundamentos
1. `senior-frontend/SKILL.md` (Angular 20 basics)
2. `accessibility/SKILL.md` (WCAG fundamentals)

### Nivel 2: Testing & Auditing
3. `accessibility-testing/SKILL.md` (automated + manual testing)
4. `chrome-devtools/SKILL.md` (browser automation)

### Nivel 3: Optimización
5. `refactor/SKILL.md` (clean code patterns)
6. `senior-frontend/EXAMPLES.md` (#6 Performance optimization)

---

## 🚀 Quick Start

### Implementar componente nuevo
```bash
# 1. Leer teoría
cat senior-frontend/SKILL.md
cat accessibility/SKILL.md

# 2. Ver ejemplos
cat senior-frontend/EXAMPLES.md  # Example #1
cat accessibility/EXAMPLES.md    # Example #2

# 3. Implementar + test
npm run test:watch
```

### Auditar accesibilidad
```bash
# 1. Leer estrategia
cat accessibility-testing/SKILL.md

# 2. Activar herramientas (en código)
# activate_browser_navigation_tools()
# activate_web_page_capture_tools()

# 3. Ejecutar tests
npm run test:a11y

# 4. Manual testing (NVDA, keyboard)
# Ver EXAMPLES.md #3, #5, #7
```

---

## 📊 Métricas de éxito

Track estas métricas:
- **Automated Coverage**: % de componentes con axe tests (target: 100%)
- **Violation Count**: Total axe violations (target: 0)
- **Manual Test Pass Rate**: % de tests manuales passing (target: 95%+)
- **Lighthouse Score**: Accessibility score (target: 95-100)

---

## 🆘 Soporte

**¿Dudas sobre qué skill usar?**
- Implementación → `senior-frontend/`, `accessibility/`
- Testing/Auditing → `accessibility-testing/`, `chrome-devtools/`
- Optimización → `refactor/`, `senior-frontend/` (#6 Performance)

**¿Ejemplos no cubren tu caso?**
- Revisa `SKILL.md` para principios generales
- Adapta ejemplos similares de `EXAMPLES.md`
- Crea nuevo ejemplo y contribuye al proyecto

---

**✅ Todos los skills están listos para usar. Copypaste, adapta, y ship código de calidad.** 🚀

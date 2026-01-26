# Rol: Git/Workflow — CryptoTerminal

## Objetivo
- Garantizar un flujo de trabajo limpio, trazable y profesional siguiendo Conventional Commits, nomenclatura de ramas y estructura de issues.

## Responsabilidades

### Commits
- Validar formato Convencional Commits: `<tipo>(scope): descripción imperativo`
- Revisar que la descripción sea clara, concisa y en inglés
- Agrupar cambios lógicamente: no mezclar refactors con features
- Sugerir resplits si el commit hace demasiadas cosas

### Ramas
- Validar nomenclatura: `feature/APP-XX-descripción-en-español` (o `bugfix/`, `refactor/`)
- Sugerir nombres descriptivos y cortos (máximo 50 caracteres después del tipo)
- Confirmar que cada rama tenga un issue asociado (APP-XX)

### Issues (GitHub)
- Validar formato: `APP-XX: Título en español`
- Verificar descripción con: Contexto, Tareas, Criterios de aceptación
- Sugerir labels (feature, bug, docs, perf, test, refactor)
- Revisar que criterios de aceptación sean claros y verificables

### Pull Requests
- Revisar descripción sigue estructura: **¿Qué?**, **¿Por qué?**, **¿Cómo?**
- Validar que PR está ligado a issue (cierra #APP-XX)
- Confirmar title sigue Conventional Commits
- Sugerir cambios si es necesario

### Workflow y Buenas prácticas
- Guiar en pre-commit checks (lint, tests, tipos)
- Recordar `git rebase` vs `git merge` en contexto
- Advertir sobre commits con secretos (validate antes de push)
- Sugerir squash de commits triviales

---

## Tipos de commits (Convencional Commits)

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `feat` | Nueva funcionalidad | `feat: add price alerts` |
| `fix` | Corrección de bug | `fix(market-service): handle disconnect timeout` |
| `docs` | Documentación | `docs: binance api integration guide` |
| `style` | Formato (sin lógica) | `style: format chart component` |
| `refactor` | Cambios internos | `refactor: extract currency formatter` |
| `test` | Añadir/modificar tests | `test: market service unit tests` |
| `perf` | Mejora de rendimiento | `perf: throttle websocket updates` |
| `chore` | Tareas de mantenimiento | `chore: update dependencies` |
| `build` | Sistema de build | `build: optimize bundle size` |
| `ci` | Cambios en pipelines | `ci: add github actions workflow` |

---

## Estructura de commits recomendada

```
feat(dashboard): add market overview widget

- Fetch markets from Binance API
- Display top 10 trending coins
- Add real-time price updates via WebSocket
- Implement lazy loading of price-card component

Closes #APP-01
```

**Reglas**:
- Asunto: máximo 50 caracteres, imperativo, sin punto final
- Body: máximo 72 caracteres por línea, explique **qué** y **por qué**
- Footer: referencia issues cerrados (`Closes #APP-XX`, `Fixes #APP-YY`)

---

## Nomenclatura de ramas

### Formato
```
<tipo>/<APP-XX>-<descripción-en-español>
```

### Ejemplos
```
feature/APP-01-implementar-busqueda-criptos
feature/APP-02-agregar-alertas-precio
bugfix/APP-03-corregir-desconexion-websocket
refactor/APP-04-extraer-currency-formatter
docs/APP-05-guia-integracion-binance
test/APP-06-tests-market-service
perf/APP-07-optimizar-apexcharts
```

### Reglas
- **Siempre** con issue asociado (APP-XX)
- Descripción en **español** (máximo 40 caracteres)
- Tipos: `feature`, `bugfix`, `refactor`, `docs`, `test`, `perf`, `chore`, `ci`
- Minúsculas, sin espacios (usar guiones)

---

## Estructura de Issues

```markdown
# APP-01: Implementar búsqueda de criptomonedas

## Contexto
Los usuarios necesitan buscar rápidamente criptos por nombre/símbolo 
en el dashboard sin scrollear toda la lista de mercados.

## Tareas
- [ ] Crear componente HeaderSearchComponent
- [ ] Implementar debounce (300ms)
- [ ] Conectar con MarketService
- [ ] Tests unitarios
- [ ] Accesibilidad WCAG AA
- [ ] Documentación en README

## Criterios de aceptación
- ✅ Búsqueda funciona en tiempo real (<300ms latencia)
- ✅ Navegable por teclado (arrow keys, enter)
- ✅ Foco management correcto
- ✅ Tests pasan (>80% cobertura)
- ✅ Lint limpio (ESLint, Prettier)

## Labels
- `feature`, `frontend`, `binance-integration`

## Asignado a
@tu-usuario
```

---

## Checklist pre-commit

Antes de hacer `git commit`:

```
□ Cambios lógicamente agrupados
□ Lint pasa: `npm run lint` (ESLint + Prettier)
□ Tests pasan: `npm run test`
□ TypeScript strict: sin `any`, sin errores
□ Sin console.log debug
□ Commits singulares por feature/fix
□ Mensaje sigue Conventional Commits
□ Referencia issue en footer (Closes #APP-XX)
□ Sin secretos (Binance keys, tokens, passwords)
```

---

## Checklist pre-push

Antes de `git push origin <rama>`:

```
□ Rebase con main (sin conflicts)
□ Tests pasan en branch local
□ Build pasa: `npm run build`
□ Commits limpios (sin squashes accidentales)
□ PR description preparada (si es para merge)
□ README actualizado (si hay cambios públicos)
□ CHANGELOG.md actualizado (si es release)
```

---

## Flujo típico de trabajo

### 1. Crear rama desde issue
```bash
# Issue: APP-01: Implementar búsqueda criptos
git checkout -b feature/APP-01-busqueda-criptos
```

### 2. Trabajo local
```bash
# Editar, implementar, refactorizar
npm run lint      # Formatear y limpiar lint
npm run test      # Pasar tests
npm run build     # Compilar sin errores
```

### 3. Commits
```bash
git add src/app/shared/components/header-search/

# Commit siguiendo Conventional Commits
git commit -m "feat(header-search): implement crypto search with debounce

- Add HeaderSearchComponent (standalone)
- Implement 300ms debounce on input
- Connect to MarketService for real-time results
- Add WCAG AA accessibility (labels, ARIA, keyboard nav)

Closes #APP-01"
```

### 4. Push y crear PR
```bash
git push origin feature/APP-01-busqueda-criptos

# En GitHub: crear PR, descripción, link issue, pedir review
```

### 5. Merge
```bash
# Después de aprobación y tests pasan:
git checkout main
git pull origin main
git merge --ff-only feature/APP-01-busqueda-criptos
git push origin main

# O usar GitHub: "Squash and merge" si commits son múltiples triviales
```

---

## Validación y sugerencias

### ❌ Commit inválido
```
git commit -m "fixed stuff"
```
**Problema**: No sigue formato, descripción poco clara
**Solución**: `git commit --amend -m "fix(market-service): handle null prices"`

### ❌ Rama inválida
```
git checkout -b search-feature
```
**Problema**: Sin APP-XX, descripción poco clara
**Solución**: `git checkout -b feature/APP-01-busqueda-criptos`

### ❌ Issue inválido
```
GitHub Issue Title: "Bug en dashboard"
```
**Problema**: Sin APP-XX, poco descriptivo
**Solución**: `APP-03: El gráfico no actualiza precios en tiempo real`

---

## Reglas de oro

1. **Un commit = una idea**: si necesitas "y" para describir, es dos commits
2. **Commits pequeños**: máximo 200 líneas de cambio (si es más, es dos commits)
3. **Mensajes claros**: el que lea el commit en 6 meses debe entender **qué** y **por qué**
4. **Siempre issue**: cada rama debe tener un APP-XX asociado
5. **Rebase limpio**: antes de merge, rebase con main para evitar merge commits
6. **No force push**: a menos que sea rama personal, no hagas `push -f` a shared branches

---

## Herramientas recomendadas

- **Commitizen** (`commitizen/cz-cli`): CLI interactivo para Conventional Commits
- **Husky** + **lint-staged**: pre-commit hooks para lint/tests automáticos
- **standard-version**: auto-generar CHANGELOG.md y versionado semántico

---

**✅ Resumen**: Convencional Commits (inglés), ramas `tipo/APP-XX-descripción-español`, issues APP-XX con tareas y criterios, checklists pre-commit/push, commits pequeños y claros.

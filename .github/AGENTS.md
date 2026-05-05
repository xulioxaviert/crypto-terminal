# Agentes disponibles - CryptoTerminal

Resumen y ejemplos de uso para los agentes configurados en `.github/agents/`.

## `accessibility-audit`

- Propósito: Auditar y corregir accesibilidad (WCAG 2.2 AA/AAA) en componentes Angular.
- Ideal para: contrast checks, keyboard nav, ARIA roles, live regions, y tests con `axe`.

Plantilla de entrada (usa esta estructura en el prompt):

```
pantalla/componente: PriceCard
alcance: revisar contraste, keyboard nav, roles ARIA
criterio: WCAG 2.2 AA
problemas observados: texto pequeño en botones, focus missing
evidencia esperada: lista de violaciones con línea/selector y sugerencias de corrección
```

Ejemplo de prompt listo:

"Audita `PriceCard` (dashboard) para WCAG 2.2 AA: revisar contraste, tab order, y atributos ARIA; reporta violaciones con selectores CSS, prioridad (alta/media/baja) y un PR-ready diff o snippets de patch si aplica."

Salida esperada: lista de hallazgos, snippets de corrección (HTML/SCSS/TS), y pruebas `vitest-axe` sugeridas.

## `senior-frontend`

- Propósito: Implementar o refactorizar features Angular 20 (zoneless, signals), integrar adaptadores Binance, y añadir tests.
- Ideal para: componentes standalone, servicios RxJS, performance tuning y coverage de tests.

Plantilla de entrada:

```
objetivo: Implementar buscador de mercados en dashboard
alcance: HeaderSearchComponent (app/features/dashboard/components)
archivos objetivo: app/features/dashboard/components/header-search/
criterios de aceptación: debounce 300ms, accessible (WCAG AA), tests unitarios Vitest
riesgos: rendimiento en listas grandes, race conditions WebSocket
tests esperados: unit + integration con mocked services
```

Ejemplo de prompt listo:

"Implementa `HeaderSearchComponent` en `dashboard` con debounce 300ms, signals-based state, y tests Vitest; asegúrate de accesibilidad (aria-labels, keyboard) y provee los archivos modificados y tests." 

Salida esperada: cambios en archivos con diffs, pruebas nuevas, y lista de consideraciones de integración.

## Cómo invocar agentes

- Desde el chat: escribe `/run-agent <agent-name>` y pega la plantilla de entrada o el prompt ejemplo.
- Manual: revisa el `argument-hint` en `.github/agents/<agent>.agent.md` para cada agente.

## `accessibility-testing`

- Propósito: Ejecutar auditorías de accesibilidad automatizadas y manuales, producir evidencia y tests reproducibles.
- Ideal para: generar `vitest-axe` tests, capturas de accessibility tree via MCP, y reportes con prioridades.

Plantilla de entrada:

```
objetivo: Auditar PriceCard en producción
alcance: pruebas automatizadas (axe) + snapshot accessibility tree + sugerencias de corrección
criterio: WCAG 2.2 AA
entregable: reporte (JSON+MD), tests Vitest/axe, snippets de patch
```

Ejemplo de prompt listo:

"Ejecuta una auditoría `accessibility-testing` sobre `PriceCard` en la rama `main`: genera un reporte con `axe` (wcag2aa, wcag22aa), captura accessibility tree via MCP, y propone tests `vitest-axe` junto con snippets de corrección." 

Salida esperada: JSON de resultados de `axe`, MD resumen con prioridades, tests `vitest-axe` propuestos, y snippets de corrección.

## `refactor`

- Propósito: Realizar refactorings quirúrgicos manteniendo comportamiento, mejorar tipos y reducir deuda técnica.
- Ideal para: extraer funciones, mejorar tipos TypeScript, eliminar code smells y aplicar patrones (Strategy, Null Object).

Plantilla de entrada:

```
objetivo: Refactorizar MarketService
alcance: separar REST y WebSocket logic en adapters, mejorar typing, añadir tests unitarios
archivos objetivo: app/features/dashboard/service/market.service.ts
criterios de aceptación: sin cambios funcionales, tests existentes pasan, cobertura igual o mejor
```

Ejemplo de prompt listo:

"Refactoriza `MarketService` separando la lógica REST y WebSocket en dos adapters (RESTAdapter, WSAdapter), añade interfaces claras y tests unitarios; entrega diffs de los archivos modificados y comandos para ejecutar los tests." 

Salida esperada: diffs aplicables, lista de tests añadidos/actualizados, y notas de riesgos/compatibilidad.

## Añadir más agentes o ejemplos

Puedo añadir prompts para otros agentes detectados o generar plantillas por tarea (ej.: PR-ready patches, tests automatizados, o auditorías completas). ¿Quieres que añada ejemplos para otros agentes también? 


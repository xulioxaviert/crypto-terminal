# Rol: Experto en Rendimiento — CryptoTerminal

## Objetivo
- Optimizar el frontend Angular 20/Tailwind y las integraciones en tiempo real (Binance REST/WS) sin sacrificar mantenibilidad.

## Responsabilidades
- **Carga inicial**: lazy loading de features (Markets, Portfolio por rutas), code splitting automático, skeletons en Dashboard.
- **Renderizados**: optimizar signals/computed (precio derivado en USD/moneda local), track() en @for (market lists, portfolio items), evitar crear arrays/funciones en templates.
- **Gráficos (ApexCharts)**: carga diferida, limitar número de velas mostradas (últimos 1000), reusar instancias, destruir correctamente.
- **WebSocket Binance**: throttling de eventos (agrupa updates cada 200-500ms), backpressure en conexión lenta, reconexión con backoff exponencial.
- **Búsqueda (header-search)**: debounce (300-500ms), caché de resultados, limitar 20 resultados mostrados.
- **Analizar métricas**: Core Web Vitals (LCP, CLS, TTI), performance de WS (latencia, reconexiones), errores HTTP, CPU/memoria navegador.
- **Assets**: purge de Tailwind, fuentes optimizadas, carga diferida de Lucide icons, compresión de imágenes si aplica.

## Reglas y estándares
- **ROI claro**: prioriza mejoras >10% impacto en LCP/TTI/engagement; evita micro-optimizaciones sin medir.
- **Main thread**: evita cálculos pesados, parsing de JSON grande, renders de listas >500 items (virtualización si aplica).
- **Documentación**: hallazgos y cambios con métricas (antes/después), herramientas (Chrome DevTools, Lighthouse, OpenTelemetry), impacto en KPIs usuario.
- **Testing**: verifica mejoras en navegador real (no solo DevTools), en conexiones lentas (throttle 3G).

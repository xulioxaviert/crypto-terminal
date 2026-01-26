# Rol: UX/UI + Accesibilidad — CryptoTerminal

## Objetivo
- Garantizar interfaces accesibles, intuitivas y rápidas en el contexto Angular 20/Tailwind del proyecto.

## Responsabilidades
- **Accesibilidad WCAG 2.2 AA**: contraste mín 4.5:1 (normal) / 3:1 (grande), foco visible en toda UI, navegación por teclado completa.
- **Componentes accesibles**: labels visibles, ARIA correcta (no redundante), tabindex lógico, aria-label en gráficos/iconos.
- **Tailwind tokens**: crypto-dark, crypto-neon, backgrounds (secondary, tertiary), text colors; verificar contraste en ambos temas.
- **Diseño de features**:
  - **Dashboard**: overview de mercados, gráfico principal, wallet summary, últimas operaciones.
  - **Markets**: búsqueda con debounce, filtros (favoritos, tendencias), listado con precios/cambios, detalles de crypto.
  - **Portfolio**: saldo actual, rentabilidad, histórico de cambios, operaciones.
  - **Alerts** (futuro): notificaciones de precio, configuración de umbrales.
  - **Settings**: preferencias (tema, moneda base, alertas), información de cuenta.
- **Rendimiento percibido**: skeletons en carga, lazy loading de vistas, sin animaciones pesadas en main thread, estados claros (cargando, vacío, error, éxito).
- **Documentar UX**: diagramas Mermaid (user journeys, flujos), wireframes, checklists de accesibilidad.

## Estándares del proyecto
- **Paleta y tokens**: crypto-dark (bg principal), crypto-neon (accents), backgrounds secondary/tertiary, text colors claros.
- **Componentes shared**: price-card (mostrar precio, cambio %), chart (ApexCharts), market-trends (tabla de mercados), header-search (búsqueda rápida), wallets (saldo), settings-component (preferencias).
- **Iconos**: Lucide Angular; pequeños (16-24px), con alt text o aria-label.
- **Microinteracciones**: hover subtiles (opacity, color), sin animaciones mareantes; respetar prefers-reduced-motion.
- **Formularios**: labels visibles, input con placeholder descriptivo, validación en tiempo real, mensajes de error claros.
- **Atajos de teclado**: búsqueda (Ctrl/Cmd+K), navegación (arrow keys en listas), Enter para seleccionar.
- **Focus management**: orden lógico, visible en todos los elementos interactivos (botones, links, inputs, tablas).
- **Modo oscuro/claro** (si aplica): tokens ajustables, no solo invertir colores.

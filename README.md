# CryptoTerminal

🚀 **Aplicación web moderna de monitoreo de criptomonedas** con Angular 20 (Zoneless) y streaming en tiempo real desde Binance API.

## 🎯 Características Principales

- ✅ **Precios en Tiempo Real**: Conexión WebSocket a Binance
- ✅ **Portfolio Analytics**: Gráficos con ApexCharts
- ✅ **Responsive Design**: Mobile-first con Tailwind CSS
- ✅ **State Management**: Signals + RxJS
- ✅ **Standalone Components**: Angular 20 moderno
- ✅ **TypeScript Strict**: Tipado fuerte en todo el proyecto

## 📁 Estructura del Proyecto

```
src/app/
├── core/
│   ├── components/
│   │   ├── header/              # Barra superior
│   │   └── sidebar/             # Navegación
│   └── config/                  # Configuración de APIs
├── features/
│   └── dashboard/
│       ├── components/
│       │   ├── price-card/              # Tarjeta de precio
│       │   ├── portfolio-hero/          # Hero del portfolio
│       │   ├── portfolio-analytics/     # Gráficos (ApexCharts)
│       │   ├── markets/                 # Vista de mercados
│       │   ├── wallets/                 # Vista de wallets
│       │   └── settings-component/      # Configuración
│       ├── models/                      # Tipos TypeScript
│       └── service/
│           ├── market.service.ts        # Datos en tiempo real
│           ├── portfolio.service.ts     # Gestión del portafolio
│           └── chart-data.service.ts    # Datos de gráficos
└── app/
    ├── app.config.ts            # Configuración
    └── app.routes.ts            # Rutas
```

## 🛠️ Stack Tecnológico

- **Angular**: 20.0.0 (Zoneless)
- **TypeScript**: 5.9.2 (Strict mode)
- **Tailwind CSS**: 3.4.19
- **ApexCharts**: Para visualización de datos
- **Vitest**: Testing
- **RxJS**: Streaming
- **Binance API**: REST + WebSocket

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
ng serve
```

Abre http://localhost:4200 en tu navegador.

### Build Producción

```bash
ng build --configuration production
```

### Tests

```bash
ng test
```

---

## 📊 Estado del Proyecto

### ✅ Completo
- Core components (Header, Sidebar)
- DashboardComponent con grid de precios
- PriceCardComponent con diseño responsivo
- MarketService (WebSocket + RxJS)
- PortfolioService (cálculos en tiempo real)
- PortfolioAnalyticsComponent (gráficos)
- State management con Signals

### ⚠️ En Progreso
- MarketsComponent (tabla de mercados)
- WalletsComponent (gestión de wallets)
- SettingsComponent (configuración)
- ChartDataService (datos históricos)
- Tests unitarios

### 🚧 Planificado
- Backend (Node.js + Express)
- Autenticación de usuarios
- Persistencia de portafolios
- Notificaciones en tiempo real
- Sistema de alertas

Para más detalles, ver [CHANGELOG.md](./CHANGELOG.md)

## 📚 Documentación

Encuentra documentación detallada en `/docs`:
- [01-project-overview.md](./docs/01-project-overview.md) - Visión general
- [04-services-and-state.md](./docs/04-services-and-state.md) - Servicios
- [05-components.md](./docs/05-components.md) - Componentes
- [06-models-and-types.md](./docs/06-models-and-types.md) - Modelos TypeScript

## 🔧 Configuración

### API de Binance

Los datos se obtienen de:
- **REST API**: `https://api.binance.com/api/v3`
- **WebSocket**: `wss://stream.binance.com:9443/ws`

Sin autenticación requerida (endpoints públicos).

### Criptomonedas Monitoredas

Por defecto se monitorean:
- BTC (Bitcoin)
- ETH (Ethereum)
- SOL (Solana)
- DOGE (Dogecoin)

---

## 📝 Desarrollo

### Crear Componente

```bash
ng generate component features/dashboard/components/my-component
```

### Crear Servicio

```bash
ng generate service features/dashboard/service/my-service
```

### Convenciones de Código

- Componentes standalone
- Signal inputs con `input.required<T>()`
- Servicios con `@Injectable({ providedIn: 'root' })`
- TypeScript strict mode obligatorio
- Imports ordenados alfabéticamente

---

## 🤝 Contribuir

1. Revisar [CHANGELOG.md](./CHANGELOG.md)
2. Crear rama: `git checkout -b feature/mi-feature`
3. Hacer cambios y commit
4. Push y crear Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto para propósitos educativos.

---

## 🔗 Enlaces Útiles

- [Documentación Angular](https://angular.dev/)
- [Binance API](https://binance-docs.github.io/apidocs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ApexCharts](https://apexcharts.com/)

---

**Última actualización**: 8 de enero de 2026

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

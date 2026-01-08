# CryptoTerminal

🚀 **Modern cryptocurrency market monitoring web application** with Angular 20 (Zoneless) and real-time streaming from Binance API.

## 🎯 Key Features

- ✅ **Real-Time Prices**: WebSocket connection to Binance
- ✅ **Portfolio Analytics**: Charts with ApexCharts
- ✅ **Responsive Design**: Mobile-first with Tailwind CSS
- ✅ **State Management**: Signals + RxJS
- ✅ **Standalone Components**: Modern Angular 20
- ✅ **TypeScript Strict**: Strong typing across the project

## 📁 Project Structure

```
src/app/
├── core/
│   ├── components/
│   │   ├── header/              # Top navigation bar
│   │   └── sidebar/             # Side navigation
│   └── config/                  # API configuration
├── features/
│   └── dashboard/
│       ├── components/
│       │   ├── price-card/              # Price card component
│       │   ├── portfolio-hero/          # Portfolio hero section
│       │   ├── portfolio-analytics/     # Analytics charts (ApexCharts)
│       │   ├── markets/                 # Markets view
│       │   ├── wallets/                 # Wallets view
│       │   └── settings-component/      # Settings view
│       ├── models/                      # TypeScript types
│       └── service/
│           ├── market.service.ts        # Real-time market data
│           ├── portfolio.service.ts     # Portfolio management
│           └── chart-data.service.ts    # Chart data service
└── app/
    ├── app.config.ts            # App configuration
    └── app.routes.ts            # Route definitions
```

## 🛠️ Tech Stack

- **Angular**: 20.0.0 (Zoneless)
- **TypeScript**: 5.9.2 (Strict mode)
- **Tailwind CSS**: 3.4.19
- **ApexCharts**: Data visualization
- **Vitest**: Testing framework
- **RxJS**: Streaming library
- **Binance API**: REST + WebSocket

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
ng serve
```

Open http://localhost:4200 in your browser.

### Production Build

```bash
ng build --configuration production
```

### Running Tests

```bash
ng test
```

---

## 📊 Project Status

### ✅ Complete
- Core components (Header, Sidebar)
- DashboardComponent with price grid
- PriceCardComponent with responsive design
- MarketService (WebSocket + RxJS)
- PortfolioService (real-time calculations)
- PortfolioAnalyticsComponent (charts)
- State management with Signals

### ⚠️ In Progress
- MarketsComponent (market data table)
- WalletsComponent (wallet management)
- SettingsComponent (app settings)
- ChartDataService (historical data)
- Unit tests

### 🚧 Planned
- Backend (Node.js + Express)
- User authentication
- Portfolio persistence
- Real-time notifications
- Alert system

For more details, see [CHANGELOG.md](./CHANGELOG.md)

## 📚 Documentation

Detailed documentation is available in `/docs`:
- [01-project-overview.md](./docs/01-project-overview.md) - Project overview
- [04-services-and-state.md](./docs/04-services-and-state.md) - Services and state management
- [05-components.md](./docs/05-components.md) - Component architecture
- [06-models-and-types.md](./docs/06-models-and-types.md) - TypeScript models

## 🔧 Configuration

### Binance API

Data is fetched from:
- **REST API**: `https://api.binance.com/api/v3`
- **WebSocket**: `wss://stream.binance.com:9443/ws`

No authentication required (public endpoints).

### Monitored Cryptocurrencies

By default, these cryptocurrencies are monitored:
- BTC (Bitcoin)
- ETH (Ethereum)
- SOL (Solana)
- DOGE (Dogecoin)

---

## 📝 Development

### Create Component

```bash
ng generate component features/dashboard/components/my-component
```

### Create Service

```bash
ng generate service features/dashboard/service/my-service
```

### Code Conventions

- Standalone components
- Signal inputs with `input.required<T>()`
- Services with `@Injectable({ providedIn: 'root' })`
- TypeScript strict mode required
- Alphabetically sorted imports

---

## 🤝 Contributing

1. Review [CHANGELOG.md](./CHANGELOG.md)
2. Create a branch: `git checkout -b feature/my-feature`
3. Make changes and commit
4. Push and create a Pull Request

---

## 📄 License

This project is open source for educational purposes.

---

## 🔗 Useful Links

- [Angular Documentation](https://angular.dev/)
- [Binance API](https://binance-docs.github.io/apidocs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ApexCharts](https://apexcharts.com/)

---

**Last updated**: January 8, 2026

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

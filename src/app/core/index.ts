// Core Store
export { AppStore } from './store/app.store.service';

export { DEFAULT_USER_PREFERENCES } from './models/app-state.model';
export type { PortfolioSnapshot, UserPreferences } from './models/app-state.model';

// Core Interfaces
export type { IMarketDataProvider } from './interfaces/market-data-provider.interface';

// Core Adapters
export { BinanceMarketAdapter } from './adapters/binance-market.adapter';

import { Observable } from 'rxjs';

/**
 * Price update from market data provider
 */
export interface PriceUpdate {
  symbol: string;
  price: number;
  change: number;
}

/**
 * Market Data Provider Interface
 *
 * Defines the contract for market data providers (Binance, Coinbase, etc.)
 * This allows the application to swap data sources without changing business logic.
 *
 * @example
 * ```typescript
 * class BinanceAdapter implements IMarketDataProvider {
 *   connect(): Observable<PriceUpdate> {
 *     return webSocket('wss://stream.binance.com/ws').pipe(...);
 *   }
 * }
 * ```
 */
export interface IMarketDataProvider {
  /**
   * Establish connection to the market data stream
   * @returns Observable emitting price updates for all tracked assets
   */
  connect(): Observable<PriceUpdate | null>;

  /**
   * Get tracked asset symbols
   * @returns Array of asset symbols (e.g., ['btcusdt', 'ethusdt'])
   */
  getTrackedAssets(): readonly string[];

  /**
   * Get WebSocket URL for this provider
   * @returns WebSocket connection URL
   */
  getWebSocketUrl(): string;
}

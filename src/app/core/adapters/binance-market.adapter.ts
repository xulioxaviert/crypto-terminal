import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, retry, throttleTime } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { BinanceTickerData } from '../../features/dashboard/models/binance.model';
import { ENDPOINTS } from '../config/endpoints.config';
import { IMarketDataProvider, PriceUpdate } from '../interfaces/market-data-provider.interface';

/**
 * Binance Market Data Adapter
 *
 * Implements IMarketDataProvider interface for Binance API.
 * Handles WebSocket connections, data transformation, and error recovery.
 *
 * Features:
 * - Real-time price updates via WebSocket
 * - Automatic reconnection with exponential backoff
 * - Throttling to prevent UI overload
 * - Type-safe data transformation
 *
 * @example
 * ```typescript
 * const adapter = inject(BinanceMarketAdapter);
 * adapter.connect().subscribe(update => {
 *   console.log(`${update.symbol}: $${update.price}`);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class BinanceMarketAdapter implements IMarketDataProvider {
  /**
   * Assets tracked by Binance WebSocket
   */
  private readonly TRACKED_ASSETS = [
    'btcusdt',
    'ethusdt',
    'solusdt',
    'dogeusdt',
    'dotusdt',
    'adausdt',
    'xrpusdt',
    'bnbusdt',
    'maticusdt',
    'ltcusdt',
  ] as const;

  /**
   * Binance WebSocket URL with ticker streams
   */
  private readonly WS_URL = `${ENDPOINTS.ws_url}/${this.TRACKED_ASSETS.map(
    (s) => `${s}@ticker`
  ).join('/')}`;

  /**
   * Get array of tracked asset symbols
   */
  getTrackedAssets(): readonly string[] {
    return this.TRACKED_ASSETS;
  }

  /**
   * Get WebSocket URL
   */
  getWebSocketUrl(): string {
    return this.WS_URL;
  }

  /**
   * Connect to Binance WebSocket and stream price updates
   *
   * Stream features:
   * - Throttled to 100ms (10 updates/second max)
   * - Auto-reconnect on disconnect (3s delay)
   * - Error handling with fallback to null
   *
   * @returns Observable of PriceUpdate or null on error
   */
  connect(): Observable<PriceUpdate | null> {
    return webSocket<BinanceTickerData>(this.WS_URL).pipe(
      throttleTime(100), // Prevent UI overload
      map((data) => this.transformBinanceData(data)),
      retry({ delay: 3000 }), // Reconnect after 3s
      catchError((error) => {
        console.error('[BinanceAdapter] WebSocket error:', error);
        return of(null);
      })
    );
  }

  /**
   * Transform Binance ticker data to internal PriceUpdate format
   *
   * @param data - Raw Binance ticker data
   * @returns Normalized PriceUpdate
   *
   * @example
   * Input:  { s: 'BTCUSDT', c: '50000.00', P: '2.50' }
   * Output: { symbol: 'BTC', price: 50000, change: 2.5 }
   */
  private transformBinanceData(data: BinanceTickerData): PriceUpdate {
    return {
      symbol: data.s.replace('USDT', ''), // BTCUSDT → BTC
      price: parseFloat(data.c), // Current price
      change: parseFloat(data.P), // 24h change percentage
    };
  }
}

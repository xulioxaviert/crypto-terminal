import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, map, Observable, of, retryWhen, tap, throttleTime, timer } from 'rxjs';
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
   * Reconnection configuration from environment
   */
  private readonly RECONNECT_CONFIG = environment.websocket.reconnect;
  private reconnectAttempts = 0;
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
   * - Throttled to configured rate (default 100ms)
   * - Auto-reconnect with exponential backoff
   * - Error handling with fallback to null
   *
   * Exponential backoff strategy:
   * - Attempt 1: 1s delay
   * - Attempt 2: 2s delay
   * - Attempt 3: 4s delay
   * - Attempt 4: 8s delay
   * - Attempt 5: 16s delay (capped at maxDelay)
   *
   * @returns Observable of PriceUpdate or null on error
   */
  connect(): Observable<PriceUpdate | null> {
    return webSocket<BinanceTickerData>(this.WS_URL).pipe(
      throttleTime(environment.websocket.throttle),
      map((data) => this.transformBinanceData(data)),
      tap(() => {
        // Reset reconnection counter on successful message
        this.reconnectAttempts = 0;
      }),
      retryWhen((errors) =>
        errors.pipe(
          tap(() => {
            this.reconnectAttempts++;
            if (this.reconnectAttempts > this.RECONNECT_CONFIG.maxAttempts) {
              console.error(
                `[BinanceAdapter] Max reconnection attempts (${this.RECONNECT_CONFIG.maxAttempts}) reached. Stopping.`
              );
              throw new Error('Max reconnection attempts exceeded');
            }

            const delay = this.calculateBackoffDelay();
            console.warn(
              `[BinanceAdapter] Reconnecting... (attempt ${this.reconnectAttempts}/${this.RECONNECT_CONFIG.maxAttempts}) in ${delay}ms`
            );
          }),
          // Delay with exponential backoff
          map(() => timer(this.calculateBackoffDelay()))
        )
      ),
      catchError((error) => {
        console.error('[BinanceAdapter] Fatal WebSocket error:', error);
        // Reset counter for future reconnection attempts
        this.reconnectAttempts = 0;
        return of(null);
      })
    );
  }

  /**
   * Calculate exponential backoff delay
   *
   * Formula: min(baseDelay * 2^attempts, maxDelay)
   *
   * @returns Delay in milliseconds
   */
  private calculateBackoffDelay(): number {
    const exponentialDelay =
      this.RECONNECT_CONFIG.baseDelay * Math.pow(2, this.reconnectAttempts - 1);

    return Math.min(exponentialDelay, this.RECONNECT_CONFIG.maxDelay);
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

import { environment } from '@environments/environment';

/**
 * API Endpoints
 *
 * Defines all API endpoint paths.
 * Base URLs come from environment configuration.
 */
export const ENDPOINTS = {
  // Binance REST API endpoints
  ticker: '/ticker/24hr',
  price: '/ticker/price',
  klines: '/klines',
  exchangeInfo: '/exchangeInfo',

  // WebSocket endpoint (from environment)
  ws_url: `${environment.binance.wsUrl}/ws`,

  // Icon service (from environment)
  ICON_BASE_URL: environment.icons.baseUrl,
} as const;

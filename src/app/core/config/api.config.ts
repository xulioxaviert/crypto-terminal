import { environment } from '@environments/environment';

/**
 * API Configuration
 *
 * Centralizes all external API configurations.
 * Uses environment variables for flexible deployment.
 *
 * @see src/environments/environment.ts
 */
export const API_CONFIG = {
  binance: environment.binance,
  icons: environment.icons,
  websocket: environment.websocket,
} as const;

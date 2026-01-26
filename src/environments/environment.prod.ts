/**
 * Production Environment Configuration
 *
 * Used in production builds (ng build --configuration production)
 * Contains production-optimized settings
 */
export const environment = {
  production: true,

  binance: {
    baseUrl: 'https://api.binance.com/api/v3',
    testnetUrl: 'https://testnet.binance.vision',
    wsUrl: 'wss://stream.binance.com:9443',
  },

  icons: {
    baseUrl: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/',
  },

  websocket: {
    reconnect: {
      maxAttempts: 10,
      baseDelay: 2000, // 2s
      maxDelay: 60000, // 60s
    },
    throttle: 100, // ms
  },
};

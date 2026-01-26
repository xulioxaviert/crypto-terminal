/**
 * Development Environment Configuration
 *
 * Used during local development (ng serve)
 * Contains non-production API endpoints and debug settings
 */
export const environment = {
  production: false,

  binance: {
    baseUrl: 'https://data-api.binance.vision/api/v3',
    testnetUrl: 'https://testnet.binance.vision',
    wsUrl: 'wss://stream.binance.com:9443',
  },

  icons: {
    baseUrl: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/',
  },

  websocket: {
    reconnect: {
      maxAttempts: 5,
      baseDelay: 1000, // 1s
      maxDelay: 30000, // 30s
    },
    throttle: 100, // ms
  },
};

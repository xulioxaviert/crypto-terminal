/**
 * User Preferences Model
 *
 * Global user preferences for the application
 */
export interface UserPreferences {
  /**
   * Theme preference
   */
  theme: 'dark' | 'light' | 'auto';

  /**
   * Preferred currency for display
   */
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';

  /**
   * Language preference
   */
  language: 'en' | 'es' | 'fr' | 'de';

  /**
   * Notifications enabled
   */
  notificationsEnabled: boolean;

  /**
   * Sound effects enabled
   */
  soundEnabled: boolean;
}

/**
 * Default user preferences
 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'dark',
  currency: 'USD',
  language: 'en',
  notificationsEnabled: true,
  soundEnabled: false,
};

/**
 * Portfolio Snapshot
 *
 * Snapshot of user's portfolio value and performance
 */
export interface PortfolioSnapshot {
  /**
   * Total portfolio value in USD
   */
  totalValue: number;

  /**
   * 24h change in value
   */
  change24h: number;

  /**
   * 24h change percentage
   */
  changePercent24h: number;

  /**
   * Total profit/loss
   */
  totalProfitLoss: number;

  /**
   * Last updated timestamp
   */
  lastUpdated: Date;
}

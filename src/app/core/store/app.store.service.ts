import { computed, effect, Injectable, signal } from '@angular/core';
import {
  DEFAULT_USER_PREFERENCES,
  PortfolioSnapshot,
  UserPreferences,
} from '../models/app-state.model';

/**
 * Application Store
 *
 * Global state management using Angular 20 native signals.
 * Manages cross-cutting concerns shared across features:
 * - User preferences (theme, currency, language)
 * - Watchlist (favorite crypto symbols)
 * - Portfolio snapshot (total value, P&L)
 *
 * Features:
 * - Reactive state with signals
 * - Computed derived values
 * - LocalStorage persistence
 * - Type-safe mutations
 *
 * @example
 * ```typescript
 * const appStore = inject(AppStore);
 *
 * // Read state
 * const theme = appStore.userPreferences().theme;
 * const watchlist = appStore.watchlist();
 *
 * // Update state
 * appStore.updateTheme('dark');
 * appStore.addToWatchlist('BTC');
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AppStore {
  // ========================================
  // STATE (Private Signals)
  // ========================================

  /**
   * User preferences
   * @private
   */
  private readonly _userPreferences = signal<UserPreferences>(
    this.loadUserPreferences()
  );

  /**
   * Watchlist (favorite symbols)
   * @private
   */
  private readonly _watchlist = signal<string[]>(this.loadWatchlist());

  /**
   * Portfolio snapshot
   * @private
   */
  private readonly _portfolioSnapshot = signal<PortfolioSnapshot | null>(null);

  // ========================================
  // PUBLIC READONLY ACCESSORS
  // ========================================

  /**
   * User preferences (readonly)
   */
  readonly userPreferences = this._userPreferences.asReadonly();

  /**
   * Watchlist (readonly)
   */
  readonly watchlist = this._watchlist.asReadonly();

  /**
   * Portfolio snapshot (readonly)
   */
  readonly portfolioSnapshot = this._portfolioSnapshot.asReadonly();

  // ========================================
  // COMPUTED SIGNALS
  // ========================================

  /**
   * Is symbol in watchlist?
   */
  isInWatchlist = (symbol: string) =>
    computed(() => this._watchlist().includes(symbol));

  /**
   * Watchlist count
   */
  readonly watchlistCount = computed(() => this._watchlist().length);

  /**
   * Has portfolio data
   */
  readonly hasPortfolioData = computed(
    () => this._portfolioSnapshot() !== null
  );

  /**
   * Portfolio is profitable (P&L > 0)
   */
  readonly isPortfolioProfitable = computed(() => {
    const snapshot = this._portfolioSnapshot();
    return snapshot ? snapshot.totalProfitLoss > 0 : false;
  });

  /**
   * Snapshot helper to check if a symbol is in watchlist (template friendly)
   */
  isInWatchlistSnapshot(symbol: string): boolean {
    return this._watchlist().includes(symbol);
  }

  constructor() {
    effect(() => {
      this.applyTheme(this._userPreferences().theme);
    });
  }

  // ========================================
  // USER PREFERENCES METHODS
  // ========================================

  /**
   * Update theme preference
   */
  updateTheme(theme: UserPreferences['theme']): void {
    this._userPreferences.update((prefs) => {
      const updated = { ...prefs, theme };
      this.saveUserPreferences(updated);
      return updated;
    });
  }

  /**
   * Update currency preference
   */
  updateCurrency(currency: UserPreferences['currency']): void {
    this._userPreferences.update((prefs) => {
      const updated = { ...prefs, currency };
      this.saveUserPreferences(updated);
      return updated;
    });
  }

  /**
   * Update language preference
   */
  updateLanguage(language: UserPreferences['language']): void {
    this._userPreferences.update((prefs) => {
      const updated = { ...prefs, language };
      this.saveUserPreferences(updated);
      return updated;
    });
  }

  /**
   * Toggle notifications
   */
  toggleNotifications(): void {
    this._userPreferences.update((prefs) => {
      const updated = { ...prefs, notificationsEnabled: !prefs.notificationsEnabled };
      this.saveUserPreferences(updated);
      return updated;
    });
  }

  /**
   * Toggle sound
   */
  toggleSound(): void {
    this._userPreferences.update((prefs) => {
      const updated = { ...prefs, soundEnabled: !prefs.soundEnabled };
      this.saveUserPreferences(updated);
      return updated;
    });
  }

  /**
   * Reset preferences to defaults
   */
  resetPreferences(): void {
    this._userPreferences.set(DEFAULT_USER_PREFERENCES);
    this.saveUserPreferences(DEFAULT_USER_PREFERENCES);
  }

  // ========================================
  // WATCHLIST METHODS
  // ========================================

  /**
   * Add symbol to watchlist
   */
  addToWatchlist(symbol: string): void {
    this._watchlist.update((list) => {
      if (list.includes(symbol)) return list;
      const updated = [...list, symbol];
      this.saveWatchlist(updated);
      return updated;
    });
  }

  /**
   * Remove symbol from watchlist
   */
  removeFromWatchlist(symbol: string): void {
    this._watchlist.update((list) => {
      const updated = list.filter((s) => s !== symbol);
      this.saveWatchlist(updated);
      return updated;
    });
  }

  /**
   * Toggle symbol in watchlist
   */
  toggleWatchlist(symbol: string): void {
    if (this._watchlist().includes(symbol)) {
      this.removeFromWatchlist(symbol);
    } else {
      this.addToWatchlist(symbol);
    }
  }

  /**
   * Clear watchlist
   */
  clearWatchlist(): void {
    this._watchlist.set([]);
    this.saveWatchlist([]);
  }

  // ========================================
  // PORTFOLIO METHODS
  // ========================================

  /**
   * Update portfolio snapshot
   */
  updatePortfolioSnapshot(snapshot: PortfolioSnapshot): void {
    this._portfolioSnapshot.set(snapshot);
  }

  /**
   * Clear portfolio snapshot
   */
  clearPortfolioSnapshot(): void {
    this._portfolioSnapshot.set(null);
  }

  // ========================================
  // PERSISTENCE (LocalStorage)
  // ========================================

  private readonly STORAGE_KEYS = {
    PREFERENCES: 'crypto_terminal_preferences',
    WATCHLIST: 'crypto_terminal_watchlist',
  } as const;

  /**
   * Load user preferences from localStorage
   */
  private loadUserPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.PREFERENCES);
      if (stored) {
        return { ...DEFAULT_USER_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('[AppStore] Error loading preferences:', error);
    }
    return DEFAULT_USER_PREFERENCES;
  }

  /**
   * Save user preferences to localStorage
   */
  private saveUserPreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(
        this.STORAGE_KEYS.PREFERENCES,
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.error('[AppStore] Error saving preferences:', error);
    }
  }

  /**
   * Load watchlist from localStorage
   */
  private loadWatchlist(): string[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.WATCHLIST);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('[AppStore] Error loading watchlist:', error);
    }
    return [];
  }

  /**
   * Save watchlist to localStorage
   */
  private saveWatchlist(watchlist: string[]): void {
    try {
      localStorage.setItem(
        this.STORAGE_KEYS.WATCHLIST,
        JSON.stringify(watchlist)
      );
    } catch (error) {
      console.error('[AppStore] Error saving watchlist:', error);
    }
  }

  /**
   * Apply theme to document root
   */
  private applyTheme(theme: UserPreferences['theme']): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-light');

    if (theme === 'auto') {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
      return;
    }

    root.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
  }
}

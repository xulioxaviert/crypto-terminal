import { TestBed } from '@angular/core/testing';
import { DEFAULT_USER_PREFERENCES } from '../models/app-state.model';
import { AppStore } from './app.store.service';

describe('AppStore', () => {
  let store: AppStore;
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => localStorageMock[key] || null,
        setItem: (key: string, value: string) => {
          localStorageMock[key] = value;
        },
        removeItem: (key: string) => {
          delete localStorageMock[key];
        },
        clear: () => {
          localStorageMock = {};
        },
      },
      writable: true,
    });

    TestBed.configureTestingModule({
      providers: [AppStore],
    });

    store = TestBed.inject(AppStore);
  });

  afterEach(() => {
    localStorageMock = {};
  });

  // ========================================
  // INITIALIZATION
  // ========================================

  describe('Initialization', () => {
    it('should create the store', () => {
      expect(store).toBeTruthy();
    });

    it('should initialize with default preferences', () => {
      expect(store.userPreferences()).toEqual(DEFAULT_USER_PREFERENCES);
    });

    it('should initialize with empty watchlist', () => {
      expect(store.watchlist()).toEqual([]);
    });

    it('should initialize with no portfolio snapshot', () => {
      expect(store.portfolioSnapshot()).toBeNull();
    });

    it('should load preferences from localStorage if available', () => {
      const customPrefs = {
        ...DEFAULT_USER_PREFERENCES,
        theme: 'light' as const,
        currency: 'EUR' as const,
      };

      localStorageMock['crypto_terminal_preferences'] = JSON.stringify(customPrefs);

      const newStore = TestBed.inject(AppStore);
      expect(newStore.userPreferences().theme).toBe('light');
      expect(newStore.userPreferences().currency).toBe('EUR');
    });

    it('should load watchlist from localStorage if available', () => {
      localStorageMock['crypto_terminal_watchlist'] = JSON.stringify(['BTC', 'ETH']);

      const newStore = TestBed.inject(AppStore);
      expect(newStore.watchlist()).toEqual(['BTC', 'ETH']);
    });
  });

  // ========================================
  // USER PREFERENCES
  // ========================================

  describe('User Preferences', () => {
    it('should update theme', () => {
      store.updateTheme('light');
      expect(store.userPreferences().theme).toBe('light');
    });

    it('should persist theme to localStorage', () => {
      store.updateTheme('light');
      const stored = JSON.parse(localStorageMock['crypto_terminal_preferences']);
      expect(stored.theme).toBe('light');
    });

    it('should update currency', () => {
      store.updateCurrency('EUR');
      expect(store.userPreferences().currency).toBe('EUR');
    });

    it('should persist currency to localStorage', () => {
      store.updateCurrency('GBP');
      const stored = JSON.parse(localStorageMock['crypto_terminal_preferences']);
      expect(stored.currency).toBe('GBP');
    });

    it('should update language', () => {
      store.updateLanguage('es');
      expect(store.userPreferences().language).toBe('es');
    });

    it('should persist language to localStorage', () => {
      store.updateLanguage('fr');
      const stored = JSON.parse(localStorageMock['crypto_terminal_preferences']);
      expect(stored.language).toBe('fr');
    });

    it('should toggle notifications', () => {
      const initialValue = store.userPreferences().notificationsEnabled;
      store.toggleNotifications();
      expect(store.userPreferences().notificationsEnabled).toBe(!initialValue);
      store.toggleNotifications();
      expect(store.userPreferences().notificationsEnabled).toBe(initialValue);
    });

    it('should toggle sound', () => {
      const initialValue = store.userPreferences().soundEnabled;
      store.toggleSound();
      expect(store.userPreferences().soundEnabled).toBe(!initialValue);
      store.toggleSound();
      expect(store.userPreferences().soundEnabled).toBe(initialValue);
    });

    it('should reset preferences to defaults', () => {
      store.updateTheme('light');
      store.updateCurrency('EUR');
      store.resetPreferences();
      expect(store.userPreferences()).toEqual(DEFAULT_USER_PREFERENCES);
    });
  });

  // ========================================
  // WATCHLIST
  // ========================================

  describe('Watchlist', () => {
    it('should add symbol to watchlist', () => {
      store.addToWatchlist('BTC');
      expect(store.watchlist()).toContain('BTC');
    });

    it('should not add duplicate symbols', () => {
      store.addToWatchlist('BTC');
      store.addToWatchlist('BTC');
      expect(store.watchlist()).toEqual(['BTC']);
    });

    it('should persist watchlist to localStorage', () => {
      store.addToWatchlist('BTC');
      const stored = JSON.parse(localStorageMock['crypto_terminal_watchlist']);
      expect(stored).toContain('BTC');
    });

    it('should remove symbol from watchlist', () => {
      store.addToWatchlist('BTC');
      store.addToWatchlist('ETH');
      store.removeFromWatchlist('BTC');
      expect(store.watchlist()).toEqual(['ETH']);
    });

    it('should toggle symbol in watchlist', () => {
      store.toggleWatchlist('BTC');
      expect(store.watchlist()).toContain('BTC');
      store.toggleWatchlist('BTC');
      expect(store.watchlist()).not.toContain('BTC');
    });

    it('should clear watchlist', () => {
      store.addToWatchlist('BTC');
      store.addToWatchlist('ETH');
      store.clearWatchlist();
      expect(store.watchlist()).toEqual([]);
    });

    it('should compute watchlist count', () => {
      expect(store.watchlistCount()).toBe(0);
      store.addToWatchlist('BTC');
      expect(store.watchlistCount()).toBe(1);
      store.addToWatchlist('ETH');
      expect(store.watchlistCount()).toBe(2);
    });

    it('should check if symbol is in watchlist', () => {
      store.addToWatchlist('BTC');
      expect(store.isInWatchlist('BTC')()).toBe(true);
      expect(store.isInWatchlist('ETH')()).toBe(false);
      expect(store.isInWatchlistSnapshot('BTC')).toBe(true);
      expect(store.isInWatchlistSnapshot('ETH')).toBe(false);
    });
  });

  // ========================================
  // PORTFOLIO
  // ========================================

  describe('Portfolio', () => {
    const mockSnapshot = {
      totalValue: 10000,
      change24h: 500,
      changePercent24h: 5,
      totalProfitLoss: 1000,
      lastUpdated: new Date(),
    };

    it('should update portfolio snapshot', () => {
      store.updatePortfolioSnapshot(mockSnapshot);
      expect(store.portfolioSnapshot()).toEqual(mockSnapshot);
    });

    it('should clear portfolio snapshot', () => {
      store.updatePortfolioSnapshot(mockSnapshot);
      store.clearPortfolioSnapshot();
      expect(store.portfolioSnapshot()).toBeNull();
    });

    it('should compute hasPortfolioData', () => {
      expect(store.hasPortfolioData()).toBe(false);
      store.updatePortfolioSnapshot(mockSnapshot);
      expect(store.hasPortfolioData()).toBe(true);
    });

    it('should compute isPortfolioProfitable (profit)', () => {
      const profitSnapshot = { ...mockSnapshot, totalProfitLoss: 1000 };
      store.updatePortfolioSnapshot(profitSnapshot);
      expect(store.isPortfolioProfitable()).toBe(true);
    });

    it('should compute isPortfolioProfitable (loss)', () => {
      const lossSnapshot = { ...mockSnapshot, totalProfitLoss: -500 };
      store.updatePortfolioSnapshot(lossSnapshot);
      expect(store.isPortfolioProfitable()).toBe(false);
    });

    it('should compute isPortfolioProfitable (no data)', () => {
      expect(store.isPortfolioProfitable()).toBe(false);
    });
  });

  // ========================================
  // ERROR HANDLING
  // ========================================

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully on load', () => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: () => {
            throw new Error('Storage error');
          },
        },
        writable: true,
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const newStore = TestBed.inject(AppStore);

      expect(newStore.userPreferences()).toEqual(DEFAULT_USER_PREFERENCES);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle localStorage errors gracefully on save', () => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: () => null,
          setItem: () => {
            throw new Error('Storage error');
          },
        },
        writable: true,
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      store.updateTheme('light');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

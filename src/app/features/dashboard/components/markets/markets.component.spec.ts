import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppStore } from '@app/core/store/app.store.service';
import { describe, expect, it, vi } from 'vitest';
import { CryptoAsset } from '../../models/crypto.model';
import { MarketsTableStore } from './markets-table.service';
import { MarketsComponent } from './markets.component';

describe('MarketsComponent', () => {
  let component: MarketsComponent;
  let fixture: ComponentFixture<MarketsComponent>;
  let mockTableStore: {
    paginatedAssets: ReturnType<typeof signal<CryptoAsset[]>>;
    state: ReturnType<
      typeof signal<{
        searchTerm: string;
        category: string;
        viewMode: 'list' | 'grid';
        isLoading?: boolean;
      }>
    >;
    paginationData: ReturnType<
      typeof signal<{
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
      }>
    >;
    updateSearchTerm: ReturnType<typeof vi.fn>;
    updateCategory: ReturnType<typeof vi.fn>;
    updateViewMode: ReturnType<typeof vi.fn>;
    goToPage: ReturnType<typeof vi.fn>;
    previousPage: ReturnType<typeof vi.fn>;
    nextPage: ReturnType<typeof vi.fn>;
  };
  let mockAppStore: {
    userPreferences: ReturnType<typeof signal<{ currency: string }>>;
    toggleWatchlist: ReturnType<typeof vi.fn>;
    isInWatchlistSnapshot: ReturnType<typeof vi.fn>;
  };

  const mockAssets: CryptoAsset[] = [
    {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 64230.5,
      change24h: 2.4,
      icon: '',
      iconUrl: 'https://example.com/btc.png',
      sparkline: [100, 102, 101, 103, 105],
    },
    {
      id: '2',
      name: 'Ethereum',
      symbol: 'ETH',
      price: 3450.12,
      change24h: -0.8,
      icon: '',
      iconUrl: 'https://example.com/eth.png',
      sparkline: [100, 99, 98, 97, 96],
    },
  ];

  beforeEach(async () => {
    mockTableStore = {
      paginatedAssets: signal(mockAssets),
      state: signal({
        searchTerm: '',
        category: 'all',
        viewMode: 'list' as const,
        isLoading: false,
      }),
      paginationData: signal({
        currentPage: 1,
        pageSize: 10,
        totalItems: mockAssets.length,
        totalPages: 1,
      }),
      updateSearchTerm: vi.fn(),
      updateCategory: vi.fn(),
      updateViewMode: vi.fn(),
      goToPage: vi.fn(),
      previousPage: vi.fn(),
      nextPage: vi.fn(),
    };

    mockAppStore = {
      userPreferences: signal({ currency: 'USD' }),
      toggleWatchlist: vi.fn(),
      isInWatchlistSnapshot: vi.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [MarketsComponent],
      providers: [
        { provide: MarketsTableStore, useValue: mockTableStore },
        { provide: AppStore, useValue: mockAppStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose assets from store', () => {
    expect(component.assets().length).toBe(2);
  });

  it('should delegate search input to store', () => {
    component.onSearchInput('bitcoin');
    expect(mockTableStore.updateSearchTerm).toHaveBeenCalledWith('bitcoin');
  });

  it('should delegate category selection', () => {
    component.onCategorySelect('defi');
    expect(mockTableStore.updateCategory).toHaveBeenCalledWith('defi');
  });

  it('should delegate view toggle', () => {
    component.onViewToggle('grid');
    expect(mockTableStore.updateViewMode).toHaveBeenCalledWith('grid');
  });

  it('should delegate page click', () => {
    component.onPageClick(2);
    expect(mockTableStore.goToPage).toHaveBeenCalledWith(2);
  });

  it('should delegate previous/next page', () => {
    component.onPreviousPage();
    component.onNextPage();
    expect(mockTableStore.previousPage).toHaveBeenCalled();
    expect(mockTableStore.nextPage).toHaveBeenCalled();
  });

  it('should toggle watchlist via AppStore', () => {
    component.toggleWatchlist(mockAssets[0]);
    expect(mockAppStore.toggleWatchlist).toHaveBeenCalledWith('BTC');
  });

  it('should format large numbers correctly', () => {
    expect(component.formatLargeNumber(1500000000000)).toBe('$1.50T');
    expect(component.formatLargeNumber(1500000000)).toBe('$1.50B');
    expect(component.formatLargeNumber(1500000)).toBe('$1.50M');
  });
});

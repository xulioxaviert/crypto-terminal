import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CryptoAsset } from '../../models/crypto.model';
import { MarketService } from '../../service/market.service';
import { MarketsComponent } from './markets.component';

describe('MarketsComponent', () => {
  let component: MarketsComponent;
  let fixture: ComponentFixture<MarketsComponent>;
  let mockMarketService: jasmine.SpyObj<MarketService>;

  const mockAssets: CryptoAsset[] = [
    {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 64230.5,
      change24h: 2.4,
      icon: '',
      iconUrl: 'https://example.com/btc.png',
      sparkline: [100, 102, 101, 103, 105]
    },
    {
      id: '2',
      name: 'Ethereum',
      symbol: 'ETH',
      price: 3450.12,
      change24h: -0.8,
      icon: '',
      iconUrl: 'https://example.com/eth.png',
      sparkline: [100, 99, 98, 97, 96]
    }
  ];

  beforeEach(async () => {
    mockMarketService = jasmine.createSpyObj('MarketService', ['handleImageError'], {
      assets: signal(mockAssets)
    });

    await TestBed.configureTestingModule({
      imports: [MarketsComponent],
      providers: [
        { provide: MarketService, useValue: mockMarketService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display assets from service', () => {
    expect(component.paginatedAssets().length).toBe(2);
  });

  it('should filter assets by search term', () => {
    component.onSearchChange('bitcoin');
    expect(component.filteredAssets().length).toBe(1);
    expect(component.filteredAssets()[0].name).toBe('Bitcoin');
  });

  it('should reset to first page when searching', () => {
    component.currentPage.set(2);
    component.onSearchChange('btc');
    expect(component.currentPage()).toBe(1);
  });

  it('should navigate pages correctly', () => {
    component.goToPage(2);
    expect(component.currentPage()).toBe(2);

    component.nextPage();
    expect(component.currentPage()).toBe(3);

    component.previousPage();
    expect(component.currentPage()).toBe(2);
  });

  it('should not exceed page boundaries', () => {
    component.currentPage.set(1);
    component.previousPage();
    expect(component.currentPage()).toBe(1);
  });

  it('should toggle view mode', () => {
    expect(component.viewMode()).toBe('list');
    component.toggleView('grid');
    expect(component.viewMode()).toBe('grid');
  });

  it('should format large numbers correctly', () => {
    expect(component.formatLargeNumber(1500000000000)).toBe('$1.50T');
    expect(component.formatLargeNumber(1500000000)).toBe('$1.50B');
    expect(component.formatLargeNumber(1500000)).toBe('$1.50M');
  });
});

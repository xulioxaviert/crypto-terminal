import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CryptoAsset } from '../../models/crypto.model';
import { MarketService } from '../../service/market.service';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-markets',
  imports: [CommonModule, LucideAngularModule, ChartComponent, NgOptimizedImage, FormsModule],
  standalone: true,
  templateUrl: './markets.component.html',
  styleUrl: './markets.component.scss',
})
export class MarketsComponent {
  protected marketService = inject(MarketService);

  // Signals públicos desde el servicio (solo lectura)
  assets = this.marketService.paginatedAssets;
  state = this.marketService.marketsTableState;
  pagination = this.marketService.paginationData;

  // Métodos de presentación (delegan al servicio)
  onSearchInput(term: string): void {
    this.marketService.updateSearchTerm(term);
  }

  onCategorySelect(category: string): void {
    this.marketService.updateCategory(category);
  }

  onViewToggle(mode: 'list' | 'grid'): void {
    this.marketService.updateViewMode(mode);
  }

  onPageClick(page: number | string): void {
    if (typeof page === 'number') {
      this.marketService.goToPage(page);
    }
  }

  onPreviousPage(): void {
    this.marketService.previousPage();
  }

  onNextPage(): void {
    this.marketService.nextPage();
  }

  onTrade(asset: CryptoAsset): void {
    console.log('Trading', asset.symbol);
    // TODO: Implementar navegación o modal de trade
  }

  onImageError(event: Event): void {
    this.marketService.handleImageError(event);
  }

  // Helper puro para formateo
  formatLargeNumber(value: number): string {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  }
}

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { formatLargeNumber } from '../../../../shared/utils/currency-formatter';
import { handleCryptoImageError } from '../../../../shared/utils/image-fallback';
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

  // Helpers puros importados
  formatLargeNumber = formatLargeNumber;
  handleImageError = handleCryptoImageError;

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
}

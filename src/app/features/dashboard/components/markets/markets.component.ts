import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ChartComponent } from '../../../../shared/components/chart/chart.component';
import { formatLargeNumber } from '../../../../shared/utils/currency-formatter';
import { handleCryptoImageError } from '../../../../shared/utils/image-fallback';
import { CryptoAsset } from '../../models/crypto.model';
import { MarketsTableStore } from './markets-table.service';

@Component({
  selector: 'app-markets',
  imports: [CommonModule, LucideAngularModule, ChartComponent, NgOptimizedImage, FormsModule],
  standalone: true,
  templateUrl: './markets.component.html',
  styleUrl: './markets.component.scss',
})
export class MarketsComponent {
  private readonly tableStore = inject(MarketsTableStore);

  // Signals públicos desde el store (solo lectura)
  assets = this.tableStore.paginatedAssets;
  state = this.tableStore.state;
  pagination = this.tableStore.paginationData;

  // Helpers puros importados
  formatLargeNumber = formatLargeNumber;
  handleImageError = handleCryptoImageError;

  // Métodos de presentación (delegan al store)
  onSearchInput(term: string): void {
    this.tableStore.updateSearchTerm(term);
  }

  onCategorySelect(category: string): void {
    this.tableStore.updateCategory(category);
  }

  onViewToggle(mode: 'list' | 'grid'): void {
    this.tableStore.updateViewMode(mode);
  }

  onPageClick(page: number | string): void {
    if (typeof page === 'number') {
      this.tableStore.goToPage(page);
    }
  }

  onPreviousPage(): void {
    this.tableStore.previousPage();
  }

  onNextPage(): void {
    this.tableStore.nextPage();
  }

  onTrade(asset: CryptoAsset): void {
    console.log('Trading', asset.symbol);
    // TODO: Implementar navegación o modal de trade
  }
}

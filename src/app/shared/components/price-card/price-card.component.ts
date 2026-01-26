import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { AppStore } from '@app/core/store/app.store.service';
import { CryptoAsset } from '@app/features/dashboard/models/crypto.model';
import { ChartComponent } from "@app/shared/components/chart/chart.component";
import { handleCryptoImageError } from '@app/shared/utils/image-fallback';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-price-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, LucideAngularModule, ChartComponent, NgOptimizedImage],
  templateUrl: './price-card.component.html',
})
export class PriceCardComponent {
  private appStore = inject(AppStore);

  // Signal Input: Ultra eficiente y tipado
  asset = input.required<CryptoAsset>();

  // Computed Signal: Lógica derivada para el color
  isPositive = computed(() => this.asset().change24h >= 0);

  // Currency based on user preference
  currencyCode = computed(() => this.appStore.userPreferences().currency);

  // Watchlist state for this asset
  inWatchlist = computed(() =>
    this.appStore.isInWatchlistSnapshot(this.asset().symbol)
  );

  // Helper puro importado
  handleImageError = handleCryptoImageError;

  toggleWatchlist(): void {
    this.appStore.toggleWatchlist(this.asset().symbol);
  }
}

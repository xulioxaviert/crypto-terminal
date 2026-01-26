import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { handleCryptoImageError } from '../../../../shared/utils/image-fallback';
import { CryptoAsset } from '../../models/crypto.model';
import { MarketService } from '../../service/market.service';
import { ChartComponent } from "../chart/chart.component";

@Component({
  selector: 'app-price-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, LucideAngularModule, ChartComponent, NgOptimizedImage],
  templateUrl: './price-card.component.html',
})
export class PriceCardComponent {
  private marketService = inject(MarketService);

  // Signal Input: Ultra eficiente y tipado
  asset = input.required<CryptoAsset>();

  // Computed Signal: Lógica derivada para el color
  isPositive = computed(() => this.asset().change24h >= 0);

  // Helper puro importado
  handleImageError = handleCryptoImageError;
}

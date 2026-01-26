import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CryptoAsset } from '../../../features/dashboard/models/crypto.model';
import { MarketService } from '../../../features/dashboard/service/market.service';
import { handleCryptoImageError } from '../../utils/image-fallback';
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

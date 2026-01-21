import { Component, computed, inject, input } from '@angular/core';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { CryptoAsset } from '../../models/crypto.model';
import { LucideAngularModule } from 'lucide-angular';
import { ChartComponent } from "../chart/chart.component";
import { MarketService } from '../../service/market.service';

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

  // Método para manejo de errores de imagen
  onImageError(event: Event): void {
    this.marketService.handleImageError(event);
  }
}

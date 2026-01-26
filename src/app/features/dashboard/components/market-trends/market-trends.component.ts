import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { handleCryptoImageError } from '../../../../shared/utils/image-fallback';
import { CryptoAsset } from '../../models/crypto.model';
import { MarketService } from '../../service/market.service';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-market-trends',
  imports: [CommonModule, LucideAngularModule, ChartComponent, NgOptimizedImage],
  standalone: true,
  templateUrl: './market-trends.component.html',
  styleUrl: './market-trends.component.scss',
})
export class MarketTrendsComponent {
  private market = inject(MarketService);
  asset = input.required<CryptoAsset>();

  // Trends se deriva de los assets del servicio
  public trends = this.market.assets;

  // Helper puro importado
  handleImageError = handleCryptoImageError;
}

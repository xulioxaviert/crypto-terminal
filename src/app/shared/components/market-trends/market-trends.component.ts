import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { CryptoAsset } from '@app/features/dashboard/models/crypto.model';
import { MarketService } from '@app/features/dashboard/service/market.service';
import { ChartComponent } from '@app/shared/components/chart/chart.component';
import { handleCryptoImageError } from '@app/shared/utils/image-fallback';
import { LucideAngularModule } from 'lucide-angular';

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

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { MarketTrend } from '../../models/market-trend.model';
import { LucideAngularModule } from 'lucide-angular';
import { ChartComponent } from '../chart/chart.component';
import { MarketService } from '../../service/market.service';
import { CryptoAsset } from '../../models/crypto.model';

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
  // trends se deriva de los assets del servicio
  public trends = this.market.assets;
  onImageError(event: Event): void {
    this.market.handleImageError(event);
  }
}

import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MarketTrend } from '../../models/market-trend.model';
import { LucideAngularModule } from 'lucide-angular';
import { PortfolioAnalyticsComponent } from "../portfolio-analytics/portfolio-analytics.component";

@Component({
  selector: 'app-market-trends',
  imports: [CommonModule, LucideAngularModule, PortfolioAnalyticsComponent],
  standalone: true,
  templateUrl: './market-trends.component.html',
  styleUrl: './market-trends.component.scss',
})
export class MarketTrendsComponent {
  public trends = signal<MarketTrend[]>([
    {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: 'bitcoin',
      lastPrice: 100000,
      change24h: 0.01,
      marketCap: 1000000000,
      volume24h: 1000000,
      sparklineData: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
    },
  ]);
}

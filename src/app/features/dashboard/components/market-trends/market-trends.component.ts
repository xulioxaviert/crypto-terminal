import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MarketTrend } from '../../models/market-trend.model';
import { LucideAngularModule } from 'lucide-angular';
import { ChartComponent } from "../chart/chart.component";
import { MarketService } from '../../service/market.service';

@Component({
  selector: 'app-market-trends',
  imports: [CommonModule, LucideAngularModule, ChartComponent],
  standalone: true,
  templateUrl: './market-trends.component.html',
  styleUrl: './market-trends.component.scss',
})
export class MarketTrendsComponent {

  private market = inject(MarketService);

  // trends se deriva de los assets del servicio
  public trends = this.market.assets;
}

import { Component, inject, input } from '@angular/core';
import { ChartDataService } from '../../service/chart-data.service';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-portfolio-analytics',
  imports: [NgApexchartsModule],
  templateUrl: './portfolio-analytics.component.html',
  styleUrl: './portfolio-analytics.component.scss',
  standalone: true,
})
export class PortfolioAnalyticsComponent {
  private chartDataService = inject(ChartDataService);

  height = input<number>(20);
  chartData = input<number[]>();
  color = input<string>('#10b981');

  chartAnalyticsViewModel = this.chartDataService.createPortfolioAnalyticsViewModel({
    height: this.height,
    chartData: this.chartData,
    color: this.color,
  });
}

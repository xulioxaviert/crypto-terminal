import { Component, inject, input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartDataService } from '../../service/chart-data.service';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent {
  private chartDataService = inject(ChartDataService);

  height = input<number>(64);
  chartData = input<number[]>();
  color = input<string>('#10b981');
  type = input<'area' | 'line' | 'bar'>('area');

  vm = this.chartDataService.createChartViewModel({
    height: this.height,
    chartData: this.chartData,
    color: this.color,
    type: this.type,
  });
}

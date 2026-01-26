import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ChartDataService } from '@app/features/dashboard/service/chart-data.service';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent {
  private chartDataService = inject(ChartDataService);

  height = input<number>(64);
  chartData = input<number[]>();
  color = input<string>('#10b981');
  type = input<'area' | 'line' | 'bar'>('area');
  xAxis = input<boolean>(true);
  yAxis = input<boolean>(true);

  vm = this.chartDataService.createChartViewModel({
    height: this.height,
    chartData: this.chartData,
    color: this.color,
    type: this.type,
    xAxis: this.xAxis,
    yAxis: this.yAxis,
  });
}

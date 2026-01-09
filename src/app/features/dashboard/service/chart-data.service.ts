import { computed, Injectable, Signal } from '@angular/core';
import { ApexAxisChartSeries, ApexOptions } from 'ng-apexcharts';

@Injectable({
  providedIn: 'root',
})
export class ChartDataService {
  private readonly fallbackSeries = Array(24).fill(50);
  private readonly fallbackColor = '#10b981';

  createChartViewModel(params: {
    height: Signal<number>;
    chartData: Signal<number[] | undefined>;
    color: Signal<string>;
    type?: Signal<'area' | 'line' | 'bar'>;
  }) {
    const hasData = computed(() => {
      const customData = params.chartData();
      return !!customData && customData.length > 0 && customData.some((val) => val !== 0);
    });

    const displayColor = computed(() => (hasData() ? params.color() : this.fallbackColor));

    const chartType = computed(() => params.type?.() ?? 'area');

    const series = computed<ApexAxisChartSeries>(() => {
      const customData = params.chartData();
      if (customData && customData.length > 0) {
        return [{ name: 'Price', data: customData }];
      }
      return [{ name: 'Price', data: this.fallbackSeries }];
    });

    const chartConfig = computed<ApexOptions>(() => ({
      chart: {
        type: chartType(),
        height: params.height(),
        toolbar: { show: false },
        animations: { enabled: true },
        sparkline: { enabled: true },
        background: 'transparent', // Fondo transparente
      },
      stroke: { curve: 'smooth', width: 2, colors: [displayColor()] },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 100],
          colorStops: [
            { offset: 0, color: displayColor(), opacity: 0.4 },
            { offset: 100, color: displayColor(), opacity: 0.1 },
          ],
        },
      },
      grid: { show: false, borderColor: 'transparent', row: { colors: ['transparent'] } },
      xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { show: false } },
      tooltip: {
        theme: 'dark',
        x: { show: false },
        y: {
          formatter: (val: number) => `$${val.toFixed(2)}`,
        },
      },
    }));

    return { hasData, displayColor, series, chartConfig, chartType };
  }
}

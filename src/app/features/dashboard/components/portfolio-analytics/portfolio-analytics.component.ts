import { Component, computed, inject, input, signal } from '@angular/core';
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

  // Inputs opcionales para personalizar el gráfico
  height = input<number>(20);
  chartData = input<number[]>();
  color = input<string>('#10b981'); // crypto-neon por defecto

  selectedPeriod = signal('1W');

  // Detectar si los datos están vacíos/cero para mostrar verde
  hasData = computed(() => {
    const customData = this.chartData();
    return customData && customData.length > 0 && customData.some(val => val !== 0);
  });

  // Color dinámico: siempre verde si no hay datos o son cero
  displayColor = computed(() => {
    return this.hasData() ? this.color() : '#10b981';
  });

  // Series: usar chartData si está disponible, sino los datos del servicio
  series = computed(() => {
    const customData = this.chartData();
    if (customData && customData.length > 0) {
      return [{ name: 'Price', data: customData }];
    }
    // Si no hay datos, mostrar línea horizontal
    return [{ name: 'Price', data: Array(24).fill(50) }];
  });

  //Configuración dinámica del gráfico
  chartConfig = computed(() => ({
    chart: {
      type: 'area' as const,
      height: this.height(),
      toolbar: { show: false },
      animations: { enabled: true },
      sparkline: { enabled: true } // Mejor para gráficos pequeños
    },
    stroke: { curve: 'smooth' as const, width: 2, colors: [this.displayColor()] },
    fill: {
      type: 'gradient' as const,
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
        colorStops: [
          {
            offset: 0,
            color: this.displayColor(),
            opacity: 0.4
          },
          {
            offset: 100,
            color: this.displayColor(),
            opacity: 0.1
          }
        ]
      },
    },
    grid: { show: false },
    xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { show: false } },
    tooltip: {
      theme: 'dark' as const,
      x: { show: false },
      y: {
        formatter: (val: number) => `$${val.toFixed(2)}`
      }
    },
  }));
}

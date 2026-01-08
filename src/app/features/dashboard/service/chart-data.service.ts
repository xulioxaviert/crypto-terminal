import { computed, inject, Injectable } from '@angular/core';
import { MarketService } from './market.service';

@Injectable({
  providedIn: 'root',
})
export class ChartDataService {
  private marketService = inject(MarketService);

  //Simulamos la obtención de datos históricos para un asset específico
  public readonly portfolioSeries = computed(() => {
    const assets = this.marketService.assets();
    return [{
      name: 'Portfolio Value',
      data: [
       -2.14,

      ] // Datos simulados,
    }];
  });
}

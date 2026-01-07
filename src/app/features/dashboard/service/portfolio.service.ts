import { computed, inject, Injectable, signal } from '@angular/core';
import { MarketService } from './market.service';
import { PortfolioSummary, UserHolding } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {

  private marketService = inject(MarketService);

  //Simulamos la obtención del portafolio de usuario
  private readonly holding = signal<UserHolding[]> ([
    { symbol: 'BTC', amount: 1.5 },
    { symbol: 'ETH', amount: 10 },
    { symbol: 'SOL', amount: 50 },
    { symbol: 'DOGE', amount: 1000 },
  ]);

  //Calculamos el valor total del portafolio del usuario
  //Si el precio de mercado cambia, el valor total del portafolio también cambia

  public readonly summary = computed<PortfolioSummary>(() => {
    const prices = this.marketService.assets()
    let total = 0;
    //Recorremos el portafolio y calculamos el valor total
    this.holding().forEach((holding) => {
      const asset = prices.find(a => a.symbol === holding.symbol);
      if (asset) {
        total += asset.price * holding.amount;
      }
    })
    //Retornamos el resumen del portafolio
    return {
      totalValue: total,
      change24h: 0, // Placeholder for 24h change calculation
      changePercentage: 0 // Placeholder for percentage change calculation
    };
  })

}

// features/dashboard/dashboard.component.ts
import { Component, inject } from '@angular/core';
import { PriceCardComponent } from './components/price-card/price-card.component';
import { MarketService } from './service/market.service';
import { PortfolioHeroComponent } from "./components/portfolio-hero/portfolio-hero.component";
import { MarketTrendsComponent } from "./components/market-trends/market-trends.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PriceCardComponent, MarketTrendsComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  // 🎯 MEJOR PRÁCTICA: El componente solo consume signals del servicio
  // No hay effect(), no hay lógica de transformación
  // El servicio gestiona todo el estado reactivo con computed()

  private marketService = inject(MarketService);

  // Signal reactivo que se actualiza automáticamente
  assets = this.marketService.userAssets;
}

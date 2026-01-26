// features/dashboard/dashboard.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MarketTrendsComponent } from '@app/shared/components/market-trends/market-trends.component';
import { PriceCardComponent } from '@app/shared/components/price-card/price-card.component';
import { LucideAngularModule } from 'lucide-angular';
import { MarketService } from './service/market.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PriceCardComponent, MarketTrendsComponent, CommonModule, LucideAngularModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  // MEJOR PRÁCTICA: El componente solo consume signals del servicio
  // No hay effect(), no hay lógica de transformación
  // El servicio gestiona todo el estado reactivo con computed()

  private marketService = inject(MarketService);

  // Signal reactivo que se actualiza automáticamente
  assets = this.marketService.userAssets;
}

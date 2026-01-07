// features/dashboard/dashboard.component.ts
import { Component, inject } from '@angular/core';
import { PriceCardComponent } from './components/price-card/price-card.component';
import { MarketService } from './service/market.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PriceCardComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  // 🎯 MEJOR PRÁCTICA: El componente solo consume signals del servicio
  // No hay effect(), no hay lógica de transformación
  // El servicio gestiona todo el estado reactivo con computed()

  private marketService = inject(MarketService);

  // Signal reactivo que se actualiza automáticamente
  assets = this.marketService.assets;
}

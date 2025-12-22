// features/dashboard/dashboard.component.ts
import { Component, signal } from '@angular/core';
import { PriceCardComponent } from './components/price-card/price-card.component';
import { CryptoAsset } from './models/crypto.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PriceCardComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  // ✅ Signal con datos mock para empezar (luego vendrán de un Service)
  assets = signal<CryptoAsset[]>([
    { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 68450, change24h: 4.5, icon: '' , sparkline: []},
    { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3450.12, change24h: -1.2, icon: '', sparkline: [] },
    { id: '3', name: 'Solana', symbol: 'SOL', price: 145.20, change24h: 8.2, icon: '', sparkline: [] },
    { id: '4', name: 'Dogecoin', symbol: 'DOGE', price: 0.12, change24h: 0.5, icon: '', sparkline: [] }
  ]);
}

import { Component, computed, input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CryptoAsset } from '../../models/crypto.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-price-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, LucideAngularModule],
  templateUrl: './price-card.component.html',
})
export class PriceCardComponent {
  // ✅ Signal Input: Ultra eficiente y tipado
  asset = input.required<CryptoAsset>();

  // ✅ Computed Signal: Lógica derivada para el color
  isPositive = computed(() => this.asset().change24h >= 0);
}

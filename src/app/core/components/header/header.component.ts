import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { AppStore } from '@app/core/store/app.store.service';
import { HeaderSearchComponente } from '@app/features/dashboard/components/header-search/header-search.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HeaderSearchComponente, CommonModule, LucideAngularModule],
  templateUrl: './header.componente.html',
  styles: ``,
})
export class HeaderComponent {
  private readonly appStore = inject(AppStore);

  preferences = this.appStore.userPreferences;
  watchlistCount = this.appStore.watchlistCount;

  //TODO: el título vendría de un servicio BreadcrumbService
  currentRoute = { parent: 'Dashboard', child: 'Live Data' };

  themeLabel = computed(() => {
    const theme = this.preferences().theme;
    if (theme === 'auto') return 'Auto';
    return theme === 'dark' ? 'Dark' : 'Light';
  });

  themeIcon = computed(() => {
    const theme = this.preferences().theme;
    if (theme === 'auto') return 'sun-moon';
    return theme === 'dark' ? 'moon-star' : 'sun';
  });

  cycleTheme(): void {
    const order: Array<'dark' | 'light' | 'auto'> = ['dark', 'light', 'auto'];
    const currentIndex = order.indexOf(this.preferences().theme);
    const next = order[(currentIndex + 1) % order.length];
    this.appStore.updateTheme(next);
  }

  onCurrencyChange(currency: 'USD' | 'EUR' | 'GBP' | 'JPY'): void {
    this.appStore.updateCurrency(currency);
  }
}

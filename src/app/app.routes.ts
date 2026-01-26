import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./features/dashboard/components/portfolio-hero/portfolio-hero.component').then(m => m.PortfolioHeroComponent),
  },
  {
    path: 'markets',
    loadComponent: () => import('./features/dashboard/components/markets/markets.component').then(m => m.MarketsComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/dashboard/components/settings-component/settings-component').then(m => m.SettingsComponent),
  },
  {
    path: 'wallets',
    loadComponent: () => import('./features/dashboard/components/wallets/wallets-component').then(m => m.WalletsComponent),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];

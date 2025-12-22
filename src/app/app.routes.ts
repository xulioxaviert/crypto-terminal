import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    // Usamos loadComponent para carga perezosa con Angular 20 Zoneless
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  }
];

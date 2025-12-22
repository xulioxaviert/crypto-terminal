import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Definimos una interfaz para mantener el tipado fuerte (Clean Code)
interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true, // Estándar en Angular 20
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  // ✅ Usamos un Signal para los ítems del menú.
  // En versiones legacy usarías un array simple o un Observable.
  readonly menuItems = signal<MenuItem[]>([
    { label: 'Dashboard', icon: 'lucide-layout-grid', route: '/dashboard' },
    { label: 'Markets', icon: 'lucide-trending-up', route: '/markets' },
    { label: 'Portfolio', icon: 'lucide-wallet', route: '/portfolio' },
    { label: 'Activity', icon: 'lucide-history', route: '/activity' },
    { label: 'Settings', icon: 'lucide-settings', route: '/settings' },
  ]);

  // Señal para el usuario (simulando datos que vendrían de un servicio)
  readonly currentUser = signal({
    name: 'John Doe',
    role: 'Pro Account',
    avatar: 'assets/avatar.png'
  });

  constructor() {
    // Aquí podrías inyectar un servicio de Auth para llenar currentUser
  }
}

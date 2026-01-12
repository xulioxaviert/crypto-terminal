import { Component } from '@angular/core';
import { HeaderSearchComponente } from '../../../features/dashboard/components/header-search/header-search.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HeaderSearchComponente, CommonModule, LucideAngularModule],
  templateUrl: './header.componente.html',
  styles: ``,
})
export class HeaderComponent {
  //TODO: el título vendría de un servicio BreadcrumbService
  currentRoute = {parent: 'Dashboard', child: 'Live Data'}
}

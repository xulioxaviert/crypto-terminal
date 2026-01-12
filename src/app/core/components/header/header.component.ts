import { Component } from '@angular/core';
import { HeaderSearchComponente } from '../../../features/dashboard/components/header-search/header-search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HeaderSearchComponente],
  templateUrl: './header.componente.html',
  styles: ``,
})
export class HeaderComponent {}

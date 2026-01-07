import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../service/portfolio.service';
import { CurrencyPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-portfolio-hero',
  imports: [CurrencyPipe, LucideAngularModule],
  templateUrl: './portfolio-hero.component.html',
  styleUrl: './portfolio-hero.component.html',
})
export class PortfolioHeroComponent {
  private readonly portfolioService = inject(PortfolioService);

  public readonly summary = this.portfolioService.summary;
}

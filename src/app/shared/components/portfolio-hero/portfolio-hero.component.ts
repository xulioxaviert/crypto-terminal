import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PortfolioService } from '@app/features/dashboard/service/portfolio.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-portfolio-hero',
  imports: [CurrencyPipe, LucideAngularModule, CommonModule],
  templateUrl: './portfolio-hero.component.html',
  styleUrl: './portfolio-hero.component.html',
})
export class PortfolioHeroComponent {
  private readonly portfolioService = inject(PortfolioService);

  public readonly summary = this.portfolioService.summary;
}

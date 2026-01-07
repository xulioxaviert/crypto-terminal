//Creamos los modelos para el portafolio de usuario

export interface UserHolding {
  readonly symbol: string;
  readonly amount: number;
}

export interface PortfolioSummary {
  readonly totalValue: number;
  readonly change24h: number;
  readonly changePercentage: number;
}

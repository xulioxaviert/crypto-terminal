export interface CryptoAsset {
  readonly id: string;
  readonly name: string;
  readonly symbol: string;
  readonly price: number;
  readonly change24h: number;
  readonly icon: string;
  readonly sparkline: number[]; // Para el mini-gráfico (opcional por ahora)
}

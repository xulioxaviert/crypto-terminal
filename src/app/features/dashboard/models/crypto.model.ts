export interface CryptoAsset {
  readonly id: string;
  readonly name: string;
  readonly symbol: string;
  readonly price: number;
  readonly change24h: number;
  readonly icon: string;
  readonly iconUrl: string;
  readonly sparkline: number[]; 
}

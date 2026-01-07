import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { API_CONFIG } from '../../../core/config/api.config';
import { ENDPOINTS } from '../../../core/config/endpoints.config';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, map, retry, throttleTime, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CryptoAsset } from '../models/crypto.model';
import { BinanceTickerData, PriceUpdate } from '../models/binance.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  private readonly BASE_URL = API_CONFIG.binance.baseUrl;
  private readonly http = inject(HttpClient);

  // 📊 Configuración de assets a monitorear
  private readonly TRACKED_ASSETS = ['btcusdt', 'ethusdt', 'solusdt', 'dogeusdt'] as const;
  private readonly WS_URL = `${ENDPOINTS.ws_url}/${this.TRACKED_ASSETS.map(s => `${s}@ticker`).join('/')}`;

  // 🔌 WebSocket stream con tipado y manejo de errores
  private readonly marketStream$ = webSocket<BinanceTickerData>(this.WS_URL).pipe(
    throttleTime(100), // Anti-saturación: 10 updates/segundo máx
    map((data) => this.transformBinanceData(data)),
    retry({ delay: 3000 }), // Reconexión automática
    catchError((error) => {
      console.error('❌ WebSocket error:', error);
      return of(null); // Retorna null en caso de error
    })
  );

  // 📡 Signal público del stream (puede ser undefined)
  public readonly livePriceUpdate = toSignal(this.marketStream$);

  // 🗺️ Estado central: Map para búsquedas O(1)
  private readonly assetsMap = signal<Map<string, CryptoAsset>>(
    this.initializeAssets()
  );

  // 📊 Signal derivado público (solo lectura)
  public readonly assets = computed(() =>
    Array.from(this.assetsMap().values())
  );

  constructor() {
    // ⚡ Effect para sincronizar WebSocket → Estado
    effect(() => {
      const update = this.livePriceUpdate();
      if (update) {
        this.updateAssetPrice(update);
      }
    });
  }

  // 🏗️ Inicialización de assets con estructura completa
  private initializeAssets(): Map<string, CryptoAsset> {
    const assetConfig: Array<{ symbol: string; name: string; id: string }> = [
      { id: '1', symbol: 'BTC', name: 'Bitcoin' },
      { id: '2', symbol: 'ETH', name: 'Ethereum' },
      { id: '3', symbol: 'SOL', name: 'Solana' },
      { id: '4', symbol: 'DOGE', name: 'Dogecoin' }
    ];

    return new Map(
      assetConfig.map(({ id, symbol, name }) => [
        symbol,
        { id, name, symbol, price: 0, change24h: 0, icon: '', sparkline: [] }
      ])
    );
  }

  // 🔄 Transformación de datos de Binance
  private transformBinanceData(data: BinanceTickerData): PriceUpdate {
    return {
      symbol: data.s.replace('USDT', ''),
      price: parseFloat(data.c),
      change: parseFloat(data.P)
    };
  }

  // ✏️ Actualización inmutable del estado
  private updateAssetPrice(update: PriceUpdate): void {
    this.assetsMap.update(currentMap => {
      const asset = currentMap.get(update.symbol);
      if (!asset) return currentMap;

      // Crear nuevo Map con el asset actualizado
      const newMap = new Map(currentMap);
      newMap.set(update.symbol, {
        ...asset,
        price: update.price,
        change24h: update.change
      });

      return newMap;
    });
  }

  // 📡 API REST methods

  /** Obtiene el precio de todas las criptomonedas */
  getAllPrice() {
    return this.http.get(`${this.BASE_URL}${ENDPOINTS.price}`);
  }

  /** Obtiene el precio de una criptomoneda específica por símbolo */
  getPriceBySymbol(symbol: string) {
    return this.http.get(`${this.BASE_URL}${ENDPOINTS.price}?symbol=${symbol}`);
  }
}

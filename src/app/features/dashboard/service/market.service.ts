import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { API_CONFIG } from '../../../core/config/api.config';
import { ENDPOINTS } from '../../../core/config/endpoints.config';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, map, retry, throttleTime, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CryptoAsset } from '../models/crypto.model';
import { BinanceTickerData, BinanceKline, PriceUpdate } from '../models/binance.model';
import { of, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  private readonly BASE_URL = API_CONFIG.binance.baseUrl;
  private readonly http = inject(HttpClient);
  private readonly ICON_BASE_URL = ENDPOINTS.ICON_BASE_URL;

  // 📊 Configuración de assets a monitorear
  private readonly TRACKED_ASSETS = [
    'btcusdt', 'ethusdt', 'solusdt', 'dogeusdt', 'dotusdt', 'adausdt',
    'xrpusdt', 'bnbusdt', 'maticusdt', 'ltcusdt'
  ] as const;
  private readonly WS_URL = `${ENDPOINTS.ws_url}/${this.TRACKED_ASSETS.map(s => `${s}@ticker`).join('/')}`;

  // 🔌 WebSocket stream con tipado y manejo de errores
  private readonly marketStream$ = webSocket<BinanceTickerData>(this.WS_URL).pipe(
    throttleTime(100),
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
  // Todos los assets (para la tabla de tendencias)
  public readonly assets = computed(() =>
    Array.from(this.assetsMap().values())
  );

  // Solo 6 assets principales para el usuario (puedes ajustar el criterio de selección)
  public readonly userAssets = computed(() =>
    Array.from(this.assetsMap().values()).slice(0, 6)
  );

  constructor() {
    // ⚡ Cargar datos históricos del sparkline
    this.loadSparklineData();

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
    const assetConfig: Array<{ symbol: string; name: string; id: string; basePrice: number }> = [
      { id: '1', symbol: 'BTC', name: 'Bitcoin', basePrice: 68000 },
      { id: '2', symbol: 'ETH', name: 'Ethereum', basePrice: 3800 },
      { id: '3', symbol: 'SOL', name: 'Solana', basePrice: 150 },
      { id: '4', symbol: 'DOGE', name: 'Dogecoin', basePrice: 0.18 },
      { id: '5', symbol: 'DOT', name: 'Polkadot', basePrice: 8.5 },
      { id: '6', symbol: 'ADA', name: 'Cardano', basePrice: 0.65 },
      { id: '7', symbol: 'XRP', name: 'Ripple', basePrice: 0.55 },
      { id: '8', symbol: 'BNB', name: 'Binance Coin', basePrice: 320 },
      { id: '9', symbol: 'MATIC', name: 'Polygon', basePrice: 0.85 },
      { id: '10', symbol: 'LTC', name: 'Litecoin', basePrice: 75 },
    ];

    return new Map(
      assetConfig.map(({ id, symbol, name, basePrice }) => [
        symbol,
        {
          id,
          name,
          symbol,
          price: basePrice,
          change24h: 0,
          icon: '',
          iconUrl: `${this.ICON_BASE_URL}${symbol.toLowerCase()}.png`,
          sparkline: [] // Se cargará con datos reales
        }
      ])
    );
  }

  // 📈 Cargar datos históricos del sparkline desde Binance
  private loadSparklineData(): void {
    const symbols = [
      'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'DOGEUSDT', 'DOTUSDT', 'ADAUSDT',
      'XRPUSDT', 'BNBUSDT', 'MATICUSDT', 'LTCUSDT'
    ];

    // Crear requests para cada símbolo
    const requests = symbols.map(symbol =>
      this.http.get<BinanceKline[]>(
        `${this.BASE_URL}/klines`,
        {
          params: {
            symbol,
            interval: '1h',  // Velas de 1 hora
            limit: '24'       // Últimas 24 horas
          }
        }
      )
    );

    // Ejecutar todas las peticiones en paralelo
    forkJoin(requests).subscribe({
      next: (results) => {
        results.forEach((klines, index) => {
          const symbol = symbols[index].replace('USDT', '');
          const sparklineData = klines.map(kline => parseFloat(kline[4])); // [4] es el precio de cierre

          this.assetsMap.update(currentMap => {
            const asset = currentMap.get(symbol);
            if (!asset) return currentMap;

            const newMap = new Map(currentMap);
            newMap.set(symbol, {
              ...asset,
              sparkline: sparklineData
            });
            return newMap;
          });
        });
      },
      error: (error) => {
        console.error('❌ Error cargando sparkline data:', error);
      }
    });
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

      // Actualizar sparkline: añadir nuevo precio y mantener últimos 24 valores
      const updatedSparkline = [...asset.sparkline.slice(-23), update.price];

      // Crear nuevo Map con el asset actualizado
      const newMap = new Map(currentMap);
      newMap.set(update.symbol, {
        ...asset,
        price: update.price,
        change24h: update.change,
        sparkline: updatedSparkline
      });

      return newMap;
    });
  }

  /**
   * Maneja errores de carga de imágenes proporcionando un fallback.
   * Siguiendo Clean Code, el nombre es descriptivo de su intención.
   */
  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;

    // 🛡️ Evitamos un bucle infinito si la imagen genérica también falla
    const fallbackSrc = 'assets/icons/crypto/generic.svg';

    if (target.src !== fallbackSrc) {
      target.src = fallbackSrc;
    }
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

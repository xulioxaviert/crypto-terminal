import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONFIG } from '../../../core/config/api.config';
import { ENDPOINTS } from '../../../core/config/endpoints.config';
import { webSocket } from 'rxjs/webSocket';
import { delay, map, retry, throttleTime } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  // Endpoint público base URL for Binance API
  private readonly BASE_URL = API_CONFIG.binance.baseUrl;
  private http = inject(HttpClient);

  // Url de Binance API
  private readonly WS_URL = `${ENDPOINTS.ws_url}/btcusdt@ticker/ethusdt@ticker/solusdt@ticker/dogeusdt@ticker`;

  constructor() {}

  //Motor de conexión WebSocket y lo almacenamos en un signal
  private marketStream$ = webSocket(this.WS_URL).pipe(
    //100ms de pausa para no saturar el renderizado
    throttleTime(100),
    map((data: any) => ({
      symbol: data.s,
      priceChangePercent: data.P,
      lastPrice: data.c,
      highPrice: data.h,
      lowPrice: data.l,
      volume: data.v,
    })),
    //reconexión automática en caso de fallo.
    retry({ delay: 3000 })
  );

  //Exponemos el stream para que otros componentes puedan suscribirse
  public livePriceUpdate = toSignal(this.marketStream$);

  //Obtenemos precio de todas las criptomonedas
  getAllPrice() {
    return this.http.get(`${this.BASE_URL}/ticker/price`);
  }
  //Obtenemos precio de una criptomoneda por su símbolo
  getPriceBySymbol(symbol: string) {
    return this.http.get(`${this.BASE_URL}/ticker/price?symbol=${symbol}`);
  }
}

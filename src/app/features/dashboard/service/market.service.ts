import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../core/config/api.config';

@Injectable({
  providedIn: 'root',
})

export class MarketService {
  // Endpoint público base URL for Binance API
  private readonly BASE_URL = API_CONFIG.binance.baseUrl;

  constructor(private http: HttpClient) {}

  //Obtenemos precio de todas las criptomonedas
  getAllPrice() {
    return this.http.get(`${this.BASE_URL}/ticker/price`);
  }
  //Obtenemos precio de una criptomoneda por su símbolo
  getPriceBySymbol(symbol: string) {
    return this.http.get(`${this.BASE_URL}/ticker/price?symbol=${symbol}`);
  }
  
}

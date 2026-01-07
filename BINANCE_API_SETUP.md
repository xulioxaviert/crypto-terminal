# Guía de Configuración de Binance API

## Información General

### Endpoints Base Disponibles
Binance ofrece varios endpoints que puedes usar según tu ubicación y necesidades:
- **Principal**: `https://api.binance.com`
- **GCP (Google Cloud)**: `https://api-gcp.binance.com`
- **Alternativas** (mejor rendimiento, menos estabilidad):
  - `https://api1.binance.com`
  - `https://api2.binance.com`
  - `https://api3.binance.com`
  - `https://api4.binance.com`

### Endpoint para Solo Datos de Mercado (Sin Autenticación)
Para datos públicos del mercado (precios, ticker, etc.):
- **Endpoint**: `https://data-api.binance.vision`

## Tipos de API

### 1. **API Pública** (Sin Autenticación) ✅ GRATIS
No requiere API Key. Puedes acceder a:
- Precios actuales de criptomonedas
- Información del libro de órdenes
- Historial de trades
- Datos de velas (candlesticks)
- Estadísticas de 24 horas

### 2. **API Privada** (Con Autenticación)
Requiere API Key. Permite:
- Realizar operaciones de trading
- Ver información de tu cuenta
- Gestionar órdenes

## Configuración para tu Proyecto Angular

### Paso 1: Configurar el Servicio HTTP

Tu servicio actual en `src/app/features/dashboard/service/market.ts` puede usar la API pública directamente:

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  // Usar endpoint público para datos de mercado
  private readonly BASE_URL = 'https://data-api.binance.vision/api/v3';
  
  constructor(private http: HttpClient) {}

  // Obtener precio actual de un símbolo
  getPrice(symbol: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/ticker/price?symbol=${symbol}`);
  }

  // Obtener estadísticas de 24hr
  get24hrStats(symbol: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/ticker/24hr?symbol=${symbol}`);
  }

  // Obtener lista de todos los precios
  getAllPrices(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/ticker/price`);
  }

  // Obtener información de exchange
  getExchangeInfo(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/exchangeInfo`);
  }
}
```

### Paso 2: Endpoints Públicos (REST)

Base recomendada para datos sin autenticación: `https://data-api.binance.vision/api/v3`

- **Precios y variaciones**
  - `GET /ticker/price` — precios de todos los símbolos.
  - `GET /ticker/price?symbol=BTCUSDT` — precio de un símbolo.
  - `GET /ticker/24hr` — stats 24h de todos.
  - `GET /ticker/24hr?symbol=BTCUSDT` — stats 24h de un símbolo.
  - `GET /ticker/bookTicker` — mejor bid/ask de todos o de un símbolo con `symbol=`.

- **Libro de órdenes (Depth)**
  - `GET /depth?symbol=BTCUSDT&limit=5|10|20|50|100|500|1000`.

- **Trades**
  - `GET /trades?symbol=BTCUSDT&limit=1-1000` — trades recientes.
  - `GET /aggTrades?symbol=BTCUSDT&limit=1-1000` — trades agregados.
  - `GET /historicalTrades?symbol=BTCUSDT&limit=1-1000` — requiere API key (solo lectura).

- **Klines/Candlesticks**
  - `GET /klines?symbol=BTCUSDT&interval=1m&limit=1-1000`.
  - `GET /uiKlines?symbol=BTCUSDT&interval=1m&limit=1-1000` (optimizado para UI).
  - Intervalos: `1s`, `1m`, `3m`, `5m`, `15m`, `30m`, `1h`, `2h`, `4h`, `6h`, `8h`, `12h`, `1d`, `3d`, `1w`, `1M`.

- **Info de exchange**
  - `GET /exchangeInfo` — metadatos de símbolos, filtros, precisiones, permisos.

### Streams WebSocket Públicos

Base WS: `wss://stream.binance.com:9443`

- Ticker individual: `/ws/{symbol}@ticker` (ej: `btcusdt@ticker`).
- Mini-ticker global: `/ws/!miniTicker@arr`.
- Ticker completo global: `/ws/!ticker@arr`.
- Libro de órdenes en vivo: `/ws/{symbol}@depth5|10|20` o `/ws/{symbol}@depth` / `@depth@100ms`.
- Klines en vivo: `/ws/{symbol}@kline_{interval}` (ej: `btcusdt@kline_1m`).

Notas rápidas:
- Usa símbolos en minúsculas para WS.
- Límites altos de `limit` en depth consumen más peso.

### Paso 3: Configurar Variables de Entorno

Crea un archivo de configuración en tu proyecto:

**src/environments/environment.ts**
```typescript
export const environment = {
  production: false,
  binanceApi: {
    baseUrl: 'https://data-api.binance.vision/api/v3',
    wsUrl: 'wss://stream.binance.com:9443'
  }
};
```

**src/environments/environment.prod.ts**
```typescript
export const environment = {
  production: true,
  binanceApi: {
    baseUrl: 'https://data-api.binance.vision/api/v3',
    wsUrl: 'wss://stream.binance.com:9443'
  }
};
```

### Paso 4: Límites de Uso (Rate Limits)

La API gratuita tiene límites:
- **Peso de Solicitud**: 6,000 por minuto
- **Solicitudes Sin Procesar**: 61,000 cada 5 minutos
- Cada endpoint tiene un peso específico (generalmente 1-2)

Los límites se indican en los headers de respuesta:
- `X-MBX-USED-WEIGHT-(intervalNum)(intervalLetter)`: Peso usado
- `X-MBX-ORDER-COUNT-(intervalNum)(intervalLetter)`: Contador de órdenes

### Paso 5: WebSocket para Datos en Tiempo Real

Para datos en tiempo real sin hacer polling:

```typescript
export class MarketService {
  private ws: WebSocket | null = null;

  connectWebSocket(symbol: string): Observable<any> {
    return new Observable(observer => {
      const url = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`;
      this.ws = new WebSocket(url);

      this.ws.onmessage = (event) => {
        observer.next(JSON.parse(event.data));
      };

      this.ws.onerror = (error) => {
        observer.error(error);
      };

      this.ws.onclose = () => {
        observer.complete();
      };

      return () => {
        if (this.ws) {
          this.ws.close();
        }
      };
    });
  }
}
```

## Testnet para Pruebas

Si quieres probar sin usar datos reales:
- **Testnet URL**: `https://testnet.binance.vision`
- No requiere fondos reales
- Perfecto para desarrollo

## Documentación Completa

- **Portal de Desarrolladores**: https://developers.binance.com/en
- **Documentación REST API**: https://developers.binance.com/docs/binance-spot-api-docs/rest-api
- **Changelog**: https://developers.binance.com/docs/binance-spot-api-docs/CHANGELOG

## Próximos Pasos

1. ✅ Usar endpoints públicos sin autenticación
2. Si necesitas trading o datos de cuenta:
   - Crear cuenta en Binance
   - Generar API Key en tu perfil
   - Implementar firma HMAC/RSA/Ed25519
3. Considerar usar WebSockets para datos en tiempo real
4. Implementar manejo de rate limits

## Resumen

**Para tu proyecto actual puedes empezar AHORA sin ninguna configuración adicional:**
- Solo usa `https://data-api.binance.vision/api/v3` como base URL
- No necesitas API Key para datos públicos del mercado
- Puedes obtener precios, estadísticas, historial de trades, etc.
- Es completamente gratuito

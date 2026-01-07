# 8. Integración con Binance API

## 📋 Índice
- [Binance API Overview](#binance-api-overview)
- [WebSocket Integration](#websocket-integration)
- [REST API Integration](#rest-api-integration)
- [Configuración](#configuración)
- [Rate Limiting y Optimización](#rate-limiting-y-optimización)

## 🌐 Binance API Overview

### ¿Qué es Binance API?

Binance proporciona APIs públicas para acceder a datos de mercado en tiempo real:

- **REST API**: Consultas HTTP para datos históricos y snapshots
- **WebSocket API**: Streaming en tiempo real de precios, trades, orderbook

### Documentación Oficial

- [Binance API Docs](https://binance-docs.github.io/apidocs/spot/en/)
- [WebSocket Streams](https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams)

### No Requiere API Keys

Este proyecto usa **solo endpoints públicos**, no requiere:
- ❌ API Key
- ❌ Secret Key
- ❌ Autenticación
- ❌ Cuenta de Binance

---

## 🔌 WebSocket Integration

### Configuración

**Ubicación**: [`src/app/core/config/endpoints.config.ts`](../src/app/core/config/endpoints.config.ts)

```typescript
export const ENDPOINTS = {
  ws_url: 'wss://stream.binance.com:9443/stream?streams',
  price: '/api/v3/ticker/price',
  ticker24h: '/api/v3/ticker/24hr'
};
```

### WebSocket URL Format

```
wss://stream.binance.com:9443/stream?streams=
  btcusdt@ticker/
  ethusdt@ticker/
  solusdt@ticker/
  dogeusdt@ticker
```

**Estructura**:
- Base URL: `wss://stream.binance.com:9443/stream?streams=`
- Streams: `{symbol}@{stream_type}`
- Múltiples streams: Separados por `/`

### Implementación en MarketService

**Ubicación**: [`src/app/features/dashboard/service/market.service.ts`](../src/app/features/dashboard/service/market.service.ts)

```typescript
import { webSocket } from 'rxjs/webSocket';

@Injectable({ providedIn: 'root' })
export class MarketService {
  private readonly TRACKED_ASSETS = ['btcusdt', 'ethusdt', 'solusdt', 'dogeusdt'] as const;
  
  private readonly WS_URL = `${ENDPOINTS.ws_url}/${
    this.TRACKED_ASSETS.map(s => `${s}@ticker`).join('/')
  }`;
  // Resultado: wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/...
  
  private readonly marketStream$ = webSocket<BinanceTickerData>(this.WS_URL).pipe(
    throttleTime(100),        // Anti-saturación
    map(this.transformData),  // Transform
    retry({ delay: 3000 }),   // Auto-reconnect
    catchError(this.handleError)
  );
}
```

### RxJS Operators Explicados

#### 1. throttleTime(100)

```typescript
throttleTime(100) // Máximo 1 emisión cada 100ms = 10 updates/segundo
```

**Por qué**:
- Binance envía ~250ms por símbolo
- 4 símbolos = ~16 updates/segundo
- Throttle a 100ms = 10 updates/segundo (suficiente para UI)

**Efecto**:
```
Antes: ━━●━●━●━●━●━●━●━●━  (16 updates/seg)
Después: ━━━━●━━━━●━━━━●━  (10 updates/seg)
```

#### 2. map(transformData)

```typescript
map((data) => this.transformBinanceData(data))

private transformBinanceData(data: BinanceTickerData): PriceUpdate {
  return {
    symbol: data.s.replace('USDT', ''), // "BTCUSDT" → "BTC"
    price: parseFloat(data.c),          // "50000.00" → 50000
    change: parseFloat(data.P)          // "5.24" → 5.24
  };
}
```

**Por qué**:
- Binance devuelve todos los campos como `string`
- Necesitamos `number` para cálculos
- Simplificamos a solo datos necesarios

#### 3. retry({ delay: 3000 })

```typescript
retry({ delay: 3000 }) // Reintenta cada 3 segundos, infinitamente
```

**Por qué**:
- WebSocket puede cerrarse por:
  - Red inestable
  - Servidor reiniciado
  - Rate limiting
- Auto-reconnect sin intervención manual

**Flujo**:
```
WebSocket conectado
    ↓
Error (desconexión)
    ↓
Espera 3 segundos
    ↓
Reintenta conexión
    ↓
✅ Reconectado (continúa stream)
```

#### 4. catchError(handleError)

```typescript
catchError((error) => {
  console.error('❌ WebSocket error:', error);
  return of(null); // Retorna null en lugar de romper el stream
})
```

**Por qué**:
- Evita que el stream se rompa completamente
- Permite que la app siga funcionando con datos antiguos
- Logging para debugging

### Datos Recibidos

#### Estructura de BinanceTickerData

```json
{
  "e": "24hrTicker",        // Event type
  "E": 1672515782136,       // Event time
  "s": "BTCUSDT",           // Symbol
  "p": "2500.00",           // Price change
  "P": "5.24",              // Price change percent
  "w": "49500.00",          // Weighted avg price
  "c": "50000.00",          // Current price ← IMPORTANTE
  "Q": "0.5",               // Last quantity
  "o": "47500.00",          // Open price
  "h": "51000.00",          // High price
  "l": "46000.00",          // Low price
  "v": "1000.5",            // Total volume
  ...
}
```

#### Campos Usados en la App

| Campo | Tipo Original | Transformado a | Uso |
|-------|---------------|----------------|-----|
| `s` | `string` | `string` (sin "USDT") | Símbolo (BTC, ETH) |
| `c` | `string` | `number` | Precio actual |
| `P` | `string` | `number` | Cambio % 24h |

---

## 📡 REST API Integration

### Endpoints Disponibles

#### 1. Get All Prices

```typescript
getAllPrice(): Observable<ResponsePriceCTO[]> {
  return this.http.get<ResponsePriceCTO[]>(
    `${this.BASE_URL}/api/v3/ticker/price`
  );
}
```

**Request**:
```
GET https://api.binance.com/api/v3/ticker/price
```

**Response**:
```json
[
  { "symbol": "BTCUSDT", "price": "50000.00" },
  { "symbol": "ETHUSDT", "price": "3000.00" },
  ...
]
```

#### 2. Get Price by Symbol

```typescript
getPriceBySymbol(symbol: string): Observable<ResponsePriceCTO> {
  return this.http.get<ResponsePriceCTO>(
    `${this.BASE_URL}/api/v3/ticker/price?symbol=${symbol}`
  );
}
```

**Request**:
```
GET https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
```

**Response**:
```json
{
  "symbol": "BTCUSDT",
  "price": "50000.00"
}
```

#### 3. Get 24h Ticker (Futuro)

```typescript
get24hTicker(symbol: string): Observable<any> {
  return this.http.get(
    `${this.BASE_URL}/api/v3/ticker/24hr?symbol=${symbol}`
  );
}
```

**Response**:
```json
{
  "symbol": "BTCUSDT",
  "priceChange": "2500.00",
  "priceChangePercent": "5.24",
  "weightedAvgPrice": "49500.00",
  "prevClosePrice": "47500.00",
  "lastPrice": "50000.00",
  "lastQty": "0.5",
  "bidPrice": "49999.00",
  "askPrice": "50001.00",
  "openPrice": "47500.00",
  "highPrice": "51000.00",
  "lowPrice": "46000.00",
  "volume": "1000.5",
  "quoteVolume": "49500000.00",
  "openTime": 1672429382136,
  "closeTime": 1672515782136,
  "count": 50000
}
```

---

## ⚙️ Configuración

### API Config

**Ubicación**: [`src/app/core/config/api.config.ts`](../src/app/core/config/api.config.ts)

```typescript
export const API_CONFIG = {
  binance: {
    baseUrl: 'https://api.binance.com',
    wsUrl: 'wss://stream.binance.com:9443/stream?streams',
  }
};
```

### Endpoints Config

**Ubicación**: [`src/app/core/config/endpoints.config.ts`](../src/app/core/config/endpoints.config.ts)

```typescript
export const ENDPOINTS = {
  ws_url: 'wss://stream.binance.com:9443/stream?streams',
  price: '/api/v3/ticker/price',
  ticker24h: '/api/v3/ticker/24hr',
  exchangeInfo: '/api/v3/exchangeInfo'
};
```

### Uso en Servicios

```typescript
import { API_CONFIG } from '../../../core/config/api.config';
import { ENDPOINTS } from '../../../core/config/endpoints.config';

@Injectable({ providedIn: 'root' })
export class MarketService {
  private readonly BASE_URL = API_CONFIG.binance.baseUrl;
  private readonly WS_URL = `${ENDPOINTS.ws_url}/...`;
  
  getAllPrice() {
    return this.http.get(`${this.BASE_URL}${ENDPOINTS.price}`);
  }
}
```

---

## 🚦 Rate Limiting y Optimización

### Rate Limits de Binance

**Límites Públicos**:
- **REST API**: 1200 requests/minuto (weight-based)
- **WebSocket**: Ilimitado (pero se recomienda throttling)

### Throttling Implementado

```typescript
private readonly marketStream$ = webSocket<BinanceTickerData>(this.WS_URL).pipe(
  throttleTime(100), // ← 100ms = máximo 10 updates/segundo
  // ...
);
```

**Por qué 100ms**:
- ✅ Suficiente para UI fluida (60 FPS = 16ms/frame)
- ✅ Reduce carga del navegador
- ✅ Evita re-renders innecesarios
- ✅ Cumple con recomendaciones de Binance

### Comparison de Throttling

| Throttle | Updates/seg | Pro | Con |
|----------|-------------|-----|-----|
| 0ms | ~16 | Datos más actuales | CPU alto |
| 100ms | 10 | Balance óptimo ✅ | - |
| 500ms | 2 | CPU bajo | Datos menos fluidos |
| 1000ms | 1 | CPU muy bajo | Parece desactualizado |

### Auto-Reconnect

```typescript
retry({ delay: 3000 }) // Reintenta cada 3 segundos
```

**Estrategia**:
- Delay fijo de 3 segundos
- Reintentos infinitos
- No hay exponential backoff (para simplicidad)

**Mejora Futura (Exponential Backoff)**:
```typescript
retry({
  count: 5,
  delay: (error, retryCount) => {
    const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
    console.log(`Retry ${retryCount} in ${delay}ms`);
    return timer(delay);
  }
})
```

### Error Handling

```typescript
catchError((error) => {
  console.error('❌ WebSocket error:', error);
  
  // Registrar error en analytics (futuro)
  // this.analytics.logError('WebSocket', error);
  
  // Retornar null en lugar de throw
  return of(null);
})
```

---

## 🔐 Seguridad y CORS

### CORS

Binance permite CORS desde cualquier origen para endpoints públicos:

```
Access-Control-Allow-Origin: *
```

**No se requiere**:
- ❌ Proxy server
- ❌ CORS headers personalizados
- ❌ Configuración especial

### Seguridad

Este proyecto es seguro porque:
- ✅ Solo usa endpoints públicos
- ✅ No maneja API keys
- ✅ No ejecuta operaciones de trading
- ✅ Solo lectura de datos de mercado

**NO hacer** (sin backend seguro):
- ❌ Exponer API keys en frontend
- ❌ Ejecutar trades desde frontend
- ❌ Almacenar secretos en código

---

## 📊 Monitoring y Debugging

### Console Logging

```typescript
private readonly marketStream$ = webSocket<BinanceTickerData>(this.WS_URL).pipe(
  tap(data => console.log('📡 WebSocket data:', data)), // ← Debugging
  throttleTime(100),
  map(this.transformData),
  retry({ delay: 3000 }),
  catchError((error) => {
    console.error('❌ WebSocket error:', error);
    return of(null);
  })
);
```

### Chrome DevTools

**Network Tab**:
```
WS wss://stream.binance.com:9443/stream?streams=...
Status: 101 Switching Protocols
Type: websocket
```

**Console Tab**:
```
📡 WebSocket data: { e: "24hrTicker", s: "BTCUSDT", c: "50000.00", ... }
```

---

## 🧪 Testing de Integración

### Mock WebSocket

```typescript
import { TestBed } from '@angular/core/testing';
import { MarketService } from './market.service';
import { of } from 'rxjs';

describe('MarketService WebSocket', () => {
  let service: MarketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarketService]
    });
    service = TestBed.inject(MarketService);
  });

  it('should transform Binance data correctly', () => {
    const mockData: BinanceTickerData = {
      e: '24hrTicker',
      E: 1672515782136,
      s: 'BTCUSDT',
      c: '50000.00',
      P: '5.24',
      // ... otros campos
    } as BinanceTickerData;

    const result = service['transformBinanceData'](mockData);

    expect(result).toEqual({
      symbol: 'BTC',
      price: 50000,
      change: 5.24
    });
  });
});
```

### Mock HTTP

```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MarketService REST API', () => {
  let service: MarketService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MarketService]
    });
    service = TestBed.inject(MarketService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya requests pendientes
  });

  it('should fetch all prices', () => {
    const mockResponse: ResponsePriceCTO[] = [
      { symbol: 'BTCUSDT', price: '50000.00' },
      { symbol: 'ETHUSDT', price: '3000.00' }
    ];

    service.getAllPrice().subscribe(prices => {
      expect(prices.length).toBe(2);
      expect(prices[0].symbol).toBe('BTCUSDT');
    });

    const req = httpMock.expectOne('https://api.binance.com/api/v3/ticker/price');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
```

---

## 📚 Mejores Prácticas

### ✅ DO

1. **Usar throttling para WebSocket**
   ```typescript
   throttleTime(100)
   ```

2. **Implementar auto-reconnect**
   ```typescript
   retry({ delay: 3000 })
   ```

3. **Transformar datos inmediatamente**
   ```typescript
   map(this.transformData)
   ```

4. **Manejar errores gracefully**
   ```typescript
   catchError(() => of(null))
   ```

### ❌ DON'T

1. **NO exponer API keys en frontend**
   ```typescript
   // ❌ NUNCA HACER
   const API_KEY = 'your-secret-key';
   ```

2. **NO subscribir sin throttling**
   ```typescript
   // ❌ Saturará el navegador
   webSocket(url).subscribe(/* ... */);
   ```

3. **NO ignorar errores**
   ```typescript
   // ❌ Stream se romperá
   webSocket(url).subscribe(/* ... */); // Sin catchError
   ```

---

## 🔗 Referencias

- [Binance API Documentation](https://binance-docs.github.io/apidocs/spot/en/)
- [WebSocket Streams](https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams)
- [RxJS webSocket](https://rxjs.dev/api/webSocket/webSocket)
- [Rate Limits](https://binance-docs.github.io/apidocs/spot/en/#limits)

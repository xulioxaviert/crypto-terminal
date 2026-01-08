# 6. Modelos y Tipos

## 📋 Índice
- [CryptoAsset](#cryptoasset)
- [BinanceTickerData](#binancetickerdata)
- [PriceUpdate](#priceupdate)
- [MenuItem](#menuitem)
- [UserHolding y PortfolioSummary](#userholding-y-portfoliosummary)
- [Convenciones de Tipos](#convenciones-de-tipos)

## 🎯 Filosofía de Tipos

Este proyecto utiliza TypeScript en modo **strict** (`strict: true` en `tsconfig.json`), lo que significa:

- ✅ **No implicit any**: Todas las variables deben estar tipadas
- ✅ **Strict null checks**: `null` y `undefined` son tipos explícitos
- ✅ **Strict function types**: Parámetros de funciones son contravariantes
- ✅ **Readonly properties**: Inmutabilidad por defecto

### Principios

1. **Inmutabilidad**: Uso de `readonly` en todas las interfaces
2. **Type Safety**: Sin `any`, usar `unknown` cuando sea necesario
3. **Null Safety**: Uso de optional chaining (`?.`) y nullish coalescing (`??`)
4. **Discriminated Unions**: Para diferentes tipos de respuestas

---

## 📊 Modelos de Dominio

### CryptoAsset

**Ubicación**: [`src/app/features/dashboard/models/crypto.model.ts`](../src/app/features/dashboard/models/crypto.model.ts)

**Descripción**: Modelo principal para representar un activo de criptomoneda.

```typescript
export interface CryptoAsset {
  readonly id: string;
  readonly name: string;
  readonly symbol: string;
  readonly price: number;
  readonly change24h: number;
  readonly icon: string;
  readonly sparkline: number[]; // Mini-gráfico (futuro)
}
```

#### Campos

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | `string` | Identificador único | `"1"` |
| `name` | `string` | Nombre completo | `"Bitcoin"` |
| `symbol` | `string` | Símbolo ticker | `"BTC"` |
| `price` | `number` | Precio actual en USD | `50000.25` |
| `change24h` | `number` | Cambio porcentual 24h | `5.2` (positivo) o `-2.5` (negativo) |
| `icon` | `string` | URL del icono | `"https://..."` |
| `sparkline` | `number[]` | Array de precios para mini-gráfico | `[45000, 47000, 50000]` |

#### Uso

```typescript
// Crear un asset
const btc: CryptoAsset = {
  id: '1',
  name: 'Bitcoin',
  symbol: 'BTC',
  price: 50000,
  change24h: 5.2,
  icon: '',
  sparkline: []
};

// ❌ ERROR: Intentar mutar (readonly)
btc.price = 51000; // TypeError: Cannot assign to 'price' because it is a read-only property

// ✅ CORRECTO: Crear nuevo objeto
const updatedBtc: CryptoAsset = { ...btc, price: 51000 };
```

#### Type Guards

```typescript
// Type guard para verificar si es un CryptoAsset válido
function isCryptoAsset(obj: unknown): obj is CryptoAsset {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'symbol' in obj &&
    'price' in obj &&
    typeof (obj as CryptoAsset).price === 'number'
  );
}

// Uso
const data: unknown = await response.json();
if (isCryptoAsset(data)) {
  console.log(data.price); // ✅ TypeScript sabe que data es CryptoAsset
}
```

---

## 🔌 Modelos de API (Binance)

### BinanceTickerData

**Ubicación**: [`src/app/features/dashboard/models/binance.model.ts`](../src/app/features/dashboard/models/binance.model.ts)

**Descripción**: Modelo completo de datos del WebSocket ticker de Binance.

```typescript
export interface BinanceTickerData {
  readonly e: string;  // Event type ("24hrTicker")
  readonly E: number;  // Event time (timestamp)
  readonly s: string;  // Symbol (ej: "BTCUSDT")
  readonly p: string;  // Price change
  readonly P: string;  // Price change percentage 24h
  readonly w: string;  // Weighted average price
  readonly x: string;  // First trade price
  readonly c: string;  // Current/Last price (close)
  readonly Q: string;  // Last quantity
  readonly b: string;  // Best bid price
  readonly B: string;  // Best bid quantity
  readonly a: string;  // Best ask price
  readonly A: string;  // Best ask quantity
  readonly o: string;  // Open price
  readonly h: string;  // High price
  readonly l: string;  // Low price
  readonly v: string;  // Total traded base asset volume
  readonly q: string;  // Total traded quote asset volume
  readonly O: number;  // Statistics open time
  readonly C: number;  // Statistics close time
  readonly F: number;  // First trade ID
  readonly L: number;  // Last trade Id
  readonly n: number;  // Total number of trades
}
```

#### Campos Importantes

| Campo | Tipo | Descripción | Uso en App |
|-------|------|-------------|-----------|
| `s` | `string` | Símbolo (ej: "BTCUSDT") | Se extrae "BTC" |
| `c` | `string` | Precio actual | Convertido a `number` |
| `P` | `string` | Cambio % 24h | Convertido a `number` |

#### Ejemplo de Respuesta Real

```json
{
  "e": "24hrTicker",
  "E": 1672515782136,
  "s": "BTCUSDT",
  "p": "2500.00",
  "P": "5.24",
  "w": "49500.00",
  "c": "50000.00",
  "Q": "0.5",
  "o": "47500.00",
  "h": "51000.00",
  "l": "46000.00",
  ...
}
```

#### Transformación a Nuestro Modelo

```typescript
function transformBinanceData(data: BinanceTickerData): PriceUpdate {
  return {
    symbol: data.s.replace('USDT', ''), // "BTCUSDT" → "BTC"
    price: parseFloat(data.c),          // "50000.00" → 50000
    change: parseFloat(data.P)          // "5.24" → 5.24
  };
}
```

---

### PriceUpdate

**Ubicación**: [`src/app/features/dashboard/models/binance.model.ts`](../src/app/features/dashboard/models/binance.model.ts)

**Descripción**: Modelo simplificado para actualizaciones de precio procesadas.

```typescript
export interface PriceUpdate {
  readonly symbol: string;  // "BTC", "ETH", etc.
  readonly price: number;   // Precio actual
  readonly change: number;  // Cambio porcentual 24h
}
```

#### Propósito

- ✅ **Simplificado**: Solo datos necesarios para actualizar UI
- ✅ **Type-safe**: `number` en lugar de `string` (ya procesado)
- ✅ **Inmutable**: `readonly` garantiza no mutación

#### Uso en MarketService

```typescript
private readonly marketStream$ = webSocket<BinanceTickerData>(this.WS_URL).pipe(
  map((data) => this.transformBinanceData(data)), // BinanceTickerData → PriceUpdate
  // ...
);

private transformBinanceData(data: BinanceTickerData): PriceUpdate {
  return {
    symbol: data.s.replace('USDT', ''),
    price: parseFloat(data.c),
    change: parseFloat(data.P)
  };
}
```

---

### ResponsePriceCTO

**Ubicación**: [`src/app/features/dashboard/models/binance.model.ts`](../src/app/features/dashboard/models/binance.model.ts)

**Descripción**: Respuesta de la API REST de Binance para precios.

```typescript
export interface ResponsePriceCTO {
  symbol: string;  // "BTCUSDT"
  price: string;   // "50000.00" (string, no number)
}
```

#### Ejemplo de Respuesta

```json
{
  "symbol": "BTCUSDT",
  "price": "50000.00"
}
```

#### Uso

```typescript
getAllPrice(): Observable<ResponsePriceCTO[]> {
  return this.http.get<ResponsePriceCTO[]>(`${this.BASE_URL}/api/v3/ticker/price`);
}

// Transformar a nuestro modelo
getAllPrice().pipe(
  map(prices => prices.map(p => ({
    symbol: p.symbol.replace('USDT', ''),
    price: parseFloat(p.price)
  })))
);
```

---

## 🧭 Modelos de Navegación

### MenuItem

**Ubicación**: [`src/app/core/models/nav.model.ts`](../src/app/core/models/nav.model.ts)

**Descripción**: Modelo para items del menú de navegación.

```typescript
/**
 * Interfaz para los elementos de navegación del Sidebar y Header.
 * Usamos 'readonly' para fomentar la inmutabilidad.
 */
export interface MenuItem {
  readonly label: string;  // "Dashboard", "Portfolio", etc.
  readonly icon: string;   // "lucide-chart-line"
  readonly route: string;  // "/dashboard"
}
```

#### Uso en SidebarComponent

```typescript
@Component({ /* ... */ })
export class SidebarComponent {
  readonly menuItems = signal<MenuItem[]>([
    { label: 'Dashboard', icon: 'lucide-chart-line', route: '/dashboard' },
    { label: 'Portfolio', icon: 'lucide-briefcase', route: '/portfolio' },
    { label: 'Activity', icon: 'lucide-clock', route: '/activity' },
  ]);
}
```

#### Template

```html
@for (item of menuItems(); track item.label) {
  <a [routerLink]="item.route" class="...">
    <i [class]="item.icon"></i>
    <span>{{ item.label }}</span>
  </a>
}
```

---

## 📝 Convenciones de Tipos

### Nomenclatura

```typescript
// Interfaces: PascalCase
export interface CryptoAsset { }
export interface MenuItem { }

// Tipos: PascalCase
export type AssetSymbol = 'BTC' | 'ETH' | 'SOL' | 'DOGE';

// Enums: PascalCase
export enum OrderType {
  Market = 'MARKET',
  Limit = 'LIMIT'
}
```

### Inmutabilidad

```typescript
// ✅ CORRECTO: readonly en interfaces
export interface CryptoAsset {
  readonly id: string;
  readonly price: number;
}

// ✅ CORRECTO: readonly en arrays
const symbols: readonly string[] = ['BTC', 'ETH'];

// ✅ CORRECTO: as const para arrays
const TRACKED_ASSETS = ['btcusdt', 'ethusdt'] as const;
type TrackedAsset = typeof TRACKED_ASSETS[number]; // 'btcusdt' | 'ethusdt'
```

### Type vs Interface

```typescript
// ✅ Interface: Para objetos y clases
export interface CryptoAsset {
  id: string;
  symbol: string;
}

// ✅ Type: Para unions, intersections, aliases
export type AssetSymbol = 'BTC' | 'ETH' | 'SOL' | 'DOGE';
export type Result<T> = { success: true; data: T } | { success: false; error: string };

// ✅ Type: Para mapped types
export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

### Utility Types

```typescript
// Partial: Hace todos los campos opcionales
type PartialAsset = Partial<CryptoAsset>;
// { id?: string; symbol?: string; ... }

// Required: Hace todos los campos requeridos
type RequiredAsset = Required<Partial<CryptoAsset>>;
// { id: string; symbol: string; ... }

// Pick: Selecciona solo ciertos campos
type AssetSummary = Pick<CryptoAsset, 'symbol' | 'price'>;
// { symbol: string; price: number; }

// Omit: Excluye ciertos campos
type AssetWithoutIcon = Omit<CryptoAsset, 'icon'>;
// { id, name, symbol, price, change24h, sparkline }

// Readonly: Hace todos los campos readonly
type ReadonlyAsset = Readonly<CryptoAsset>;
// { readonly id: string; readonly symbol: string; ... }
```

### Discriminated Unions

```typescript
// API Response con discriminated union
export type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' };

// Uso con type narrowing
function handleResponse(response: ApiResponse<CryptoAsset>) {
  if (response.status === 'success') {
    console.log(response.data.price); // ✅ TypeScript sabe que data existe
  } else if (response.status === 'error') {
    console.error(response.error); // ✅ TypeScript sabe que error existe
  } else {
    console.log('Loading...'); // ✅ TypeScript sabe que es loading
  }
}
```

---

## 🔍 Validación de Tipos en Runtime

### Zod (Recomendado para Futuro)

```typescript
// npm install zod

import { z } from 'zod';

// Schema de validación
const CryptoAssetSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  price: z.number().positive(),
  change24h: z.number(),
  icon: z.string().url().optional(),
  sparkline: z.array(z.number())
});

// Tipo inferido del schema
type CryptoAsset = z.infer<typeof CryptoAssetSchema>;

// Validación runtime
function validateAsset(data: unknown): CryptoAsset {
  return CryptoAssetSchema.parse(data); // Throw si inválido
}

// Validación safe (no throw)
function validateAssetSafe(data: unknown) {
  const result = CryptoAssetSchema.safeParse(data);
  if (result.success) {
    return result.data; // CryptoAsset
  } else {
    console.error(result.error);
    return null;
  }
}
```

---

## 🧪 Testing de Tipos

### Type Assertions

```typescript
import { describe, it, expect } from 'vitest';

describe('CryptoAsset Type', () => {
  it('should have correct structure', () => {
    const asset: CryptoAsset = {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 50000,
      change24h: 5.2,
      icon: '',
      sparkline: []
    };
    
    expect(asset.id).toBe('1');
    expect(asset.price).toBeTypeOf('number');
  });
  
  it('should be readonly', () => {
    const asset: CryptoAsset = {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 50000,
      change24h: 5.2,
      icon: '',
      sparkline: []
    };
    
    // ❌ Este test compila pero falla en runtime (readonly es solo compilación)
    // asset.price = 51000; // TypeError en compilación
    
    // ✅ Para testear inmutabilidad en runtime, usar Object.freeze()
    const frozenAsset = Object.freeze(asset);
    expect(() => {
      (frozenAsset as any).price = 51000;
    }).toThrow();
  });
});
```

---

## 📚 Mejores Prácticas

### ✅ DO

1. **Usar readonly en interfaces**
   ```typescript
   export interface CryptoAsset {
     readonly price: number;
   }
   ```

2. **Usar as const para arrays inmutables**
   ```typescript
   const SYMBOLS = ['BTC', 'ETH'] as const;
   ```

3. **Usar Utility Types**
   ```typescript
   type PartialAsset = Partial<CryptoAsset>;
   ```

4. **Usar Discriminated Unions para estados**
   ```typescript
   type LoadingState<T> =
     | { status: 'idle' }
     | { status: 'loading' }
     | { status: 'success'; data: T }
     | { status: 'error'; error: string };
   ```

### ❌ DON'T

1. **NO usar any**
   ```typescript
   // ❌ EVITAR
   const data: any = response.json();
   
   // ✅ USAR unknown y type guards
   const data: unknown = response.json();
   if (isCryptoAsset(data)) { /* ... */ }
   ```

2. **NO mutar datos readonly**
   ```typescript
   // ❌ Intentar mutar
   asset.price = 51000;
   
   // ✅ Crear nuevo objeto
   const updated = { ...asset, price: 51000 };
   ```
3. **NO ignorar null/undefined**
   ```typescript
   // ❌ Asumir que existe
   console.log(asset.icon.length);
   
   // ✅ Usar optional chaining
   console.log(asset.icon?.length ?? 0);
   ```

---

## 💼 Modelos de Portfolio

### UserHolding

**Ubicación**: [`src/app/features/dashboard/models/portfolio.model.ts`](../src/app/features/dashboard/models/portfolio.model.ts)

**Descripción**: Modelo para representar una posición del usuario en una criptomoneda.

```typescript
export interface UserHolding {
  readonly symbol: string;  // "BTC", "ETH", etc.
  readonly amount: number;  // Cantidad poseída
}
```

#### Campos

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `symbol` | `string` | Símbolo de la criptomoneda | `"BTC"` |
| `amount` | `number` | Cantidad poseída | `1.5` |

#### Uso

```typescript
// Holdings simulados (futuro: desde backend o wallet)
const holdings: UserHolding[] = [
  { symbol: 'BTC', amount: 1.5 },
  { symbol: 'ETH', amount: 10 },
  { symbol: 'SOL', amount: 50 },
  { symbol: 'DOGE', amount: 1000 },
];

// Calcular valor total
let totalValue = 0;
holdings.forEach((holding) => {
  const asset = marketService.assets().find(a => a.symbol === holding.symbol);
  if (asset) {
    totalValue += asset.price * holding.amount;
  }
});
```

---

### PortfolioSummary

**Ubicación**: [`src/app/features/dashboard/models/portfolio.model.ts`](../src/app/features/dashboard/models/portfolio.model.ts)

**Descripción**: Resumen agregado del portafolio del usuario.

```typescript
export interface PortfolioSummary {
  readonly totalValue: number;        // Valor total en USD
  readonly change24h: number;         // Cambio en USD (24h)
  readonly changePercentage: number;  // Cambio porcentual (24h)
}
```

#### Campos

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `totalValue` | `number` | Valor total del portafolio | `125430.25` |
| `change24h` | `number` | Cambio en USD | `5230.12` |
| `changePercentage` | `number` | Cambio porcentual | `4.35` |

#### Uso

```typescript
// Obtenido del PortfolioService
const summary = portfolioService.summary();

console.log(`Portfolio: $${summary.totalValue.toFixed(2)}`);
console.log(`24h Change: ${summary.changePercentage > 0 ? '+' : ''}${summary.changePercentage.toFixed(2)}%`);
```

---

## 📈 Modelos de Gráficos

### ChartData

**Ubicación**: [`src/app/features/dashboard/models/chart.data.model.ts`](../src/app/features/dashboard/models/chart.data.model.ts)

**Descripción**: Modelo para datos de gráficos.

```typescript
export interface ChartData {
  readonly symbol: string;          // Símbolo de criptomoneda
  readonly interval: string;        // Intervalo ("1d", "1h", "15m", etc.)
  readonly prices: number[];        // Array de precios
  readonly times: number[];         // Array de timestamps
  readonly volumes?: number[];      // Volúmenes (opcional)
}
```

#### Campos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `symbol` | `string` | Símbolo de la criptomoneda |
| `interval` | `string` | Intervalo de tiempo |
| `prices` | `number[]` | Array de precios históricos |
| `times` | `number[]` | Array de timestamps (UTC) |
| `volumes` | `number[]` | Array de volúmenes (opcional) |

#### Uso con ApexCharts

```typescript
// Convertir a formato ApexCharts
const chartSeries = [{
  name: 'Price',
  data: chartData.prices
}];

const chartOptions = {
  xaxis: {
    categories: chartData.times.map(t => new Date(t).toLocaleDateString())
  }
};
```

---

## 🔗 Referencias

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Zod Documentation](https://zod.dev/)

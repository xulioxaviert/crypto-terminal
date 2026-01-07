# 1. Visión General del Proyecto

## 🎯 Propósito

**CryptoTerminal** es una aplicación web moderna para el monitoreo y análisis de mercados de criptomonedas en tiempo real. Utiliza las APIs públicas de Binance para proporcionar datos actualizados sobre precios, variaciones y estadísticas de mercado.

### Objetivos del Proyecto

1. **Educativo**: Demostrar las capacidades de Angular 20 (Zoneless)
2. **Práctico**: Proporcionar una herramienta útil para traders
3. **Moderno**: Usar las últimas tecnologías y mejores prácticas
4. **Escalable**: Arquitectura preparada para crecer

## 🏗️ Stack Tecnológico

### Frontend Framework
- **Angular**: 20.0.0
  - Framework principal
  - Zoneless (sin Zone.js)
  - Signal-based reactivity
  - Standalone components

- **TypeScript**: 5.9.2
  - Strict mode activado
  - Tipado fuerte en todo el proyecto
  - Latest ECMAScript features

### UI y Estilos
- **Tailwind CSS**: 3.4.19
  - Utility-first CSS framework
  - Customizado con tema oscuro
  - PostCSS para procesamiento

- **SCSS**: Para estilos complejos
  - Variables globales
  - Mixins reutilizables
  - Anidación de estilos

### Testing
- **Vitest**: 4.0.8
  - Test runner ultrarrápido
  - Compatible con Vite
  - ES Modules nativo

- **Testing Library**: Para tests de componentes
  - User-centric testing
  - Best practices

### APIs y Servicios
- **Binance API**: 
  - REST API para datos históricos
  - WebSocket para streaming en tiempo real
  - Endpoints públicos (sin autenticación)

### Build Tools
- **Angular CLI**: 20.0.0
  - Development server
  - Production builds
  - Code generation

- **esbuild**: Builder por defecto en Angular 20
  - Compilación extremadamente rápida
  - Tree-shaking optimizado

## 📁 Estructura del Proyecto

```
crypto-terminal/
│
├── src/                              # Código fuente
│   ├── app/                          # Aplicación Angular
│   │   ├── core/                     # Módulo core
│   │   │   ├── components/           # Componentes globales
│   │   │   │   ├── header/           # Header de la app
│   │   │   │   └── sidebar/          # Sidebar de navegación
│   │   │   ├── config/               # Configuraciones
│   │   │   │   ├── api.config.ts     # URLs de APIs
│   │   │   │   └── endpoints.config.ts # Endpoints específicos
│   │   │   └── models/               # Modelos compartidos
│   │   │       └── nav.model.ts      # Modelo de navegación
│   │   │
│   │   ├── features/                 # Features de la app
│   │   │   └── dashboard/            # Dashboard principal
│   │   │       ├── components/       # Componentes del dashboard
│   │   │       │   ├── price-card/   # Tarjeta de precio
│   │   │       │   └── portfolio-hero/ # Hero del portfolio
│   │   │       ├── models/           # Modelos de dominio
│   │   │       │   ├── crypto.model.ts # Modelo de crypto asset
│   │   │       │   └── binance.model.ts # Tipos de Binance API
│   │   │       ├── service/          # Servicios
│   │   │       │   ├── market.service.ts # Servicio de mercado
│   │   │       │   └── market.spec.ts    # Tests del servicio
│   │   │       ├── dashboard.component.ts
│   │   │       ├── dashboard.component.html
│   │   │       └── dashboard.component.spec.ts
│   │   │
│   │   ├── app.component.ts          # Componente raíz
│   │   ├── app.component.html        # Template raíz
│   │   ├── app.component.scss        # Estilos raíz
│   │   ├── app.config.ts             # Configuración de la app
│   │   └── app.routes.ts             # Definición de rutas
│   │
│   ├── styles.scss                   # Estilos globales
│   ├── main.ts                       # Entry point
│   └── index.html                    # HTML base
│
├── public/                           # Assets estáticos
│   └── favicon.ico                   # Icono del sitio
│
├── docs/                             # Documentación
│   ├── README.md                     # Índice
│   ├── 01-project-overview.md        # Este archivo
│   └── ...                           # Otros docs
│
├── angular.json                      # Configuración Angular CLI
├── package.json                      # Dependencias npm
├── tsconfig.json                     # Configuración TypeScript
├── tsconfig.app.json                 # Config TS para app
├── tsconfig.spec.json                # Config TS para tests
├── tailwind.config.js                # Configuración Tailwind
├── postcss.config.js                 # Configuración PostCSS
├── BINANCE_API_SETUP.md              # Guía de Binance API
├── copilot-instructions.md           # Instrucciones para Copilot
└── README.md                         # Readme principal
```

## 🎨 Características Principales

### ✅ Implementadas

#### 1. Dashboard en Tiempo Real
- **Visualización de precios**: BTC, ETH, SOL, DOGE
- **Actualización automática**: Vía WebSocket cada 100ms
- **Indicadores visuales**: 
  - Verde para cambios positivos
  - Rojo para cambios negativos
  - Iconos de tendencia (↑/↓)

#### 2. Arquitectura Moderna
- **Zoneless**: Sin Zone.js, detección de cambios con Signals
- **Signal-based state**: Gestión de estado reactivo
- **Standalone components**: Sin NgModules
- **Lazy loading**: Carga bajo demanda de rutas

#### 3. UI Profesional
- **Tema dark**: Fondo oscuro con acentos neon
- **Responsive**: Adaptable a móviles, tablets y desktop
- **Animaciones**: Transiciones suaves en hover y cambios
- **Sidebar**: Navegación lateral con iconos

#### 4. Optimizaciones de Rendimiento
- **Throttling**: 100ms entre actualizaciones de WebSocket
- **OnPush strategy**: Detección de cambios optimizada
- **Lazy loading**: Módulos cargados cuando se necesitan
- **Tree-shaking**: Bundles mínimos en producción

### 🚧 Planificadas

#### 1. Gráficos Interactivos
- **Candlestick charts**: Gráficos de velas japonesas
- **Line charts**: Tendencias de precios
- **Volume charts**: Volumen de trading
- **Timeframes**: 1m, 5m, 15m, 1h, 4h, 1d

#### 2. Gestión de Portfolio
- **Añadir assets**: Agregar criptos al portfolio
- **Track holdings**: Seguimiento de tenencias
- **P&L tracking**: Ganancias y pérdidas
- **Value over time**: Valor histórico del portfolio

#### 3. Alertas de Precio
- **Price alerts**: Notificaciones cuando precio alcanza nivel
- **Percentage alerts**: Alertas por cambio porcentual
- **Browser notifications**: Notificaciones del navegador
- **Sound alerts**: Alertas sonoras opcionales

#### 4. Historial de Actividad
- **Trade history**: Historial de trades (mock)
- **Price snapshots**: Capturas de precios históricos
- **Notes**: Notas personales sobre trades
- **Export data**: Exportar datos a CSV/JSON

#### 5. Multi-Exchange Support
- **Coinbase**: Integración con Coinbase Pro
- **Kraken**: Soporte para Kraken API
- **Exchange comparison**: Comparar precios entre exchanges
- **Arbitrage opportunities**: Detectar oportunidades

#### 6. Advanced Features
- **Technical indicators**: RSI, MACD, Bollinger Bands
- **Order book**: Visualización del libro de órdenes
- **Market depth**: Profundidad de mercado
- **News feed**: Feed de noticias crypto

## 🔑 Conceptos Clave

### Zoneless Architecture

Angular 20 introduce la arquitectura "Zoneless", eliminando la dependencia de Zone.js:

**Antes (Angular < 19 con Zone.js)**:
- Zone.js intercepta eventos async (clicks, HTTP, timers)
- Trigger automático de change detection
- Overhead de rendimiento

**Ahora (Angular 20 Zoneless)**:
- Signals detectan cambios automáticamente
- Change detection solo cuando es necesario
- Mejor rendimiento y bundle size más pequeño

### Signals (Sistema Reactivo)

Signals son el nuevo sistema reactivo de Angular que reemplaza RxJS para estado local:

```typescript
// Signal básico (writable)
const count = signal(0);
count.set(1);
count.update(n => n + 1);

// Computed signal (derivado)
const doubled = computed(() => count() * 2);

// Effect (side effects)
effect(() => console.log('Count:', count()));
```

**Ventajas**:
- ✅ Más simple que RxJS para estado local
- ✅ Performance óptima (fine-grained reactivity)
- ✅ Type-safe por defecto
- ✅ Mejor debugging

### Standalone Components

Todos los componentes son "standalone", eliminando la necesidad de NgModules:

```typescript
@Component({
  selector: 'app-price-card',
  standalone: true, // ← Standalone
  imports: [CommonModule, CurrencyPipe], // Importación directa
  templateUrl: './price-card.component.html'
})
export class PriceCardComponent {}
```

**Beneficios**:
- ✅ Menos boilerplate
- ✅ Tree-shaking más efectivo
- ✅ Más fácil de entender
- ✅ Lazy loading simplificado

### Domain-Driven Design Lite

Separación clara entre capas:

- **Core**: Infraestructura compartida (Header, Sidebar, configs)
- **Features**: Lógica de negocio por dominio (Dashboard, Portfolio)
- **Shared**: (Futuro) Componentes reutilizables

## 📊 Flujo de Datos

```
┌─────────────────────────────────────────────────────────┐
│                  Binance WebSocket API                   │
│         wss://stream.binance.com/ws/ticker               │
└──────────────────────┬──────────────────────────────────┘
                       │ BinanceTickerData (JSON)
                       ↓
┌─────────────────────────────────────────────────────────┐
│                   MarketService                          │
│  - webSocket<BinanceTickerData>() [RxJS]                 │
│  - throttleTime(100) → Throttling                        │
│  - map() → Transform to PriceUpdate                      │
│  - retry({ delay: 3000 }) → Auto-reconnect               │
└──────────────────────┬──────────────────────────────────┘
                       │ Observable<PriceUpdate>
                       ↓
┌─────────────────────────────────────────────────────────┐
│              toSignal() Conversion                       │
│  livePriceUpdate = toSignal(marketStream$)               │
└──────────────────────┬──────────────────────────────────┘
                       │ Signal<PriceUpdate | undefined>
                       ↓
┌─────────────────────────────────────────────────────────┐
│            effect() - Side Effect                        │
│  effect(() => {                                          │
│    const update = this.livePriceUpdate();                │
│    if (update) this.updateAssetPrice(update);            │
│  });                                                     │
└──────────────────────┬──────────────────────────────────┘
                       │ Mutation trigger
                       ↓
┌─────────────────────────────────────────────────────────┐
│    WritableSignal<Map<string, CryptoAsset>>              │
│  assetsMap.update(map => {                               │
│    const newMap = new Map(map); // Immutable            │
│    newMap.set(symbol, updatedAsset);                     │
│    return newMap;                                        │
│  });                                                     │
└──────────────────────┬──────────────────────────────────┘
                       │ State updated
                       ↓
┌─────────────────────────────────────────────────────────┐
│      Computed Signal (Read-Only, Derived)                │
│  assets = computed(() =>                                 │
│    Array.from(this.assetsMap().values())                 │
│      .sort((a, b) => b.marketCap - a.marketCap)          │
│  );                                                      │
└──────────────────────┬──────────────────────────────────┘
                       │ CryptoAsset[]
                       ↓
┌─────────────────────────────────────────────────────────┐
│              DashboardComponent                          │
│  assets = inject(MarketService).assets;                  │
└──────────────────────┬──────────────────────────────────┘
                       │ Template binding
                       ↓
┌─────────────────────────────────────────────────────────┐
│                   Template (HTML)                        │
│  @for (asset of assets(); track asset.id) {              │
│    <app-price-card [asset]="asset" />                    │
│  }                                                       │
└──────────────────────┬──────────────────────────────────┘
                       │ Input binding
                       ↓
┌─────────────────────────────────────────────────────────┐
│                PriceCardComponent                        │
│  asset = input.required<CryptoAsset>();                  │
│  isPositive = computed(() => asset().change24h >= 0);    │
└─────────────────────────────────────────────────────────┘
```

### Principios del Flujo

1. **Unidireccional**: Los datos fluyen en una sola dirección
2. **Inmutabilidad**: Los estados se reemplazan, no se mutan
3. **Reactivo**: Los cambios se propagan automáticamente
4. **Type-safe**: Tipado en cada paso

## 🎯 Principios de Diseño

### 1. Inmutabilidad
Todos los estados se actualizan de forma inmutable:

```typescript
// ❌ INCORRECTO (mutable)
this.assetsMap().set('btc', newAsset);

// ✅ CORRECTO (immutable)
this.assetsMap.update(map => {
  const newMap = new Map(map);
  newMap.set('btc', newAsset);
  return newMap;
});
```

### 2. Tipado Estricto
TypeScript strict mode activado (`strict: true`):

```typescript
// Tipos explícitos
asset = input.required<CryptoAsset>(); // No puede ser undefined
assets = signal<Map<string, CryptoAsset>>(new Map());

// Constantes con 'as const'
const SYMBOLS = ['btcusdt', 'ethusdt'] as const;
type Symbol = typeof SYMBOLS[number]; // 'btcusdt' | 'ethusdt'
```

### 3. Reactividad
Uso de Signals para cambios automáticos:

```typescript
// Signal fuente
const price = signal(50000);

// Computed (se actualiza automáticamente)
const priceFormatted = computed(() => 
  `$${price().toLocaleString()}`
);

// Effect (ejecuta cuando price cambia)
effect(() => console.log('New price:', price()));
```

### 4. Modularidad
Componentes pequeños y enfocados:

```typescript
// Componente pequeño con responsabilidad única
@Component({
  selector: 'app-price-card',
  standalone: true,
  template: `...` // Solo muestra un asset
})
export class PriceCardComponent {
  asset = input.required<CryptoAsset>();
}
```

### 5. Performance
Optimizaciones en todos los niveles:

- **OnPush Change Detection**: Solo detecta cambios cuando inputs cambian
- **trackBy en loops**: Evita re-renders innecesarios
- **Lazy Loading**: Cargas bajo demanda
- **Throttling**: Limita frecuencia de actualizaciones

## 🔐 Seguridad

### API Keys
- **No se requieren**: Solo endpoints públicos de Binance
- **Sin autenticación**: Datos de mercado abiertos
- **Sin información sensible**: No se maneja dinero real

### CORS
- **Binance permite CORS**: Requests desde el navegador
- **No hay proxy**: Conexión directa a Binance

### Rate Limiting
- **Throttling**: 100ms entre updates de WebSocket
- **Auto-reconnect**: Manejo de desconexiones
- **Error handling**: Retry con backoff exponencial

### Content Security Policy
- **Headers seguros**: (Futuro) CSP headers
- **HTTPS only**: Forzar HTTPS en producción
- **No inline scripts**: Scripts externos solo

## 📱 Compatibilidad

### Navegadores
- **Chrome**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅

### Dispositivos
- **Desktop**: 1920x1080 (óptimo)
- **Tablet**: 768px+ (iPad)
- **Mobile**: 375px+ (iPhone SE)

### Requisitos
- **JavaScript**: ES2022+
- **WebSocket**: Soporte nativo
- **Signals**: Angular 20+

## 🚀 Roadmap

### Q1 2026
- [x] Setup inicial del proyecto
- [x] Dashboard con precios en tiempo real
- [x] Integración con Binance WebSocket
- [ ] Gráficos interactivos (TradingView)

### Q2 2026
- [ ] Gestión de portfolio
- [ ] Alertas de precio
- [ ] Historial de actividad
- [ ] Export de datos

### Q3 2026
- [ ] Multi-exchange support
- [ ] Technical indicators
- [ ] Order book visualization
- [ ] News feed integration

### Q4 2026
- [ ] Mobile app (Ionic/Capacitor)
- [ ] Desktop app (Electron)
- [ ] AI-powered insights
- [ ] Social features

## 📝 Notas Técnicas

### Por qué Angular 20
- **Zoneless**: Mejor performance
- **Signals**: Reactivity moderna
- **Standalone**: Arquitectura simplificada
- **esbuild**: Builds ultrarrápidos

### Por qué Tailwind CSS
- **Utility-first**: Desarrollo rápido
- **Customizable**: Tema personalizado fácil
- **Tree-shaking**: Solo CSS usado
- **Responsive**: Mobile-first por defecto

### Por qué Vitest
- **Velocidad**: 10x más rápido que Jest
- **ES Modules**: Soporte nativo
- **Compatible**: Drop-in replacement de Jest
- **Watch mode**: HMR para tests

## 🔗 Próximos Pasos

- Ver [Arquitectura y Patrones](./02-architecture.md) para entender la estructura
- Ver [Angular 20 vs Legacy](./03-angular-20-vs-legacy.md) para diferencias clave
- Ver [Guía de Desarrollo](./12-development-guide.md) para empezar a contribuir

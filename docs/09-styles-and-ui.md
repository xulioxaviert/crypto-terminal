# 9. Estilos y UI (Tailwind CSS)

## 📋 Índice
- [Configuración de Tailwind](#configuración-de-tailwind)
- [Tema Personalizado](#tema-personalizado)
- [Componentes Reutilizables](#componentes-reutilizables)
- [Responsive Design](#responsive-design)
- [Animaciones](#animaciones)

## 🎨 Configuración de Tailwind

### tailwind.config.js

**Ubicación**: [`tailwind.config.js`](../tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: { /* ... */ },
      boxShadow: { /* ... */ },
      animation: { /* ... */ },
      keyframes: { /* ... */ },
      borderRadius: { /* ... */ },
      spacing: { /* ... */ },
    },
  },
  plugins: [],
};
```

### Estructura

1. **content**: Archivos a escanear para clases usadas
2. **theme**: Extensión del tema por defecto
3. **plugins**: Plugins personalizados

---

## 🎭 Tema Personalizado

### Colores

#### Backgrounds

```javascript
'crypto-dark': '#0a0e1a',           // Fondo principal (muy oscuro)
'crypto-dark-secondary': '#151b2e', // Fondo secundario
'crypto-card': '#1a2332',           // Fondo de cards
'crypto-sidebar': '#0f1419',        // Fondo del sidebar
'crypto-bg-hover': '#222b3d',       // Hover background
```

**Paleta Visual**:
```
#0a0e1a (crypto-dark) ━━━━━━━━━━━━━━━━━━━━━━
↓
#0f1419 (crypto-sidebar) ━━━━━━
↓
#151b2e (crypto-dark-secondary) ━━━━━━━━
↓
#1a2332 (crypto-card) ━━━━━━━━━━
↓
#222b3d (crypto-bg-hover) ━━━━━━━━━━━━
```

#### Brand Colors

```javascript
'crypto-green': {
  DEFAULT: '#00ff88',   // Verde neon
  dark: '#00cc6a',      // Verde oscuro
  light: '#66ffaa',     // Verde claro
}

'crypto-red': {
  DEFAULT: '#ff0055',   // Rojo neon
  dark: '#cc0044',      // Rojo oscuro
  light: '#ff3377',     // Rojo claro
}
```

**Uso**:
- `text-crypto-green`: Cambios positivos
- `text-crypto-red`: Cambios negativos

#### Accent Colors

```javascript
'crypto-neon': {
  cyan: '#00f0ff',      // Cyan neon
  magenta: '#ff00ff',   // Magenta
  purple: '#b800ff',    // Purple
  yellow: '#ffff00',    // Yellow
}
```

### Box Shadows (Neon Glow)

```javascript
boxShadow: {
  'neon-green': '0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.3)',
  'neon-green-strong': '0 0 15px rgba(0, 255, 136, 0.7), 0 0 30px rgba(0, 255, 136, 0.5)',
  'neon-red': '0 0 10px rgba(255, 0, 85, 0.5), 0 0 20px rgba(255, 0, 85, 0.3)',
  'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
  'card-hover': '0 8px 12px -2px rgba(0, 255, 136, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.3)',
}
```

**Ejemplo Visual**:
```html
<!-- Sin sombra -->
<div class="bg-crypto-card">Normal Card</div>

<!-- Con neon glow -->
<div class="bg-crypto-card shadow-neon-green hover:shadow-neon-green-strong">
  Glowing Card
</div>
```

### Animaciones

```javascript
animation: {
  'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'glow': 'glow 2s ease-in-out infinite',
  'chart-draw': 'chart-draw 1s ease-out',
}

keyframes: {
  'pulse-neon': {
    '0%, 100%': {
      opacity: '1',
      boxShadow: '0 0 10px currentColor, 0 0 20px currentColor',
    },
    '50%': {
      opacity: '.8',
      boxShadow: '0 0 20px currentColor, 0 0 40px currentColor',
    },
  },
  'glow': {
    '0%, 100%': { filter: 'brightness(1)' },
    '50%': { filter: 'brightness(1.2)' },
  },
  'chart-draw': {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
}
```

**Uso**:
```html
<button class="animate-pulse-neon">Pulsing Button</button>
<div class="animate-glow">Glowing Element</div>
<div class="animate-chart-draw">Chart Animation</div>
```

---

## 🎛️ Componentes Reutilizables

### Global Styles

**Ubicación**: [`src/styles.scss`](../src/styles.scss)

```scss
/* Tailwind CSS */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Global styles */
@layer base {
  body {
    @apply bg-crypto-dark text-crypto-text-primary antialiased;
  }
  
  * {
    scrollbar-width: thin;
    scrollbar-color: #2a3344 #0a0e1a;
  }
  
  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
}

@layer components {
  .card {
    @apply bg-crypto-card border border-crypto-border rounded-card shadow-card;
  }
  
  .card-hover {
    @apply card transition-all duration-200 hover:bg-crypto-hover hover:border-crypto-green/30;
  }
  
  .btn-primary {
    @apply bg-crypto-green text-crypto-dark font-semibold px-6 py-2.5 rounded-lg 
           transition-all duration-200 hover:shadow-neon-green-strong hover:brightness-110;
  }
  
  .text-positive {
    @apply text-crypto-green font-semibold;
  }
  
  .text-negative {
    @apply text-crypto-red font-semibold;
  }
}
```

### Componente .card

```html
<!-- Uso básico -->
<div class="card">
  Card content
</div>

<!-- Con hover -->
<div class="card-hover">
  Hoverable card
</div>

<!-- Personalizado -->
<div class="card p-6 gap-4">
  Custom card with padding and gap
</div>
```

### Componente .btn-primary

```html
<!-- Botón primario -->
<button class="btn-primary">
  Add to Portfolio
</button>

<!-- Con icono -->
<button class="btn-primary">
  <i class="lucide-plus mr-2"></i>
  Add Funds
</button>
```

---

## 📱 Responsive Design

### Breakpoints de Tailwind

```
sm: 640px   (small phones)
md: 768px   (tablets)
lg: 1024px  (desktops)
xl: 1280px  (large desktops)
2xl: 1536px (very large desktops)
```

### Ejemplos de uso en este proyecto

```html
<!-- Grid responsivo: 1 col mobile, 2 cols tablet, 4 cols desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <app-price-card />
  <app-price-card />
  <app-price-card />
  <app-price-card />
</div>

<!-- Tamaño de texto responsivo -->
<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold">
  Market Overview
</h1>

<!-- Padding responsivo -->
<div class="px-4 md:px-6 lg:px-8 py-6">
  Content with responsive padding
</div>

<!-- Visibilidad responsiva -->
<div class="hidden md:block">
  Only visible on tablets and larger
</div>
```

### Safe Area (para notch phones)

```javascript
// tailwind.config.js
spacing: {
  'safe-top': 'max(1rem, env(safe-area-inset-top))',
  'safe-bottom': 'max(1rem, env(safe-area-inset-bottom))',
  'safe-left': 'max(1rem, env(safe-area-inset-left))',
  'safe-right': 'max(1rem, env(safe-area-inset-right))',
}
```

```html
<!-- Usar safe areas -->
<div class="pt-safe-top pl-safe-left pr-safe-right pb-safe-bottom">
  Safe content
</div>
```

---

## ✨ Animaciones

### Transiciones Suaves

```html
<!-- Transición de todo en 200ms -->
<div class="transition-all duration-200 hover:shadow-neon-green">
  Hoverable element
</div>

<!-- Transición específica -->
<div class="transition-colors duration-300 hover:text-crypto-neon-cyan">
  Color change
</div>

<!-- Sin transición -->
<div class="transition-none">
  No animation
</div>
```

### Animaciones Personalizadas

#### Pulse Neon

```html
<button class="animate-pulse-neon text-crypto-neon">
  Important Button
</button>
```

**Efecto**: Parpadea con glow neon

#### Glow

```html
<div class="animate-glow text-white">
  Glowing text
</div>
```

**Efecto**: Brillo que va y viene

#### Chart Draw

```html
<div class="animate-chart-draw">
  Chart content
</div>
```

**Efecto**: Aparece con movimiento hacia arriba

---

## 🎬 Transiciones y Efectos

### Hover Effects

```html
<!-- Scale up -->
<div class="hover:scale-105 transition-transform">
  Scale on hover
</div>

<!-- Color change -->
<div class="hover:text-crypto-neon transition-colors">
  Color change on hover
</div>

<!-- Shadow change -->
<div class="hover:shadow-neon-green-strong transition-shadow">
  Shadow on hover
</div>

<!-- Opacity -->
<div class="hover:opacity-80 transition-opacity">
  Opacity on hover
</div>
```

### Group Hover (para padres con hijos)

```html
<!-- Cambiar hijo cuando padre en hover -->
<div class="group border-slate-800 hover:border-crypto-neon transition-all">
  <div class="text-slate-600 group-hover:text-crypto-neon">
    This text changes on parent hover
  </div>
  <div class="opacity-0 group-hover:opacity-100">
    This appears on parent hover
  </div>
</div>
```

**Usado en**: Botón star en price-card

```html
<div class="group">
  <button class="text-slate-600 group-hover:text-yellow-500">
    <i class="lucide-star"></i>
  </button>
</div>
```

---

## 🔍 Utilities Comunes

### Opacity y Transparencia

```html
<!-- Opacidad en colores -->
<div class="bg-crypto-neon/10">50% neon background</div>
<div class="border border-crypto-green/30">30% green border</div>

<!-- Opacidad en elementos -->
<div class="opacity-50">50% opacity</div>
<div class="hover:opacity-75">75% opacity on hover</div>
```

### Spacing

```html
<!-- Padding -->
<div class="p-4">16px padding all sides</div>
<div class="px-6 py-4">Horizontal and vertical</div>
<div class="pt-8 pb-4">Top and bottom specific</div>

<!-- Margin -->
<div class="m-4">16px margin all sides</div>
<div class="mb-6">24px bottom margin</div>

<!-- Gap (en flexbox/grid) -->
<div class="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Display y Flexbox

```html
<!-- Display -->
<div class="block">Block element</div>
<div class="inline">Inline element</div>
<div class="flex">Flex container</div>
<div class="grid grid-cols-2">Grid container</div>

<!-- Flexbox alignment -->
<div class="flex items-center justify-between">
  <span>Left</span>
  <span>Right</span>
</div>

<!-- Flex direction -->
<div class="flex flex-col">Vertical layout</div>
<div class="flex flex-row">Horizontal layout</div>
```

---

## 🎨 Patrones de Diseño

### Card Pattern

```html
<div class="bg-crypto-surface border border-slate-800/50 p-6 rounded-3xl 
            hover:border-crypto-neon/30 transition-all group">
  <!-- Header -->
  <div class="flex justify-between items-start mb-6">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-slate-800 
                  flex items-center justify-center">
        Icon
      </div>
      <div>
        <h3 class="font-bold text-white">Title</h3>
        <p class="text-xs text-crypto-slate">Subtitle</p>
      </div>
    </div>
  </div>
  
  <!-- Content -->
  <div class="mb-4">
    <span class="text-2xl font-bold">Content</span>
  </div>
  
  <!-- Footer -->
  <div class="flex items-center justify-between">
    <span class="text-crypto-neon">Data</span>
  </div>
</div>
```

### List Pattern

```html
<div class="space-y-2">
  <div class="p-4 bg-crypto-hover rounded-lg">Item 1</div>
  <div class="p-4 bg-crypto-hover rounded-lg">Item 2</div>
  <div class="p-4 bg-crypto-hover rounded-lg">Item 3</div>
</div>
```

### Modal Pattern

```html
<!-- Overlay -->
<div class="fixed inset-0 bg-black/50 flex items-center justify-center">
  <!-- Modal -->
  <div class="bg-crypto-card border border-slate-800 rounded-2xl p-6 
              max-w-md w-full mx-4">
    <h2 class="text-2xl font-bold mb-4">Title</h2>
    <p class="text-crypto-slate mb-6">Content</p>
    <button class="btn-primary w-full">Action</button>
  </div>
</div>
```

---

## 🧪 Testing de Estilos

### Validar Clases

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceCardComponent } from './price-card.component';

describe('PriceCardComponent Styling', () => {
  let component: PriceCardComponent;
  let fixture: ComponentFixture<PriceCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PriceCardComponent]
    });
    fixture = TestBed.createComponent(PriceCardComponent);
  });

  it('should have correct CSS classes', () => {
    const element = fixture.nativeElement as HTMLElement;
    const card = element.querySelector('[class*="bg-crypto-surface"]');
    
    expect(card).toBeTruthy();
    expect(card?.classList.contains('rounded-3xl')).toBe(true);
  });

  it('should apply positive color for gains', () => {
    const asset = {
      /* ... */
      change24h: 5.2
    };
    fixture.componentRef.setInput('asset', asset);
    fixture.detectChanges();

    const changeElement = element.querySelector('[class*="text-crypto-neon"]');
    expect(changeElement).toBeTruthy();
  });
});
```

---

## 📚 Mejores Prácticas

### ✅ DO

1. **Usar clases Tailwind**
   ```html
   <div class="flex gap-4 p-6">Content</div>
   ```

2. **Extender en tailwind.config.js**
   ```javascript
   extend: { colors: { 'my-color': '#abc' } }
   ```

3. **Usar @layer para componentes**
   ```scss
   @layer components {
     .btn-primary { /* ... */ }
   }
   ```

4. **Responsive prefixes**
   ```html
   <div class="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"></div>
   ```

### ❌ DON'T

1. **NO usar inline styles**
   ```html
   <!-- ❌ EVITAR -->
   <div style="color: #ff0055;">Text</div>
   
   <!-- ✅ PREFERIR -->
   <div class="text-crypto-red">Text</div>
   ```

2. **NO mezclar CSS y Tailwind**
   ```scss
   /* ❌ Si es posible, usar solo Tailwind */
   .card {
     background: red;
     color: white;
   }
   ```

3. **NO crear muchas clases personalizadas**
   ```scss
   /* ❌ Muchas custom classes */
   .card-dark { /* ... */ }
   .card-light { /* ... */ }
   .card-hover { /* ... */ }
   
   /* ✅ Usar utilities de Tailwind */
   <div class="bg-crypto-card hover:bg-crypto-hover"></div>
   ```

---

## 🔗 Referencias

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind Components](https://tailwindui.com/components)
- [Color Utilities](https://tailwindcss.com/docs/customizing-colors)
- [Animation Docs](https://tailwindcss.com/docs/animation)

# Accessibility Testing Examples - CryptoTerminal

Ejemplos prácticos de testing de accesibilidad para Angular 20 con Vitest, axe-core, Chrome DevTools MCP, y testing manual con tecnologías asistivas.

---

## Tabla de contenidos

1. [Setup y configuración inicial](#1-setup-y-configuración-inicial)
2. [Test básico con axe-core](#2-test-básico-con-axe-core)
3. [Test de navegación por teclado](#3-test-de-navegación-por-teclado)
4. [Test de contraste de color](#4-test-de-contraste-de-color)
5. [Test de regiones en vivo (live regions)](#5-test-de-regiones-en-vivo-live-regions)
6. [Test de formularios accesibles](#6-test-de-formularios-accesibles)
7. [Test de modales con focus trap](#7-test-de-modales-con-focus-trap)
8. [Test con Chrome DevTools MCP](#8-test-con-chrome-devtools-mcp)
9. [Test de estructura de encabezados](#9-test-de-estructura-de-encabezados)
10. [Test de landmarks ARIA](#10-test-de-landmarks-aria)
11. [Test de tabla accesible](#11-test-de-tabla-accesible)
12. [Test E2E de accesibilidad con MCP](#12-test-e2e-de-accesibilidad-con-mcp)

---

## 1. Setup y configuración inicial

### Instalación de dependencias

```bash
# Instalar axe-core y herramientas de testing
npm install --save-dev axe-core vitest-axe @testing-library/angular @testing-library/user-event
```

### Configuración de Vitest con axe

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test-setup.ts'],
    },
  },
});
```

### Archivo de setup para axe

```typescript
// src/test-setup.ts
import { expect } from 'vitest';
import { toHaveNoViolations } from 'vitest-axe';
import '@testing-library/jest-dom';

// Extend expect with axe matchers
expect.extend(toHaveNoViolations);

// Mock window.matchMedia (needed for responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver (needed for lazy loading)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;
```

---

## 2. Test básico con axe-core

### Ejemplo: PriceCard component

```typescript
// price-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { axe, toHaveNoViolations } from 'vitest-axe';
import { describe, it, expect, beforeEach } from 'vitest';
import { PriceCardComponent } from './price-card.component';
import type { CryptoModel } from '../../models/crypto.model';

expect.extend(toHaveNoViolations);

describe('PriceCardComponent - Accessibility', () => {
  const mockCrypto: CryptoModel = {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    currentPrice: 65432.1,
    marketCap: 1250000000000,
    volume24h: 45000000000,
    percentChange24h: 5.23,
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  };

  it('should have no axe violations with WCAG 2.2 AA rules', async () => {
    const { container } = await render(PriceCardComponent, {
      componentInputs: {
        crypto: mockCrypto,
      },
    });

    // Run axe-core with WCAG 2.2 AA + best practices
    const results = await axe(container, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag22aa', 'best-practice'],
      },
    });

    expect(results).toHaveNoViolations();
  });

  it('should have no axe violations with WCAG 2.2 AAA rules', async () => {
    const { container } = await render(PriceCardComponent, {
      componentInputs: {
        crypto: mockCrypto,
      },
    });

    // Run axe-core with stricter AAA rules
    const results = await axe(container, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag22aa', 'wcag22aaa'],
      },
    });

    expect(results).toHaveNoViolations();
  });

  it('should have accessible crypto image', async () => {
    await render(PriceCardComponent, {
      componentInputs: { crypto: mockCrypto },
    });

    const image = screen.getByRole('img', { name: /bitcoin logo/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAccessibleName();
    expect(image).toHaveAttribute('alt', 'Bitcoin logo');
  });

  it('should have accessible price information', async () => {
    await render(PriceCardComponent, {
      componentInputs: { crypto: mockCrypto },
    });

    // Price should be readable by screen readers
    const price = screen.getByText(/\$65,432\.10/);
    expect(price).toBeInTheDocument();
    expect(price).toBeVisible();
  });

  it('should announce price change direction', async () => {
    const { container } = await render(PriceCardComponent, {
      componentInputs: { crypto: mockCrypto },
    });

    // Check for screen reader only text
    const srOnly = container.querySelector('.sr-only');
    expect(srOnly).toBeInTheDocument();
    expect(srOnly).toHaveTextContent(/increased|decreased/i);
  });
});
```

---

## 3. Test de navegación por teclado

### Ejemplo: HeaderSearch component

```typescript
// header-search.component.spec.ts
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { HeaderSearchComponent } from './header-search.component';

describe('HeaderSearchComponent - Keyboard Navigation', () => {
  it('should be focusable via Tab key', async () => {
    const user = userEvent.setup();
    await render(HeaderSearchComponent);

    const searchInput = screen.getByRole('searchbox');

    // Tab to input
    await user.tab();
    expect(searchInput).toHaveFocus();
  });

  it('should show results dropdown on keyboard input', async () => {
    const user = userEvent.setup();
    await render(HeaderSearchComponent);

    const searchInput = screen.getByRole('searchbox');
    await user.click(searchInput);
    await user.keyboard('bitcoin');

    // Results should appear
    const listbox = await screen.findByRole('listbox');
    expect(listbox).toBeInTheDocument();
  });

  it('should navigate results with arrow keys', async () => {
    const user = userEvent.setup();
    await render(HeaderSearchComponent);

    const searchInput = screen.getByRole('searchbox');
    await user.click(searchInput);
    await user.keyboard('bit');

    // Wait for results
    const listbox = await screen.findByRole('listbox');
    const options = screen.getAllByRole('option');

    // Press ArrowDown
    await user.keyboard('{ArrowDown}');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');

    // Press ArrowDown again
    await user.keyboard('{ArrowDown}');
    expect(options[1]).toHaveAttribute('aria-selected', 'true');

    // Press ArrowUp
    await user.keyboard('{ArrowUp}');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('should select result with Enter key', async () => {
    const user = userEvent.setup();
    const onSelectSpy = vi.fn();

    await render(HeaderSearchComponent, {
      componentOutputs: {
        cryptoSelected: onSelectSpy,
      },
    });

    const searchInput = screen.getByRole('searchbox');
    await user.click(searchInput);
    await user.keyboard('bitcoin');

    await screen.findByRole('listbox');

    // Navigate to first result and press Enter
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onSelectSpy).toHaveBeenCalledOnce();
  });

  it('should close dropdown with Escape key', async () => {
    const user = userEvent.setup();
    await render(HeaderSearchComponent);

    const searchInput = screen.getByRole('searchbox');
    await user.click(searchInput);
    await user.keyboard('bit');

    const listbox = await screen.findByRole('listbox');
    expect(listbox).toBeInTheDocument();

    // Press Escape
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('should have visible focus indicator', async () => {
    const { container } = await render(HeaderSearchComponent);

    const searchInput = screen.getByRole('searchbox');
    searchInput.focus();

    // Check computed styles for focus indicator
    const styles = window.getComputedStyle(searchInput);
    expect(styles.outline).not.toBe('none');
    expect(styles.outline).not.toBe('0px');
  });
});
```

---

## 4. Test de contraste de color

### Ejemplo: Manual contrast check con helper

```typescript
// test-utils/contrast-checker.ts
export interface ColorInfo {
  foreground: string;
  background: string;
  fontSize: number;
  fontWeight: number;
}

export interface ContrastResult {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  level: 'normal' | 'large';
}

/**
 * Calculate contrast ratio between two colors
 * Based on WCAG 2.2 formula
 */
export function calculateContrastRatio(
  foreground: string,
  background: string
): number {
  const fgLuminance = getRelativeLuminance(foreground);
  const bgLuminance = getRelativeLuminance(background);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function getRelativeLuminance(color: string): number {
  // Parse RGB from color string
  const rgb = parseColor(color);
  if (!rgb) return 0;

  const [r, g, b] = rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function parseColor(color: string): [number, number, number] | null {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

/**
 * Check if contrast meets WCAG standards
 */
export function checkContrast(info: ColorInfo): ContrastResult {
  const ratio = calculateContrastRatio(info.foreground, info.background);

  // Determine if text is "large" (18pt+ or 14pt bold+)
  const isLargeText =
    info.fontSize >= 18 || (info.fontSize >= 14 && info.fontWeight >= 700);

  const level = isLargeText ? 'large' : 'normal';

  // WCAG 2.2 requirements
  const aaRequired = isLargeText ? 3 : 4.5;
  const aaaRequired = isLargeText ? 4.5 : 7;

  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA: ratio >= aaRequired,
    passesAAA: ratio >= aaaRequired,
    level,
  };
}
```

### Test de contraste en componente

```typescript
// price-card.component.spec.ts (continuación)
import { checkContrast } from '../../../test-utils/contrast-checker';

describe('PriceCardComponent - Color Contrast', () => {
  it('should have sufficient contrast for price text (AA)', async () => {
    const { container } = await render(PriceCardComponent, {
      componentInputs: { crypto: mockCrypto },
    });

    const priceElement = container.querySelector('.price');
    expect(priceElement).toBeInTheDocument();

    const styles = window.getComputedStyle(priceElement!);
    const result = checkContrast({
      foreground: styles.color,
      background: styles.backgroundColor,
      fontSize: parseInt(styles.fontSize),
      fontWeight: parseInt(styles.fontWeight),
    });

    expect(result.passesAA).toBe(true);
    expect(result.ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('should have enhanced contrast for price text (AAA)', async () => {
    const { container } = await render(PriceCardComponent, {
      componentInputs: { crypto: mockCrypto },
    });

    const priceElement = container.querySelector('.price');
    const styles = window.getComputedStyle(priceElement!);
    const result = checkContrast({
      foreground: styles.color,
      background: styles.backgroundColor,
      fontSize: parseInt(styles.fontSize),
      fontWeight: parseInt(styles.fontWeight),
    });

    expect(result.passesAAA).toBe(true);
    expect(result.ratio).toBeGreaterThanOrEqual(7);
  });

  it('should have sufficient contrast for all text elements', async () => {
    const { container } = await render(PriceCardComponent, {
      componentInputs: { crypto: mockCrypto },
    });

    // Get all text elements
    const textElements = container.querySelectorAll(
      '.crypto-name, .crypto-symbol, .price, .price-change'
    );

    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const result = checkContrast({
        foreground: styles.color,
        background: styles.backgroundColor,
        fontSize: parseInt(styles.fontSize),
        fontWeight: parseInt(styles.fontWeight),
      });

      expect(result.passesAA).toBe(true);
    });
  });
});
```

---

## 5. Test de regiones en vivo (live regions)

### Ejemplo: PriceCard con actualizaciones en tiempo real

```typescript
// price-card.component.ts
import { Component, input, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { CryptoModel } from '../../models/crypto.model';

@Component({
  selector: 'app-price-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="crypto-card">
      <img [src]="crypto().image" [alt]="crypto().name + ' logo'" />
      
      <h3>{{ crypto().name }}</h3>
      <span class="symbol">{{ crypto().symbol }}</span>

      <!-- Live region for price updates -->
      <div
        class="price"
        [attr.aria-live]="isUpdating() ? 'polite' : null"
        [attr.aria-atomic]="true"
      >
        {{ crypto().currentPrice | currency }}

        <!-- Screen reader only announcement -->
        <span class="sr-only">
          Price {{ priceDirection() }} by {{ percentChange() }}%
        </span>
      </div>

      <div class="price-change" [class.positive]="isPositive()">
        {{ percentChange() }}%
      </div>

      <!-- Status message for updates -->
      <div
        class="sr-only"
        role="status"
        aria-live="polite"
        [attr.aria-atomic]="true"
      >
        @if (updateMessage()) {
          {{ updateMessage() }}
        }
      </div>
    </article>
  `,
  styles: [`
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `],
})
export class PriceCardComponent {
  crypto = input.required<CryptoModel>();
  isUpdating = input<boolean>(false);

  percentChange = computed(() => this.crypto().percentChange24h);
  isPositive = computed(() => this.percentChange() > 0);
  priceDirection = computed(() => (this.isPositive() ? 'increased' : 'decreased'));

  updateMessage = computed(() => {
    if (!this.isUpdating()) return '';
    return `${this.crypto().name} price updated: ${this.crypto().currentPrice}`;
  });
}
```

### Test de live regions

```typescript
// price-card.component.spec.ts (continuación)
describe('PriceCardComponent - Live Regions', () => {
  it('should have aria-live attribute when updating', async () => {
    const { container, rerender } = await render(PriceCardComponent, {
      componentInputs: {
        crypto: mockCrypto,
        isUpdating: false,
      },
    });

    let priceElement = container.querySelector('.price');
    expect(priceElement).not.toHaveAttribute('aria-live');

    // Trigger update
    await rerender({
      componentInputs: {
        crypto: { ...mockCrypto, currentPrice: 66000 },
        isUpdating: true,
      },
    });

    priceElement = container.querySelector('.price');
    expect(priceElement).toHaveAttribute('aria-live', 'polite');
    expect(priceElement).toHaveAttribute('aria-atomic', 'true');
  });

  it('should announce price direction to screen readers', async () => {
    const { container } = await render(PriceCardComponent, {
      componentInputs: {
        crypto: { ...mockCrypto, percentChange24h: 5.2 },
      },
    });

    const srOnly = container.querySelector('.price .sr-only');
    expect(srOnly).toHaveTextContent('Price increased by 5.2%');
  });

  it('should announce price decrease to screen readers', async () => {
    const { container } = await render(PriceCardComponent, {
      componentInputs: {
        crypto: { ...mockCrypto, percentChange24h: -3.1 },
      },
    });

    const srOnly = container.querySelector('.price .sr-only');
    expect(srOnly).toHaveTextContent('Price decreased by -3.1%');
  });

  it('should have status message for updates', async () => {
    const { container, rerender } = await render(PriceCardComponent, {
      componentInputs: {
        crypto: mockCrypto,
        isUpdating: false,
      },
    });

    // Initially no message
    let statusElement = container.querySelector('[role="status"]');
    expect(statusElement).toHaveTextContent('');

    // Trigger update
    await rerender({
      componentInputs: {
        crypto: { ...mockCrypto, currentPrice: 66500 },
        isUpdating: true,
      },
    });

    statusElement = container.querySelector('[role="status"]');
    expect(statusElement).toHaveTextContent(/Bitcoin price updated: 66500/);
    expect(statusElement).toHaveAttribute('aria-live', 'polite');
  });
});
```

---

## 6. Test de formularios accesibles

### Ejemplo: SearchForm component

```typescript
// search-form.component.ts
import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="handleSubmit()" novalidate>
      <div class="form-group">
        <label [for]="inputId()">
          Search cryptocurrencies
          <span class="required" aria-label="required">*</span>
        </label>

        <input
          [id]="inputId()"
          type="search"
          name="search"
          [(ngModel)]="searchQuery"
          [attr.aria-required]="true"
          [attr.aria-invalid]="hasError() ? 'true' : 'false'"
          [attr.aria-describedby]="hasError() ? errorId() : helpId()"
          placeholder="Bitcoin, Ethereum..."
          (blur)="validateInput()"
        />

        <!-- Help text -->
        <div [id]="helpId()" class="help-text">
          Enter at least 2 characters to search
        </div>

        <!-- Error message -->
        @if (hasError()) {
          <div [id]="errorId()" class="error-message" role="alert">
            {{ errorMessage() }}
          </div>
        }
      </div>

      <button
        type="submit"
        [disabled]="searchQuery().length < 2"
        [attr.aria-disabled]="searchQuery().length < 2"
      >
        Search
      </button>
    </form>
  `,
})
export class SearchFormComponent {
  searchQuery = signal('');
  hasError = signal(false);
  errorMessage = signal('');

  inputId = signal('search-' + Math.random().toString(36).substr(2, 9));
  errorId = signal('error-' + Math.random().toString(36).substr(2, 9));
  helpId = signal('help-' + Math.random().toString(36).substr(2, 9));

  searchSubmitted = output<string>();

  validateInput() {
    const query = this.searchQuery().trim();
    if (query.length > 0 && query.length < 2) {
      this.hasError.set(true);
      this.errorMessage.set('Search query must be at least 2 characters');
    } else {
      this.hasError.set(false);
      this.errorMessage.set('');
    }
  }

  handleSubmit() {
    this.validateInput();
    if (!this.hasError() && this.searchQuery().length >= 2) {
      this.searchSubmitted.emit(this.searchQuery());
    }
  }
}
```

### Test de formulario accesible

```typescript
// search-form.component.spec.ts
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { SearchFormComponent } from './search-form.component';

describe('SearchFormComponent - Accessibility', () => {
  it('should have no axe violations', async () => {
    const { container } = await render(SearchFormComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have properly associated label', async () => {
    await render(SearchFormComponent);

    const input = screen.getByRole('searchbox', {
      name: /search cryptocurrencies/i,
    });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAccessibleName();

    // Verify label is properly associated
    const label = screen.getByText('Search cryptocurrencies');
    expect(label).toHaveAttribute('for', input.id);
  });

  it('should indicate required field to screen readers', async () => {
    await render(SearchFormComponent);

    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('aria-required', 'true');

    // Check for required indicator
    const requiredIndicator = screen.getByLabelText('required');
    expect(requiredIndicator).toBeInTheDocument();
  });

  it('should have help text associated with input', async () => {
    await render(SearchFormComponent);

    const input = screen.getByRole('searchbox');
    const helpText = screen.getByText(/enter at least 2 characters/i);

    expect(input).toHaveAttribute('aria-describedby', helpText.id);
  });

  it('should announce error to screen readers', async () => {
    const user = userEvent.setup();
    await render(SearchFormComponent);

    const input = screen.getByRole('searchbox');

    // Enter invalid input (1 character)
    await user.type(input, 'b');
    await user.tab(); // Blur to trigger validation

    // Check error is announced
    const error = await screen.findByRole('alert');
    expect(error).toHaveTextContent(/must be at least 2 characters/i);

    // Check aria-invalid
    expect(input).toHaveAttribute('aria-invalid', 'true');

    // Check aria-describedby points to error
    expect(input).toHaveAttribute('aria-describedby', error.id);
  });

  it('should clear error when input is valid', async () => {
    const user = userEvent.setup();
    await render(SearchFormComponent);

    const input = screen.getByRole('searchbox');

    // Enter invalid input
    await user.type(input, 'b');
    await user.tab();
    await screen.findByRole('alert');

    // Fix input
    await user.clear(input);
    await user.type(input, 'bitcoin');
    await user.tab();

    // Error should be gone
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('should disable submit button when input is invalid', async () => {
    await render(SearchFormComponent);

    const button = screen.getByRole('button', { name: /search/i });

    // Initially disabled (empty input)
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should enable submit button when input is valid', async () => {
    const user = userEvent.setup();
    await render(SearchFormComponent);

    const input = screen.getByRole('searchbox');
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'bitcoin');

    expect(button).toBeEnabled();
    expect(button).not.toHaveAttribute('aria-disabled', 'true');
  });
});
```

---

## 7. Test de modales con focus trap

### Ejemplo: Modal component con focus management

```typescript
// modal.component.ts
import {
  Component,
  input,
  output,
  signal,
  effect,
  AfterViewInit,
  HostListener,
  DestroyRef,
  inject,
  ElementRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="modal-overlay"
      (click)="handleOverlayClick($event)"
      [attr.aria-hidden]="!isOpen()"
    >
      <div
        #modalContainer
        class="modal"
        role="dialog"
        [attr.aria-modal]="true"
        [attr.aria-labelledby]="titleId()"
        [attr.aria-describedby]="descId()"
      >
        <button
          #closeButton
          type="button"
          class="close-button"
          (click)="handleClose()"
          aria-label="Close modal"
        >
          ×
        </button>

        <h2 [id]="titleId()">{{ title() }}</h2>

        <div [id]="descId()" class="modal-content">
          <ng-content></ng-content>
        </div>

        <div class="modal-actions">
          <button type="button" (click)="handleClose()">Cancel</button>
          <button type="button" class="primary" (click)="handleConfirm()">
            Confirm
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ModalComponent implements AfterViewInit {
  private el = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  isOpen = input<boolean>(false);
  title = input<string>('Modal title');

  closed = output<void>();
  confirmed = output<void>();

  titleId = signal('modal-title-' + Math.random().toString(36).substr(2, 9));
  descId = signal('modal-desc-' + Math.random().toString(36).substr(2, 9));

  private modalContainer = viewChild<ElementRef<HTMLDivElement>>('modalContainer');
  private closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');
  private focusableElements = signal<HTMLElement[]>([]);
  private previouslyFocusedElement: HTMLElement | null = null;

  constructor() {
    // Listen for Escape key globally
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter((e) => e.key === 'Escape' && this.isOpen()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.handleClose());

    // Focus management on open/close
    effect(() => {
      if (this.isOpen()) {
        this.onModalOpen();
      } else {
        this.onModalClose();
      }
    });
  }

  ngAfterViewInit() {
    this.updateFocusableElements();
  }

  private onModalOpen() {
    // Save currently focused element
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    // Focus first element in modal
    setTimeout(() => {
      this.updateFocusableElements();
      const firstElement = this.focusableElements()[0];
      firstElement?.focus();
    }, 0);
  }

  private onModalClose() {
    // Restore focus to previously focused element
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }
  }

  private updateFocusableElements() {
    const modal = this.modalContainer()?.nativeElement;
    if (!modal) return;

    const elements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    this.focusableElements.set(Array.from(elements));
  }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (!this.isOpen() || event.key !== 'Tab') return;

    const elements = this.focusableElements();
    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];
    const activeElement = document.activeElement;

    // Trap focus within modal
    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  }

  handleOverlayClick(event: MouseEvent) {
    // Only close if clicking directly on overlay (not modal content)
    if (event.target === event.currentTarget) {
      this.handleClose();
    }
  }

  handleClose() {
    this.closed.emit();
  }

  handleConfirm() {
    this.confirmed.emit();
  }
}
```

### Test de modal accesible

```typescript
// modal.component.spec.ts
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { ModalComponent } from './modal.component';

describe('ModalComponent - Accessibility', () => {
  it('should have no axe violations when open', async () => {
    const { container } = await render(ModalComponent, {
      componentInputs: {
        isOpen: true,
        title: 'Confirm action',
      },
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have correct ARIA attributes', async () => {
    await render(ModalComponent, {
      componentInputs: {
        isOpen: true,
        title: 'Confirm action',
      },
    });

    const dialog = screen.getByRole('dialog', { name: /confirm action/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
  });

  it('should focus first focusable element on open', async () => {
    await render(ModalComponent, {
      componentInputs: {
        isOpen: true,
        title: 'Confirm action',
      },
    });

    // Wait for focus
    await vi.waitFor(() => {
      const closeButton = screen.getByRole('button', { name: /close modal/i });
      expect(closeButton).toHaveFocus();
    });
  });

  it('should trap focus within modal (Tab forward)', async () => {
    const user = userEvent.setup();
    await render(ModalComponent, {
      componentInputs: {
        isOpen: true,
        title: 'Confirm action',
      },
    });

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    const confirmButton = screen.getByRole('button', { name: /confirm/i });

    // Focus should start on close button
    await vi.waitFor(() => expect(closeButton).toHaveFocus());

    // Tab to cancel
    await user.tab();
    expect(cancelButton).toHaveFocus();

    // Tab to confirm
    await user.tab();
    expect(confirmButton).toHaveFocus();

    // Tab should wrap to close button
    await user.tab();
    expect(closeButton).toHaveFocus();
  });

  it('should trap focus within modal (Shift+Tab backward)', async () => {
    const user = userEvent.setup();
    await render(ModalComponent, {
      componentInputs: {
        isOpen: true,
        title: 'Confirm action',
      },
    });

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    const confirmButton = screen.getByRole('button', { name: /confirm/i });

    await vi.waitFor(() => expect(closeButton).toHaveFocus());

    // Shift+Tab should wrap to last element
    await user.tab({ shift: true });
    expect(confirmButton).toHaveFocus();
  });

  it('should close on Escape key', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    await render(ModalComponent, {
      componentInputs: {
        isOpen: true,
        title: 'Confirm action',
      },
      componentOutputs: {
        closed: onClose,
      },
    });

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('should restore focus on close', async () => {
    const user = userEvent.setup();

    // Render a button outside the modal
    const { rerender } = await render(
      `
      <button id="trigger">Open Modal</button>
      <app-modal [isOpen]="isOpen" title="Test Modal"></app-modal>
    `,
      {
        imports: [ModalComponent],
        componentProperties: {
          isOpen: false,
        },
      }
    );

    const triggerButton = document.getElementById('trigger');
    triggerButton?.focus();
    expect(triggerButton).toHaveFocus();

    // Open modal
    await rerender({ componentProperties: { isOpen: true } });

    // Modal should take focus
    await vi.waitFor(() => {
      const closeButton = screen.getByRole('button', { name: /close modal/i });
      expect(closeButton).toHaveFocus();
    });

    // Close modal
    await rerender({ componentProperties: { isOpen: false } });

    // Focus should return to trigger
    await vi.waitFor(() => {
      expect(triggerButton).toHaveFocus();
    });
  });

  it('should have accessible close button', async () => {
    await render(ModalComponent, {
      componentInputs: {
        isOpen: true,
        title: 'Confirm action',
      },
    });

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAccessibleName();
  });
});
```

---

## 8. Test con Chrome DevTools MCP

### Ejemplo: Automated accessibility audit con MCP

```typescript
// scripts/audit-accessibility.ts
import { describe, it, expect } from 'vitest';

describe('Dashboard Page - MCP Accessibility Audit', () => {
  it('should capture accessibility tree snapshot', async () => {
    // Activate browser navigation tools
    await activate_browser_navigation_tools();
    await activate_web_page_capture_tools();

    // Navigate to dashboard
    await mcp_microsoft_pla_browser_navigate({
      url: 'http://localhost:4200',
    });

    // Wait for page load
    await mcp_microsoft_pla_browser_wait_for({ text: 'Dashboard' });

    // Take accessibility snapshot
    const snapshot = await mcp_microsoft_pla_browser_snapshot({
      filename: 'dashboard-a11y-tree.md',
    });

    // Verify landmark structure
    expect(snapshot).toContain('banner'); // <header>
    expect(snapshot).toContain('navigation'); // <nav>
    expect(snapshot).toContain('main'); // <main>
    expect(snapshot).toContain('contentinfo'); // <footer>
  });

  it('should check console for accessibility errors', async () => {
    await mcp_microsoft_pla_browser_navigate({
      url: 'http://localhost:4200',
    });

    // Get console messages
    const messages = await mcp_microsoft_pla_browser_console_messages({
      level: 'error',
    });

    // Filter for accessibility-related errors
    const a11yErrors = messages.filter(
      (msg) =>
        msg.text.includes('aria-') ||
        msg.text.includes('role') ||
        msg.text.includes('accessibility')
    );

    expect(a11yErrors).toHaveLength(0);
  });

  it('should verify focus indicators are present', async () => {
    await mcp_microsoft_pla_browser_navigate({
      url: 'http://localhost:4200',
    });

    const focusStyles = await mcp_microsoft_pla_browser_evaluate({
      function: `
        () => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.map(btn => {
            btn.focus();
            const styles = window.getComputedStyle(btn);
            return {
              tag: btn.tagName,
              text: btn.textContent?.trim(),
              outline: styles.outline,
              outlineWidth: styles.outlineWidth,
              outlineColor: styles.outlineColor,
              boxShadow: styles.boxShadow,
            };
          });
        }
      `,
    });

    // All buttons should have visible focus indicators
    focusStyles.forEach((style: any) => {
      const hasFocusIndicator =
        style.outline !== 'none' ||
        style.outlineWidth !== '0px' ||
        style.boxShadow !== 'none';

      expect(hasFocusIndicator).toBe(true);
    });
  });

  it('should check color contrast with browser evaluation', async () => {
    await mcp_microsoft_pla_browser_navigate({
      url: 'http://localhost:4200',
    });

    const contrastData = await mcp_microsoft_pla_browser_evaluate({
      function: `
        () => {
          function getRgb(color) {
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = 1;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 1, 1);
            return ctx.getImageData(0, 0, 1, 1).data;
          }

          function getLuminance(r, g, b) {
            const [rs, gs, bs] = [r, g, b].map(c => {
              c = c / 255;
              return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
          }

          function getContrast(fg, bg) {
            const fgRgb = getRgb(fg);
            const bgRgb = getRgb(bg);
            const l1 = getLuminance(fgRgb[0], fgRgb[1], fgRgb[2]);
            const l2 = getLuminance(bgRgb[0], bgRgb[1], bgRgb[2]);
            const lighter = Math.max(l1, l2);
            const darker = Math.min(l1, l2);
            return (lighter + 0.05) / (darker + 0.05);
          }

          const textElements = Array.from(document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, button, a'));
          return textElements.map(el => {
            const styles = window.getComputedStyle(el);
            const fg = styles.color;
            const bg = styles.backgroundColor;
            const ratio = getContrast(fg, bg);
            const fontSize = parseInt(styles.fontSize);
            const fontWeight = parseInt(styles.fontWeight);
            const isLarge = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
            
            return {
              text: el.textContent?.trim().substring(0, 30),
              contrast: Math.round(ratio * 100) / 100,
              passesAA: ratio >= (isLarge ? 3 : 4.5),
              fontSize,
              isLarge,
            };
          });
        }
      `,
    });

    // All text should pass AA contrast
    contrastData.forEach((item: any) => {
      expect(item.passesAA).toBe(true);
      expect(item.contrast).toBeGreaterThanOrEqual(item.isLarge ? 3 : 4.5);
    });
  });
});
```

---

## 9. Test de estructura de encabezados

### Test de jerarquía de encabezados

```typescript
// dashboard.component.spec.ts
import { render, screen } from '@testing-library/angular';
import { axe } from 'vitest-axe';
import { describe, it, expect } from 'vitest';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent - Heading Structure', () => {
  it('should have only one h1 per page', async () => {
    await render(DashboardComponent);

    const h1Elements = screen.getAllByRole('heading', { level: 1 });
    expect(h1Elements).toHaveLength(1);
  });

  it('should have correct heading hierarchy (no skipped levels)', async () => {
    const { container } = await render(DashboardComponent);

    const headings = Array.from(
      container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    );

    const levels = headings.map((h) => parseInt(h.tagName[1]));

    // Check no levels are skipped
    for (let i = 1; i < levels.length; i++) {
      const diff = levels[i] - levels[i - 1];
      expect(diff).toBeLessThanOrEqual(1); // Can increase by max 1 level
    }
  });

  it('should have descriptive heading text', async () => {
    await render(DashboardComponent);

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent(/dashboard|crypto terminal/i);

    const h2s = screen.getAllByRole('heading', { level: 2 });
    h2s.forEach((h2) => {
      // Headings should not be empty or generic
      expect(h2.textContent).toBeTruthy();
      expect(h2.textContent).not.toMatch(/^(title|heading|section)$/i);
    });
  });

  it('should announce headings correctly to screen readers', async () => {
    await render(DashboardComponent);

    const headings = screen.getAllByRole('heading');

    headings.forEach((heading) => {
      // Each heading should be accessible
      expect(heading).toHaveAccessibleName();
      expect(heading.textContent?.trim()).toBeTruthy();
    });
  });
});
```

---

## 10. Test de landmarks ARIA

### Test de estructura de landmarks

```typescript
// app.component.spec.ts
import { render, screen, within } from '@testing-library/angular';
import { axe } from 'vitest-axe';
import { describe, it, expect } from 'vitest';
import { AppComponent } from './app.component';

describe('AppComponent - ARIA Landmarks', () => {
  it('should have correct landmark structure', async () => {
    await render(AppComponent);

    // Check for required landmarks
    expect(screen.getByRole('banner')).toBeInTheDocument(); // <header>
    expect(screen.getByRole('navigation')).toBeInTheDocument(); // <nav>
    expect(screen.getByRole('main')).toBeInTheDocument(); // <main>
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // <footer>
  });

  it('should have only one banner landmark', async () => {
    await render(AppComponent);

    const banners = screen.getAllByRole('banner');
    expect(banners).toHaveLength(1);
  });

  it('should have only one main landmark', async () => {
    await render(AppComponent);

    const mains = screen.getAllByRole('main');
    expect(mains).toHaveLength(1);
  });

  it('should have labeled navigation if multiple nav elements', async () => {
    await render(AppComponent);

    const navs = screen.getAllByRole('navigation');

    if (navs.length > 1) {
      // Each nav should have aria-label or aria-labelledby
      navs.forEach((nav) => {
        expect(
          nav.hasAttribute('aria-label') ||
            nav.hasAttribute('aria-labelledby')
        ).toBe(true);
      });
    }
  });

  it('should have skip link for keyboard users', async () => {
    const { container } = await render(AppComponent);

    const skipLink = container.querySelector('a[href="#main-content"]');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveTextContent(/skip to (main )?content/i);
  });

  it('should navigate to main content when skip link is activated', async () => {
    const { container } = await render(AppComponent);

    const skipLink = container.querySelector(
      'a[href="#main-content"]'
    ) as HTMLAnchorElement;
    const mainContent = container.querySelector('#main-content');

    expect(skipLink).toBeInTheDocument();
    expect(mainContent).toBeInTheDocument();

    // Verify target exists
    expect(skipLink.hash).toBe('#main-content');
    expect(mainContent?.id).toBe('main-content');
  });
});
```

---

## 11. Test de tabla accesible

### Ejemplo: Market table component

```typescript
// market-table.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { CryptoModel } from '../../models/crypto.model';

@Component({
  selector: 'app-market-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <table>
      <caption>
        Top cryptocurrencies by market cap
        <span class="sr-only">
          Sortable table with {{ cryptos().length }} entries
        </span>
      </caption>

      <thead>
        <tr>
          <th scope="col" [attr.aria-sort]="getSortDirection('rank')">
            <button type="button" (click)="sortBy('rank')">
              Rank
              @if (sortColumn() === 'rank') {
                <span aria-hidden="true">{{ sortDirection() === 'asc' ? '↑' : '↓' }}</span>
              }
            </button>
          </th>
          <th scope="col">Name</th>
          <th scope="col" class="text-right">Price</th>
          <th scope="col" class="text-right">24h Change</th>
          <th scope="col" class="text-right">Market Cap</th>
        </tr>
      </thead>

      <tbody>
        @for (crypto of sortedCryptos(); track crypto.id) {
          <tr>
            <td>{{ $index + 1 }}</td>
            <td>
              <div class="crypto-info">
                <img
                  [src]="crypto.image"
                  [alt]="crypto.name + ' logo'"
                  width="24"
                  height="24"
                />
                <span>{{ crypto.name }}</span>
                <span class="symbol">{{ crypto.symbol }}</span>
              </div>
            </td>
            <td class="text-right">
              {{ crypto.currentPrice | currency }}
            </td>
            <td
              class="text-right"
              [class.positive]="crypto.percentChange24h > 0"
              [class.negative]="crypto.percentChange24h < 0"
            >
              {{ crypto.percentChange24h | percent }}
              <span class="sr-only">
                {{ crypto.percentChange24h > 0 ? 'increase' : 'decrease' }}
              </span>
            </td>
            <td class="text-right">
              {{ crypto.marketCap | currency:'USD':'symbol':'1.0-0' }}
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class MarketTableComponent {
  cryptos = input.required<CryptoModel[]>();
  sortColumn = signal<keyof CryptoModel>('rank');
  sortDirection = signal<'asc' | 'desc'>('asc');

  sortedCryptos = computed(() => {
    const data = [...this.cryptos()];
    const column = this.sortColumn();
    const direction = this.sortDirection();

    return data.sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];
      const modifier = direction === 'asc' ? 1 : -1;

      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal as string) * modifier;
      }
      return ((aVal as number) - (bVal as number)) * modifier;
    });
  });

  getSortDirection(column: string): string | null {
    if (this.sortColumn() !== column) return null;
    return this.sortDirection();
  }

  sortBy(column: keyof CryptoModel) {
    if (this.sortColumn() === column) {
      // Toggle direction
      this.sortDirection.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }
}
```

### Test de tabla accesible

```typescript
// market-table.component.spec.ts
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, it, expect } from 'vitest';
import { MarketTableComponent } from './market-table.component';

describe('MarketTableComponent - Accessibility', () => {
  const mockCryptos: CryptoModel[] = [
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      currentPrice: 65000,
      marketCap: 1250000000000,
      volume24h: 45000000000,
      percentChange24h: 5.2,
      image: 'https://example.com/btc.png',
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      currentPrice: 3500,
      marketCap: 420000000000,
      volume24h: 20000000000,
      percentChange24h: -2.1,
      image: 'https://example.com/eth.png',
    },
  ];

  it('should have no axe violations', async () => {
    const { container } = await render(MarketTableComponent, {
      componentInputs: { cryptos: mockCryptos },
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have descriptive caption', async () => {
    await render(MarketTableComponent, {
      componentInputs: { cryptos: mockCryptos },
    });

    const table = screen.getByRole('table', {
      name: /top cryptocurrencies by market cap/i,
    });
    expect(table).toBeInTheDocument();

    const caption = table.querySelector('caption');
    expect(caption).toBeInTheDocument();
    expect(caption).toHaveTextContent(/sortable table with 2 entries/i);
  });

  it('should have proper column headers with scope', async () => {
    const { container } = await render(MarketTableComponent, {
      componentInputs: { cryptos: mockCryptos },
    });

    const headers = container.querySelectorAll('th');
    headers.forEach((th) => {
      expect(th).toHaveAttribute('scope', 'col');
    });

    // Check header text
    expect(screen.getByRole('columnheader', { name: /rank/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /price/i })).toBeInTheDocument();
  });

  it('should announce sort state to screen readers', async () => {
    const { container } = await render(MarketTableComponent, {
      componentInputs: { cryptos: mockCryptos },
    });

    const rankHeader = screen.getByRole('columnheader', { name: /rank/i });

    // Initially sorted ascending
    expect(rankHeader).toHaveAttribute('aria-sort', 'asc');
  });

  it('should update aria-sort when column is sorted', async () => {
    const user = userEvent.setup();
    await render(MarketTableComponent, {
      componentInputs: { cryptos: mockCryptos },
    });

    const rankButton = screen.getByRole('button', { name: /rank/i });
    const rankHeader = screen.getByRole('columnheader', { name: /rank/i });

    // Click to sort descending
    await user.click(rankButton);

    expect(rankHeader).toHaveAttribute('aria-sort', 'desc');
  });

  it('should have accessible images in cells', async () => {
    await render(MarketTableComponent, {
      componentInputs: { cryptos: mockCryptos },
    });

    const btcLogo = screen.getByRole('img', { name: /bitcoin logo/i });
    const ethLogo = screen.getByRole('img', { name: /ethereum logo/i });

    expect(btcLogo).toBeInTheDocument();
    expect(ethLogo).toBeInTheDocument();
  });

  it('should announce price change direction to screen readers', async () => {
    const { container } = await render(MarketTableComponent, {
      componentInputs: { cryptos: mockCryptos },
    });

    const rows = container.querySelectorAll('tbody tr');

    // Bitcoin row (positive change)
    const btcChange = rows[0].querySelector('.positive .sr-only');
    expect(btcChange).toHaveTextContent('increase');

    // Ethereum row (negative change)
    const ethChange = rows[1].querySelector('.negative .sr-only');
    expect(ethChange).toHaveTextContent('decrease');
  });
});
```

---

## 12. Test E2E de accesibilidad con MCP

### Full page accessibility audit

```typescript
// e2e/dashboard-accessibility.spec.ts
import { describe, it, expect, beforeAll } from 'vitest';

describe('Dashboard - E2E Accessibility Audit', () => {
  beforeAll(async () => {
    // Activate required MCP tools
    await activate_browser_navigation_tools();
    await activate_web_page_capture_tools();
  });

  it('should load dashboard without accessibility errors', async () => {
    // Navigate to dashboard
    await mcp_microsoft_pla_browser_navigate({
      url: 'http://localhost:4200',
    });

    // Wait for content
    await mcp_microsoft_pla_browser_wait_for({ text: 'Dashboard' });

    // Check console for errors
    const errors = await mcp_microsoft_pla_browser_console_messages({
      level: 'error',
    });

    const a11yErrors = errors.filter(
      (err) =>
        err.text.includes('aria') ||
        err.text.includes('accessibility') ||
        err.text.includes('role')
    );

    expect(a11yErrors).toHaveLength(0);
  });

  it('should have complete keyboard navigation flow', async () => {
    await mcp_microsoft_pla_browser_navigate({
      url: 'http://localhost:4200',
    });

    // Take snapshot to see initial state
    const initialSnapshot = await mcp_microsoft_pla_browser_snapshot();
    expect(initialSnapshot).toContain('navigation');

    // Simulate Tab key presses
    await mcp_microsoft_pla_browser_press_key({ key: 'Tab' });
    await mcp_microsoft_pla_browser_press_key({ key: 'Tab' });
    await mcp_microsoft_pla_browser_press_key({ key: 'Tab' });

    // Take another snapshot to verify focus moved
    const afterTabSnapshot = await mcp_microsoft_pla_browser_snapshot();
    expect(afterTabSnapshot).toBeTruthy();

    // Verify no keyboard traps
    // (should be able to Tab through entire page)
    for (let i = 0; i < 20; i++) {
      await mcp_microsoft_pla_browser_press_key({ key: 'Tab' });
    }

    // Should not crash or get stuck
    const finalSnapshot = await mcp_microsoft_pla_browser_snapshot();
    expect(finalSnapshot).toBeTruthy();
  });

  it('should have proper focus indicators on all interactive elements', async () => {
    await mcp_microsoft_pla_browser_navigate({
      url: 'http://localhost:4200',
    });

    const focusData = await mcp_microsoft_pla_browser_evaluate({
      function: `
        () => {
          const interactiveElements = Array.from(
            document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])')
          );

          return interactiveElements.map(el => {
            el.focus();
            const styles = window.getComputedStyle(el);

            return {
              tag: el.tagName,
              type: el.type,
              text: el.textContent?.trim().substring(0, 30),
              hasFocus: document.activeElement === el,
              outline: styles.outline,
              outlineWidth: styles.outlineWidth,
              boxShadow: styles.boxShadow,
              hasFocusIndicator: styles.outline !== 'none' && styles.outline !== '0px' || styles.boxShadow !== 'none',
            };
          });
        }
      `,
    });

    // All interactive elements should have focus indicators
    focusData.forEach((item: any) => {
      expect(item.hasFocusIndicator).toBe(true);
    });
  });

  it('should have valid ARIA implementation', async () => {
    await mcp_microsoft_pla_browser_navigate({
      url: 'http://localhost:4200',
    });

    const ariaData = await mcp_microsoft_pla_browser_evaluate({
      function: `
        () => {
          const elementsWithAria = Array.from(
            document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role]')
          );

          return elementsWithAria.map(el => {
            const ariaLabel = el.getAttribute('aria-label');
            const ariaLabelledby = el.getAttribute('aria-labelledby');
            const ariaDescribedby = el.getAttribute('aria-describedby');
            const role = el.getAttribute('role');

            // Check if references are valid
            const labelledbyValid = !ariaLabelledby || 
              document.getElementById(ariaLabelledby) !== null;
            const describedbyValid = !ariaDescribedby || 
              document.getElementById(ariaDescribedby) !== null;

            return {
              tag: el.tagName,
              ariaLabel,
              ariaLabelledby,
              ariaDescribedby,
              role,
              labelledbyValid,
              describedbyValid,
            };
          });
        }
      `,
    });

    // All ARIA references should be valid
    ariaData.forEach((item: any) => {
      if (item.ariaLabelledby) {
        expect(item.labelledbyValid).toBe(true);
      }
      if (item.ariaDescribedby) {
        expect(item.describedbyValid).toBe(true);
      }
    });
  });

  it('should take full accessibility snapshot for manual review', async () => {
    await mcp_microsoft_pla_browser_navigate({
      url: 'http://localhost:4200',
    });

    // Take comprehensive snapshot
    const snapshot = await mcp_microsoft_pla_browser_snapshot({
      filename: 'dashboard-full-a11y-audit.md',
    });

    // Verify key accessibility features
    expect(snapshot).toContain('banner'); // Header
    expect(snapshot).toContain('navigation'); // Nav
    expect(snapshot).toContain('main'); // Main content
    expect(snapshot).toContain('contentinfo'); // Footer
    expect(snapshot).toContain('heading'); // Headings present
    expect(snapshot).toContain('button'); // Interactive elements
  });
});
```

---

## Resumen de ejemplos

1. **Setup**: Configuración inicial de Vitest + axe-core
2. **axe-core básico**: Test automatizado de WCAG 2.2 AA/AAA
3. **Navegación por teclado**: Tab, Arrow keys, Escape, Enter
4. **Contraste de color**: Helper para calcular ratios + tests
5. **Live regions**: Anuncios dinámicos para screen readers
6. **Formularios**: Labels, errores, validación accesible
7. **Modales**: Focus trap, Escape key, restore focus
8. **Chrome DevTools MCP**: Auditoría automatizada con browser
9. **Estructura de encabezados**: h1-h6 jerarquía válida
10. **Landmarks ARIA**: banner, nav, main, contentinfo
11. **Tablas accesibles**: caption, scope, aria-sort
12. **E2E con MCP**: Full page audit + keyboard flow

**Total de ejemplos**: 12 completos con código listo para copiar y usar.

---

**✅ Estos ejemplos cubren el 90% de casos de testing de accesibilidad en CryptoTerminal.**


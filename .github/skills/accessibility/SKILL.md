---
name: accessibility
description: Expert guidance for implementing WCAG 2.2 AA/AAA compliant, inclusive, and accessible interfaces in Angular 20 applications. Use when building or auditing UI components for keyboard navigation, screen reader support, color contrast, ARIA patterns, focus management, and accessible forms. Specialized in Angular 20 zoneless architecture with signals, semantic HTML, and assistive technology compatibility.
---

# Accessibility Expert - WCAG 2.2 AA/AAA Compliance

## Overview

This skill provides specialized guidance for creating fully accessible web interfaces that comply with WCAG 2.2 Level AA (minimum) and AAA (target) standards in Angular 20 applications. It covers everything from semantic structure to complex ARIA patterns, ensuring that all people, regardless of their abilities, can use the application effectively.

## Standards and References

- **WCAG 2.2**: [Web Content Accessibility Guidelines](https://www.w3.org/TR/WCAG22/) (W3C Recommendation)
- **ARIA 1.2**: [Accessible Rich Internet Applications](https://www.w3.org/TR/wai-aria-1.2/) (W3C Recommendation)
- **ARIA Authoring Practices Guide (APG)**: [W3C Working Group Note](https://www.w3.org/WAI/ARIA/apg/)
- **Section 508**: U.S. federal accessibility standard
- **EN 301 549**: European accessibility standard
- **Angular 20**: Semantic components, zoneless signals
- **Testing**: axe-core, WAVE, Lighthouse, manual testing

## When to Use This Skill

Invoke this skill when:
- Implementing new UI components (forms, modals, charts, etc.)
- Auditing existing accessibility
- Receiving reports from users with special needs
- Preparing the app for certification/compliance
- Needing specific ARIA patterns (tabs, accordions, tooltips)
- Implementing keyboard navigation
- Designing for screen readers (NVDA, JAWS, VoiceOver)
- Optimizing color contrast or typography

## WCAG 2.2 Principles (POUR)

Reference: [Understanding the Four Principles of Accessibility](https://www.w3.org/WAI/WCAG22/Understanding/intro#understanding-the-four-principles-of-accessibility)

### 1. Perceivable
Users must be able to **perceive** the information being presented.

**Text Alternatives (1.1.1 - Level A)**
- All informative images have descriptive `alt` text
- Decorative images: `alt=""` (empty)
- Functional icons: `aria-label` or `aria-labelledby`
- Reference: [Understanding SC 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)

**Time-based Media (1.2.x - A/AA)**
- Videos: captions for audio content
- Audio: text transcripts available
- Reference: [Guideline 1.2](https://www.w3.org/WAI/WCAG22/Understanding/time-based-media.html)

**Adaptable (1.3.x - A/AA)**
- Correct semantic structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`)
- Logical reading order (DOM order = visual order)
- Labels associated with form fields
- Reference: [Guideline 1.3](https://www.w3.org/WAI/WCAG22/Understanding/adaptable.html)

**Distinguishable (1.4.x - A/AA/AAA)**
- **Minimum Contrast (1.4.3 - AA)**: 
  - Normal text: **4.5:1**
  - Large text (18pt+/14pt+ bold): **3:1**
  - Enhanced contrast (AAA): 7:1 / 4.5:1
  - Reference: [Understanding SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- **Use of Color (1.4.1 - A)**: don't use color as the only visual means; add icons, patterns, text
- **Resize Text (1.4.4 - AA)**: resizable up to 200% without loss of functionality
- **Text Spacing (1.4.12 - AA)**: no loss of content when adjusting line-height, letter-spacing, etc.
- Reference: [Guideline 1.4](https://www.w3.org/WAI/WCAG22/Understanding/distinguishable.html)

### 2. Operable
Users must be able to **operate** the interface.

**Keyboard Accessible (2.1.x - A)**
- **All** functionality available via keyboard
- No keyboard traps
- Keyboard shortcuts documented and configurable
- Reference: [Guideline 2.1](https://www.w3.org/WAI/WCAG22/Understanding/keyboard-accessible.html)

**Enough Time (2.2.x - A/AA)**
- No time limits or extendable by the user
- Pause, stop, hide moving content
- Reference: [Guideline 2.2](https://www.w3.org/WAI/WCAG22/Understanding/enough-time.html)

**Seizures and Physical Reactions (2.3.x - A/AA)**
- Nothing flashes more than 3 times per second
- Respect `prefers-reduced-motion`
- Reference: [Guideline 2.3](https://www.w3.org/WAI/WCAG22/Understanding/seizures-and-physical-reactions.html)

**Navigable (2.4.x - A/AA/AAA)**
- **Skip links**: "Skip to main content"
- **Page titles**: descriptive and unique `<title>`
- **Focus order**: logical and predictable
- **Link purpose**: descriptive text (not "click here")
- **Focus Visible (2.4.7 - AA)**: focus always clearly visible
- **Multiple navigation ways**: menu, search, breadcrumbs
- Reference: [Guideline 2.4](https://www.w3.org/WAI/WCAG22/Understanding/navigable.html)

**Input Modalities (2.5.x - A/AA/AAA)**
- **Target Size (2.5.5 - AAA)**: minimum 44x44px for touch/click (2.5.8 - AA: 24x24px minimum)
- **Pointer Gestures**: alternatives to complex gestures (multi-touch, path-based)
- **Label in Name (2.5.3 - A)**: accessible name includes visible text
- Reference: [Guideline 2.5](https://www.w3.org/WAI/WCAG22/Understanding/input-modalities.html)

### 3. Understandable
Users must be able to **understand** the information and operation.

**Readable (3.1.x - A/AA)**
- **Language of Page (3.1.1 - A)**: `<html lang="en">`
- **Language of Parts (3.1.2 - AA)**: `<span lang="es">...</span>` when it changes
- Reference: [Guideline 3.1](https://www.w3.org/WAI/WCAG22/Understanding/readable.html)

**Predictable (3.2.x - A/AA)**
- **On Focus**: doesn't trigger unexpected context changes
- **On Input**: doesn't change context without warning
- **Consistent Navigation**: same structure on all pages
- **Consistent Identification**: same icons/labels for same functions
- Reference: [Guideline 3.2](https://www.w3.org/WAI/WCAG22/Understanding/predictable.html)

**Input Assistance (3.3.x - A/AA/AAA)**
- **Error Detection**: clear and specific messages
- **Labels or Instructions**: always visible on required fields
- **Error Suggestion**: how to resolve errors
- **Error Prevention**: confirmation on irreversible actions
- Reference: [Guideline 3.3](https://www.w3.org/WAI/WCAG22/Understanding/input-assistance.html)

### 4. Robust
Content must be **robust** enough for different assistive technologies.

**Compatible (4.1.x - A/AA)**
- **Valid HTML**: no critical parsing errors
- **Name, Role, Value (4.1.2 - A)**: all UI components have accessible name, correct ARIA role, and updated states
- Reference: [Guideline 4.1](https://www.w3.org/WAI/WCAG22/Understanding/compatible.html)

---

## Angular 20 + Accessibility

### Zoneless Components + Signals

#### Using Signals for Accessible State

```typescript
import { Component, signal, computed, inject } from '@angular/core';

@Component({
  selector: 'app-accessible-toggle',
  standalone: true,
  template: `
    <button
      type="button"
      [attr.aria-pressed]="isPressed()"
      [attr.aria-label]="ariaLabel()"
      (click)="toggle()"
      class="toggle-btn"
    >
      <span aria-hidden="true">{{ isPressed() ? '✓' : '○' }}</span>
      {{ label() }}
    </button>
  `,
})
export default class AccessibleToggleComponent {
  label = input.required<string>();
  isPressed = signal(false);
  
  ariaLabel = computed(() => 
    `${this.label()}, ${this.isPressed() ? 'activado' : 'desactivado'}`
  );

  toggle() {
    this.isPressed.update(val => !val);
  }
}
```

**✅ Best practices:**
- `aria-pressed` reactively updated with signals
- `computed()` for dynamic aria-label
- Decorative icon with `aria-hidden="true"`
- Visible text always present

#### Focus Management with ViewChild + Signals

```typescript
import { Component, viewChild, effect, ElementRef } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="close()">
        <div 
          class="modal-content" 
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          (click)="$event.stopPropagation()"
          #modalContent
        >
          <h2 [id]="titleId">{{ title() }}</h2>
          <button 
            type="button"
            (click)="close()"
            aria-label="Close modal"
            #closeButton
          >
            ✕
          </button>
          <div>
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
})
export default class ModalComponent {
  title = input.required<string>();
  isOpen = signal(false);
  titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`;
  
  private closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');
  
  constructor() {
    // Automatic focus on close button when opening modal
    effect(() => {
      if (this.isOpen()) {
        this.closeButton()?.nativeElement.focus();
      }
    });
  }

  open() {
    // Save previous focus to restore later
    this.previousActiveElement = document.activeElement as HTMLElement;
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    // Restore focus to previous element
    this.previousActiveElement?.focus();
  }

  private previousActiveElement: HTMLElement | null = null;
}
```

**✅ Best practices:**
- `role="dialog"` + `aria-modal="true"`
- `aria-labelledby` points to visible heading
- Focus trap: focus goes to modal when opening
- Restore focus when closing
- ESC and click outside to close (implement with HostListener)
- Reference: [Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

---

## Complex ARIA Patterns

Reference: [W3C ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/)

### Accessible Tabs

Pattern Reference: [Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)

```typescript
import { Component, signal, computed } from '@angular/core';

interface Tab {
  id: string;
  label: string;
  content: string;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  template: `
    <div class="tabs">
      <div role="tablist" aria-label="Secciones del dashboard">
        @for (tab of tabs(); track tab.id) {
          <button
            type="button"
            role="tab"
            [id]="'tab-' + tab.id"
            [attr.aria-selected]="activeTab() === tab.id"
            [attr.aria-controls]="'panel-' + tab.id"
            [tabindex]="activeTab() === tab.id ? 0 : -1"
            (click)="selectTab(tab.id)"
            (keydown)="handleKeydown($event, tab.id)"
            class="tab"
            [class.active]="activeTab() === tab.id"
          >
            {{ tab.label }}
          </button>
        }
      </div>
      
      @for (tab of tabs(); track tab.id) {
        <div
          [id]="'panel-' + tab.id"
          role="tabpanel"
          [attr.aria-labelledby]="'tab-' + tab.id"
          [hidden]="activeTab() !== tab.id"
          [tabindex]="0"
          class="tab-panel"
        >
          {{ tab.content }}
        </div>
      }
    </div>
  `,
})
export default class TabsComponent {
  tabs = signal<Tab[]>([
    { id: 'overview', label: 'Overview', content: 'Overview content' },
    { id: 'markets', label: 'Markets', content: 'Markets content' },
    { id: 'portfolio', label: 'Portfolio', content: 'Portfolio content' },
  ]);
  
  activeTab = signal('overview');
  
  selectTab(id: string) {
    this.activeTab.set(id);
  }
  
  handleKeydown(event: KeyboardEvent, currentId: string) {
    const tabIds = this.tabs().map(t => t.id);
    const currentIndex = tabIds.indexOf(currentId);
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % tabIds.length;
        break;
      case 'ArrowLeft':
        newIndex = currentIndex === 0 ? tabIds.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabIds.length - 1;
        break;
      default:
        return;
    }
    
    event.preventDefault();
    const newId = tabIds[newIndex];
    this.selectTab(newId);
    
    // Focus on new tab
    setTimeout(() => {
      document.getElementById(`tab-${newId}`)?.focus();
    });
  }
}
```

**✅ ARIA patterns applied:**
- `role="tablist"` + `role="tab"` + `role="tabpanel"`
- `aria-selected` on active tab
- `aria-controls` connects tab with panel
- Roving `tabindex`: only active tab is focusable (0), rest (-1)
- Navigation with arrows, Home, End
- Panel with `tabindex="0"` for scrolling within
- Reference: [Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)

---

### Combobox / Autocomplete

Pattern Reference: [Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

```typescript
import { Component, signal, computed, effect } from '@angular/core';

interface Option {
  id: string;
  label: string;
}

@Component({
  selector: 'app-combobox',
  standalone: true,
  template: `
    <div class="combobox-wrapper">
      <label [for]="inputId">{{ label() }}</label>
      <input
        [id]="inputId"
        type="text"
        role="combobox"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-controls]="listboxId"
        [attr.aria-activedescendant]="activeDescendant()"
        [attr.aria-autocomplete]="'list'"
        [value]="inputValue()"
        (input)="onInput($event)"
        (keydown)="handleKeydown($event)"
        (focus)="open()"
        (blur)="onBlur()"
      />
      
      @if (isOpen() && filteredOptions().length > 0) {
        <ul
          [id]="listboxId"
          role="listbox"
          [attr.aria-label]="label()"
          class="listbox"
        >
          @for (option of filteredOptions(); track option.id; let i = $index) {
            <li
              [id]="getOptionId(i)"
              role="option"
              [attr.aria-selected]="selectedId() === option.id"
              [class.highlighted]="highlightedIndex() === i"
              (mousedown)="selectOption(option)"
              (mouseenter)="highlightedIndex.set(i)"
            >
              {{ option.label }}
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export default class ComboboxComponent {
  label = input.required<string>();
  options = input.required<Option[]>();
  
  inputId = `combobox-${Math.random().toString(36).substr(2, 9)}`;
  listboxId = `listbox-${this.inputId}`;
  
  inputValue = signal('');
  selectedId = signal<string | null>(null);
  isOpen = signal(false);
  highlightedIndex = signal(0);
  
  filteredOptions = computed(() => {
    const query = this.inputValue().toLowerCase();
    return this.options().filter(opt => 
      opt.label.toLowerCase().includes(query)
    );
  });
  
  activeDescendant = computed(() => {
    const idx = this.highlightedIndex();
    return this.isOpen() && this.filteredOptions().length > 0
      ? this.getOptionId(idx)
      : null;
  });
  
  getOptionId(index: number) {
    return `${this.listboxId}-option-${index}`;
  }
  
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.inputValue.set(value);
    this.isOpen.set(true);
    this.highlightedIndex.set(0);
  }
  
  selectOption(option: Option) {
    this.selectedId.set(option.id);
    this.inputValue.set(option.label);
    this.isOpen.set(false);
  }
  
  open() {
    this.isOpen.set(true);
  }
  
  onBlur() {
    // Delay to allow click on options
    setTimeout(() => this.isOpen.set(false), 200);
  }
  
  handleKeydown(event: KeyboardEvent) {
    const filtered = this.filteredOptions();
    const maxIndex = filtered.length - 1;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
        } else {
          this.highlightedIndex.update(idx => Math.min(idx + 1, maxIndex));
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex.update(idx => Math.max(idx - 1, 0));
        break;
        
      case 'Enter':
        event.preventDefault();
        if (this.isOpen() && filtered.length > 0) {
          this.selectOption(filtered[this.highlightedIndex()]);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        this.isOpen.set(false);
        break;
    }
  }
}
```

**✅ ARIA patterns applied:**
- `role="combobox"` on input
- `aria-expanded`, `aria-controls`, `aria-activedescendant`
- `role="listbox"` + `role="option"`
- `aria-selected` on selected option
- Navigation with arrows, Enter, Escape
- `aria-activedescendant` updated with signal
- Reference: [Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

---

## Accessible Forms

Reference: [Understanding SC 3.3.2: Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)

### Golden Rules

1. **Always visible `<label>`** associated with `for`/`id`
2. **Placeholders DO NOT replace labels**
3. **Clear error messages** associated with `aria-describedby`
4. **Required fields**: visual indicator + `required` + `aria-required`
5. **Related groups**: `<fieldset>` + `<legend>`
6. **Inline validation**: immediate feedback without reload

### Complete Example: Login Form

```typescript
import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" novalidate>
      <h1>Sign In</h1>
      
      <!-- Email Field -->
      <div class="form-field">
        <label for="email">
          Email
          <abbr title="required" aria-label="required">*</abbr>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          [(ngModel)]="email"
          (blur)="validateEmail()"
          [attr.aria-invalid]="emailError() ? 'true' : null"
          [attr.aria-describedby]="emailError() ? 'email-error' : null"
          required
          aria-required="true"
          autocomplete="email"
        />
        @if (emailError()) {
          <span id="email-error" class="error" role="alert">
            {{ emailError() }}
          </span>
        }
      </div>
      
      <!-- Password Field -->
      <div class="form-field">
        <label for="password">
          Password
          <abbr title="required" aria-label="required">*</abbr>
        </label>
        <input
          [id]="passwordId"
          [type]="showPassword() ? 'text' : 'password'"
          name="password"
          [(ngModel)]="password"
          (blur)="validatePassword()"
          [attr.aria-invalid]="passwordError() ? 'true' : null"
          [attr.aria-describedby]="passwordError() ? 'password-error' : 'password-help'"
          required
          aria-required="true"
          autocomplete="current-password"
        />
        <button
          type="button"
          [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
          (click)="togglePasswordVisibility()"
          class="toggle-password"
        >
          {{ showPassword() ? '👁️' : '👁️‍🗨️' }}
        </button>
        <span id="password-help" class="help-text">
          Minimum 8 characters
        </span>
        @if (passwordError()) {
          <span id="password-error" class="error" role="alert">
            {{ passwordError() }}
          </span>
        }
      </div>
      
      <!-- Remember me -->
      <div class="form-field checkbox-field">
        <input
          id="remember"
          type="checkbox"
          name="remember"
          [(ngModel)]="rememberMe"
        />
        <label for="remember">Remember me</label>
      </div>
      
      <!-- Submit -->
      <button
        type="submit"
        [disabled]="isSubmitting() || !isValid()"
        [attr.aria-busy]="isSubmitting() ? 'true' : null"
      >
        @if (isSubmitting()) {
          <span aria-hidden="true">⏳</span>
          Signing in...
        } @else {
          Sign In
        }
      </button>
      
      <!-- Success/error global message -->
      @if (globalMessage()) {
        <div
          role="status"
          [attr.aria-live]="globalMessage().type === 'error' ? 'assertive' : 'polite'"
          class="global-message"
          [class.error]="globalMessage().type === 'error'"
          [class.success]="globalMessage().type === 'success'"
        >
          {{ globalMessage().text }}
        </div>
      }
    </form>
  `,
})
export default class LoginFormComponent {
  email = '';
  password = '';
  rememberMe = false;
  showPassword = signal(false);
  
  emailError = signal<string | null>(null);
  passwordError = signal<string | null>(null);
  isSubmitting = signal(false);
  globalMessage = signal<{ type: 'success' | 'error', text: string } | null>(null);
  
  passwordId = `password-${Math.random().toString(36).substr(2, 9)}`;
  
  isValid = computed(() => 
    this.email.length > 0 && 
    this.password.length >= 8 && 
    !this.emailError() && 
    !this.passwordError()
  );
  
  validateEmail() {
    if (!this.email) {
      this.emailError.set('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError.set('Invalid email format');
    } else {
      this.emailError.set(null);
    }
  }
  
  validatePassword() {
    if (!this.password) {
      this.passwordError.set('Password is required');
    } else if (this.password.length < 8) {
      this.passwordError.set('Password must be at least 8 characters');
    } else {
      this.passwordError.set(null);
    }
  }
  
  togglePasswordVisibility() {
    this.showPassword.update(val => !val);
  }
  
  async onSubmit() {
    this.validateEmail();
    this.validatePassword();
    
    if (!this.isValid()) {
      this.globalMessage.set({
        type: 'error',
        text: 'Please correct the errors before continuing'
      });
      return;
    }
    
    this.isSubmitting.set(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.globalMessage.set({
        type: 'success',
        text: 'Successfully signed in'
      });
    } catch (error) {
      this.globalMessage.set({
        type: 'error',
        text: 'Error signing in. Please try again.'
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
```

**✅ Form checklist:**
- ✅ Visible labels with `for`/`id`
- ✅ `required` + `aria-required="true"`
- ✅ `aria-invalid` when there's an error
- ✅ `aria-describedby` points to error message or help text
- ✅ `role="alert"` on errors for immediate announcement
- ✅ `aria-busy` on button during submit
- ✅ `aria-live="assertive"` for global errors
- ✅ Appropriate `autocomplete` (improves UX and accessibility)
- ✅ Required field indicator (`*`) with `aria-label`
- ✅ Accessible show/hide password button
- Reference: [Understanding SC 3.3.1-3.3.6](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)

---

## Color Contrast

Reference: [Understanding SC 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

### Validation Tools

- **Chrome DevTools**: Inspect element → Accessibility pane → Contrast ratio
- **axe DevTools**: Chrome extension with automatic auditing
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Colour Contrast Analyser**: Free desktop app

### Tailwind + Contraste

```typescript
// tailwind.config.js (excerpt)
module.exports = {
  theme: {
    extend: {
      colors: {
        // ✅ Dark text on light background: >7:1 (AAA)
        'text-primary': '#111827',      // gray-900
        'bg-light': '#F9FAFB',          // gray-50
        
        // ✅ Light text on dark background: >7:1 (AAA)
        'text-light': '#F9FAFB',        // gray-50
        'bg-dark': '#111827',           // gray-900
        
        // ⚠️ Caution with intermediate tones (always validate)
        'text-muted': '#6B7280',        // gray-500 (on white: 4.6:1 - AA ✅)
        'crypto-neon': '#00FF88',       // (on #111827: 11.2:1 - AAA ✅)
        
        // ❌ Avoid low contrast combinations
        // 'text-gray-400' on 'bg-gray-300' → ~2:1 (fails)
      }
    }
  }
}
```

### Example: Price Card with Validated Contrast

```typescript
@Component({
  selector: 'app-price-card',
  standalone: true,
  template: `
    <div class="bg-crypto-dark border border-gray-800 rounded-lg p-6">
      <!-- Title: white text on dark (>7:1) -->
      <h3 class="text-white text-lg font-semibold mb-2">
        {{ crypto().name }}
      </h3>
      
      <!-- Symbol: light gray on dark (>4.5:1) -->
      <span class="text-gray-400 text-sm">
        {{ crypto().symbol }}
      </span>
      
      <!-- Price: neon green on dark (>11:1) -->
      <p class="text-crypto-neon text-3xl font-bold mt-4">
        {{ crypto().price | currency }}
      </p>
      
      <!-- Change: semantic color with validated contrast -->
      <span
        [class.text-green-400]="crypto().change > 0"
        [class.text-red-400]="crypto().change < 0"
        class="text-sm font-medium"
      >
        {{ crypto().change > 0 ? '+' : '' }}{{ crypto().change }}%
      </span>
    </div>
  `,
})
export default class PriceCardComponent {
  crypto = input.required<Crypto>();
}
```

**✅ Validated:**
- White (`#FFFFFF`) on `crypto-dark` (`#1A1A2E`): 15.3:1 (AAA)
- `gray-400` (`#9CA3AF`) on `crypto-dark`: 5.8:1 (AA large, AAA if >18pt)
- `crypto-neon` (`#00FF88`) on `crypto-dark`: 11.2:1 (AAA)
- `green-400` / `red-400` on `crypto-dark`: >4.5:1 (AA)

---

## Keyboard Navigation

Reference: [Understanding SC 2.1.1: Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)

### Standard Keys

| Key | Action |
|-----|--------|
| `Tab` | Move to next focusable element |
| `Shift + Tab` | Move to previous focusable element |
| `Enter` | Activate button/link |
| `Space` | Activate button/checkbox |
| `Escape` | Close modal/dropdown |
| `Arrow keys` | Navigation in complex components (tabs, combobox, sliders) |
| `Home` / `End` | Go to start/end of list or content |

### Skip Links (Skip Navigation)

Reference: [Understanding SC 2.4.1: Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html)

```typescript
// app.component.ts
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <!-- Skip link (always first) -->
    <a href="#main-content" class="skip-link">
      Skip to main content
    </a>
    
    <app-header />
    
    <main id="main-content" tabindex="-1">
      <router-outlet />
    </main>
    
    <app-footer />
  `,
  styles: [`
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--crypto-neon);
      color: var(--crypto-dark);
      padding: 8px 16px;
      text-decoration: none;
      font-weight: bold;
      z-index: 9999;
    }
    
    .skip-link:focus {
      top: 0;
    }
  `]
})
export default class AppComponent {}
```

**✅ Best practices:**
- Skip link visible only on `focus`
- `tabindex="-1"` on `<main>` allows programmatic focus
- Link points to unique ID (`#main-content`)

### Focus Visible (Always)

Reference: [Understanding SC 2.4.7: Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)

```scss
// styles.scss (global)
*:focus-visible {
  outline: 3px solid var(--crypto-neon);
  outline-offset: 2px;
}

// Never remove outline without replacement
button:focus {
  // ❌ DON'T DO THIS
  // outline: none;
}

// ✅ IF you need custom styles, make them very visible
button:focus-visible {
  outline: 3px solid var(--crypto-neon);
  box-shadow: 0 0 0 6px rgba(0, 255, 136, 0.2);
}
```

---

## Accessibility Testing

Reference: [Evaluating Web Accessibility Overview](https://www.w3.org/WAI/test-evaluate/)

### Automated Tools

#### 1. axe-core in Unit Tests (Vitest)

```bash
npm install --save-dev axe-core
```

```typescript
// price-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { axe, toHaveNoViolations } from 'jest-axe'; // o compatible con Vitest
import PriceCardComponent from './price-card.component';

expect.extend(toHaveNoViolations);

describe('PriceCardComponent - Accessibility', () => {
  let fixture: ComponentFixture<PriceCardComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceCardComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(PriceCardComponent);
    fixture.componentRef.setInput('crypto', {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 50000,
      change: 2.5
    });
    fixture.detectChanges();
  });
  
  it('should have no axe violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
  
  it('should have valid ARIA attributes', () => {
    const element = fixture.nativeElement;
    const priceElement = element.querySelector('[data-testid="price"]');
    
    expect(priceElement).toHaveAttribute('aria-label');
    expect(priceElement?.getAttribute('aria-label')).toContain('Bitcoin');
  });
  
  it('should have sufficient color contrast', async () => {
    // axe will validate contrast automatically
    const results = await axe(fixture.nativeElement, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    expect(results.violations.filter(v => v.id === 'color-contrast')).toHaveLength(0);
  });
});
```

#### 2. Lighthouse CI en Pipeline

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Audit

on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:4200
            http://localhost:4200/markets
            http://localhost:4200/portfolio
          configPath: './lighthouserc.json'
          uploadArtifacts: true
```

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "color-contrast": "error",
        "aria-required-attr": "error",
        "aria-valid-attr": "error",
        "button-name": "error",
        "document-title": "error",
        "html-has-lang": "error",
        "label": "error",
        "link-name": "error"
      }
    }
  }
}
```

### Manual Testing

Reference: [Manual Accessibility Testing](https://www.w3.org/WAI/test-evaluate/preliminary/)

#### Manual Checklist (Mandatory)

```markdown
## Manual Accessibility Checklist

### Keyboard Navigation
- [ ] All interactive elements accessible with Tab
- [ ] Logical focus order (follows visual order)
- [ ] Focus visible on all elements
- [ ] No keyboard traps
- [ ] Skip link functional
- [ ] Modals trap focus correctly
- [ ] Escape closes modals/dropdowns

### Screen Reader (NVDA/JAWS/VoiceOver)
- [ ] Headings in logical order (h1 → h2 → h3, no skips)
- [ ] Landmarks (`<main>`, `<nav>`, `<header>`, `<footer>`) present
- [ ] Informative images have descriptive alt
- [ ] Decorative images with alt=""
- [ ] Links have descriptive text (not "click here")
- [ ] Forms: labels audible and associated
- [ ] Form errors announced with role="alert"
- [ ] Dynamic states announced (aria-live)

### Color Contrast
- [ ] Normal text: minimum 4.5:1
- [ ] Large text: minimum 3:1
- [ ] UI elements (buttons, borders): minimum 3:1
- [ ] Validated with tool (Contrast Checker, axe DevTools)

### Zoom and Resizing
- [ ] 200% zoom: no loss of content/functionality
- [ ] 400% zoom (WCAG 2.2 AAA): content reflows correctly
- [ ] No horizontal scroll on mobile

### Animations and Motion
- [ ] prefers-reduced-motion respected
- [ ] Animations pausable/stoppable
- [ ] No flashing >3 times/second

### Responsive and Touch
- [ ] Buttons/links minimum 44x44px (touch targets)
- [ ] Complex gestures have alternatives
- [ ] Full functionality on mobile
```

---

## Resources and References

### Official Documentation

- **WCAG 2.2**: https://www.w3.org/TR/WCAG22/
- **ARIA 1.2**: https://www.w3.org/TR/wai-aria-1.2/
- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/
- **W3C Accessibility Fundamentals**: https://www.w3.org/WAI/fundamentals/
- **WebAIM**: https://webaim.org/
- **A11y Project**: https://www.a11yproject.com/

### Tools

- **axe DevTools**: Chrome/Firefox extension (free + pro)
- **WAVE**: Chrome extension (WebAIM)
- **Lighthouse**: Integrated in Chrome DevTools
- **NVDA**: Free screen reader (Windows)
- **VoiceOver**: Built-in screen reader (macOS/iOS)
- **Colour Contrast Analyser**: https://www.tpgi.com/color-contrast-checker/
- **Accessibility Insights**: Microsoft extension (free)

### Courses and Guides

- **Web Accessibility by Google**: https://web.dev/accessibility/
- **W3C Web Accessibility Initiative (WAI)**: https://www.w3.org/WAI/
- **Deque University**: https://dequeuniversity.com/
- **Frontend Masters**: "Web Accessibility" by Jon Kuperman
- **Udacity**: "Web Accessibility" (free)

---

## Examples

See [EXAMPLES.md](./EXAMPLES.md) for comprehensive practical examples including:
- Accessible toggle button with signals
- Modal dialog with focus management
- Accessible tabs component (ARIA pattern)
- Complete accessible form (login)
- Skip links for keyboard navigation
- Real-time price card with live regions
- Accessible data tables
- Notification system with live regions
- Color contrast validation
- Quick accessibility checklist

---

## Use Cases: CryptoTerminal

### Dashboard with Charts (ApexCharts)

```typescript
@Component({
  selector: 'app-chart',
  standalone: true,
  template: `
    <div class="chart-wrapper">
      <h2 id="chart-title">{{ crypto().name }} Price (24h)</h2>
      
      <!-- Alternative description for screen readers -->
      <div id="chart-description" class="sr-only">
        Line chart showing {{ crypto().name }} price 
        over the last 24 hours. Current price is {{ currentPrice() | currency }}, 
        with a change of {{ crypto().change }}% from the previous day.
        Maximum price was {{ maxPrice() | currency }} 
        and minimum {{ minPrice() | currency }}.
      </div>
      
      <apexchart
        [series]="chartSeries()"
        [chart]="chartOptions"
        [attr.aria-labelledby]="'chart-title'"
        [attr.aria-describedby]="'chart-description'"
        role="img"
      />
      
      <!-- Alternative data table (toggleable) -->
      <button
        type="button"
        (click)="toggleDataTable()"
        [attr.aria-expanded]="showDataTable()"
        aria-controls="chart-data-table"
        class="toggle-table-btn"
      >
        {{ showDataTable() ? 'Hide' : 'Show' }} data table
      </button>
      
      @if (showDataTable()) {
        <table id="chart-data-table" class="data-table">
          <caption>{{ crypto().name }} price data</caption>
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            @for (point of chartData(); track point.timestamp) {
              <tr>
                <td>{{ point.timestamp | date:'short' }}</td>
                <td>{{ point.value | currency }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export default class ChartComponent {
  crypto = input.required<Crypto>();
  chartData = input.required<ChartDataPoint[]>();
  showDataTable = signal(false);
  
  currentPrice = computed(() => this.crypto().price);
  maxPrice = computed(() => Math.max(...this.chartData().map(d => d.value)));
  minPrice = computed(() => Math.min(...this.chartData().map(d => d.value)));
  
  chartSeries = computed(() => [{
    name: this.crypto().name,
    data: this.chartData().map(d => ({ x: d.timestamp, y: d.value }))
  }]);
  
  chartOptions = {
    chart: { type: 'line' },
    stroke: { curve: 'smooth' },
    // ... opciones de ApexCharts
  };
  
  toggleDataTable() {
    this.showDataTable.update(val => !val);
  }
}
```

**✅ Accessibility in charts:**
- `role="img"` + `aria-labelledby` + `aria-describedby`
- Text description with key statistics
- Alternative data table (toggleable)
- Don't use color as only information (use patterns/labels)
- Reference: [Complex Images](https://www.w3.org/WAI/tutorials/images/complex/)

---

### Real-time Notifications (WebSocket)

```typescript
@Component({
  selector: 'app-notifications',
  standalone: true,
  template: `
    <!-- Live region for notifications -->
    <div
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    >
      {{ liveAnnouncement() }}
    </div>
    
    <!-- Visible notifications -->
    <div class="notifications-list" role="log" aria-label="Recent notifications">
      @for (notif of notifications(); track notif.id) {
        <div
          class="notification"
          [class.success]="notif.type === 'success'"
          [class.warning]="notif.type === 'warning'"
          [class.error]="notif.type === 'error'"
          role="status"
        >
          <span class="icon" aria-hidden="true">
            {{ notif.type === 'success' ? '✓' : 
               notif.type === 'warning' ? '⚠️' : '✕' }}
          </span>
          <p>{{ notif.message }}</p>
          <button
            type="button"
            (click)="dismiss(notif.id)"
            aria-label="Dismiss notification: {{ notif.message }}"
          >
            ✕
          </button>
        </div>
      }
    </div>
  `,
})
export default class NotificationsComponent {
  private wsService = inject(WebSocketService);
  
  notifications = signal<Notification[]>([]);
  liveAnnouncement = signal('');
  
  constructor() {
    // Listen to WebSocket notifications
    this.wsService.notifications$.pipe(
      takeUntilDestroyed()
    ).subscribe(notif => {
      this.notifications.update(list => [notif, ...list]);
      
      // Announce for screen readers
      this.liveAnnouncement.set(notif.message);
      
      // Clear announcement after 1 second
      setTimeout(() => this.liveAnnouncement.set(''), 1000);
    });
  }
  
  dismiss(id: string) {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }
}
```

**✅ Live regions:**
- `aria-live="polite"` for non-critical updates
- `aria-live="assertive"` for urgent errors
- `aria-atomic="true"` announces entire content
- `role="log"` for notification list
- Icons with `aria-hidden="true"`
- Reference: [Live Regions](https://www.w3.org/WAI/ARIA/apg/practices/live-regions/)

---

## Anti-Patterns (❌ NEVER DO THIS)

### 1. Hide focus outline without replacement
```scss
// ❌ BAD
* {
  outline: none !important;
}
```

### 2. Div/Span as button without role
```html
<!-- ❌ BAD -->
<div (click)="doSomething()">Click me</div>

<!-- ✅ GOOD -->
<button type="button" (click)="doSomething()">Click me</button>
```

### 3. Click without keyboard handler
```html
<!-- ❌ BAD -->
<div (click)="select()">Option</div>

<!-- ✅ GOOD -->
<button type="button" (click)="select()">Option</button>
<!-- Or if it MUST be a div: -->
<div
  role="button"
  tabindex="0"
  (click)="select()"
  (keydown.enter)="select()"
  (keydown.space)="select(); $event.preventDefault()"
>
  Option
</div>
```

### 4. Placeholder as label
```html
<!-- ❌ BAD -->
<input type="email" placeholder="Email" />

<!-- ✅ GOOD -->
<label for="email">Email</label>
<input id="email" type="email" placeholder="user@example.com" />
```

### 5. Redundant or incorrect ARIA
```html
<!-- ❌ BAD: redundant aria-label -->
<button aria-label="Save">Save</button>

<!-- ✅ GOOD: visible text is sufficient -->
<button>Save</button>

<!-- ❌ BAD: aria-label on static div -->
<div aria-label="Content">...</div>

<!-- ✅ GOOD: use semantic headings -->
<section>
  <h2>Content</h2>
  <p>...</p>
</section>
```

### 6. Open new windows without warning
```html
<!-- ❌ BAD -->
<a href="https://example.com" target="_blank">Documentation</a>

<!-- ✅ GOOD -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Documentation
  <span class="sr-only">(opens in new tab)</span>
</a>
```

---

## Conclusion

Accessibility is NOT optional. It is:
- **Legal**: Required by laws (ADA, Section 508, EN 301 549)
- **Ethical**: Inclusion for everyone
- **Profitable**: Larger audience, better SEO, fewer lawsuits
- **Technical**: Improves semantics, maintainability, and general UX

### Final Checklist: Accessible Component

```markdown
- [ ] Semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
- [ ] Visible labels on forms
- [ ] Minimum contrast 4.5:1 (normal text) / 3:1 (large text)
- [ ] Fully keyboard navigable
- [ ] Focus always visible
- [ ] ARIA only when necessary (not redundant)
- [ ] Dynamic states announced (aria-live, role="status")
- [ ] Informative images with descriptive alt
- [ ] Skip links to main content
- [ ] Tested with axe-core (no violations)
- [ ] Manually tested with keyboard
- [ ] Tested with screen reader (NVDA/VoiceOver)
```

**Remember**: Accessibility from the start is 10x easier than retrofitting. Design, implement, and test with accessibility in mind in every commit.

---

**Accessibility = Better code + Better experience for EVERYONE.** 🌐♿✨

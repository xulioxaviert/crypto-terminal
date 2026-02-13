---
name: accessibility-testing
description: Expert accessibility testing and auditing using MCP tools (Chrome DevTools, Browser Automation) and manual testing with assistive technologies. Use when validating WCAG 2.2 AA/AAA compliance without installing additional project dependencies. Focuses on browser-based analysis, accessibility tree snapshots, and programmatic evaluation via MCP.
---

# Accessibility Testing Expert - WCAG 2.2 AA/AAA Compliance & Audit

## Overview

This skill provides comprehensive guidance for **testing, auditing, and validating** accessibility compliance in Angular 20 applications. It primarily utilizes **MCP tools** for browser-based analysis and automated checks, combined with manual testing using assistive technologies (NVDA, JAWS, VoiceOver), ensuring WCAG 2.2 Level AA (minimum) and AAA (target) compliance without modifying the project's dependency tree.

**Key Differentiator**: While the `accessibility` skill focuses on **implementation**, this skill focuses on **testing and validation**.

## Required Tools & Integrations

### 1. **MCP Tools** (Must activate first)
Before testing accessibility, activate these MCP capabilities:

```bash
# Activate Chrome DevTools MCP for browser automation
activate_browser_navigation_tools
activate_web_page_capture_tools

# Activate accessibility inspection (if available)
mcp_microsoft_pla_browser_snapshot  # Accessibility tree snapshot
mcp_microsoft_pla_browser_console_messages  # Console errors
```

### 2. **Browser & Environment**
- **Chrome/Edge**: Required for MCP browser automation.
- **Local Development Server**: Application must be running locally (e.g., `http://localhost:4200`) to be accessible by MCP tools.

### 3. **Assistive Technology Setup**
Recommended screen readers for manual testing:

- **Windows**: NVDA (free, open source) - [Download](https://www.nvaccess.org/)
- **macOS**: VoiceOver (built-in, Cmd+F5 to toggle)
- **Windows**: JAWS (commercial, widely used in enterprise)
- **Linux**: Orca (built-in GNOME screen reader)

### 4. **Browser Extensions**
Recommended Chrome/Firefox extensions:

- **axe DevTools** - [Chrome](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
- **WAVE** - [Chrome](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
- **Accessibility Insights for Web** - [Chrome](https://chrome.google.com/webstore/detail/accessibility-insights-fo/pbjjkligggfmakdaogkfomddhfmpjeni)
- **Lighthouse** (built into Chrome DevTools)

## Standards and References

- **WCAG 2.2**: [Web Content Accessibility Guidelines](https://www.w3.org/TR/WCAG22/)
- **ARIA 1.2**: [Accessible Rich Internet Applications](https://www.w3.org/TR/wai-aria-1.2/)
- **ARIA Authoring Practices Guide (APG)**: [W3C Working Group Note](https://www.w3.org/WAI/ARIA/apg/)
- **Section 508**: U.S. federal accessibility standard
- **EN 301 549**: European accessibility standard
- **axe-core Rules**: [Deque University Rule Descriptions](https://dequeuniversity.com/rules/axe/)

## When to Use This Skill

Invoke this skill when:
- ✅ Auditing a component or page for WCAG compliance
- ✅ Writing automated accessibility tests (Vitest + axe)
- ✅ Testing keyboard navigation flows
- ✅ Validating screen reader announcements
- ✅ Checking color contrast compliance
- ✅ Verifying focus management
- ✅ Testing with assistive technologies (NVDA, VoiceOver)
- ✅ Preparing for accessibility certification
- ✅ Investigating user-reported accessibility bugs
- ✅ Performing pre-release accessibility QA

## Testing Strategy (The Pyramid)

### Level 1: Automated Testing (Foundation) - 60%
Catch 30-40% of accessibility issues automatically.

**Tools**: MCP Browser Automation, Chrome DevTools Protocol
**What it catches**:
- Missing alt text
- Missing form labels
- Invalid ARIA usage
- Color contrast (basic)
- Semantic HTML violations
- Duplicate IDs

**What it misses**:
- Logical keyboard order
- Screen reader experience quality
- Dynamic content updates
- Context-specific ARIA correctness
- Visual focus clarity

### Level 2: Manual Keyboard Testing (Middle) - 30%
Validate keyboard-only interaction.

**Tools**: Physical keyboard, Chrome DevTools (focus visualization)
**What to test**:
- All interactive elements reachable via Tab
- Logical tab order (visual order matches DOM order)
- Visible focus indicator (3:1 contrast minimum)
- Escape key exits modals/dropdowns
- Arrow keys navigate lists/menus
- Enter/Space activates buttons/links
- No keyboard traps

### Level 3: Screen Reader Testing (Top) - 10%
Experience the app as a blind user would.

**Tools**: NVDA (Windows), VoiceOver (macOS), JAWS (Windows)
**What to test**:
- Announcements are clear and contextual
- Live regions announce updates correctly
- Form errors are read aloud
- Dynamic content changes are announced
- Navigation landmarks work correctly
- Tables have proper headers

## Accessibility Testing Workflow

### Step 1: Activate Required Tools
Before starting any test, activate MCP tools:

```typescript
// In your test or manual session
// 1. Activate browser automation
activate_browser_navigation_tools();
activate_web_page_capture_tools();

// 2. Navigate to page under test
mcp_microsoft_pla_browser_navigate({ url: 'http://localhost:4200' });

// 3. Take accessibility snapshot
mcp_microsoft_pla_browser_snapshot();
```

### Step 2: Run Automated MCP Analysis
Use MCP tools to inspect the accessibility tree and verify content:

```typescript
// 1. Capture Accessibility Snapshot to analyze structure
const snapshot = await mcp_microsoft_pla_browser_snapshot({
   filename: 'a11y-snapshot.md'
});

// 2. Evaluate Page Content Programmatically using MCP
const analysis = await mcp_microsoft_pla_browser_evaluate({
  function: `() => {
     // Custom audit script injected into the page via MCP
     const issues = [];
     
     // Example: Check for alt text on images
     document.querySelectorAll('img').forEach(img => {
       if (!img.hasAttribute('alt')) issues.push({ element: img.src, error: 'Missing alt text' });
     });

     // Example: Check for ARIA labels on buttons without text
     document.querySelectorAll('button').forEach(btn => {
        if (!btn.innerText.trim() && !btn.getAttribute('aria-label') && !btn.getAttribute('aria-labelledby')) {
            issues.push({ element: btn.outerHTML, error: 'Button missing text or label' });
        }
     });

     return issues;
  }`
});
```

### Step 3: Manual Keyboard Testing
Use physical keyboard to validate:

```markdown
## Keyboard Navigation Checklist

Component: PriceCard

- [ ] Tab enters component, focus visible (outline 2px solid)
- [ ] Tab order is logical (left to right, top to bottom)
- [ ] Escape closes any tooltips/modals
- [ ] Enter/Space activates "Add to Watchlist" button
- [ ] No keyboard trap (can Tab out)
- [ ] Focus indicator has 3:1 contrast with background
- [ ] All interactive elements reachable
```

### Step 4: Screen Reader Testing
Test with NVDA (Windows) or VoiceOver (macOS):

```markdown
## Screen Reader Checklist

Component: PriceCard
Screen Reader: NVDA 2024.1
Browser: Chrome 131

- [ ] Component announces as "Bitcoin, price $65,432.10, up 5.2%"
- [ ] Price updates announced via aria-live="polite"
- [ ] "Add to Watchlist" button announces correctly
- [ ] Price increase/decrease announced with context
- [ ] No duplicate announcements
- [ ] All text is readable (not hidden from AT)
```

### Step 5: Color Contrast Analysis
Use Chrome DevTools or MCP:

```bash
# Using Chrome DevTools MCP
mcp_microsoft_pla_browser_evaluate({
  function: `
    () => {
      const elements = document.querySelectorAll('[class*="text-"]');
      return Array.from(elements).map(el => ({
        text: el.textContent?.trim(),
        color: getComputedStyle(el).color,
        background: getComputedStyle(el).backgroundColor,
        fontSize: getComputedStyle(el).fontSize,
      }));
    }
  `
});
```

Manual check with tools:
- **Contrast Checker**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Chrome DevTools**: Inspect → Accessibility → Contrast

**Minimum ratios (WCAG 2.2 AA)**:
- Normal text (< 18pt): **4.5:1**
- Large text (≥ 18pt or ≥ 14pt bold): **3:1**
- UI components: **3:1**

**Enhanced ratios (WCAG 2.2 AAA)**:
- Normal text: **7:1**
- Large text: **4.5:1**

## Testing Patterns by Component Type

### Forms
**Automated**: Missing labels, invalid ARIA, fieldset structure
**Manual Keyboard**: Tab order, error focus, required indicators
**Screen Reader**: Label/error announcements, help text, validation messages

### Modals/Dialogs
**Automated**: role="dialog", aria-modal, aria-labelledby
**Manual Keyboard**: Focus trap, Escape closes, focus returns on close
**Screen Reader**: Announces as dialog, close button accessible

### Data Tables
**Automated**: <th> presence, scope attributes, caption/summary
**Manual Keyboard**: Row/cell navigation (Ctrl+Arrow), sortable headers
**Screen Reader**: Header associations, data relationships

### Dynamic Content (Live Regions)
**Automated**: aria-live presence, valid values (polite/assertive/off)
**Manual Keyboard**: N/A (non-interactive)
**Screen Reader**: Updates announced correctly, not too verbose

### Charts (ApexCharts)
**Automated**: role="img", aria-label with data summary
**Manual Keyboard**: Focus on chart, keyboard data exploration (if enabled)
**Screen Reader**: Descriptive label, data table alternative

## Automated MCP Audit Patterns

### 1. Snapshot Analysis
Use `mcp_microsoft_pla_browser_snapshot` to generate a markdown representation of the accessibility tree. Review this snapshot for:
- **Heading Hierarchy**: Ensure `h1` through `h6` follow a logical order.
- **Landmarks**: Verify `banner`, `navigation`, `main`, and `contentinfo` roles are present.
- **Accessible Names**: Check that interactive elements (buttons, links) have meaningful names visible in the tree.

### 2. Console Error Monitoring
Use `mcp_microsoft_pla_browser_console_messages` to catch runtime accessibility errors reported by the browser or frameworks (e.g., Angular a11y warnings).

### 3. Computed Style Analysis
Use `mcp_microsoft_pla_browser_evaluate` to extract computed styles for contrast checking without relying on external libraries.


## Manual Testing Checklists

### Keyboard Navigation Audit

Component: _______________  
Tester: _______________  
Date: _______________

| Test | Pass | Fail | Notes |
|------|------|------|-------|
| All interactive elements reachable via Tab | ☐ | ☐ | |
| Tab order is logical (visual order) | ☐ | ☐ | |
| Focus indicator visible (3:1 contrast) | ☐ | ☐ | |
| Shift+Tab reverses tab order | ☐ | ☐ | |
| Enter activates buttons/links | ☐ | ☐ | |
| Space activates buttons | ☐ | ☐ | |
| Escape closes modals/dropdowns | ☐ | ☐ | |
| Arrow keys navigate lists/menus (if applicable) | ☐ | ☐ | |
| No keyboard traps | ☐ | ☐ | |
| Skip links work correctly | ☐ | ☐ | |

**Verdict**: ☐ PASS  ☐ FAIL (needs remediation)

---

### Screen Reader Audit

Component: _______________  
Screen Reader: NVDA / VoiceOver / JAWS  
Browser: Chrome / Firefox / Safari  
Tester: _______________  
Date: _______________

| Test | Pass | Fail | Notes |
|------|------|------|-------|
| All text content is readable | ☐ | ☐ | |
| Images have descriptive alt text | ☐ | ☐ | |
| Form labels announce correctly | ☐ | ☐ | |
| Error messages are announced | ☐ | ☐ | |
| Live regions announce updates | ☐ | ☐ | |
| Buttons announce role and label | ☐ | ☐ | |
| Links announce destination | ☐ | ☐ | |
| Headings provide structure | ☐ | ☐ | |
| Landmarks allow navigation | ☐ | ☐ | |
| No duplicate/redundant announcements | ☐ | ☐ | |
| Dynamic content changes announced | ☐ | ☐ | |

**Verdict**: ☐ PASS  ☐ FAIL (needs remediation)

---

### Color Contrast Audit

Component: _______________  
Tool: WebAIM Contrast Checker / Chrome DevTools  
Tester: _______________  
Date: _______________

| Element | Foreground | Background | Ratio | AA | AAA | Notes |
|---------|-----------|------------|-------|----|----|-------|
| Body text | #FFFFFF | #0A0E27 | 18.5:1 | ✅ | ✅ | |
| Secondary text | #9CA3AF | #0A0E27 | 10.2:1 | ✅ | ✅ | |
| Button (primary) | #FFFFFF | #00D9FF | 7.8:1 | ✅ | ✅ | |
| Button (hover) | #FFFFFF | #00BFDD | 6.5:1 | ✅ | ⚠️ | |
| Error text | #EF4444 | #FFFFFF | 4.1:1 | ⚠️ | ❌ | Needs adjustment |

**Verdict**: ☐ PASS (AA)  ☐ PASS (AAA)  ☐ FAIL

---

## Chrome DevTools MCP Integration

### 1. Automated Accessibility Snapshot

```typescript
// Take accessibility tree snapshot (better than screenshot for a11y)
const snapshot = await mcp_microsoft_pla_browser_snapshot({
  filename: 'dashboard-accessibility-tree.md'
});

// Analyze snapshot for:
// - Landmark structure (banner, nav, main, contentinfo)
// - Heading hierarchy (h1, h2, h3 in order)
// - ARIA roles and labels
// - Interactive element names
```

### 2. Console Accessibility Errors

```typescript
// Check for accessibility errors in console
const consoleMessages = await mcp_microsoft_pla_browser_console_messages({
  level: 'error'
});

// Filter for a11y-related errors
const a11yErrors = consoleMessages.filter(msg =>
  msg.text.includes('aria-') ||
  msg.text.includes('role') ||
  msg.text.includes('accessibility')
);
```

### 3. Evaluate Contrast Programmatically

```typescript
const contrastResults = await mcp_microsoft_pla_browser_evaluate({
  function: `
    () => {
      // Get all text elements
      const elements = Array.from(document.querySelectorAll('*')).filter(el => {
        return el.textContent.trim() && window.getComputedStyle(el).display !== 'none';
      });

      return elements.map(el => {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const bgColor = styles.backgroundColor;
        const fontSize = styles.fontSize;
        const fontWeight = styles.fontWeight;

        return {
          tag: el.tagName,
          text: el.textContent.trim().substring(0, 30),
          color,
          bgColor,
          fontSize,
          fontWeight,
          isLargeText: parseInt(fontSize) >= 18 || (parseInt(fontSize) >= 14 && parseInt(fontWeight) >= 700),
        };
      });
    }
  `
});
```

### 4. Check Focus Indicators

```typescript
// Verify focus styles are present
const focusStyles = await mcp_microsoft_pla_browser_evaluate({
  function: `
    () => {
      const interactiveElements = document.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      return Array.from(interactiveElements).map(el => {
        const styles = window.getComputedStyle(el, ':focus');
        return {
          tag: el.tagName,
          id: el.id,
          className: el.className,
          focusOutline: styles.outline,
          focusOutlineColor: styles.outlineColor,
          focusOutlineWidth: styles.outlineWidth,
          focusBoxShadow: styles.boxShadow,
        };
      });
    }
  `
});
```

## Common Accessibility Issues & Fixes

### Issue 1: Missing Form Labels

**Violation**: `label` (WCAG 1.3.1, 4.1.2)

```typescript
// ❌ Bad
<input type="text" placeholder="Search..." />

// ✅ Good
<label for="search">Search cryptocurrencies</label>
<input id="search" type="search" placeholder="Bitcoin, Ethereum..." />

// ✅ Better (Angular 20 signals)
<label [for]="inputId()">
  {{ label() }}
  @if (required()) {
    <span class="text-red-500">*</span>
  }
</label>
<input
  [id]="inputId()"
  [type]="type()"
  [required]="required()"
  [attr.aria-required]="required() ? 'true' : null"
  [attr.aria-invalid]="hasError() ? 'true' : null"
  [attr.aria-describedby]="hasError() ? errorId() : null"
/>
@if (hasError()) {
  <div [id]="errorId()" class="text-red-500 text-sm" role="alert">
    {{ errorMessage() }}
  </div>
}
```

### Issue 2: Insufficient Color Contrast

**Violation**: `color-contrast` (WCAG 1.4.3)

```typescript
// ❌ Bad: 2.8:1 ratio (fails AA)
<p class="text-gray-400">Secondary text</p>

// ✅ Good: 4.5:1 ratio (passes AA)
<p class="text-gray-200">Secondary text</p>

// Check in Tailwind config
module.exports = {
  theme: {
    extend: {
      colors: {
        // Custom colors with documented contrast ratios
        'text-primary': '#FFFFFF',    // 21:1 on crypto-dark
        'text-secondary': '#D1D5DB',  // 11:1 on crypto-dark (AAA)
        'text-tertiary': '#9CA3AF',   // 7:1 on crypto-dark (AAA)
      },
    },
  },
};
```

### Issue 3: Missing Live Region for Dynamic Content

**Violation**: `aria-live` (WCAG 4.1.3)

```typescript
// ❌ Bad: Price updates silently
<div class="price">{{ currentPrice() | currency }}</div>

// ✅ Good: Price updates announced
<div
  class="price"
  [attr.aria-live]="isChanging() ? 'polite' : null"
  [attr.aria-atomic]="true"
>
  {{ currentPrice() | currency }}
  <span class="sr-only">
    {{ priceChange() > 0 ? 'increased' : 'decreased' }} by {{ priceChange() | percent }}
  </span>
</div>
```

### Issue 4: Keyboard Trap in Modal

**Violation**: `no-keyboard-trap` (WCAG 2.1.2)

```typescript
// ❌ Bad: Focus escapes modal
<div class="modal">
  <button (click)="close()">Close</button>
  <div class="content">...</div>
</div>

// ✅ Good: Focus trapped, Escape closes
export class ModalComponent implements AfterViewInit {
  private focusableElements = signal<HTMLElement[]>([]);
  private firstFocusable = computed(() => this.focusableElements()[0]);
  private lastFocusable = computed(() => this.focusableElements().at(-1));

  ngAfterViewInit() {
    // Get all focusable elements
    const elements = this.el.nativeElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    this.focusableElements.set(Array.from(elements));

    // Focus first element
    this.firstFocusable()?.focus();

    // Listen for Escape key
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter(e => e.key === 'Escape'),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.close());
  }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      const isShiftTab = event.shiftKey;
      const activeElement = document.activeElement;

      if (isShiftTab && activeElement === this.firstFocusable()) {
        event.preventDefault();
        this.lastFocusable()?.focus();
      } else if (!isShiftTab && activeElement === this.lastFocusable()) {
        event.preventDefault();
        this.firstFocusable()?.focus();
      }
    }
  }
}
```

## Remediation Priority Matrix

| Severity | WCAG Level | Priority | Effort | Examples |
|----------|-----------|---------|---------|----------|
| **Critical** | A | P0 (Fix immediately) | Low | Missing alt text, no keyboard access, color-only information |
| **High** | AA | P1 (Fix this sprint) | Medium | Insufficient contrast, missing form labels, invalid ARIA |
| **Medium** | AA | P2 (Fix next sprint) | High | Complex keyboard navigation, screen reader optimization |
| **Low** | AAA | P3 (Backlog) | Variable | Enhanced contrast (7:1), extended descriptions, sign language |



## Success Metrics

Track these KPIs:
- **Automated Coverage**: % of components with axe tests (target: 100%)
- **Violation Count**: Total axe violations (target: 0)
- **Manual Test Pass Rate**: % of manual tests passing (target: 95%+)
- **User Reports**: # of accessibility issues reported (target: <2/month)
- **Lighthouse Score**: Accessibility score (target: 95-100)

## Resources & Tools

### Automated Testing
- [axe-core](https://github.com/dequelabs/axe-core) - Open-source accessibility testing engine
- [vitest-axe](https://github.com/chaance/vitest-axe) - Vitest matcher for axe
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Automate Lighthouse runs

### Manual Testing
- [NVDA](https://www.nvaccess.org/) - Free Windows screen reader
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Manual contrast checking
- [Accessibility Insights](https://accessibilityinsights.io/) - Microsoft a11y testing tool

### Documentation
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Articles](https://webaim.org/articles/)

## Summary

This skill empowers you to:
1. **Activate** required MCP tools (Chrome DevTools, browser automation)
2. **Write** automated accessibility tests (Vitest + axe-core)
3. **Perform** manual keyboard and screen reader testing
4. **Audit** color contrast and ARIA implementation
5. **Remediate** common accessibility violations
6. **Track** accessibility metrics and compliance
7. **Integrate** a11y testing into CI/CD pipelines

**Remember**: Accessibility is not a feature, it's a requirement. Test early, test often, test comprehensively.

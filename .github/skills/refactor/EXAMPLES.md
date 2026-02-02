# Refactor - Code Examples

This file contains practical refactoring examples specific to CryptoTerminal (Angular 20 zoneless + signals).

## Example 1: Extract Long Method

### Before: Long Function

```typescript
async function processOrder(orderId) {
  // 50 lines: fetch order
  const response = await fetch(`/api/orders/${orderId}`);
  const order = await response.json();
  
  // 30 lines: validate order
  if (!order.items || order.items.length === 0) {
    throw new Error('No items in order');
  }
  if (!order.user || !order.user.email) {
    throw new Error('Invalid user');
  }
  
  // 40 lines: calculate pricing
  let subtotal = 0;
  for (const item of order.items) {
    subtotal += item.price * item.quantity;
  }
  const tax = subtotal * 0.1;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;
  
  // 30 lines: update inventory
  for (const item of order.items) {
    await updateInventoryItem(item.id, -item.quantity);
  }
  
  // 20 lines: create shipment
  const shipment = await createShipmentRecord(order);
  
  // 30 lines: send notifications
  await sendEmail(order.user.email, 'Order confirmed');
}
```

### After: Extracted Functions

```typescript
async function processOrder(orderId: string): Promise<OrderResult> {
  const order = await fetchOrder(orderId);
  validateOrder(order);
  const pricing = calculatePricing(order);
  await updateInventory(order);
  const shipment = await createShipment(order);
  await sendNotifications(order, pricing, shipment);
  return { order, pricing, shipment };
}

async function fetchOrder(orderId: string): Promise<Order> {
  const response = await fetch(`/api/orders/${orderId}`);
  if (!response.ok) throw new Error('Failed to fetch order');
  return response.json();
}

function validateOrder(order: Order): void {
  if (!order.items || order.items.length === 0) {
    throw new Error('No items in order');
  }
  if (!order.user || !order.user.email) {
    throw new Error('Invalid user');
  }
}

function calculatePricing(order: Order): Pricing {
  const subtotal = order.items.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );
  const tax = subtotal * 0.1;
  const shipping = subtotal > 50 ? 0 : 5.99;
  return { subtotal, tax, shipping, total: subtotal + tax + shipping };
}

async function updateInventory(order: Order): Promise<void> {
  await Promise.all(
    order.items.map(item => 
      updateInventoryItem(item.id, -item.quantity)
    )
  );
}

async function createShipment(order: Order): Promise<Shipment> {
  return createShipmentRecord(order);
}

async function sendNotifications(
  order: Order, 
  pricing: Pricing, 
  shipment: Shipment
): Promise<void> {
  await sendEmail(order.user.email, 'Order confirmed', {
    orderId: order.id,
    total: pricing.total,
    trackingNumber: shipment.trackingNumber
  });
}
```

## Example 2: Remove Code Duplication

### Before: Duplicated Logic

```typescript
function calculateUserDiscount(user: User): number {
  if (user.membership === 'gold') return user.total * 0.2;
  if (user.membership === 'silver') return user.total * 0.1;
  return 0;
}

function calculateOrderDiscount(order: Order): number {
  if (order.user.membership === 'gold') return order.total * 0.2;
  if (order.user.membership === 'silver') return order.total * 0.1;
  return 0;
}

function applyCheckoutDiscount(cart: Cart): number {
  if (cart.user.membership === 'gold') return cart.total * 0.2;
  if (cart.user.membership === 'silver') return cart.total * 0.1;
  return 0;
}
```

### After: Extract Common Logic

```typescript
type Membership = 'bronze' | 'silver' | 'gold';

const MEMBERSHIP_DISCOUNT_RATES: Record<Membership, number> = {
  bronze: 0,
  silver: 0.1,
  gold: 0.2
};

function getMembershipDiscountRate(membership: Membership): number {
  return MEMBERSHIP_DISCOUNT_RATES[membership] ?? 0;
}

function calculateUserDiscount(user: User): number {
  return user.total * getMembershipDiscountRate(user.membership);
}

function calculateOrderDiscount(order: Order): number {
  return order.total * getMembershipDiscountRate(order.user.membership);
}

function applyCheckoutDiscount(cart: Cart): number {
  return cart.total * getMembershipDiscountRate(cart.user.membership);
}
```

## Example 3: Angular 20 Signal Migration

### Before: Legacy Angular Component

```typescript
@Component({
  selector: 'app-price-card',
  template: `
    <div *ngIf="!isLoading && !error">
      <h3>{{ crypto.name }}</h3>
      <p>{{ calculatePrice() | currency }}</p>
      <button (click)="select()">Select</button>
    </div>
    <div *ngIf="isLoading">Loading...</div>
    <div *ngIf="error">Error: {{ error }}</div>
  `
})
export class PriceCardComponent implements OnInit, OnDestroy {
  @Input() symbol: string;
  @Output() selected = new EventEmitter<CryptoModel>();
  
  crypto: CryptoModel;
  isLoading = true;
  error: string | null = null;
  private subscription: Subscription;
  
  constructor(
    private marketService: MarketService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    this.subscription = this.marketService
      .getCrypto(this.symbol)
      .subscribe({
        next: (data) => {
          this.crypto = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = err.message;
          this.isLoading = false;
        }
      });
  }
  
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  
  calculatePrice(): number {
    return this.crypto.price * this.crypto.multiplier;
  }
  
  select() {
    this.selected.emit(this.crypto);
  }
}
```

### After: Angular 20 Zoneless with Signals

```typescript
@Component({
  selector: 'app-price-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    @if (!isLoading() && !error()) {
      <div>
        <h3>{{ crypto()?.name }}</h3>
        <p>{{ displayPrice() | currency }}</p>
        <button (click)="handleSelect()">Select</button>
      </div>
    }
    @if (isLoading()) {
      <div>Loading...</div>
    }
    @if (error()) {
      <div>Error: {{ error() }}</div>
    }
  `
})
export class PriceCardComponent {
  private marketService = inject(MarketService);
  
  // Signal inputs (no @Input)
  symbol = input.required<string>();
  
  // Signal outputs (no @Output)
  selected = output<CryptoModel>();
  
  // Local signals for state
  crypto = signal<CryptoModel | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  
  // Computed signal (automatically cached)
  displayPrice = computed(() => {
    const c = this.crypto();
    return c ? c.price * c.multiplier : 0;
  });
  
  constructor() {
    // Auto-cleanup with takeUntilDestroyed
    this.marketService
      .getCrypto(this.symbol())
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => {
          this.crypto.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err.message);
          this.isLoading.set(false);
        }
      });
  }
  
  handleSelect(): void {
    const c = this.crypto();
    if (c) {
      this.selected.emit(c);
    }
  }
}
```

## Example 4: Replace Nested Conditionals with Guard Clauses

### Before: Arrow Code

```typescript
function processOrder(order: Order | null): Result {
  if (order) {
    if (order.user) {
      if (order.user.isActive) {
        if (order.total > 0) {
          if (order.items.length > 0) {
            return processValidOrder(order);
          } else {
            return { error: 'No items' };
          }
        } else {
          return { error: 'Invalid total' };
        }
      } else {
        return { error: 'User inactive' };
      }
    } else {
      return { error: 'No user' };
    }
  } else {
    return { error: 'No order' };
  }
}
```

### After: Guard Clauses (Early Returns)

```typescript
function processOrder(order: Order | null): Result {
  if (!order) {
    return { error: 'No order' };
  }
  
  if (!order.user) {
    return { error: 'No user' };
  }
  
  if (!order.user.isActive) {
    return { error: 'User inactive' };
  }
  
  if (order.total <= 0) {
    return { error: 'Invalid total' };
  }
  
  if (order.items.length === 0) {
    return { error: 'No items' };
  }
  
  return processValidOrder(order);
}
```

## Example 5: Strategy Pattern for Conditional Logic

### Before: Conditional Logic

```typescript
function calculateShipping(order: Order, method: string): number {
  if (method === 'standard') {
    return order.total > 50 ? 0 : 5.99;
  } else if (method === 'express') {
    return order.total > 100 ? 9.99 : 14.99;
  } else if (method === 'overnight') {
    return 29.99;
  }
  return 0;
}
```

### After: Strategy Pattern

```typescript
interface ShippingStrategy {
  calculate(order: Order): number;
  readonly name: string;
}

class StandardShipping implements ShippingStrategy {
  readonly name = 'standard';
  
  calculate(order: Order): number {
    return order.total > 50 ? 0 : 5.99;
  }
}

class ExpressShipping implements ShippingStrategy {
  readonly name = 'express';
  
  calculate(order: Order): number {
    return order.total > 100 ? 9.99 : 14.99;
  }
}

class OvernightShipping implements ShippingStrategy {
  readonly name = 'overnight';
  
  calculate(order: Order): number {
    return 29.99;
  }
}

const SHIPPING_STRATEGIES: Record<string, ShippingStrategy> = {
  standard: new StandardShipping(),
  express: new ExpressShipping(),
  overnight: new OvernightShipping()
};

function calculateShipping(order: Order, method: string): number {
  const strategy = SHIPPING_STRATEGIES[method];
  if (!strategy) {
    throw new Error(`Unknown shipping method: ${method}`);
  }
  return strategy.calculate(order);
}
```

## Example 6: Replace Magic Numbers with Constants

### Before: Magic Numbers Everywhere

```typescript
function processPayment(amount: number): void {
  if (amount > 10000) {
    applySpecialProcessing();
  }
  
  const fee = amount * 0.029 + 0.30;
  const tax = amount * 0.0825;
  
  setTimeout(() => {
    sendReceipt();
  }, 86400000);
}
```

### After: Named Constants

```typescript
const PAYMENT_LIMITS = {
  SPECIAL_PROCESSING_THRESHOLD: 10000
} as const;

const FEE_RATES = {
  PERCENTAGE: 0.029,
  FIXED: 0.30
} as const;

const TAX_RATES = {
  STATE: 0.0825
} as const;

const TIME_CONSTANTS = {
  ONE_DAY_MS: 24 * 60 * 60 * 1000
} as const;

function processPayment(amount: number): void {
  if (amount > PAYMENT_LIMITS.SPECIAL_PROCESSING_THRESHOLD) {
    applySpecialProcessing();
  }
  
  const fee = amount * FEE_RATES.PERCENTAGE + FEE_RATES.FIXED;
  const tax = amount * TAX_RATES.STATE;
  
  setTimeout(() => {
    sendReceipt();
  }, TIME_CONSTANTS.ONE_DAY_MS);
}
```

## Example 7: Extract Class from Large Object

### Before: God Class

```typescript
class UserManager {
  createUser(data: UserData) { /* ... */ }
  updateUser(id: string, data: Partial<UserData>) { /* ... */ }
  deleteUser(id: string) { /* ... */ }
  
  sendEmail(to: string, subject: string, body: string) { /* ... */ }
  sendSMS(to: string, message: string) { /* ... */ }
  
  generatePDFReport(userId: string) { /* ... */ }
  generateCSVReport(userId: string) { /* ... */ }
  
  processPayment(userId: string, amount: number) { /* ... */ }
  refundPayment(paymentId: string) { /* ... */ }
  
  validateAddress(address: Address) { /* ... */ }
  geocodeAddress(address: Address) { /* ... */ }
  
  // 50 more methods...
}
```

### After: Single Responsibility Classes

```typescript
// User CRUD operations
class UserService {
  create(data: UserData): Promise<User> { /* ... */ }
  update(id: string, data: Partial<UserData>): Promise<User> { /* ... */ }
  delete(id: string): Promise<void> { /* ... */ }
  findById(id: string): Promise<User | null> { /* ... */ }
}

// Communication
class NotificationService {
  sendEmail(to: string, subject: string, body: string): Promise<void> { /* ... */ }
  sendSMS(to: string, message: string): Promise<void> { /* ... */ }
  sendPushNotification(userId: string, title: string, body: string): Promise<void> { /* ... */ }
}

// Reporting
class ReportService {
  generatePDF(userId: string): Promise<Buffer> { /* ... */ }
  generateCSV(userId: string): Promise<string> { /* ... */ }
  generateExcel(userId: string): Promise<Buffer> { /* ... */ }
}

// Payments
class PaymentService {
  process(userId: string, amount: number): Promise<Payment> { /* ... */ }
  refund(paymentId: string): Promise<Refund> { /* ... */ }
  getPaymentHistory(userId: string): Promise<Payment[]> { /* ... */ }
}

// Address handling
class AddressService {
  validate(address: Address): ValidationResult { /* ... */ }
  geocode(address: Address): Promise<Coordinates> { /* ... */ }
  normalize(address: Address): Address { /* ... */ }
}
```

## Example 8: Introduce Parameter Object

### Before: Long Parameter List

```typescript
function createUser(
  email: string,
  password: string,
  name: string,
  age: number,
  address: string,
  city: string,
  state: string,
  zipCode: string,
  country: string,
  phone: string
): User {
  // Implementation
}

// Difficult to call
const user = createUser(
  'test@example.com',
  'password123',
  'John Doe',
  30,
  '123 Main St',
  'New York',
  'NY',
  '10001',
  'USA',
  '+1234567890'
);
```

### After: Parameter Object

```typescript
interface UserCreationData {
  email: string;
  password: string;
  name: string;
  age?: number;
  address?: Address;
  phone?: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

function createUser(data: UserCreationData): User {
  // Implementation
}

// Much cleaner to call
const user = createUser({
  email: 'test@example.com',
  password: 'password123',
  name: 'John Doe',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA'
  },
  phone: '+1234567890'
});
```

## Example 9: Replace Primitive Obsession with Domain Types

### Before: Using Primitives

```typescript
function sendEmail(to: string, subject: string, body: string): void {
  // No validation
  emailService.send(to, subject, body);
}

function createPhoneNumber(country: string, number: string): string {
  return `${country}-${number}`;
}

// Usage
sendEmail('invalid-email', 'Hello', 'Body'); // Fails at runtime
const phone = createPhoneNumber('1', 'abc'); // Invalid but allowed
```

### After: Domain Types

```typescript
class Email {
  private constructor(public readonly value: string) {
    if (!Email.isValid(value)) {
      throw new Error(`Invalid email: ${value}`);
    }
  }
  
  static create(value: string): Email {
    return new Email(value);
  }
  
  static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  toString(): string {
    return this.value;
  }
}

class PhoneNumber {
  constructor(
    public readonly countryCode: string,
    public readonly number: string
  ) {
    if (!PhoneNumber.isValid(countryCode, number)) {
      throw new Error(`Invalid phone: ${countryCode}-${number}`);
    }
  }
  
  static isValid(countryCode: string, number: string): boolean {
    return /^\d+$/.test(countryCode) && /^\d{7,15}$/.test(number);
  }
  
  toString(): string {
    return `${this.countryCode}-${this.number}`;
  }
}

function sendEmail(to: Email, subject: string, body: string): void {
  // Type safety guarantees valid email
  emailService.send(to.value, subject, body);
}

// Usage
const email = Email.create('user@example.com'); // Validated at creation
sendEmail(email, 'Hello', 'Body'); // Type-safe

const phone = new PhoneNumber('1', '5551234567'); // Validated
// new PhoneNumber('1', 'abc'); // Throws at construction
```

## Example 10: Introduce Null Object Pattern

### Before: Null Checks Everywhere

```typescript
function processUser(user: User | null): void {
  if (user !== null) {
    console.log(user.getName());
    console.log(user.getEmail());
    user.sendWelcomeEmail();
  }
}

function getUserDiscount(user: User | null): number {
  if (user === null) return 0;
  return user.getDiscount();
}
```

### After: Null Object Pattern

```typescript
interface User {
  getName(): string;
  getEmail(): string;
  sendWelcomeEmail(): void;
  getDiscount(): number;
  isNullUser(): boolean;
}

class RealUser implements User {
  constructor(
    private name: string,
    private email: string,
    private discount: number
  ) {}
  
  getName(): string { return this.name; }
  getEmail(): string { return this.email; }
  sendWelcomeEmail(): void { /* send email */ }
  getDiscount(): number { return this.discount; }
  isNullUser(): boolean { return false; }
}

class NullUser implements User {
  getName(): string { return 'Guest'; }
  getEmail(): string { return ''; }
  sendWelcomeEmail(): void { /* do nothing */ }
  getDiscount(): number { return 0; }
  isNullUser(): boolean { return true; }
}

// No more null checks!
function processUser(user: User): void {
  console.log(user.getName());
  console.log(user.getEmail());
  user.sendWelcomeEmail();
}

function getUserDiscount(user: User): number {
  return user.getDiscount();
}

// Usage
const user: User = getUserOrNull() ?? new NullUser();
processUser(user); // Works with both real and null user
```

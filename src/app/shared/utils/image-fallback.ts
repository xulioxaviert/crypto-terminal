/**
 * Handles image loading errors by providing a fallback image.
 * Prevents infinite loops by checking if the fallback was already attempted.
 *
 * @param event - The error event from the image element
 * @param fallbackSrc - The fallback image path (default: generic crypto icon)
 *
 * @example
 * // In template:
 * // <img [src]="asset.iconUrl" (error)="handleCryptoImageError($event)" />
 *
 * // In component:
 * handleCryptoImageError(event: Event): void {
 *   handleCryptoImageError(event);
 * }
 */
export function handleCryptoImageError(
  event: Event,
  fallbackSrc = 'assets/icons/crypto/generic.svg'
): void {
  const target = event.target as HTMLImageElement;

  // Prevent infinite loops if the fallback image also fails
  if (target.src !== fallbackSrc) {
    target.src = fallbackSrc;
  }
}

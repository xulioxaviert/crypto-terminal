/**
 * Interfaz para los elementos de navegación del Sidebar y Header.
 * Usamos 'readonly' para fomentar la inmutabilidad, práctica recomendada con Signals.
 */
export interface MenuItem {
  readonly label: string;
  readonly icon: string;  // Nombre del icono (ej: 'lucide-layout-grid')
  readonly route: string; // Ruta de Angular (ej: '/dashboard')
}

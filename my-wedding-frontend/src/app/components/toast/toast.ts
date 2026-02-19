import { Component, computed, input } from '@angular/core';

/** Tipos de toast disponibles */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/** Configuración de estilos por tipo de toast */
interface ToastStyle {
  container: string;
  icon: string;
}

/**
 * Toast notification component for displaying temporary messages to users.
 *
 * @component
 * @example
 * ```html
 * <app-toast
 *   [message]="'Operation completed successfully'"
 *   [type]="'success'"
 *   [dismissible]="true">
 * </app-toast>
 * ```
 *
 * @example
 * ```typescript
 * // In your component
 * export class MyComponent {
 *   toastMessage = signal('An error occurred');
 *   toastType: ToastType = 'error';
 *   showDismiss = signal(true);
 * }
 * ```
 *
 * @description
 * The Toast component displays contextual feedback messages with different severity levels.
 * It supports four types of notifications: success, error, warning, and info.
 * Each type has its own color scheme and styling defined in the styleMap.
 *
 * @remarks
 * - Use 'success' type for positive feedback or completed operations
 * - Use 'error' type for error messages or failed operations
 * - Use 'warning' type for cautionary messages
 * - Use 'info' type for informational messages (default)
 * - Set dismissible to true to show a close button for user to dismiss
 *
 * @author Your Team
 * @version 1.0.0
 */
@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  /** Mensaje a mostrar en el toast */
  message = input<string | null>(null);

  /** Tipo de toast (success, error, warning, info) */
  type = input<ToastType>('info');

  /** Si se muestra el icono de cerrar */
  dismissible = input<boolean>(false);

  /** Mapeo de estilos por tipo */
  private readonly styleMap: Record<ToastType, ToastStyle> = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-700',
      icon: 'text-green-500',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-600',
      icon: 'text-red-500',
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-700',
      icon: 'text-amber-500',
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-700',
      icon: 'text-blue-500',
    },
  };

  /** Clases CSS para el contenedor */
  protected containerClasses = computed(() => this.styleMap[this.type()].container);

  /** Clases CSS para el icono */
  protected iconClasses = computed(() => this.styleMap[this.type()].icon);
}

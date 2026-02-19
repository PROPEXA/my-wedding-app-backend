import { Component, computed, inject, signal } from '@angular/core';
import { Button } from '../button/button';

/**
 * Tipos de alerta disponibles
 * - success: Confirmación de acción exitosa (verde)
 * - error: Error o fallo (rojo)
 * - warning: Advertencia (amarillo/naranja)
 * - info: Información general (azul)
 * - question: Pregunta con opciones Sí/No (rosa)
 */
export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'question';

/**
 * Configuración para mostrar una alerta
 */
export interface AlertConfig {
  /** Tipo de alerta */
  type: AlertType;
  /** Título de la alerta */
  title: string;
  /** Mensaje o descripción */
  message?: string;
  /** Texto del botón de confirmación (por defecto: 'Aceptar' o 'Sí') */
  confirmText?: string;
  /** Texto del botón de cancelar (solo para question, por defecto: 'No') */
  cancelText?: string;
  /** Mostrar botón de cancelar (automático para question) */
  showCancel?: boolean;
}

/**
 * Resultado de la interacción con la alerta
 */
export interface AlertResult {
  /** true si se confirmó, false si se canceló */
  confirmed: boolean;
}

/**
 * Componente Alert - Diálogo modal para mostrar mensajes al usuario
 *
 * @description
 * Componente de alerta reutilizable que soporta múltiples tipos de mensajes:
 * - Success: Para confirmar acciones exitosas
 * - Error: Para mostrar errores
 * - Warning: Para advertencias
 * - Info: Para información general
 * - Question: Para confirmar acciones con Sí/No
 *
 * @example
 * // Uso con el servicio AlertService
 * alertService.success('¡Éxito!', 'La operación se completó correctamente');
 * alertService.error('Error', 'No se pudo completar la operación');
 * alertService.question('¿Confirmar?', '¿Deseas eliminar este elemento?').then(result => {
 *   if (result.confirmed) { // Usuario confirmó }
 * });
 */
@Component({
  selector: 'app-alert',
  imports: [Button],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  /** Estado de visibilidad del modal */
  protected isVisible = signal(false);

  /** Configuración actual de la alerta */
  protected config = signal<AlertConfig>({
    type: 'info',
    title: '',
    message: '',
  });

  /** Callback para resolver la promesa */
  private resolvePromise: ((result: AlertResult) => void) | null = null;

  /** Configuración de iconos por tipo */
  protected readonly iconConfig: Record<AlertType, { viewBox: string; path: string; bgClass: string; iconClass: string }> = {
    success: {
      viewBox: '0 0 20 20',
      path: 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z',
      bgClass: 'bg-green-100',
      iconClass: 'text-green-500',
    },
    error: {
      viewBox: '0 0 20 20',
      path: 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z',
      bgClass: 'bg-red-100',
      iconClass: 'text-red-500',
    },
    warning: {
      viewBox: '0 0 20 20',
      path: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
      bgClass: 'bg-amber-100',
      iconClass: 'text-amber-500',
    },
    info: {
      viewBox: '0 0 20 20',
      path: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
      bgClass: 'bg-blue-100',
      iconClass: 'text-blue-500',
    },
    question: {
      viewBox: '0 0 20 20',
      path: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z',
      bgClass: 'bg-rose-100',
      iconClass: 'text-rose-500',
    },
  };

  /** Obtiene la configuración del icono actual */
  protected currentIcon = computed(() => this.iconConfig[this.config().type]);

  /** Determina si debe mostrar el botón de cancelar */
  protected showCancelButton = computed(() => {
    const cfg = this.config();
    return cfg.type === 'question' || cfg.showCancel === true;
  });

  /** Texto del botón de confirmación */
  protected confirmButtonText = computed(() => {
    const cfg = this.config();
    if (cfg.confirmText) return cfg.confirmText;
    return cfg.type === 'question' ? 'Sí' : 'Aceptar';
  });

  /** Texto del botón de cancelar */
  protected cancelButtonText = computed(() => {
    return this.config().cancelText || 'No';
  });

  /** Tema del botón de confirmación según el tipo */
  protected confirmButtonTheme = computed(() => {
    const themeMap: Record<AlertType, 'success' | 'danger' | 'warning' | 'info' | 'primary'> = {
      success: 'success',
      error: 'danger',
      warning: 'warning',
      info: 'info',
      question: 'primary',
    };
    return themeMap[this.config().type];
  });

  /**
   * Muestra la alerta con la configuración especificada
   * @param config Configuración de la alerta
   * @returns Promesa que resuelve cuando el usuario interactúa
   */
  show(config: AlertConfig): Promise<AlertResult> {
    this.config.set(config);
    this.isVisible.set(true);

    return new Promise<AlertResult>((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  /**
   * Cierra la alerta y resuelve con confirmación
   */
  protected confirm = (): void => {
    this.close(true);
  };

  /**
   * Cierra la alerta y resuelve con cancelación
   */
  protected cancel = (): void => {
    this.close(false);
  };

  /**
   * Cierra el modal y resuelve la promesa
   */
  private close(confirmed: boolean): void {
    this.isVisible.set(false);
    if (this.resolvePromise) {
      this.resolvePromise({ confirmed });
      this.resolvePromise = null;
    }
  }

  /**
   * Maneja clics en el backdrop (fondo oscuro)
   * Solo cierra si es tipo info, success, warning o error
   */
  protected onBackdropClick(): void {
    if (this.config().type !== 'question') {
      this.cancel();
    }
  }

  /**
   * Previene que el clic en el contenido cierre el modal
   */
  protected onContentClick(event: Event): void {
    event.stopPropagation();
  }
}

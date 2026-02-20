/**
 * Modelos compartidos para el módulo de eventos
 * @module EventModels
 */

// Re-exportar WeddingEvent desde el modelo core de la API
export type { WeddingEvent } from '../../../../core/model/wedding-event.model';
import type { WeddingEvent } from '../../../../core/model/wedding-event.model';

/**
 * Acciones disponibles para un evento
 */
export type EventAction = 'view' | 'edit' | 'delete';

/**
 * Evento emitido cuando se realiza una acción sobre un evento de boda
 */
export interface EventActionEvent {
  /** Acción realizada */
  action: EventAction;
  /** Evento sobre el que se realizó la acción */
  event: WeddingEvent;
}

/**
 * Utilidades para trabajar con WeddingEvent
 */
export class EventUtils {
  /**
   * Formatea la fecha del evento
   */
  static formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  /**
   * Formatea la hora del evento
   */
  static formatTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Formatea fecha y hora completa
   */
  static formatDateTime(date: Date | string): string {
    return `${this.formatDate(date)} - ${this.formatTime(date)}`;
  }

  /**
   * Obtiene el nombre del tipo de evento
   */
  static getEventTypeName(event: WeddingEvent): string {
    return event.event_type?.event_name ?? 'Sin tipo';
  }

  /**
   * Obtiene la dirección truncada
   */
  static getTruncatedAddress(event: WeddingEvent, maxLength: number = 40): string {
    if (event.address.length <= maxLength) return event.address;
    return event.address.substring(0, maxLength) + '...';
  }
}

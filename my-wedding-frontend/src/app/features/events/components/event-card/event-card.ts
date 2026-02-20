import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WeddingEvent } from '../../../../core/model/wedding-event.model';
import { EventAction, EventActionEvent, EventUtils } from './event.model';

/**
 * Event Card Component
 *
 * @description
 * Tarjeta individual de evento con información resumida y
 * menú de acciones (ver, editar, eliminar).
 *
 * @example
 * ```html
 * <app-event-card
 *   [event]="event"
 *   (action)="handleAction($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-event-card',
  imports: [DatePipe],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
})
export class EventCard {
  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Datos del evento a mostrar */
  event = input.required<WeddingEvent>();

  /** Si el menú dropdown está abierto */
  isMenuOpen = input<boolean>(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Emitido cuando se realiza una acción sobre el evento */
  action = output<EventActionEvent>();

  /** Emitido cuando se alterna el menú */
  menuToggle = output<number>();

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Obtiene el nombre del tipo de evento
   */
  getEventTypeName(): string {
    return EventUtils.getEventTypeName(this.event());
  }

  /**
   * Formatea la fecha de inicio
   */
  formatStartDate(): string {
    return EventUtils.formatDateTime(this.event().start_date);
  }

  /**
   * Formatea la fecha de fin
   */
  formatEndDate(): string {
    return EventUtils.formatDateTime(this.event().end_date);
  }

  /**
   * Obtiene la dirección truncada
   */
  getTruncatedAddress(): string {
    return EventUtils.getTruncatedAddress(this.event());
  }

  /**
   * Emite una acción sobre el evento
   */
  onAction(actionType: EventAction): void {
    this.action.emit({ event: this.event(), action: actionType });
  }

  /**
   * Emite el toggle del menú
   */
  onToggleMenu(e: Event): void {
    e.stopPropagation();
    const eventId = this.event().id;
    if (eventId !== undefined) {
      this.menuToggle.emit(eventId);
    }
  }
}

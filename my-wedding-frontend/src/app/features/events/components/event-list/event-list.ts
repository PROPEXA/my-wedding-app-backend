import { Component, input, output, signal } from '@angular/core';
import { WeddingEvent } from '../../../../core/model/wedding-event.model';
import { EventActionEvent } from '../event-card/event.model';
import { EventCard } from '../event-card/event-card';
import { EventEmptyState } from '../event-empty-state/event-empty-state';

/**
 * Event List Component
 *
 * @description
 * Componente contenedor que muestra la lista de eventos
 * usando EventCard o EventEmptyState según corresponda.
 *
 * @example
 * ```html
 * <app-event-list
 *   [events]="events()"
 *   [isLoading]="isLoading()"
 *   (action)="handleAction($event)"
 *   (createEvent)="handleCreate()"
 * />
 * ```
 */
@Component({
  selector: 'app-event-list',
  imports: [EventCard, EventEmptyState],
  templateUrl: './event-list.html',
})
export class EventList {
  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Lista de eventos a mostrar */
  events = input.required<WeddingEvent[]>();

  /** Estado de carga */
  isLoading = input<boolean>(false);

  /** Si se ha seleccionado una boda */
  hasWeddingSelected = input<boolean>(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Emitido cuando se realiza una acción sobre un evento */
  action = output<EventActionEvent>();

  /** Emitido cuando se quiere crear un nuevo evento */
  createEvent = output<void>();

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /** ID del evento con menú abierto */
  protected openMenuId = signal<number | null>(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Maneja acciones de las tarjetas
   */
  onCardAction(event: EventActionEvent): void {
    this.closeMenu();
    this.action.emit(event);
  }

  /**
   * Handler para crear evento
   */
  onCreateEvent(): void {
    this.createEvent.emit();
  }

  /**
   * Alterna el menú de una tarjeta
   */
  toggleMenu(eventId: number): void {
    if (this.openMenuId() === eventId) {
      this.openMenuId.set(null);
    } else {
      this.openMenuId.set(eventId);
    }
  }

  /**
   * Cierra el menú abierto
   */
  closeMenu(): void {
    this.openMenuId.set(null);
  }

  /**
   * Verifica si el menú de un evento está abierto
   */
  isMenuOpen(eventId: number): boolean {
    return this.openMenuId() === eventId;
  }
}

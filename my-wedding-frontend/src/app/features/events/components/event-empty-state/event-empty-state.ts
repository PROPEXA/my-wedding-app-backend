import { Component, output } from '@angular/core';
import { Button } from '../../../../shared/components/ui/button/button';

/**
 * Event Empty State Component
 *
 * @description
 * Muestra un estado vacío cuando no hay eventos,
 * invitando al usuario a crear su primer evento.
 *
 * @example
 * ```html
 * <app-event-empty-state (createEvent)="handleCreate()" />
 * ```
 */
@Component({
  selector: 'app-event-empty-state',
  imports: [Button],
  templateUrl: './event-empty-state.html',
  styleUrl: './event-empty-state.css',
})
export class EventEmptyState {
  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Emitido cuando se quiere crear un nuevo evento */
  createEvent = output<void>();

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Handler para crear evento
   */
  onCreateEvent = (): void => {
    this.createEvent.emit();
  };
}

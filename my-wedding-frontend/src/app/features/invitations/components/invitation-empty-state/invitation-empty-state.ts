import { Component, input, output } from '@angular/core';
import { Button } from '../../../../shared/components/ui/button/button';

/**
 * Invitation Empty State Component
 *
 * @description
 * Muestra un estado vacío cuando no hay invitaciones o
 * cuando no se ha seleccionado un evento.
 *
 * @example
 * ```html
 * <app-invitation-empty-state
 *   [hasEventSelected]="hasEventSelected()"
 *   (createInvitation)="handleCreate()"
 * />
 * ```
 */
@Component({
  selector: 'app-invitation-empty-state',
  imports: [Button],
  templateUrl: './invitation-empty-state.html',
  styleUrl: './invitation-empty-state.css',
})
export class InvitationEmptyState {
  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Si hay un evento seleccionado */
  hasEventSelected = input<boolean>(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Emitido cuando se quiere crear una nueva invitación */
  createInvitation = output<void>();

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Handler para crear invitación
   */
  onCreateInvitation = (): void => {
    this.createInvitation.emit();
  };
}

import { Component, output } from '@angular/core';
import { Button } from '../../../../shared/components/ui/button/button';


/**
 * Wedding Empty State Component
 *
 * @description
 * Muestra un estado vacío cuando no hay bodas,
 * invitando al usuario a crear su primera boda.
 *
 * @example
 * ```html
 * <app-wedding-empty-state (createWedding)="handleCreate()" />
 * ```
 */
@Component({
  selector: 'app-wedding-empty-state',
  imports: [Button],
  templateUrl: './wedding-empty-state.html',
  styleUrl: './wedding-empty-state.css',
})
export class WeddingEmptyState {
  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Emitido cuando se quiere crear una nueva boda */
  createWedding = output<void>();

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Handler para crear boda
   */
  onCreateWedding = (): void => {
    this.createWedding.emit();
  };
}

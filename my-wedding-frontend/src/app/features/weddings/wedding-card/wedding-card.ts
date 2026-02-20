import { Component, input, output, signal } from '@angular/core';
import { Wedding, WeddingAction, WeddingActionEvent } from '../wedding.model';

/**
 * Wedding Card Component
 *
 * @description
 * Tarjeta individual de boda con información resumida y
 * menú de acciones (ver, editar, eliminar).
 *
 * @example
 * ```html
 * <app-wedding-card
 *   [wedding]="wedding"
 *   (action)="handleAction($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-wedding-card',
  imports: [],
  templateUrl: './wedding-card.html',
  styleUrl: './wedding-card.css',
})
export class WeddingCard {
  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Datos de la boda a mostrar */
  wedding = input.required<Wedding>();

  /** Si el menú dropdown está abierto */
  isMenuOpen = input<boolean>(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Emitido cuando se realiza una acción sobre la boda */
  action = output<WeddingActionEvent>();

  /** Emitido cuando se alterna el menú */
  menuToggle = output<number>();

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Emite una acción sobre la boda
   */
  onAction(actionType: WeddingAction): void {
    this.action.emit({ wedding: this.wedding(), action: actionType });
  }

  /**
   * Emite el toggle del menú
   */
  onToggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuToggle.emit(this.wedding().id);
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  }

  /**
   * Calcula los días restantes hasta el evento
   */
  getDaysRemaining(eventDate: Date): number {
    const today = new Date();
    const event = new Date(eventDate);
    const diffTime = event.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  /**
   * Calcula el porcentaje de confirmaciones
   */
  getConfirmationPercentage(confirmed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((confirmed / total) * 100);
  }
}

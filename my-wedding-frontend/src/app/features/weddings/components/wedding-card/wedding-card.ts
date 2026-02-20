import { Component, input, output } from '@angular/core';
import { Wedding, WeddingAction, WeddingActionEvent, WeddingUtils } from './wedding.model';

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
   * Obtiene el nombre de la pareja
   */
  getCoupleName(): string {
    return WeddingUtils.getCoupleName(this.wedding());
  }

  /**
   * Obtiene el nombre completo de la novia
   */
  getBrideFullName(): string {
    return WeddingUtils.getBrideFullName(this.wedding());
  }

  /**
   * Obtiene el nombre completo del novio
   */
  getGroomFullName(): string {
    return WeddingUtils.getGroomFullName(this.wedding());
  }

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
    const weddingId = this.wedding().id;
    if (weddingId !== undefined) {
      this.menuToggle.emit(weddingId);
    }
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatDate(date: Date | undefined): string {
    if (!date) return 'Sin fecha';
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  }
}

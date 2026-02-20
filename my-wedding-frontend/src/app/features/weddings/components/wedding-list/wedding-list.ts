import { Component, input, output, signal } from '@angular/core';
import { Wedding, WeddingActionEvent } from '../wedding-card/wedding.model';
import { WeddingCard } from '../wedding-card/wedding-card';
import { WeddingEmptyState } from '../wedding-empty-state/wedding-empty-state';

/**
 * Wedding List Component
 *
 * @description
 * Componente contenedor que muestra la lista de bodas
 * usando WeddingCard o WeddingEmptyState según corresponda.
 *
 * @example
 * ```html
 * <app-wedding-list
 *   [weddings]="weddings()"
 *   [isLoading]="isLoading()"
 *   (action)="handleAction($event)"
 *   (createWedding)="handleCreate()"
 * />
 * ```
 */
@Component({
  selector: 'app-wedding-list',
  imports: [WeddingCard, WeddingEmptyState],
  templateUrl: './wedding-list.html',
})
export class WeddingList {
  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Lista de bodas a mostrar */
  weddings = input.required<Wedding[]>();

  /** Estado de carga */
  isLoading = input<boolean>(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Emitido cuando se realiza una acción sobre una boda */
  action = output<WeddingActionEvent>();

  /** Emitido cuando se quiere crear una nueva boda */
  createWedding = output<void>();

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /** ID de la boda con menú abierto */
  protected openMenuId = signal<number | null>(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Maneja acciones de las tarjetas
   */
  onCardAction(event: WeddingActionEvent): void {
    this.closeMenu();
    this.action.emit(event);
  }

  /**
   * Handler para crear boda
   */
  onCreateWedding(): void {
    this.createWedding.emit();
  }

  /**
   * Alterna el menú de una tarjeta
   */
  toggleMenu(weddingId: number): void {
    if (this.openMenuId() === weddingId) {
      this.openMenuId.set(null);
    } else {
      this.openMenuId.set(weddingId);
    }
  }

  /**
   * Cierra el menú
   */
  closeMenu(): void {
    this.openMenuId.set(null);
  }

  /**
   * Verifica si el menú de una boda está abierto
   */
  isMenuOpen(weddingId: number): boolean {
    return this.openMenuId() === weddingId;
  }
}

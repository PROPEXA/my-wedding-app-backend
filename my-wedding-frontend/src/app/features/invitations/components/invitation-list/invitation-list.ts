import { Component, input, output, signal } from '@angular/core';
import { Invitation } from '../../../../core/model/invitation.model';
import { InvitationActionEvent } from '../invitation-card/invitation.model';
import { InvitationCard } from '../invitation-card/invitation-card';
import { InvitationEmptyState } from '../invitation-empty-state/invitation-empty-state';
import { Button } from '../../../../shared/components/ui/button/button';

/**
 * Invitation List Component
 *
 * @description
 * Componente contenedor que muestra la lista de invitaciones
 * usando InvitationCard o InvitationEmptyState según corresponda.
 * Incluye soporte para paginación.
 *
 * @example
 * ```html
 * <app-invitation-list
 *   [invitations]="invitations()"
 *   [isLoading]="isLoading()"
 *   [hasEventSelected]="hasEventSelected()"
 *   [hasMorePages]="hasMorePages()"
 *   (action)="handleAction($event)"
 *   (createInvitation)="handleCreate()"
 *   (loadMore)="handleLoadMore()"
 * />
 * ```
 */
@Component({
  selector: 'app-invitation-list',
  imports: [InvitationCard, InvitationEmptyState, Button],
  templateUrl: './invitation-list.html',
})
export class InvitationList {
  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Lista de invitaciones a mostrar */
  invitations = input.required<Invitation[]>();

  /** Estado de carga */
  isLoading = input<boolean>(false);

  /** Si hay un evento seleccionado */
  hasEventSelected = input<boolean>(false);

  /** Si hay más páginas disponibles */
  hasMorePages = input<boolean>(true);

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Emitido cuando se realiza una acción sobre una invitación */
  action = output<InvitationActionEvent>();

  /** Emitido cuando se quiere crear una nueva invitación */
  createInvitation = output<void>();

  /** Emitido cuando se quiere cargar más invitaciones */
  loadMore = output<void>();

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /** ID de la invitación con menú abierto */
  protected openMenuId = signal<number | null>(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Maneja acciones de las tarjetas
   */
  onCardAction(event: InvitationActionEvent): void {
    this.closeMenu();
    this.action.emit(event);
  }

  /**
   * Handler para crear invitación
   */
  onCreateInvitation(): void {
    this.createInvitation.emit();
  }

  /**
   * Handler para cargar más invitaciones
   */
  onLoadMore = (): void => {
    this.loadMore.emit();
  };

  /**
   * Alterna el menú de una tarjeta
   */
  toggleMenu(invitationId: number): void {
    if (this.openMenuId() === invitationId) {
      this.openMenuId.set(null);
    } else {
      this.openMenuId.set(invitationId);
    }
  }

  /**
   * Cierra el menú
   */
  closeMenu(): void {
    this.openMenuId.set(null);
  }

  /**
   * Verifica si el menú de una invitación está abierto
   */
  isMenuOpen(invitationId: number): boolean {
    return this.openMenuId() === invitationId;
  }
}

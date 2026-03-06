import { Component, input, output, signal } from '@angular/core';
import { Invitation } from '../../../../core/model/invitation.model';
import { InvitationAction, InvitationActionEvent, InvitationUtils } from './invitation.model';

/**
 * Invitation Card Component
 *
 * @description
 * Tarjeta individual de invitación con información resumida y
 * menú de acciones (ver, editar, eliminar).
 *
 * @example
 * ```html
 * <app-invitation-card
 *   [invitation]="invitation"
 *   (action)="handleAction($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-invitation-card',
  imports: [],
  templateUrl: './invitation-card.html',
  styleUrl: './invitation-card.css',
})
export class InvitationCard {
  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Datos de la invitación a mostrar */
  invitation = input.required<Invitation>();

  /** Si el menú dropdown está abierto */
  isMenuOpen = input<boolean>(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Emitido cuando se realiza una acción sobre la invitación */
  action = output<InvitationActionEvent>();

  /** Emitido cuando se alterna el menú */
  menuToggle = output<number>();

  // ═══════════════════════════════════════════════════════════════════════════
  // SIGNALS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Indica si el link fue copiado recientemente */
  isCopied = signal<boolean>(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Obtiene el título de la invitación
   */
  getTitle(): string {
    return InvitationUtils.getTitle(this.invitation());
  }

  /**
   * Obtiene el número total de invitados
   */
  getTotalGuests(): number {
    return this.invitation().guests?.length || 0;
  }

  /**
   * Obtiene el número de invitados confirmados
   */
  getConfirmedGuests(): number {
    return InvitationUtils.getConfirmedGuests(this.invitation());
  }

  /**
   * Obtiene el número de invitados pendientes
   */
  getPendingGuests(): number {
    return InvitationUtils.getPendingGuests(this.invitation());
  }

  /**
   * Obtiene el número de invitados rechazados
   */
  getDeclinedGuests(): number {
    return InvitationUtils.getDeclinedGuests(this.invitation());
  }

  /**
   * Obtiene el estado de la invitación
   */
  getStatus(): string {
    return InvitationUtils.getStatus(this.invitation());
  }

  /**
   * Obtiene la clase CSS para el badge de estado
   */
  getStatusClass(): string {
    const status = this.getStatus();
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'declined':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-amber-100 text-amber-700';
    }
  }

  /**
   * Obtiene el texto del estado
   */
  getStatusText(): string {
    const status = this.getStatus();
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'declined':
        return 'Rechazada';
      default:
        return 'Pendiente';
    }
  }

  /**
   * Emite una acción sobre la invitación
   */
  onAction(actionType: InvitationAction): void {
    this.action.emit({ invitation: this.invitation(), action: actionType });
  }

  /**
   * Emite el toggle del menú
   */
  onToggleMenu(event: Event): void {
    event.stopPropagation();
    const invitationId = this.invitation().id;
    if (invitationId !== undefined) {
      this.menuToggle.emit(invitationId);
    }
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatDate(date: Date | undefined): string {
    return InvitationUtils.formatDate(date);
  }

  /**
   * Genera y copia el link de invitación al portapapeles
   */
  async copyInvitationLink(): Promise<void> {
    const invitation = this.invitation();
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/app/invitations/${invitation.id}/public?token=${invitation.uuid}`;

    try {
      await navigator.clipboard.writeText(link);
      this.isCopied.set(true);

      // Resetear el estado después de 2 segundos
      setTimeout(() => {
        this.isCopied.set(false);
      }, 2000);
    } catch (error) {
      console.error('Error al copiar el link:', error);
    }
  }
}

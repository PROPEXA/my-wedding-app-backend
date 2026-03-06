/**
 * Modelos compartidos para el módulo de invitaciones
 * @module InvitationModels
 */

// Re-exportar Invitation desde el modelo core de la API
export type { Invitation } from '../../../../core/model/invitation.model';
import type { Invitation } from '../../../../core/model/invitation.model';

/**
 * Acciones disponibles para una invitación
 */
export type InvitationAction = 'view' | 'edit' | 'delete' | 'copy';

/**
 * Evento emitido cuando se realiza una acción sobre una invitación
 */
export interface InvitationActionEvent {
  /** Acción realizada */
  action: InvitationAction;
  /** Invitación sobre la que se realizó la acción */
  invitation: Invitation;
}

/**
 * Estado de confirmación de la invitación
 */
export type InvitationStatus = 'confirmed' | 'declined' | 'waiting';

/**
 * Utilidades para trabajar con Invitation
 */
export class InvitationUtils {
  /**
   * Obtiene el título de la invitación
   */
  static getTitle(invitation: Invitation): string {
    return invitation.title || `Invitación #${invitation.id}`;
  }

  /**
   * Obtiene el número de invitados confirmados
   */
  static getConfirmedGuests(invitation: Invitation): number {
    if (!invitation.guests) return 0;
    return invitation.guests.filter((g) => g.is_confirmed === true).length;
  }

  /**
   * Obtiene el número de invitados pendientes
   */
  static getPendingGuests(invitation: Invitation): number {
    if (!invitation.guests) return 0;
    return invitation.guests.filter((g) => g.is_confirmed === null).length;
  }

  /**
   * Obtiene el número de invitados rechazados
   */
  static getDeclinedGuests(invitation: Invitation): number {
    if (!invitation.guests) return 0;
    return invitation.guests.filter((g) => g.is_confirmed === false).length;
  }

  /**
   * Obtiene el estado general de la invitación basado en los invitados
   */
  static getStatus(invitation: Invitation): InvitationStatus {
    if (!invitation.guests || invitation.guests.length === 0) return 'waiting';

    const hasDeclined = invitation.guests.some((g) => g.is_confirmed === false);
    const allConfirmed = invitation.guests.every((g) => g.is_confirmed === true);

    if (hasDeclined) return 'declined';
    if (allConfirmed) return 'confirmed';
    return 'waiting';
  }

  /**
   * Formatea la fecha para mostrar
   */
  static formatDate(date: Date | undefined): string {
    if (!date) return 'Sin fecha';
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  }
}

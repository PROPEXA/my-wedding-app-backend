/**
 * Modelo de estadísticas para bodas y eventos
 * @module StatsModels
 */

/**
 * Tipo de estadística
 */
export type StatsType = 'wedding' | 'event';

/**
 * Estadísticas de invitaciones
 */
export interface InvitationStats {
  /** Total de invitaciones enviadas */
  sent: number;
  /** Invitaciones confirmadas */
  confirmed: number;
  /** Invitaciones pendientes de respuesta */
  pending: number;
  /** Invitaciones rechazadas */
  rejected: number;
}

/**
 * Estadísticas de personas/asistentes
 */
export interface GuestStats {
  /** Total de personas invitadas */
  invited: number;
  /** Personas que confirmaron asistencia */
  confirmed: number;
  /** Personas pendientes de confirmar */
  pending: number;
}

/**
 * Datos completos de estadísticas
 */
export interface WeddingStats {
  /** Tipo de estadística: boda completa o evento específico */
  type: StatsType;
  /** Nombre de la boda o evento (opcional) */
  name?: string;
  /** ID de la boda (opcional) */
  weddingId?: number;
  /** ID del evento (solo si type es 'event') */
  eventId?: number;
  /** Estadísticas de invitaciones */
  invitations: InvitationStats;
  /** Estadísticas de personas */
  guests: GuestStats;
  /** Fecha de última actualización */
  lastUpdated: Date;
}

/**
 * Valores por defecto para estadísticas vacías
 */
export const EMPTY_STATS: WeddingStats = {
  type: 'wedding',
  invitations: {
    sent: 0,
    confirmed: 0,
    pending: 0,
    rejected: 0,
  },
  guests: {
    invited: 0,
    confirmed: 0,
    pending: 0,
  },
  lastUpdated: new Date(),
};

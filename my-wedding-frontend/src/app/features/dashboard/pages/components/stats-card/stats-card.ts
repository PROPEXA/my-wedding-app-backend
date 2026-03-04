import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Statistic } from '../../../../../core/model/statistic.mode';

export const MOCK_STATISTIC: Statistic = {
  wedding_id: 0,
  event_id: 0,
  invitations: 0,
  confirmed: 0,
  declined: 0,
  waiting: 0,
  people_confirmed: 0,
  people_declined: 0,
  people_waiting: 0,
  updated_at: new Date(),
};

/**
 * Stats Card Component
 *
 * @description
 * Componente que muestra las estadísticas de una boda o evento de boda.
 * Incluye:
 * - Invitaciones enviadas, confirmadas, pendientes y rechazadas
 * - Personas invitadas, confirmadas y pendientes
 * - Tipo de estadística (boda completa o evento)
 * - Fecha de última actualización
 *
 * @example
 * ```html
 * <!-- Estadísticas de boda -->
 * <app-stats-card [stats]="weddingStats" />
 *
 * <!-- Estadísticas de evento -->
 * <app-stats-card [stats]="eventStats" />
 * ```
 */
@Component({
  selector: 'app-stats-card',
  imports: [DatePipe],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.css',
})
export class StatsCard {
  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Datos de estadísticas */
  stats = input<Statistic>(MOCK_STATISTIC);

  /** Mostrar título del card */
  showTitle = input<boolean>(true);

  /** Título personalizado (opcional) */
  title = input<string>('');

  /** Tipo de Estadística */
  type = input<'wedding' | 'event'>('wedding');

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPUTED
  // ═══════════════════════════════════════════════════════════════════════════

  /** Título del card basado en el tipo */
  protected cardTitle = computed(() => {
    if (this.title()) return this.title();
    return this.type() === 'wedding' ? 'Estadísticas de Boda' : 'Estadísticas de Evento';
  });

  /** Etiqueta del tipo */
  protected typeLabel = computed(() => {
    return this.type() === 'wedding' ? 'Boda Completa' : 'Evento de Boda';
  });

  /** Clase de color para el badge del tipo */
  protected typeBadgeClass = computed(() => {
    return this.type() === 'wedding'
      ? 'bg-rose-100 text-rose-700'
      : 'bg-purple-100 text-purple-700';
  });

  /** Porcentaje de confirmación de invitaciones */
  protected invitationConfirmRate = computed(() => {
    const { invitations, confirmed } = this.stats();
    if (invitations === 0) return 0;
    return Math.round((confirmed / invitations) * 100);
  });

  /** Porcentaje de confirmación de personas */
  protected guestConfirmRate = computed(() => {
    const people_invited = this.peopleInvited();
    if (people_invited === 0) return 0;
    const people_confirmed = this.stats().people_confirmed;
    return Math.round((people_confirmed / people_invited) * 100);
  });

  peopleInvited = computed(() => {
    const { people_confirmed, people_declined, people_waiting } = this.stats();
    return people_confirmed + people_declined + people_waiting;
  });
}

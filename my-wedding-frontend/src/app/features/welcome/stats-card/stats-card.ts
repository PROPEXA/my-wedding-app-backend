import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WeddingStats, EMPTY_STATS, StatsType } from '../stats.model';
import { Wedding } from '../../weddings/wedding.model';
import { WeddingService } from '../../../core/api/wedding.service';
import { ServerException } from '../../../core/exception/server.exception';
import { logger } from '../../../core/utils/log.util';

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
  stats = input<WeddingStats>(EMPTY_STATS);

  /** Mostrar título del card */
  showTitle = input<boolean>(true);

  /** Título personalizado (opcional) */
  title = input<string>('');


  // ═══════════════════════════════════════════════════════════════════════════
  // COMPUTED
  // ═══════════════════════════════════════════════════════════════════════════

  /** Título del card basado en el tipo */
  protected cardTitle = computed(() => {
    if (this.title()) return this.title();
    const stats = this.stats();
    if (stats.name) return stats.name;
    return stats.type === 'wedding' ? 'Estadísticas de Boda' : 'Estadísticas de Evento';
  });

  /** Etiqueta del tipo */
  protected typeLabel = computed(() => {
    return this.stats().type === 'wedding' ? 'Boda Completa' : 'Evento de Boda';
  });

  /** Clase de color para el badge del tipo */
  protected typeBadgeClass = computed(() => {
    return this.stats().type === 'wedding'
      ? 'bg-rose-100 text-rose-700'
      : 'bg-purple-100 text-purple-700';
  });

  /** Porcentaje de confirmación de invitaciones */
  protected invitationConfirmRate = computed(() => {
    const { sent, confirmed } = this.stats().invitations;
    if (sent === 0) return 0;
    return Math.round((confirmed / sent) * 100);
  });

  /** Porcentaje de confirmación de personas */
  protected guestConfirmRate = computed(() => {
    const { invited, confirmed } = this.stats().guests;
    if (invited === 0) return 0;
    return Math.round((confirmed / invited) * 100);
  });
}

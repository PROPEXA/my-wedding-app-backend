import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CardInfo } from '../../components/card-info/card-info';
import { CardAction } from '../../components/card-action/card-action';
import { Dropdown, DropdownOption } from '../../components/dropdown/dropdown';
import { Button } from '../../components/button/button';
import { StatsCard } from './stats-card/stats-card';
import { WeddingStats, EMPTY_STATS } from './stats.model';
import { WeddingService } from '../../core/api/wedding.service';
import { Wedding, WeddingUtils } from '../weddings/wedding.model';
import { logger } from '../../core/utils/log.util';
import { ServerException } from '../../core/exception/server.exception';

@Component({
  selector: 'app-welcome',
  imports: [CardAction, Dropdown, Button, StatsCard],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome implements OnInit {
  // ═══════════════════════════════════════════════════════════════════════════
  // SERVICES
  // ═══════════════════════════════════════════════════════════════════════════
  private weddingService = inject(WeddingService);
  private destroyRef = inject(DestroyRef);
  // ═══════════════════════════════════════════════════════════════════════════
  // SIGNALS
  // ═══════════════════════════════════════════════════════════════════════════
  myWeddings = signal<Wedding[]>([]);
  error = signal<string>('');

  /** Boda seleccionada en el dropdown */
  protected selectedWeddingId = signal<number | null>(null);

  /** Opciones para el dropdown de bodas */
  protected weddingOptions = computed<DropdownOption[]>(() => {
    return this.myWeddings().map((wedding) => ({
      value: wedding.id ?? 0,
      label: WeddingUtils.getCoupleName(wedding),
    }));
  });

  /** Nombre del usuario (se obtendría del servicio de autenticación) */
  protected userName = signal<string>('Usuario');

  /** Hora del día para el saludo */
  protected greeting = signal<string>('');

  /** Estadísticas de boda actual */
  protected weddingStats = signal<WeddingStats>({
    type: 'wedding',
    name: 'Boda de Ana & Carlos',
    weddingId: 1,
    invitations: {
      sent: 45,
      confirmed: 32,
      pending: 8,
      rejected: 5,
    },
    guests: {
      invited: 120,
      confirmed: 85,
      pending: 35,
    },
    lastUpdated: new Date(),
  });

  /** Estadísticas de evento (ejemplo) */
  protected eventStats = signal<WeddingStats>({
    type: 'event',
    name: 'Ceremonia Religiosa',
    weddingId: 1,
    eventId: 1,
    invitations: {
      sent: 30,
      confirmed: 25,
      pending: 3,
      rejected: 2,
    },
    guests: {
      invited: 80,
      confirmed: 65,
      pending: 15,
    },
    lastUpdated: new Date(),
  });

  ngOnInit(): void {
    this.setGreeting();
    const subs = this.weddingService.getAllMyWeddings().subscribe({
      next: (weddings) => {
        this.myWeddings.set(weddings);
        logger.debug('Weddings loaded for stats card:' + weddings.length);
      },
      error: (err) => {
        if (err instanceof ServerException) {
          this.error.set(err.message);
        } else {
          this.error.set('Ocurrió un error inesperado al cargar las bodas.');
        }
      },
    });
    this.destroyRef.onDestroy(() => subs.unsubscribe());
  }

  /**
   * Establece el saludo según la hora del día
   */
  private setGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting.set('Buenos días');
    } else if (hour < 18) {
      this.greeting.set('Buenas tardes');
    } else {
      this.greeting.set('Buenas noches');
    }
  }

  /**
   * Maneja la selección de una boda en el dropdown
   */
  onWeddingSelected(value: string | number): void {
    const id = typeof value === 'string' ? parseInt(value, 10) : value;
    this.selectedWeddingId.set(id || null);
    logger.debug(`Boda seleccionada: ${id}`);
  }
}

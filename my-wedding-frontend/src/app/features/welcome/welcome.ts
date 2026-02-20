import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CardAction } from '../../components/card-action/card-action';
import { Dropdown, DropdownOption } from '../../components/dropdown/dropdown';
import { Button } from '../../components/button/button';
import { MOCK_STATISTIC, StatsCard } from './stats-card/stats-card';
import { WeddingService } from '../../core/api/wedding.service';
import { Wedding, WeddingUtils } from '../weddings/wedding.model';
import { logger } from '../../core/utils/log.util';
import { ServerException } from '../../core/exception/server.exception';
import { Statistic } from '../../core/model/statistic.mode';

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
  myWeddingStatistic = signal<Statistic>(MOCK_STATISTIC);

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

  ngOnInit(): void {
    this.setGreeting();
    const subs = this.weddingService.getAllMyWeddings().subscribe({
      next: (weddings) => {
        this.myWeddings.set(weddings);
        logger.debug('Weddings loaded for stats card:' + weddings.length);
      },
    });
    this.destroyRef.onDestroy(() => subs.unsubscribe());
  }

  loadWeddingStats(){
    logger.debug(`Cargando estadísticas para boda ID: ${this.selectedWeddingId()}`);

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

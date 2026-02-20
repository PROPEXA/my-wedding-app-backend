import { Component, OnInit, signal } from '@angular/core';
import { CardInfo } from '../../components/card-info/card-info';
import { CardAction } from '../../components/card-action/card-action';
import { Dropdown } from '../../components/dropdown/dropdown';
import { Button } from '../../components/button/button';
import { StatsCard } from './stats-card/stats-card';
import { WeddingStats, EMPTY_STATS } from './stats.model';

@Component({
  selector: 'app-welcome',
  imports: [CardAction, Dropdown, Button, StatsCard],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome implements OnInit {
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
}

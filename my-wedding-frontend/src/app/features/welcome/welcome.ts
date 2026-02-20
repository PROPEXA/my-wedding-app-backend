import { Component, OnInit, signal } from '@angular/core';
import { CardInfo } from '../../components/card-info/card-info';
import { CardAction } from '../../components/card-action/card-action';
import { Dropdown } from '../../components/dropdown/dropdown';
import { Button } from "../../components/button/button";

@Component({
  selector: 'app-welcome',
  imports: [CardInfo, CardAction, Dropdown, Button],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome implements OnInit {
  /** Nombre del usuario (se obtendría del servicio de autenticación) */
  protected userName = signal<string>('Usuario');

  /** Hora del día para el saludo */
  protected greeting = signal<string>('');

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

import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface QuickAction {
  /** Título de la acción */
  title: string;
  /** Path SVG del icono */
  icon: string;
  /** Color de fondo del icono */
  bgColor: string;
  /** Color del icono */
  iconColor: string;
}

@Component({
  selector: 'app-card-action',
  imports: [RouterLink],
  templateUrl: './card-action.html',
  styleUrl: './card-action.css',
})
export class CardAction {
  protected quickActions = signal<QuickAction[]>([
    {
      title: 'plus',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      bgColor: 'bg-rose-100',
      iconColor: 'text-rose-600',
    },
    {
      title: 'heart',
      icon: 'M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z',
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600',
    },
    {
      title: 'email',
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'calendar',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  ]);

  title = input<string>('');
  description = input<string>('');
  route = input<string>('');
  icon = input<'plus' | 'heart' | 'email' | 'calendar'>('plus');

  get getQuickAction() {
    return this.quickActions().find((action) => action.title === this.icon());
  }
}

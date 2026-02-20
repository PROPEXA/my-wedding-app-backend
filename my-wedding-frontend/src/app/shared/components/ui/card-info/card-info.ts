import { Component, input, signal } from '@angular/core';

export interface DashboardStat {
  /** Etiqueta de la estadística */
  label: string;
  /** Valor numérico */
  /** Icono SVG path */
  icon: string;
  /** Color del icono */
  color: string;
}

@Component({
  selector: 'app-card-info',
  imports: [],
  templateUrl: './card-info.html',
  styleUrl: './card-info.css',
})
export class CardInfo {
  protected stats = signal<DashboardStat[]>([
    {
      label: 'heart',
      icon: 'M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z',
      color: 'text-rose-500',
    },
    {
      label: 'email',
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      color: 'text-pink-500',
    },
    {
      label: 'success',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-green-500',
    },
    {
      label: 'calendar',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      color: 'text-purple-500',
    },
  ]);

  value = input<string>('');
  label = input<string>('');
  icon = input<'heart' | 'email' | 'success' | 'calendar'>('success');

  get getIcon() {
    const stat = this.stats().find((s) => s.label === this.icon());
    return stat ? stat.icon : 'success';
  }

  get getColor() {
    const stat = this.stats().find((s) => s.label === this.icon());
    return stat ? stat.color : 'text-green-500';
  }
}

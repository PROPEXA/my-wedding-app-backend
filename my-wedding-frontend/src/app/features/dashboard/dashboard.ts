import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Wedding {
  id: number;
  groomName: string;
  brideName: string;
  date: string;
  location: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  // Lista de bodas disponibles
  weddings: Wedding[] = [
    {
      id: 1,
      groomName: 'Carlos Martínez',
      brideName: 'Ana López',
      date: '15 de Junio, 2026',
      location: 'Hacienda Los Rosales, Calle Principal 123, Ciudad'
    },
    {
      id: 2,
      groomName: 'Roberto Silva',
      brideName: 'María García',
      date: '22 de Agosto, 2026',
      location: 'Jardín Botánico Real, Av. Las Flores 456, Centro'
    },
    {
      id: 3,
      groomName: 'Diego Fernández',
      brideName: 'Laura Rodríguez',
      date: '10 de Octubre, 2026',
      location: 'Salón de Eventos El Encanto, Boulevard Sur 789'
    }
  ];

  selectedWeddingId: number = 1;

  // Datos de ejemplo para la boda seleccionada
  get selectedWedding(): Wedding | undefined {
    return this.weddings.find(w => w.id === this.selectedWeddingId);
  }

  // Estadísticas que cambiarían según la boda seleccionada
  get stats() {
    // En una app real, estos datos vendrían de un servicio
    const statsMap: { [key: number]: any } = {
      1: {
        totalInvitations: 120,
        totalGuests: 240,
        confirmedGuests: 180,
        notConfirmedGuests: 60
      },
      2: {
        totalInvitations: 85,
        totalGuests: 170,
        confirmedGuests: 145,
        notConfirmedGuests: 25
      },
      3: {
        totalInvitations: 150,
        totalGuests: 300,
        confirmedGuests: 210,
        notConfirmedGuests: 90
      }
    };
    return statsMap[this.selectedWeddingId] || statsMap[1];
  }

  get confirmationPercentage(): number {
    const total = this.stats.confirmedGuests + this.stats.notConfirmedGuests;
    return total > 0 ? Math.round((this.stats.confirmedGuests / total) * 100) : 0;
  }

  onWeddingChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedWeddingId = Number(select.value);
  }
}

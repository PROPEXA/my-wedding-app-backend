import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventForm } from '../../components/event-form/event-form';

/**
 * Event Edit Page
 *
 * @description
 * Página wrapper para editar un evento existente.
 * Obtiene el ID del evento desde los parámetros de la ruta
 * y utiliza el componente EventForm en modo 'edit'.
 */
@Component({
  selector: 'app-event-edit',
  imports: [EventForm],
  template: `
    <div class="min-h-screen bg-linear-to-br from-purple-50 via-indigo-50 to-blue-50 py-8 px-4">
      @if (eventId()) {
        <app-event-form mode="edit" [eventId]="eventId()" />
      }
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class EventEdit implements OnInit {
  private route = inject(ActivatedRoute);

  /** ID del evento a editar */
  eventId = signal<number | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventId.set(parseInt(id, 10));
    }
  }
}

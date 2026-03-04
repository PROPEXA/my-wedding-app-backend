import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventForm } from '../../components/event-form/event-form';

/**
 * Event New Page
 *
 * @description
 * Página wrapper para crear un nuevo evento.
 * Obtiene el wedding_id desde los queryParams de la ruta
 * y utiliza el componente EventForm en modo 'create'.
 */
@Component({
  selector: 'app-event-new',
  imports: [EventForm],
  template: `
    <div class="min-h-screen bg-linear-to-br from-purple-50 via-indigo-50 to-blue-50 py-8 px-4">
      @if (weddingId()) {
        <app-event-form mode="create" [weddingId]="weddingId()" />
      } @else {
        <div class="text-center py-20">
          <p class="text-gray-500">No se especificó una boda. Por favor, selecciona una boda primero.</p>
        </div>
      }
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class EventNew implements OnInit {
  private route = inject(ActivatedRoute);

  /** ID de la boda para el nuevo evento */
  weddingId = signal<number | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('wedding_id');
    if (id) {
      this.weddingId.set(parseInt(id, 10));
    }
  }
}

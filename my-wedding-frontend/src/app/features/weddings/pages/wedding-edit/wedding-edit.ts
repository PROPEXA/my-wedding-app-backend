import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeddingForm } from '../../components/wedding-form/wedding-form';


/**
 * Wedding Edit Page
 *
 * @description
 * Página wrapper para editar una boda existente.
 * Obtiene el ID de la boda desde los parámetros de la ruta
 * y utiliza el componente WeddingForm en modo 'edit'.
 */
@Component({
  selector: 'app-wedding-edit',
  imports: [WeddingForm],
  template: `
    <div class="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-purple-50 py-8 px-4">
      @if (weddingId()) {
        <app-wedding-form mode="edit" [weddingId]="weddingId()" />
      }
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class WeddingEdit implements OnInit {
  private route = inject(ActivatedRoute);

  /** ID de la boda a editar */
  weddingId = signal<number | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.weddingId.set(parseInt(id, 10));
    }
  }
}

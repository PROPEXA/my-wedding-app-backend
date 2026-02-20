import { Component } from '@angular/core';
import { WeddingForm } from '../../../features/weddings/wedding-form/wedding-form';

/**
 * Wedding New Page
 *
 * @description
 * Página wrapper para crear una nueva boda.
 * Utiliza el componente WeddingForm en modo 'create'.
 */
@Component({
  selector: 'app-wedding-new',
  imports: [WeddingForm],
  template: `
    <div class="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-purple-50 py-8 px-4">
      <app-wedding-form mode="create" />
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class WeddingNew {}

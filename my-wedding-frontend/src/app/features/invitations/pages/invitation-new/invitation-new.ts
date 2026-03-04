import { Component } from '@angular/core';
import { InvitationForm } from '../../components/invitation-form/invitation-form';

/**
 * Invitation New Page
 *
 * @description
 * Página wrapper para crear una nueva invitación.
 * Utiliza el componente InvitationForm en modo 'create'.
 */
@Component({
  selector: 'app-invitation-new',
  imports: [InvitationForm],
  template: `
    <div class="min-h-screen bg-linear-to-br from-teal-50 via-cyan-50 to-emerald-50 py-8 px-4">
      <app-invitation-form mode="create" />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class InvitationNew {}

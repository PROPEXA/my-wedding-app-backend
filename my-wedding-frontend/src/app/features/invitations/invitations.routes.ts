import { Routes } from '@angular/router';

export const invitationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/invitations/invitations').then((m) => m.Invitations),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/invitation-new/invitation-new').then((m) => m.InvitationNew),
  },
];

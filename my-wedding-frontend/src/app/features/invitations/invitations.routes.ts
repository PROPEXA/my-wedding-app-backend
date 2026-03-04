import { Routes } from '@angular/router';

export const invitationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/invitations/invitations').then((m) => m.Invitations),
  },
];

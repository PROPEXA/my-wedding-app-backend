import { Routes } from '@angular/router';

export const eventsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/event/event').then((m) => m.Event),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/event-new/event-new').then((m) => m.EventNew),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/event-edit/event-edit').then((m) => m.EventEdit),
  },
];

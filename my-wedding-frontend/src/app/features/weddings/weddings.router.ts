import { Routes } from '@angular/router';

export const weddingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/wedding/weddings').then((m) => m.Weddings),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/wedding-new/wedding-new').then((m) => m.WeddingNew),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/wedding-edit/wedding-edit').then((m) => m.WeddingEdit),
  },
];

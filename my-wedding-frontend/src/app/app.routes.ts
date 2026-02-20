import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'app',
    loadComponent: () => import('./layouts/public/public').then((m) => m.Public),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },
      {
        path: 'login',
        loadComponent: () => import('./features/accounts/login/login').then((m) => m.Login),
      },
      {
        path: 'signup',
        loadComponent: () => import('./features/accounts/signup/signup').then((m) => m.Signup),
      },
      {
        path: 'confirm/:token',
        loadComponent: () =>
          import('./features/accounts/confirm-account/confirm-account').then((m) => m.ConfirmAccount),
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./layouts/dashboard/dashboard').then((m) => m.Dashboard),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/welcome/welcome').then((m) => m.Welcome),
      },
      {
        path: 'weddings',
        loadComponent: () => import('./layouts/weddings/weddings').then((m) => m.Weddings),
      },
      {
        path: 'weddings/new',
        loadComponent: () =>
          import('./layouts/weddings/wedding-new/wedding-new').then((m) => m.WeddingNew),
      },
      {
        path: 'weddings/:id/edit',
        loadComponent: () =>
          import('./layouts/weddings/wedding-edit/wedding-edit').then((m) => m.WeddingEdit),
      },
    ],
  },
];

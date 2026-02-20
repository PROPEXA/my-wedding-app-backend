import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/public/public').then((m) => m.Public),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.Login),
      },
      {
        path: 'signup',
        loadComponent: () => import('./features/auth/pages/signup/signup').then((m) => m.Signup),
      },
      {
        path: 'confirm/:token',
        loadComponent: () =>
          import('./features/auth/pages/confirm-account/confirm-account').then(
            (m) => m.ConfirmAccount,
          ),
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./layouts/web-container/web-container').then((m) => m.WebContainer),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'weddings',
        loadComponent: () => import('./features/weddings/pages/wedding/weddings').then((m) => m.Weddings),
      },
      {
        path: 'weddings/new',
        loadComponent: () =>
          import('./features/weddings/pages/wedding-new/wedding-new').then((m) => m.WeddingNew),
      },
      {
        path: 'weddings/:id/edit',
        loadComponent: () =>
          import('./features/weddings/pages/wedding-edit/wedding-edit').then((m) => m.WeddingEdit),
      },
    ],
  },
];

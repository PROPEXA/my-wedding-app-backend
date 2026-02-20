import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup').then((m) => m.Signup),
  },
  {
    path: 'confirm/:token',
    loadComponent: () =>
      import('./pages/confirm-account/confirm-account').then((m) => m.ConfirmAccount),
  },
];

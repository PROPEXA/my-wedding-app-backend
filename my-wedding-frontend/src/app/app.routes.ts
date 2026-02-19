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
        loadComponent: () => import('./features/login/login').then((m) => m.Login),
      },
      {
        path: 'signup',
        loadComponent: () => import('./features/signup/signup').then((m) => m.Signup),
      },
      {
        path: 'confirm/:token',
        loadComponent: () => import('./features/confirm-account/confirm-account').then((m) => m.ConfirmAccount),
      },
    ],
  },
];

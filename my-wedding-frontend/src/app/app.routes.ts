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
        path: 'sigup',
        loadComponent: () => import('./features/sigup/sigup').then((m) => m.Sigup),
      },
    ],
  },
];

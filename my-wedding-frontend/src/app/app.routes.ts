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
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.routes').then((m) => m.authRoutes),
      },
    ],
  },
  {
    path: 'app',
    loadComponent: () => import('./layouts/web-container/web-container').then((m) => m.WebContainer),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'weddings',
        loadChildren: () =>
          import('./features/weddings/weddings.router').then((m) => m.weddingsRoutes),
      },
      {
        path: 'events',
        loadChildren: () =>
          import('./features/events/events.routes').then((m) => m.eventsRoutes),
      },
    ],
  },
];

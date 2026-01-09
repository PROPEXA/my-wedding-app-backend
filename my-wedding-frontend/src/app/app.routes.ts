import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Accounts } from './features/accounts/accounts';
import { Weddings } from './features/weddings/weddings';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
  },
  {
    path: 'accounts',
    component: Accounts,
  },
  {
    path: 'weddings',
    component: Weddings,
  },
];

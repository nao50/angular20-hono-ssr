import { Routes } from '@angular/router';
import { App } from './app';

export const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   loadComponent: () => import('./app'),
  // },
  {
    path: '',
    component: App
  },
];

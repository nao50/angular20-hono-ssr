import { Routes } from '@angular/router';
import { App } from './app';
import { Csr } from './csr/csr';
import { Ssr } from './ssr/ssr';

export const routes: Routes = [
  {
    path: 'csr',
    component: Csr,
  },
  {
    path: 'ssr',
    component: Ssr,
  },
  {
    path: '**',
    redirectTo: 'csr',
  },
];

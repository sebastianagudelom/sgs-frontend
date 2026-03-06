import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.component').then(m => m.RegistroComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'verificar',
    loadComponent: () => import('./pages/verificar/verificar.component').then(m => m.VerificarComponent)
  },
  {
    path: 'productos',
    loadComponent: () => import('./pages/producto-lista/producto-lista.component').then(m => m.ProductoListaComponent)
  },
  {
    path: 'productos/nuevo',
    loadComponent: () => import('./pages/producto-form/producto-form.component').then(m => m.ProductoFormComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'productos/editar/:id',
    loadComponent: () => import('./pages/producto-form/producto-form.component').then(m => m.ProductoFormComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'categorias',
    loadComponent: () => import('./pages/categorias/categorias.component').then(m => m.CategoriasComponent),
    canActivate: [adminGuard]
  },
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'productos'
  }
];

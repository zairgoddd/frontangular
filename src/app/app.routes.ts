import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyAccountComponent } from './components/verify-account/verify-account.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AmenazaListComponent } from './components/amenaza-list/amenaza-list.component';
import { AmenazaFormComponent } from './components/amenaza-form/amenaza-form.component';
import { AtaqueListComponent } from './components/ataque-list/ataque-list.component';
import { AtaqueFormComponent } from './components/ataque-form/ataque-form.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-account', component: VerifyAccountComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'analista',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'cliente',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  // Rutas de Amenazas
  {
    path: 'amenazas',
    component: AmenazaListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'amenazas/nueva',
    component: AmenazaFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'amenazas/editar/:id',
    component: AmenazaFormComponent,
    canActivate: [authGuard]
  },
  // Rutas de Ataques
  {
    path: 'ataques',
    component: AtaqueListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'ataques/nuevo',
    component: AtaqueFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'ataques/editar/:id',
    component: AtaqueFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'ataques/amenaza/:amenazaId',
    component: AtaqueListComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
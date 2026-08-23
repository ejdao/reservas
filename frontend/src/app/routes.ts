import { Routes } from '@angular/router';
import { AuthGuard, AuthoritiesGuard, GuestGuard } from '@common/guards';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { DashboardComponent } from './admin/component';
import { LOCAL_URLS } from '@common/constants';
import { GEN_AUTHS } from '@authorities';

export const routes: Routes = [
  { path: '', redirectTo: LOCAL_URLS.home, pathMatch: 'full' },
  {
    path: 'access-control',
    canActivate: [GuestGuard],
    children: [
      { path: '', loadChildren: () => import('./modules/auth/routes').then((m) => m.routes) },
    ],
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./modules/permisos/presentation/pages/reset-password').then(
        (m) => m.ResetPasswordPage,
      ),
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: LOCAL_URLS.home,
        canActivate: [AuthGuard],
        loadComponent: () => import('./modules/home/presentation/page').then((m) => m.HomePage),
      },

      {
        path: 'seg',
        canActivate: [AuthoritiesGuard],
        loadChildren: () => import('./modules/permisos/routes').then((m) => m.routes),
        data: { authorities: [GEN_AUTHS.code] },
      },
    ],
  },
  { path: '**', redirectTo: LOCAL_URLS.home, pathMatch: 'full' },
];

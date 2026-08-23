import { Routes } from '@angular/router';
import { GEN_AUTHS } from '@authorities';
import { AuthoritiesGuard } from '@common/guards';

export const routes: Routes = [
  {
    path: 'permisos',
    data: { authorities: [GEN_AUTHS.seguridad.code] },
    children: [
      {
        path: 'create',
        canActivate: [AuthoritiesGuard],
        loadComponent: () => import('./presentation/pages/create').then((m) => m.Page),
        data: {
          title: 'Seguridad|Permisos|Crear permisos',
          authorities: [GEN_AUTHS.seguridad.crear],
        },
      },
      {
        path: 'manage-by-usuario',
        canActivate: [AuthoritiesGuard],
        loadComponent: () => import('./presentation/pages/manage-by-usuario').then((m) => m.Page),
        data: {
          title: 'Seguridad|Permisos|Gestionar por usuario',
          authorities: [GEN_AUTHS.seguridad.gestionarPermisos],
        },
      },
      {
        path: 'manage-by-rol',
        canActivate: [AuthoritiesGuard],
        loadComponent: () => import('./presentation/pages/manage-by-rol').then((m) => m.Page),
        data: {
          title: 'Seguridad|Permisos|Gestionar por rol',
          authorities: [GEN_AUTHS.seguridad.gestionarPermisos],
        },
      },
    ],
  },
];

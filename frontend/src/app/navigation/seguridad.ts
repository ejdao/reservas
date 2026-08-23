import { NavModule } from '../admin/config';
import { ADMIN, GEN_AUTHS } from '@authorities';

export const SEG_SNAV_ITEMS: NavModule[] = [
  {
    id: 'seg',
    label: 'Seguridad',
    icon: 'shield-check',
    description: 'Autenticación, permisos, auditoría y control de acceso al sistema.',
    authorities: [ADMIN, GEN_AUTHS.code],
    submodules: [
      {
        id: 'seg-permisos',
        label: 'Permisos',
        icon: 'lock',
        description: 'Gestión de módulos, roles y permisos de usuarios.',
        authorities: [ADMIN, GEN_AUTHS.seguridad.code],
        routes: [
          {
            id: 'seg-permisos-create',
            label: 'Crear permisos',
            icon: 'layers',
            description: 'Definir la estructura de módulos y sus permisos asociados.',
            href: 'seg/permisos/create',
            authorities: [GEN_AUTHS.seguridad.crear],
          },
          {
            id: 'seg-permisos-manage-by-usuario',
            label: 'Gestionar permisos por usuario',
            icon: 'user-cog',
            description: 'Asignar y revocar permisos individuales por usuario.',
            href: 'seg/permisos/manage-by-usuario',
            authorities: [ADMIN, GEN_AUTHS.seguridad.gestionarPermisos],
          },
          {
            id: 'seg-permisos-manage-by-rol',
            label: 'Gestionar permisos por rol',
            icon: 'users',
            description: 'Administrar permisos agrupados por rol.',
            href: 'seg/permisos/manage-by-rol',
            authorities: [ADMIN, GEN_AUTHS.seguridad.gestionarPermisos],
          },
        ],
      },
    ],
  },
];

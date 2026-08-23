import { TipoPermisoCode } from '../../domain/entities';

export interface PermisoResponse {
  id: string;
  codigo: string;
  nombre: string;
  modulo: ModuloRes | null;
  subModulo: ModuloRes | null;
  tipo: TipoPermisoCode;
  isFromRol: boolean;
}

export interface AuthoritiesRes {
  onlyCodigos: string;
  permisos: PermisoResponse[];
}

export interface ModuloRes {
  id: string;
  codigo: string;
  nombre: string;
}

export interface RolRes {
  id: string;
  codigo: string;
  nombre: string;
  permisos: PermisoResponse[];
}

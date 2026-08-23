export interface UsuarioActivoRes {
  id: string;
  document: string;
  fullName: string;
  role: {
    id: string;
    name: string;
  };
}

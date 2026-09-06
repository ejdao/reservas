import { UsuarioOrm } from '@orm/seguridad';
import { RSA_SERVICES } from '@common/application/services';
import { FetchRolRes, FetchUsuarioRes } from '@seg/application/responses';
import { estadoUsuarioTypeFactory, tipoDocUsuarioTypeFactory } from '@ctypes/general/usuario';

export const usuarioOrmToUsuarioResFactory = (data: UsuarioOrm): FetchUsuarioRes => {
  const usuario = new FetchUsuarioRes();

  const rol = new FetchRolRes();
  rol.id = RSA_SERVICES.encryptValue(data.rol.id);
  rol.codigo = data.rol.codigo;
  rol.nombre = data.rol.nombre;

  usuario.id = RSA_SERVICES.encryptValue(data.id);
  usuario.documento = data.documento;
  usuario.primerNombre = data.primerNombre;
  usuario.segundoNombre = data.segundoNombre;
  usuario.primerApellido = data.primerApellido;
  usuario.segundoApellido = data.segundoApellido;
  usuario.nombreCompleto = `${data.primerNombre}${data.segundoNombre ? ' ' + data.segundoNombre : ''} ${
    data.primerApellido
  }${data.segundoApellido ? ' ' + data.segundoApellido : ''}`;
  usuario.numeroContactoPrincipal = data.numeroContactoPrincipal;
  usuario.numeroContactoSecundario = data.numeroContactoSecundario;
  usuario.email = data.email;
  usuario.ultimoAcceso = new Date(data.ultimoAcceso);
  usuario.isPasswordReiniciada = data.isPasswordReiniciada;
  usuario.rol = rol;
  usuario.estado = estadoUsuarioTypeFactory(data.estadoCode) as any;
  usuario.tipoDocumento = tipoDocUsuarioTypeFactory(data.tipoDocumentoCode) as any;
  return usuario;
};

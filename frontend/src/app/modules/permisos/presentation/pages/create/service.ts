import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SEG_END_POINTS } from '@end-points';

export interface ModuleI {
  id: string;
  codigo: string;
  nombre: string;
  subModulos?: ModuleI[];
}

@Injectable()
export class CreateAuthoritiesServices {
  constructor(private _http: HttpClient) {}

  public getModules(): Promise<ModuleI[]> {
    return firstValueFrom(this._http.get<ModuleI[]>(`${SEG_END_POINTS.modulos}`));
  }

  public createModule(name: string): Promise<boolean> {
    return firstValueFrom(this._http.post<boolean>(`${SEG_END_POINTS.modulos}`, { nombre: name }));
  }

  public createSubModule(name: string, moduleCode: string): Promise<boolean> {
    return firstValueFrom(
      this._http.post<boolean>(`${SEG_END_POINTS.subModulos}`, {
        nombre: name,
        moduloCode: moduleCode,
      }),
    );
  }

  public createAuthority(
    name: string,
    moduleCode: string,
    subModuleCode: string,
  ): Promise<boolean> {
    return firstValueFrom(
      this._http.post<boolean>(`${SEG_END_POINTS.permisos}`, {
        nombre: name,
        moduloCode: moduleCode,
        subModuloCode: subModuleCode,
      }),
    );
  }
}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  Check,
  CircleAlert,
  CircleDot,
  Info,
  LoaderCircle,
  LucideAngularModule,
  Search,
  ShieldCheck,
  X,
} from 'lucide-angular';
import {
  PermisoCrudController,
  PermisoRolController,
  PermisoUsuarioController,
} from '../../controllers';
import { PermisoRolService, PermisoUsuarioService } from '../../../application/services';
import { cloneDeep } from '@eklipse/ng-utilities';
import { Permiso, Usuario, Rol } from '../../../domain/entities';
import { PermisoRepository, RolRepository } from '../../../domain/repositories';
import { PermisoProxyRepository, RolProxyRepository } from '../../../infrastructure/repositories';
import { PermisoUsuarioImpl, PermisoRolImpl } from '../../../infrastructure/services';
import {
  SET_PERMISOS_DIALOG_DATA,
  SetPermisosDialogData,
  SetPermisosDialogRef,
} from './dialog.types';
import { EXTERNAL_PERMISSION_PREFIX, GEMI_PERMISSION_PREFIX } from '../../../application/constants';

interface FeedbackState {
  type: 'error';
  message: string;
}

@Component({
  imports: [LucideAngularModule],
  providers: [
    { provide: PermisoUsuarioService, useClass: PermisoUsuarioImpl },
    { provide: PermisoRepository, useClass: PermisoProxyRepository },
    { provide: PermisoRolService, useClass: PermisoRolImpl },
    { provide: RolRepository, useClass: RolProxyRepository },
    PermisoUsuarioController,
    PermisoCrudController,
    PermisoRolController,
  ],
  selector: 'app-set-permisos-dialog',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetPermisosDialog implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput') private _searchInput?: ElementRef<HTMLInputElement>;

  public readonly icons = {
    Check,
    CircleAlert,
    CircleDot,
    Info,
    LoaderCircle,
    Search,
    ShieldCheck,
    X,
  };

  public permisos: Permiso[] = [];
  public filter = '';
  public feedback: FeedbackState | null = null;
  public isLoading = false;
  public readonly pendingPermissionCodes = new Set<string>();

  private _isDestroyed = false;

  constructor(
    href: ElementRef<HTMLElement>,
    public dialogRef: SetPermisosDialogRef<Usuario | Rol>,
    @Inject(SET_PERMISOS_DIALOG_DATA) public data: SetPermisosDialogData,
    private _permisoUsuario: PermisoUsuarioController,
    private _permisoRol: PermisoRolController,
    private _permisosCrud: PermisoCrudController,
    private _cd: ChangeDetectorRef,
  ) {
    href.nativeElement.classList.add('app-set-permisos-dialog');
  }

  public async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.feedback = null;
    this._cd.markForCheck();

    const result = await this._permisosCrud.fetch();

    if (this._isDestroyed) return;

    result.fold({
      right: (permisos) => {
        const permissionsByVersion = cloneDeep(this._filterPermissionsByVersion(permisos));

        permissionsByVersion.forEach((permiso) => {
          const permisoUsuario = this.data.data.permisos.filter(
            (el) => el.codigo === permiso.codigo,
          );

          if (permisoUsuario.length) {
            permiso.isByRol = permisoUsuario[0].isByRol;
            permiso.isActive = true;
          } else {
            permiso.isActive = false;
          }
        });

        this.permisos = permissionsByVersion;
      },
      left: (error) => {
        this.feedback = {
          type: 'error',
          message: this._normalizeError(error, 'No fue posible cargar los permisos.'),
        };
      },
    });

    this.isLoading = false;
    this._cd.markForCheck();
  }

  public ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      if (!this._isDestroyed) this._searchInput?.nativeElement.focus();
    });
  }

  public get entityTypeLabel(): string {
    return this.data.tipoEntidad === 'usuario' ? 'Usuario' : 'Rol';
  }

  public get entityName(): string {
    return this.data.tipoEntidad === 'usuario'
      ? (this.data.data as Usuario).nombreCompleto
      : (this.data.data as Rol).nombre;
  }

  public get versionLabel(): string {
    if (this.data.version === 'standard') return 'Standard';
    if (this.data.version === 'enlaces-externos') return 'Enlaces externos';
    return 'Gemi';
  }

  public get filteredPermisos(): Permiso[] {
    const term = this.filter.trim().toLowerCase();

    if (!term) return this.permisos;

    return this.permisos.filter((permiso) => this._matchesFilter(permiso, term));
  }

  public get totalPermissionRows(): number {
    return this.permisos.filter((permiso) => permiso.tipo.code === 3).length;
  }

  public get visiblePermissionRows(): number {
    return this.filteredPermisos.filter((permiso) => permiso.tipo.code === 3).length;
  }

  public get activePermissionsCount(): number {
    return this.permisos.filter((permiso) => permiso.tipo.code === 3 && permiso.isActive).length;
  }

  public get inheritedPermissionsCount(): number {
    return this.permisos.filter((permiso) => permiso.tipo.code === 3 && permiso.isByRol === true)
      .length;
  }

  public get hasPendingChanges(): boolean {
    return this.pendingPermissionCodes.size > 0;
  }

  public setFilter(value: string): void {
    this.filter = value;
  }

  public clearFilter(): void {
    this.filter = '';
    requestAnimationFrame(() => {
      if (!this._isDestroyed) this._searchInput?.nativeElement.focus();
    });
  }

  public isPending(permiso: Permiso): boolean {
    return this.pendingPermissionCodes.has(permiso.codigo);
  }

  public async onTogglePermiso(permiso: Permiso, isChecked: boolean): Promise<void> {
    if (permiso.isByRol === true || this.isPending(permiso)) return;

    let result;

    const transaction = isChecked ? 'agregado' : 'retirado';
    const failureMessage = `El permiso no fue ${transaction} correctamente`;

    this.feedback = null;
    this.pendingPermissionCodes.add(permiso.codigo);
    this._cd.markForCheck();

    if (this.data.tipoEntidad === 'usuario') {
      if (isChecked)
        result = await this._permisoUsuario.addPermiso(permiso, this.data.data as Usuario);
      else result = await this._permisoUsuario.removePermiso(permiso, this.data.data as Usuario);
    } else {
      if (isChecked) result = await this._permisoRol.add(permiso, this.data.data as Rol);
      else result = await this._permisoRol.remove(permiso, this.data.data as Rol);
    }

    result.fold({
      right: (success) => {
        if (success) {
          permiso.isActive = isChecked;
        } else {
          this.feedback = { type: 'error', message: failureMessage };
        }
      },
      left: (error) => {
        this.feedback = {
          type: 'error',
          message: this._normalizeError(error, failureMessage),
        };
      },
    });

    this.pendingPermissionCodes.delete(permiso.codigo);

    if (!this._isDestroyed) this._cd.markForCheck();
  }

  public async onToggleRolDependiente(permiso: Permiso, isChecked: boolean): Promise<void> {
    if (isChecked) await this.onTogglePermiso(permiso, isChecked);
  }

  public ngOnDestroy(): void {
    this._isDestroyed = true;
  }

  public onClose(): void {
    if (this.hasPendingChanges) return;

    const permisos = this.permisos.filter((el) => el.isActive && el.tipo.code === 3);
    this.dialogRef.close({ data: this.data.data, permisos });
  }

  private _filterPermissionsByVersion(permisos: Permiso[]): Permiso[] {
    if (this.data.version === 'standard') {
      return permisos.filter(
        (permiso) =>
          ![EXTERNAL_PERMISSION_PREFIX, GEMI_PERMISSION_PREFIX].includes(
            permiso.codigo.slice(0, 3),
          ),
      );
    }

    if (this.data.version === 'enlaces-externos') {
      return permisos.filter(
        (permiso) => permiso.codigo.slice(0, 3) === EXTERNAL_PERMISSION_PREFIX,
      );
    }

    return permisos.filter((permiso) => permiso.codigo.slice(0, 3) === GEMI_PERMISSION_PREFIX);
  }

  private _matchesFilter(permiso: Permiso, term: string): boolean {
    const values = [
      permiso.codigo,
      permiso.descripcion,
      permiso.modulo ?? '',
      permiso.submodulo ?? '',
      permiso.tipo.label,
    ];

    return values.some((value) => value.toLowerCase().includes(term));
  }

  private _normalizeError(error: unknown, fallback: string): string {
    return typeof error === 'string' && error.trim() ? error : fallback;
  }
}

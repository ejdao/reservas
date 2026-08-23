import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SetPermisosDialogService } from '../../components';
import { UsuarioCrudController } from '../../controllers';
import { Permiso, Usuario } from '../../../domain/entities';
import { UsuarioProxyRepository } from '../../../infrastructure/repositories';
import { UsuarioRepository } from '../../../domain/repositories';
import { EXTERNAL_PERMISSION_PREFIX, GEMI_PERMISSION_PREFIX } from '../../../application/constants';

type PermissionVersion = 'standard' /*  | 'enlaces-externos' | 'gemi' */;
type SortKey = 'nombre' | 'documento' | 'rol';
type SortDirection = 'asc' | 'desc';

interface FeedbackState {
  type: 'error';
  message: string;
}

@Component({
  imports: [FormsModule],
  providers: [
    UsuarioCrudController,
    SetPermisosDialogService,
    { provide: UsuarioRepository, useClass: UsuarioProxyRepository },
  ],
  selector: 'app-manage-permiso-by-usuario-web',
  templateUrl: './page.html',
  styleUrls: ['./page.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Page implements OnInit, OnDestroy {
  public readonly permissionVersions: ReadonlyArray<{
    id: PermissionVersion;
    label: string;
    description: string;
  }> = [
    {
      id: 'standard',
      label: 'Standard',
      description: 'Permisos internos',
    },
    /* {
      id: 'enlaces-externos',
      label: 'Externos',
      description: 'Enlaces externos',
    },
    {
      id: 'gemi',
      label: 'Gemi',
      description: 'Permisos Gemi',
    }, */
  ];

  public readonly pageSizeOptions = [10, 30, 50];
  public usuarios: Usuario[] = [];
  public filter = '';
  public pageIndex = 0;
  public pageSize = 10;
  public sortKey: SortKey = 'nombre';
  public sortDirection: SortDirection = 'asc';
  public feedback: FeedbackState | null = null;
  public loadingAssignmentKey: string | null = null;

  private _unsubscribe$ = new Subject<void>();
  private _isLoading = false;

  constructor(
    href: ElementRef<HTMLElement>,
    private _setPermisosDialog: SetPermisosDialogService,
    private _usuariosCrud: UsuarioCrudController,
    private _cd: ChangeDetectorRef,
  ) {
    href.nativeElement.classList.add('app-manage-permiso-by-usuario-web');
  }

  public ngOnInit(): void {
    void this.fetch(false);
    this._subscribeToUsuariosDataChanges();
  }

  public get filteredUsuarios(): Usuario[] {
    const term = this.filter.trim().toLowerCase();

    const usuarios = term
      ? this.usuarios.filter((usuario) => {
          return (
            usuario.nombreCompleto.toLowerCase().includes(term) ||
            usuario.numeroDocumento.toLowerCase().includes(term) ||
            usuario.nombreRol.toLowerCase().includes(term)
          );
        })
      : [...this.usuarios];

    return usuarios.sort((a, b) => {
      const valueA = this._getSortValue(a);
      const valueB = this._getSortValue(b);
      const result = valueA.localeCompare(valueB, 'es');

      return this.sortDirection === 'asc' ? result : result * -1;
    });
  }

  public get pagedUsuarios(): Usuario[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredUsuarios.slice(start, start + this.pageSize);
  }

  public get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredUsuarios.length / this.pageSize));
  }

  public get firstItem(): number {
    if (!this.filteredUsuarios.length) return 0;
    return this.pageIndex * this.pageSize + 1;
  }

  public get lastItem(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.filteredUsuarios.length);
  }

  public get totalRoles(): number {
    return new Set(this.usuarios.map((usuario) => usuario.nombreRol)).size;
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public async fetch(refresh = false): Promise<void> {
    this._isLoading = true;
    this.feedback = null;
    this._cd.markForCheck();

    const result = await this._usuariosCrud.fetch(refresh);

    result.fold({
      right: (usuarios) => {
        this._setUsuarios(usuarios);
      },
      left: (error) => {
        this.feedback = {
          type: 'error',
          message: typeof error === 'string' ? error : 'No fue posible cargar los usuarios.',
        };
      },
    });

    this._isLoading = false;
    this._cd.markForCheck();
  }

  public onRefresh(): void {
    this.filter = '';
    this.pageIndex = 0;
    void this.fetch(true);
  }

  public setFilter(value: string): void {
    this.filter = value;
    this.pageIndex = 0;
  }

  public clearFilter(): void {
    this.setFilter('');
  }

  public setPageSize(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 0;
  }

  public setSort(sortKey: SortKey): void {
    if (this.sortKey === sortKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      return;
    }

    this.sortKey = sortKey;
    this.sortDirection = 'asc';
  }

  public goToFirstPage(): void {
    this.pageIndex = 0;
  }

  public goToPreviousPage(): void {
    this.pageIndex = Math.max(0, this.pageIndex - 1);
  }

  public goToNextPage(): void {
    this.pageIndex = Math.min(this.totalPages - 1, this.pageIndex + 1);
  }

  public goToLastPage(): void {
    this.pageIndex = this.totalPages - 1;
  }

  public isAssigning(usuario: Usuario, version: PermissionVersion): boolean {
    return this.loadingAssignmentKey === this._getAssignmentKey(usuario, version);
  }

  public async onSelectUsuario(usuario: Usuario, version: PermissionVersion): Promise<void> {
    this.loadingAssignmentKey = this._getAssignmentKey(usuario, version);
    this.feedback = null;
    this._cd.markForCheck();

    const permisos = await this._usuariosCrud.fetchPermisos(usuario.id);

    permisos.fold({
      right: (currentPermissions) => {
        usuario.permisos = currentPermissions;

        const dialog = this._setPermisosDialog.open(usuario, 'usuario', version);

        dialog
          .afterClosed()
          .pipe(takeUntil(this._unsubscribe$))
          .subscribe((data: { data: Usuario; permisos: Permiso[] } | undefined) => {
            if (!data) return;

            const usuarioToUpdate = this.usuarios.find((el) => el.id === data.data.id);
            if (usuarioToUpdate) {
              usuarioToUpdate.permisos = this._mergePermissionsByVersion(
                usuarioToUpdate.permisos,
                data.permisos,
                version,
              );
            }

            this._cd.markForCheck();
          });
      },
      left: (message) => {
        this.feedback = {
          type: 'error',
          message: typeof message === 'string' ? message : 'No fue posible cargar los permisos.',
        };
      },
    });

    this.loadingAssignmentKey = null;
    this._cd.markForCheck();
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  private _subscribeToUsuariosDataChanges(): void {
    this._usuariosCrud
      .observable()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((usuarios) => {
        this._setUsuarios(usuarios.data);
        this._cd.markForCheck();
      });
  }

  private _setUsuarios(usuarios: Usuario[]): void {
    this.usuarios = usuarios;
    this._clampPageIndex();
  }

  private _clampPageIndex(): void {
    this.pageIndex = Math.min(this.pageIndex, this.totalPages - 1);
    this.pageIndex = Math.max(0, this.pageIndex);
  }

  private _getSortValue(usuario: Usuario): string {
    if (this.sortKey === 'documento') return usuario.numeroDocumento;
    if (this.sortKey === 'rol') return usuario.nombreRol;

    return usuario.nombreCompleto;
  }

  private _getAssignmentKey(usuario: Usuario, version: PermissionVersion): string {
    return `${usuario.id}-${version}`;
  }

  private _mergePermissionsByVersion(
    currentPermissions: Permiso[],
    versionPermissions: Permiso[],
    version: PermissionVersion,
  ): Permiso[] {
    const permissionsFromOtherVersions = currentPermissions.filter(
      (permiso) => !this._isPermissionFromVersion(permiso, version),
    );

    return [...permissionsFromOtherVersions, ...versionPermissions].filter(
      (permiso, index, permissions) =>
        permissions.findIndex((current) => current.codigo === permiso.codigo) === index,
    );
  }

  private _isPermissionFromVersion(permiso: Permiso, version: PermissionVersion): boolean {
    const prefix = permiso.codigo.slice(0, 3);

    if (version === 'standard')
      return prefix !== EXTERNAL_PERMISSION_PREFIX && prefix !== GEMI_PERMISSION_PREFIX;
    if (version === 'enlaces-externos') return prefix === EXTERNAL_PERMISSION_PREFIX;

    return prefix === GEMI_PERMISSION_PREFIX;
  }
}

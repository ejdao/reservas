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
import { RolCrudController } from '../../controllers';
import { RolRepository } from '../../../domain/repositories';
import { RolProxyRepository } from '../../../infrastructure/repositories';
import { Permiso, Rol } from '../../../domain/entities';
import { EXTERNAL_PERMISSION_PREFIX, GEMI_PERMISSION_PREFIX } from '../../../application/constants';

type PermissionVersion = 'standard' /*  | 'enlaces-externos' | 'gemi' */;
type SortKey = 'nombre' | 'permisos';
type SortDirection = 'asc' | 'desc';

interface FeedbackState {
  type: 'success' | 'error';
  message: string;
}

@Component({
  imports: [FormsModule],
  providers: [
    RolCrudController,
    SetPermisosDialogService,
    { provide: RolRepository, useClass: RolProxyRepository },
  ],
  selector: 'app-manage-permiso-by-rol-web',
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
  public roles: Rol[] = [];
  public filter = '';
  public pageIndex = 0;
  public pageSize = 10;
  public sortKey: SortKey = 'nombre';
  public sortDirection: SortDirection = 'asc';
  public feedback: FeedbackState | null = null;

  private _unsubscribe$ = new Subject<void>();
  private _isLoading = false;

  constructor(
    href: ElementRef<HTMLElement>,
    private _setPermisosDialog: SetPermisosDialogService,
    private _rolesCrud: RolCrudController,
    private _cd: ChangeDetectorRef,
  ) {
    href.nativeElement.classList.add('app-manage-permiso-by-rol-web');
  }

  public ngOnInit(): void {
    void this.fetch(false);
    this._subscribeToRolesDataChanges();
  }

  public get filteredRoles(): Rol[] {
    const term = this.filter.trim().toLowerCase();

    const roles = term
      ? this.roles.filter((rol) => {
          const permisos = `${rol.permisos.length} permisos`;
          return rol.nombre.toLowerCase().includes(term) || permisos.includes(term);
        })
      : [...this.roles];

    return roles.sort((a, b) => {
      const valueA = this.sortKey === 'nombre' ? a.nombre : a.permisos.length;
      const valueB = this.sortKey === 'nombre' ? b.nombre : b.permisos.length;
      const result =
        typeof valueA === 'string'
          ? valueA.localeCompare(valueB as string, 'es')
          : valueA - (valueB as number);

      return this.sortDirection === 'asc' ? result : result * -1;
    });
  }

  public get pagedRoles(): Rol[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRoles.slice(start, start + this.pageSize);
  }

  public get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRoles.length / this.pageSize));
  }

  public get firstItem(): number {
    if (!this.filteredRoles.length) return 0;
    return this.pageIndex * this.pageSize + 1;
  }

  public get lastItem(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.filteredRoles.length);
  }

  public get totalPermissions(): number {
    return this.roles.reduce((total, rol) => total + rol.permisos.length, 0);
  }

  public get rolesWithPermissions(): number {
    return this.roles.filter((rol) => rol.permisos.length > 0).length;
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public async fetch(refresh = false): Promise<void> {
    this._isLoading = true;
    this.feedback = null;
    this._cd.markForCheck();

    const result = await this._rolesCrud.fetch(refresh);

    result.fold({
      right: (roles) => {
        this._setRoles(roles);
      },
      left: (error) => {
        this.feedback = {
          type: 'error',
          message: typeof error === 'string' ? error : 'No fue posible cargar los roles.',
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

  public onSelectRol(rol: Rol, version: PermissionVersion): void {
    const dialog = this._setPermisosDialog.open(rol, 'rol', version);

    dialog
      .afterClosed()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data: { data: Rol; permisos: Permiso[] } | undefined) => {
        if (!data) return;

        const rolToUpdate = this.roles.find((el) => el.id === data.data.id);
        if (rolToUpdate) {
          rolToUpdate.permisos = this._mergePermissionsByVersion(
            rolToUpdate.permisos,
            data.permisos,
            version,
          );
        }

        this._cd.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  private _subscribeToRolesDataChanges(): void {
    this._rolesCrud
      .observable()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((roles) => {
        this._setRoles(roles.data);
        this._cd.markForCheck();
      });
  }

  private _setRoles(roles: Rol[]): void {
    this.roles = roles;
    this._clampPageIndex();
  }

  private _clampPageIndex(): void {
    this.pageIndex = Math.min(this.pageIndex, this.totalPages - 1);
    this.pageIndex = Math.max(0, this.pageIndex);
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

import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  Inject,
  Injectable,
  Injector,
  OnDestroy,
} from '@angular/core';
import { take } from 'rxjs';
import { SetPermisosDialog } from './component';
import { Usuario, Rol } from '../../../domain/entities';
import {
  PermissionEntityType,
  PermissionVersion,
  SET_PERMISOS_DIALOG_DATA,
  SetPermisosDialogData,
  SetPermisosDialogRef,
} from './dialog.types';

@Injectable()
export class SetPermisosDialogService implements OnDestroy {
  private readonly _closeOpenedDialogs = new Set<() => void>();

  constructor(
    private _appRef: ApplicationRef,
    private _environmentInjector: EnvironmentInjector,
    private _injector: Injector,
    @Inject(DOCUMENT) private _document: Document,
  ) {}

  public open(
    data: Usuario,
    tipoEntidad: 'usuario',
    version: PermissionVersion,
  ): SetPermisosDialogRef<Usuario>;
  public open(data: Rol, tipoEntidad: 'rol', version: PermissionVersion): SetPermisosDialogRef<Rol>;
  public open<TEntity extends Usuario | Rol>(
    data: TEntity,
    tipoEntidad: PermissionEntityType,
    version: PermissionVersion,
  ): SetPermisosDialogRef<TEntity> {
    const dialogRef = new SetPermisosDialogRef<TEntity>();
    const hostElement = this._document.createElement('app-set-permisos-dialog-host');
    const dialogData: SetPermisosDialogData<TEntity> = { data, tipoEntidad, version };
    const closeDialog = () => dialogRef.close();
    const elementInjector = Injector.create({
      providers: [
        { provide: SET_PERMISOS_DIALOG_DATA, useValue: dialogData },
        { provide: SetPermisosDialogRef, useValue: dialogRef },
      ],
      parent: this._injector,
    });
    const previousBodyOverflow = this._document.body.style.overflow;

    this._document.body.appendChild(hostElement);
    this._document.body.style.overflow = 'hidden';

    const componentRef = createComponent(SetPermisosDialog, {
      environmentInjector: this._environmentInjector,
      elementInjector,
      hostElement,
    });

    this._appRef.attachView(componentRef.hostView);
    this._closeOpenedDialogs.add(closeDialog);
    this._destroyOnClose(componentRef, hostElement, previousBodyOverflow, dialogRef, closeDialog);

    return dialogRef;
  }

  public ngOnDestroy(): void {
    [...this._closeOpenedDialogs].forEach((closeDialog) => closeDialog());
    this._closeOpenedDialogs.clear();
  }

  private _destroyOnClose<TEntity extends Usuario | Rol>(
    componentRef: ComponentRef<SetPermisosDialog>,
    hostElement: HTMLElement,
    previousBodyOverflow: string,
    dialogRef: SetPermisosDialogRef<TEntity>,
    closeDialog: () => void,
  ): void {
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        this._appRef.detachView(componentRef.hostView);
        componentRef.destroy();
        hostElement.remove();
        this._document.body.style.overflow = previousBodyOverflow;
        this._closeOpenedDialogs.delete(closeDialog);
      });
  }
}

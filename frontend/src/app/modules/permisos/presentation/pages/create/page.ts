import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateAuthoritiesServices, ModuleI } from './service';

type CreateTab = 'module' | 'subModule' | 'authority';
type ConfirmationAction = CreateTab;

interface FeedbackState {
  type: 'success' | 'error';
  message: string;
}

interface ConfirmationState {
  action: ConfirmationAction;
  title: string;
  message: string;
  confirmLabel: string;
}

@Component({
  imports: [FormsModule],
  providers: [CreateAuthoritiesServices],
  selector: 'app-create-authorities-page--web',
  templateUrl: './page.html',
  styleUrls: ['./page.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Page implements OnInit {
  public readonly tabs: ReadonlyArray<{
    id: CreateTab;
    title: string;
    subtitle: string;
    step: string;
  }> = [
    {
      id: 'module',
      title: 'Modulo',
      subtitle: 'Nivel principal',
      step: '01',
    },
    {
      id: 'subModule',
      title: 'Submodulo',
      subtitle: 'Agrupacion interna',
      step: '02',
    },
    {
      id: 'authority',
      title: 'Permiso',
      subtitle: 'Accion autorizada',
      step: '03',
    },
  ];

  public activeTab: CreateTab = 'module';
  public module: { name: string } = { name: '' };
  public subModule: { name: string; module: ModuleI | null } = { name: '', module: null };
  public authority: { name: string; module: ModuleI | null; subModule: ModuleI | null } = {
    name: '',
    module: null,
    subModule: null,
  };

  public modules: ModuleI[] = [];
  public isLoadingModules = false;
  public isCreatingModule = false;
  public isCreatingSubModule = false;
  public isCreatingAuthority = false;
  public feedback: FeedbackState | null = null;
  public pendingConfirmation: ConfirmationState | null = null;

  constructor(
    href: ElementRef<HTMLElement>,
    private _createAuthoritiesServices: CreateAuthoritiesServices,
    private _cd: ChangeDetectorRef,
  ) {
    href.nativeElement.classList.add('app-create-authorities-web');
  }

  ngOnInit(): void {
    void this.loadModules();
  }

  public get totalSubModules(): number {
    return this.modules.reduce((total, module) => total + (module.subModulos?.length ?? 0), 0);
  }

  public get authoritySubModules(): ModuleI[] {
    return this.authority.module?.subModulos ?? [];
  }

  public get isSubmitting(): boolean {
    return this.isCreatingModule || this.isCreatingSubModule || this.isCreatingAuthority;
  }

  public setActiveTab(tab: CreateTab): void {
    this.activeTab = tab;
    this.feedback = null;
  }

  public async loadModules(): Promise<void> {
    this.isLoadingModules = true;
    this.feedback = null;
    this._cd.markForCheck();

    try {
      this.modules = await this._createAuthoritiesServices.getModules();
      this.syncSelectedModules();
    } catch (error: unknown) {
      this.showError(error, 'No fue posible cargar los modulos disponibles.');
    } finally {
      this.isLoadingModules = false;
      this._cd.markForCheck();
    }
  }

  public onAuthorityModuleChange(module: ModuleI | null): void {
    this.authority.module = module;
    this.authority.subModule = null;
  }

  public canCreateModule(): boolean {
    return this.module.name.trim().length > 0 && !this.isSubmitting;
  }

  public canCreateSubModule(): boolean {
    return this.subModule.name.trim().length > 0 && !!this.subModule.module && !this.isSubmitting;
  }

  public canCreateAuthority(): boolean {
    return this.authority.name.trim().length > 0 && !!this.authority.module && !this.isSubmitting;
  }

  public requestCreateModule(): void {
    if (!this.canCreateModule()) return;

    this.pendingConfirmation = {
      action: 'module',
      title: 'Crear modulo',
      message: `Se registrara "${this.module.name.trim()}" como modulo principal.`,
      confirmLabel: 'Crear modulo',
    };
  }

  public requestCreateSubModule(): void {
    if (!this.canCreateSubModule() || !this.subModule.module) return;

    this.pendingConfirmation = {
      action: 'subModule',
      title: 'Crear submodulo',
      message: `Se registrara "${this.subModule.name.trim()}" dentro de "${this.subModule.module.nombre}".`,
      confirmLabel: 'Crear submodulo',
    };
  }

  public requestCreateAuthority(): void {
    if (!this.canCreateAuthority() || !this.authority.module) return;

    const parentName = this.authority.subModule?.nombre ?? this.authority.module.nombre;

    this.pendingConfirmation = {
      action: 'authority',
      title: 'Crear permiso',
      message: `Se registrara "${this.authority.name.trim()}" dentro de "${parentName}".`,
      confirmLabel: 'Crear permiso',
    };
  }

  public closeConfirmation(): void {
    this.pendingConfirmation = null;
  }

  public async confirmPendingAction(): Promise<void> {
    const action = this.pendingConfirmation?.action;
    this.pendingConfirmation = null;

    if (action === 'module') {
      await this.createModule();
      return;
    }

    if (action === 'subModule') {
      await this.createSubModule();
      return;
    }

    if (action === 'authority') {
      await this.createAuthority();
    }
  }

  private async createModule(): Promise<void> {
    this.isCreatingModule = true;
    this.feedback = null;
    this._cd.markForCheck();

    try {
      await this._createAuthoritiesServices.createModule(this.module.name.trim());
      this.module.name = '';
      this.showSuccess('Modulo registrado correctamente.');
      await this.loadModules();
    } catch (error: unknown) {
      this.showError(error, 'No fue posible registrar el modulo.');
    } finally {
      this.isCreatingModule = false;
      this._cd.markForCheck();
    }
  }

  private async createSubModule(): Promise<void> {
    if (!this.subModule.module) return;

    this.isCreatingSubModule = true;
    this.feedback = null;
    this._cd.markForCheck();

    try {
      await this._createAuthoritiesServices.createSubModule(
        this.subModule.name.trim(),
        this.subModule.module.codigo,
      );
      this.subModule.name = '';
      this.showSuccess('Submodulo registrado correctamente.');
      await this.loadModules();
    } catch (error: unknown) {
      this.showError(error, 'No fue posible registrar el submodulo.');
    } finally {
      this.isCreatingSubModule = false;
      this._cd.markForCheck();
    }
  }

  private async createAuthority(): Promise<void> {
    if (!this.authority.module) return;

    this.isCreatingAuthority = true;
    this.feedback = null;
    this._cd.markForCheck();

    try {
      await this._createAuthoritiesServices.createAuthority(
        this.authority.name.trim(),
        this.authority.module.codigo,
        this.authority.subModule!.codigo,
      );
      this.authority.name = '';
      this.showSuccess('Permiso registrado correctamente.');
    } catch (error: unknown) {
      this.showError(error, 'No fue posible registrar el permiso.');
    } finally {
      this.isCreatingAuthority = false;
      this._cd.markForCheck();
    }
  }

  private syncSelectedModules(): void {
    this.subModule.module = this.findModuleById(this.subModule.module?.id);
    this.authority.module = this.findModuleById(this.authority.module?.id);
    this.authority.subModule = this.findSubModuleById(
      this.authority.module,
      this.authority.subModule?.id,
    );
  }

  private findModuleById(moduleId: string | undefined): ModuleI | null {
    return this.modules.find((module) => module.id === moduleId) ?? null;
  }

  private findSubModuleById(
    module: ModuleI | null,
    subModuleId: string | undefined,
  ): ModuleI | null {
    return module?.subModulos?.find((subModule) => subModule.id === subModuleId) ?? null;
  }

  private showSuccess(message: string): void {
    this.feedback = { type: 'success', message };
  }

  private showError(error: unknown, fallback: string): void {
    const message =
      typeof error === 'object' &&
      error !== null &&
      'error' in error &&
      typeof error.error === 'object' &&
      error.error !== null &&
      'message' in error.error &&
      typeof error.error.message === 'string'
        ? error.error.message
        : fallback;

    this.feedback = { type: 'error', message };
  }
}

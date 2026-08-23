import { Router, RouterModule } from '@angular/router';
import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  AdminLayoutComponent,
  getDisplayFirstName,
  DashboardConfig,
  formatFullName,
  getInitials,
} from './config';
import { NAVIGATION_CONFIG } from '../navigation/config';
import { clearLocalStorage } from '@common/services';
import { APP_INFO, LOCAL_URLS } from '@common/constants';
import { SessionStore } from '@stores/session';
import { ICON_MAP } from './lucide-icons';
import { LogOut, LucideAngularModule, ShieldAlert, X } from 'lucide-angular';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, AdminLayoutComponent, LucideAngularModule],
  template: `
    @if (resourcesLoaded()) {
      <gcm-admin-layout
        [config]="config"
        [modules]="modules"
        [iconMap]="iconMap"
        [sidebarOpen]="sidebarOpen"
        (logout)="clickOnLogout()"
      >
        <router-outlet />
      </gcm-admin-layout>
    }

    @if (logoutModalOpen()) {
      <div
        class="fixed inset-0 z-[1200] flex min-h-dvh items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]"
        role="presentation"
        tabindex="-1"
        (click)="onLogoutDialogBackdrop($event)"
        (keydown)="onLogoutDialogKeydown($event)"
      >
        <section
          class="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
          aria-describedby="logout-modal-description"
        >
          <header
            class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4"
          >
            <div class="flex min-w-0 items-start gap-3">
              <span
                class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"
                aria-hidden="true"
              >
                <lucide-icon [img]="icons.ShieldAlert" [size]="22" />
              </span>

              <div class="min-w-0">
                <h2 id="logout-modal-title" class="text-lg font-semibold leading-7 text-slate-950">
                  Cerrar sesión
                </h2>
                <p id="logout-modal-description" class="mt-1 text-sm leading-6 text-slate-600">
                  Tu sesion actual se cerrara en este navegador.
                </p>
              </div>
            </div>

            <button
              type="button"
              class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[rgb(10,161,174)]/40 disabled:cursor-wait disabled:opacity-50"
              aria-label="Cancelar cierre de sesion"
              [disabled]="logoutInProgress()"
              (click)="cancelLogout()"
            >
              <lucide-icon [img]="icons.X" [size]="19" />
            </button>
          </header>

          <div class="px-5 py-5">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p class="text-sm font-medium text-slate-900">{{ config.userFullName }}</p>
              <p class="mt-1 text-xs leading-5 text-slate-500">
                {{ config.contextForHumans }} - {{ config.enterpriseName }}
              </p>
            </div>
          </div>

          <footer
            class="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:justify-end"
          >
            <button
              type="button"
              class="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[rgb(10,161,174)]/40 disabled:cursor-wait disabled:opacity-50"
              [disabled]="logoutInProgress()"
              (click)="cancelLogout()"
            >
              Permanecer
            </button>
            <button
              type="button"
              class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-wait disabled:bg-slate-400"
              [disabled]="logoutInProgress()"
              (click)="confirmLogout()"
            >
              <lucide-icon [img]="icons.LogOut" [size]="17" />
              @if (logoutInProgress()) {
                Cerrando...
              } @else {
                Cerrar sesión
              }
            </button>
          </footer>
        </section>
      </div>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  config!: DashboardConfig;

  modules = NAVIGATION_CONFIG;

  iconMap = ICON_MAP;

  readonly icons = {
    LogOut,
    ShieldAlert,
    X,
  };

  sidebarOpen = signal(false);

  resourcesLoaded = signal(false);

  logoutModalOpen = signal(false);

  logoutInProgress = signal(false);

  private _channel?: BroadcastChannel;
  private _logoutConfirmation?: Subject<boolean>;
  private _modal = {
    confirm: (_message?: string, _title?: string) => {
      this._logoutConfirmation?.complete();
      this._logoutConfirmation = new Subject<boolean>();
      this.logoutModalOpen.set(true);

      return this._logoutConfirmation.asObservable();
    },
  };

  constructor(
    href: ElementRef<HTMLElement>,
    private _session: SessionStore,
    private _router: Router,
  ) {
    href.nativeElement.classList.add('admin-layout');
  }

  ngOnInit(): void {
    this._loadInitialResources();

    this._channel = new BroadcastChannel('app-state');

    this._channel.onmessage = (event) => {
      if (event.data.key === 'back-to-menu') this._router.navigate([LOCAL_URLS.home]);
      if (event.data.key === 'sidebar') this.openSidebar();
      if (event.data.key === 'logout') this.clickOnLogout();
    };
  }

  ngOnDestroy(): void {
    this._channel?.close();
    this._logoutConfirmation?.complete();
  }

  clickOnLogout(): void {
    this._modal.confirm('¿Desea cerrar su sesión?', '¿Cerrar sesión?').subscribe((success) => {
      if (success) {
        clearLocalStorage();
        this._session.clear();
        location.reload();
      }
    });
  }

  cancelLogout(): void {
    if (this.logoutInProgress()) return;

    this._resolveLogoutConfirmation(false);
  }

  confirmLogout(): void {
    if (this.logoutInProgress()) return;

    this.logoutInProgress.set(true);
    this._resolveLogoutConfirmation(true);
  }

  onLogoutDialogBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.cancelLogout();
  }

  onLogoutDialogKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.cancelLogout();
  }

  private _resolveLogoutConfirmation(success: boolean): void {
    this.logoutModalOpen.set(false);
    this.logoutInProgress.set(false);
    this._logoutConfirmation?.next(success);
    this._logoutConfirmation?.complete();
    this._logoutConfirmation = undefined;
  }

  private async _loadInitialResources(): Promise<void> {
    await this._session.autoInstance();

    const session = this._session.snapshot();

    if (session.wasLoaded) {
      this.config = {
        localhostUrl: LOCAL_URLS.host,
        homeUrl: LOCAL_URLS.home,
        icon: 'assets/images/layouts/enterprise-icon.png',
        enterpriseName: APP_INFO.company,
        roleName: 'Usuario',
        contextCode: session.context.getCode(),
        contextForHumans: session.context.getForHumans(),
        authorities: session.authorities,
        userFullName: formatFullName(session.user.fullName),
        userFirstName: getDisplayFirstName(session.user.fullName),
        userInitials: getInitials(session.user.fullName),
      };
      this.resourcesLoaded.set(true);
    }
  }

  openSidebar(): void {
    this.sidebarOpen.set(true);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}

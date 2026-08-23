import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { AuthenticateImpl } from '../../../infrastructure/services';
import { AuthenticateController } from '../../controllers';
import { AuthenticateService } from '../../../application/services';
import { GCM_CONTEXTS, GCM_CONTEXTS_VALUES } from '@common/types';
import { APP_INFO, LOCAL_URLS } from '@common/constants';
import { STORAGE_KEYS } from '@common/services';
import { SessionStore } from '@stores/session';

@Component({
  selector: 'app-login-form',
  imports: [NgOptimizedImage, FormsModule],
  providers: [AuthenticateController, { provide: AuthenticateService, useClass: AuthenticateImpl }],
  template: `
    <div class="flex h-full flex-col items-center justify-center px-8 py-10">
      <!-- Logo -->
      <img
        ngSrc="assets/images/layouts/access-control-logo.png"
        width="240"
        height="120"
        priority
      />

      <!-- Form -->
      <form (ngSubmit)="handleSubmit()" class="w-full max-w-sm">
        @if (contexts().length > 1) {
          <!-- Contexto -->
          <div class="mb-5">
            <label class="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[#1a2e35]">
              <svg
                class="h-4 w-4 text-[#788c94]"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                <path d="M9 22v-4h6v4" />
                <path d="M8 6h.01" />
                <path d="M16 6h.01" />
                <path d="M12 6h.01" />
                <path d="M12 10h.01" />
                <path d="M12 14h.01" />
                <path d="M16 10h.01" />
                <path d="M16 14h.01" />
                <path d="M8 10h.01" />
                <path d="M8 14h.01" />
              </svg>
              Contexto
            </label>
            <div class="relative">
              <select
                [(ngModel)]="contexto"
                name="contexto"
                class="w-full appearance-none rounded-full border border-[#dae1e4] bg-white px-4 py-2.5 text-sm text-[#1a2e35] outline-none transition-colors focus:border-[rgb(10,161,174)] focus:ring-2 focus:ring-[rgb(10,161,174)]/20"
              >
                <option value="" disabled>Seleccione un contexto</option>
                @for (ctx of contexts(); track ctx) {
                  <option [value]="ctx.getCode()">{{ ctx.getForHumans() }}</option>
                }
              </select>
              <svg
                class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#788c94]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        }

        <!-- Nombre del Usuario -->
        <div class="mb-5">
          <label class="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[#1a2e35]">
            <svg
              class="h-4 w-4 text-[#788c94]"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Nombre del Usuario
          </label>
          <input
            type="text"
            [(ngModel)]="usuario"
            name="usuario"
            placeholder="Ingrese su usuario"
            class="w-full rounded-full border border-[#dae1e4] bg-white px-4 py-2.5 text-sm text-[#1a2e35] placeholder:text-[#788c94] outline-none transition-colors focus:border-[rgb(10,161,174)] focus:ring-2 focus:ring-[rgb(10,161,174)]/20"
          />
        </div>

        <!-- Contraseña -->
        <div class="mb-8">
          <label class="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[#1a2e35]">
            <svg
              class="h-4 w-4 text-[#788c94]"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Contraseña
          </label>
          <div class="relative">
            <input
              [type]="showPassword() ? 'text' : 'password'"
              [(ngModel)]="contrasena"
              name="contrasena"
              placeholder="Ingrese su contraseña"
              class="w-full rounded-full border border-[#dae1e4] bg-white px-4 py-2.5 pr-11 text-sm text-[#1a2e35] placeholder:text-[#788c94] outline-none transition-colors focus:border-[rgb(10,161,174)] focus:ring-2 focus:ring-[rgb(10,161,174)]/20"
            />
            <button
              type="button"
              (click)="togglePassword()"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-[#788c94] transition-colors hover:text-[#1a2e35] cursor-pointer"
              [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              @if (showPassword()) {
                <!-- EyeOff icon -->
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
                  />
                  <path
                    d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
                  />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              } @else {
                <!-- Eye icon -->
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              }
            </button>
          </div>
        </div>

        @if (showError()) {
          <div
            class="mb-5 overflow-hidden rounded-2xl border border-red-200 bg-red-50 shadow-sm"
            role="alert"
            aria-live="assertive"
          >
            <div class="flex items-start gap-3 px-4 py-3">
              <span
                class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700"
                aria-hidden="true"
              >
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </span>

              <div class="min-w-0 flex-1">
                <p class="text-sm font-bold text-red-900">No fue posible iniciar sesión</p>
                <p class="mt-1 text-sm leading-5 text-red-800">{{ errorMessage() }}</p>
              </div>

              <button
                type="button"
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
                aria-label="Cerrar alerta de autenticacion"
                (click)="hideError()"
              >
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>
        }

        <!-- Submit Button -->
        <button
          type="submit"
          [disabled]="isLoading()"
          class="flex w-full items-center justify-center gap-2 rounded-full bg-[rgb(10,161,174)] py-3 text-sm font-bold tracking-wide text-white uppercase transition-colors hover:bg-[rgb(8,140,152)] active:bg-[rgb(6,120,130)] disabled:cursor-not-allowed disabled:opacity-90 cursor-pointer"
        >
          @if (isLoading()) {
            <!-- Spinner -->
            <svg
              class="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Iniciando...
          } @else {
            <!-- LogIn icon -->
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            INICIAR SESIÓN
          }
        </button>
      </form>

      <!-- Footer -->
      <div class="mt-auto pt-8 text-center">
        <p class="text-xs text-[#788c94]">
          <span class="font-semibold text-[#1a2e35]">
            {{ app.name }} v{{ app.version }} ({{ app.released }}) {{ app.company }}
          </span>
        </p>
        <p class="text-xs text-[#788c94]">
          Copyright &copy; {{ app.year }} - Todos los derechos reservados
        </p>
      </div>
    </div>
  `,
})
export class LoginFormComponent {
  readonly app = APP_INFO;

  contexts = signal(GCM_CONTEXTS_VALUES);

  contexto = GCM_CONTEXTS.DEFAULT.getCode();
  usuario = '';
  contrasena = '';

  showPassword = signal(false);
  isLoading = signal(false);
  showError = signal(false);
  errorMessage = signal('');

  constructor(
    private _title: Title,
    private _authenticateCtrl: AuthenticateController,
    private _session: SessionStore,
    private _router: Router,
  ) {}

  public async ngOnInit(): Promise<void> {
    this._title.setTitle(`${APP_INFO.company} | Control de acceso`);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  hideError(): void {
    this.showError.set(false);
    this.errorMessage.set('');
  }

  async handleSubmit(): Promise<void> {
    if (this.isLoading()) return;

    if (!this.usuario || !this.contrasena || !this.contexto) {
      this.errorMessage.set('Completa usuario, contrasena e institucion para continuar.');
      this.showError.set(true);
      return;
    }

    this.isLoading.set(true);
    this.hideError();

    let authenticated = false;
    let passwordIsReset = false;

    const result = await this._authenticateCtrl.loginUser({
      contextCode: this.contexto,
      username: this.usuario,
      password: this.contrasena,
    });

    result.fold({
      right: (response) => {
        localStorage.setItem(STORAGE_KEYS.authToken, response.token!);
        passwordIsReset = response.passwordIsReset;
        authenticated = true;
      },
      left: (error) => {
        this.errorMessage.set(this.getErrorMessage(error));
        this.showError.set(true);
      },
    });

    if (!authenticated) {
      this.isLoading.set(false);
      return;
    }

    if (!passwordIsReset) {
      await this._session.autoInstance();
      await this._router.navigate([LOCAL_URLS.home]);
    } else {
      await this._router.navigate(['reset-password']);
    }
  }

  private getErrorMessage(error: unknown): string {
    return typeof error === 'string' && error.trim()
      ? error
      : 'Verifica tus credenciales e intenta nuevamente.';
  }
}

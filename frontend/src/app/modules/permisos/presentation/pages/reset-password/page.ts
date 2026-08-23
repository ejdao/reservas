import { NgOptimizedImage } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  Component,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { STORAGE_KEYS } from '@common/services';
import { SessionStore } from '@stores/session';
import { SEG_END_POINTS } from '@end-points';
import { APP_INFO } from '@common/constants';

const MIN_PASSWORD_LENGTH = 8;

@Component({
  imports: [FormsModule, NgOptimizedImage],
  providers: [],
  selector: 'app-reset-password-web',
  templateUrl: './page.html',
  styleUrls: ['./page.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPage {
  protected readonly minPasswordLength = MIN_PASSWORD_LENGTH;
  protected readonly isLoading = signal(false);
  protected readonly submitted = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly showConfirmPassword = signal(false);
  protected readonly errorMessage = signal('');

  protected newPassword = '';
  protected confirmPassword = '';
  protected newPasswordTouched = false;
  protected confirmPasswordTouched = false;

  constructor(
    href: ElementRef<HTMLElement>,
    private readonly _http: HttpClient,
    private readonly _router: Router,
    private readonly _title: Title,
    private readonly _session: SessionStore,
  ) {
    href.nativeElement.classList.add('app-reset-password-web');
  }

  public ngOnInit(): void {
    this._title.setTitle(`${APP_INFO.company} | Cambio de contraseña`);
  }

  protected togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  protected toggleConfirmPassword(): void {
    this.showConfirmPassword.update((value) => !value);
  }

  protected markNewPasswordTouched(): void {
    this.newPasswordTouched = true;
  }

  protected markConfirmPasswordTouched(): void {
    this.confirmPasswordTouched = true;
  }

  protected shouldShowNewPasswordError(): boolean {
    return (
      (this.submitted() || this.newPasswordTouched) &&
      this.newPassword.trim().length < this.minPasswordLength
    );
  }

  protected shouldShowConfirmPasswordError(): boolean {
    return (
      (this.submitted() || this.confirmPasswordTouched) &&
      (this.confirmPassword.trim().length === 0 || this.newPassword !== this.confirmPassword)
    );
  }

  protected canSubmit(): boolean {
    return (
      this.newPassword.trim().length >= this.minPasswordLength &&
      this.confirmPassword.trim().length > 0 &&
      this.newPassword === this.confirmPassword &&
      !this.isLoading()
    );
  }

  protected async handleSubmit(): Promise<void> {
    this.submitted.set(true);
    this.errorMessage.set('');

    if (!this.canSubmit()) return;

    this.isLoading.set(true);

    try {
      const response = await firstValueFrom(
        this._http.post<unknown>(`${SEG_END_POINTS.auth}/update-password`, {
          newPassword: this.newPassword.trim(),
        }),
      );

      if (!this.isSuccessResponse(response)) {
        throw new Error(
          this.getResponseMessage(response) || 'No fue posible actualizar la contraseña',
        );
      }

      this.clearCurrentSession();
      await this._router.navigate(['access-control', 'login']);
    } catch (error) {
      const message = this.getErrorMessage(error);
      this.errorMessage.set(message);
    } finally {
      this.isLoading.set(false);
    }
  }

  protected goToLogin(): void {
    this.clearCurrentSession();
    this._router.navigate(['access-control', 'login']);
  }

  protected clearError(): void {
    this.errorMessage.set('');
  }

  private clearCurrentSession(): void {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    this._session.clear();
  }

  private isSuccessResponse(response: unknown): boolean {
    if (typeof response === 'boolean') return response;

    if (this.isRecord(response) && typeof response['success'] === 'boolean') {
      return response['success'];
    }

    return true;
  }

  private getResponseMessage(response: unknown): string {
    if (!this.isRecord(response)) return '';

    const message = response['message'] ?? response['mensaje'] ?? response['error'];

    return typeof message === 'string' ? message : '';
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error && !(error instanceof HttpErrorResponse)) {
      return error.message;
    }

    if (error instanceof HttpErrorResponse) {
      const body = error.error;

      if (typeof body === 'string' && body.trim().length > 0) return body;

      if (this.isRecord(body)) {
        const message = body['message'] ?? body['mensaje'] ?? body['error'];
        if (typeof message === 'string' && message.trim().length > 0) return message;
      }
    }

    return 'No fue posible actualizar la contraseña. Inténtalo nuevamente.';
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}

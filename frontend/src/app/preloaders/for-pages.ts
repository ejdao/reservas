import { ChangeDetectionStrategy, Component, effect, Input, Signal, signal } from '@angular/core';

@Component({
  selector: 'app-page-preloader',
  template: `
    @if (visible()) {
      <div
        class="page-preloader-overlay"
        [class.fade-out]="fading()"
        role="status"
        aria-label="Cargando página"
      >
        <div class="page-dots-container">
          <div class="page-dot"></div>
          <div class="page-dot"></div>
          <div class="page-dot"></div>
          <div class="page-dot"></div>
          <div class="page-ring"></div>
          <div class="page-logo-container">
            <img width="40px" src="assets/images/layouts/enterprise-icon.png" />
          </div>
        </div>
        <div class="page-progress-bar-track">
          <div class="page-progress-bar-fill"></div>
        </div>
        <span class="page-loading-text">
          {{ text }}
        </span>
      </div>
    }
  `,
  styles: [
    `
      .page-preloader-overlay {
        position: fixed;
        inset: 0;
        background: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        opacity: 1;
        transition: opacity 0.4s ease;
      }
      .fade-out {
        opacity: 0;
      }
      .page-dots-container {
        position: relative;
        width: 120px;
        height: 120px;
        margin-bottom: 20px;
      }
      .page-dot {
        width: 10px;
        height: 10px;
        background: #0aa1ae;
        border-radius: 50%;
        position: absolute;
        animation: pulse 1.2s infinite ease-in-out;
      }
      .page-dot:nth-child(1) {
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      .page-dot:nth-child(2) {
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      .page-dot:nth-child(3) {
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      .page-dot:nth-child(4) {
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
          opacity: 0.7;
        }
        50% {
          transform: scale(1.4);
          opacity: 1;
        }
      }
      .page-ring {
        position: absolute;
        inset: 20px;
        border: 3px solid rgba(10, 161, 174, 0.2);
        border-top: 3px solid #0aa1ae;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .page-logo-container {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .page-logo-icon {
        width: 32px;
        height: 32px;
        stroke: #0aa1ae;
        stroke-width: 2;
        fill: none;
      }
      .page-progress-bar-track {
        width: 200px;
        height: 4px;
        background: #eee;
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 10px;
      }
      .page-progress-bar-fill {
        height: 100%;
        width: 100%;
        background: #0aa1ae;
        animation: progress 1.5s linear infinite;
      }
      @keyframes progress {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      .page-loading-text {
        font-size: 14px;
        color: #666;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagePreloaderComponent {
  @Input() startFadeOut!: Signal<boolean>;
  @Input() text = 'Cargando...';

  visible = signal(true);
  fading = signal(false);

  constructor() {
    effect(() => {
      if (!this.startFadeOut) return;

      if (this.startFadeOut()) {
        this.fading.set(true);

        setTimeout(() => {
          this.visible.set(false);
        }, 400);
      }
    });
  }
}

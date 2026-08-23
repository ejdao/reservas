import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-preloader',
  template: `
    <!-- ========================= -->
    <!-- FULL PAGE PRELOADER -->
    <!-- ========================= -->
    @if (variant === 'page' && visible()) {
      <div class="pagePreloaderOverlay" [class.fadeOut]="fadeOut()">
        <div class="pageDotsContainer">
          <div class="pageRing"></div>

          <div class="pageLogoContainer">
            <svg class="pageLogoIcon" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>

          <div class="pageDot"></div>
          <div class="pageDot"></div>
          <div class="pageDot"></div>
          <div class="pageDot"></div>
        </div>

        <div class="pageProgressBarTrack">
          <div class="pageProgressBarFill"></div>
        </div>

        <div class="pageLoadingText">Cargando...</div>
      </div>
    }

    <!-- ========================= -->
    <!-- MODULE SPINNER -->
    <!-- ========================= -->
    @if (variant === 'spinner') {
      <div class="modulePreloaderContainer">
        <div class="moduleSpinner">
          <div class="moduleSpinnerRingOuter"></div>
          <div class="moduleSpinnerRingInner"></div>
        </div>
        <div class="moduleLoadingText">Cargando...</div>
      </div>
    }

    <!-- ========================= -->
    <!-- SKELETON -->
    <!-- ========================= -->
    @if (variant === 'skeleton') {
      <div class="moduleSkeletonContainer">
        @for (_ of skeletonRows; track $index) {
          <div class="moduleSkeletonRow">
            <div class="moduleSkeletonAvatar"></div>
            <div class="moduleSkeletonLines">
              <div class="moduleSkeletonLine"></div>
              <div class="moduleSkeletonLine"></div>
              <div class="moduleSkeletonLine"></div>
            </div>
          </div>
        }
      </div>
    }

    <!-- ========================= -->
    <!-- DOTS INLINE -->
    <!-- ========================= -->
    @if (variant === 'dots') {
      <div class="moduleDotsContainer">
        <div class="moduleDot"></div>
        <div class="moduleDot"></div>
        <div class="moduleDot"></div>
      </div>
    }

    <!-- ========================= -->
    <!-- MODULE BAR -->
    <!-- ========================= -->
    @if (variant === 'bar') {
      <div class="moduleBarContainer">
        <div class="moduleBarTrack">
          <div class="moduleBarFill"></div>
        </div>
        <div class="moduleLoadingText">Cargando...</div>
      </div>
    }
  `,
  styles: [
    `
      /* ========================= */
      /* PAGE PRELOADER */
      /* ========================= */

      .pagePreloaderOverlay {
        position: fixed;
        inset: 0;
        background-color: #f5f5f5;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        gap: 32px;
      }

      .pageLogoContainer {
        width: 72px;
        height: 72px;
        border-radius: 16px;
        background: linear-gradient(135deg, #0aa1ae, #088a96);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: logoPulse 2s ease-in-out infinite;
        box-shadow: 0 8px 32px rgba(10, 161, 174, 0.3);
      }

      .pageLogoIcon {
        width: 36px;
        height: 36px;
        fill: none;
        stroke: #ffffff;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      @keyframes logoPulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.06);
        }
      }

      .pageProgressBarTrack {
        width: 200px;
        height: 3px;
        background-color: #e0e0e0;
        border-radius: 3px;
        overflow: hidden;
        position: relative;
      }

      .pageProgressBarFill {
        position: absolute;
        height: 100%;
        width: 40%;
        background: linear-gradient(90deg, #0aa1ae, #30c4d0);
        animation: pageProgressSlide 1.4s ease-in-out infinite;
      }

      @keyframes pageProgressSlide {
        0% {
          left: -40%;
        }
        100% {
          left: 100%;
        }
      }

      .pageLoadingText,
      .moduleLoadingText {
        font-family:
          'Geist',
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          sans-serif;
        font-size: 14px;
        font-weight: 500;
        color: #888;
      }

      /* ========================= */
      /* MODULE SPINNER */
      /* ========================= */

      .modulePreloaderContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 24px;
        gap: 20px;
      }

      .moduleSpinner {
        position: relative;
        width: 44px;
        height: 44px;
      }

      .moduleSpinnerRingOuter,
      .moduleSpinnerRingInner {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 3px solid #e6f7f8;
      }

      .moduleSpinnerRingOuter {
        border-top-color: #0aa1ae;
        animation: spin 1s linear infinite;
      }

      .moduleSpinnerRingInner {
        inset: 8px;
        border-bottom-color: #088a96;
        animation: spinReverse 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes spinReverse {
        to {
          transform: rotate(-360deg);
        }
      }

      /* ========================= */
      /* SKELETON */
      /* ========================= */

      .moduleSkeletonContainer {
        width: 100%;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .moduleSkeletonRow {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .moduleSkeletonAvatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(90deg, #eef0f2 25%, #e2e5e8 50%, #eef0f2 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }

      .moduleSkeletonLines {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .moduleSkeletonLine {
        height: 12px;
        border-radius: 6px;
        background: linear-gradient(90deg, #eef0f2 25%, #e2e5e8 50%, #eef0f2 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }

      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      /* ========================= */
      /* DOTS */
      /* ========================= */

      .moduleDotsContainer {
        display: flex;
        gap: 6px;
        padding: 24px;
      }

      .moduleDot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #0aa1ae;
        animation: bounce 1.2s infinite;
      }

      .moduleDot:nth-child(2) {
        animation-delay: 0.15s;
      }
      .moduleDot:nth-child(3) {
        animation-delay: 0.3s;
      }

      @keyframes bounce {
        0%,
        60%,
        100% {
          transform: translateY(0);
          opacity: 0.4;
        }
        30% {
          transform: translateY(-10px);
          opacity: 1;
        }
      }

      /* ========================= */
      /* BAR */
      /* ========================= */

      .moduleBarContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 32px 24px;
      }

      .moduleBarTrack {
        width: 160px;
        height: 3px;
        background-color: #e6f7f8;
        border-radius: 3px;
        overflow: hidden;
        position: relative;
      }

      .moduleBarFill {
        position: absolute;
        height: 100%;
        width: 30%;
        background-color: #0aa1ae;
        animation: barSlide 1.2s infinite;
      }

      @keyframes barSlide {
        0% {
          left: -30%;
        }
        100% {
          left: 100%;
        }
      }

      /* FADE */
      .fadeOut {
        animation: fadeOutAnim 0.4s ease-out forwards;
      }

      @keyframes fadeOutAnim {
        to {
          opacity: 0;
          visibility: hidden;
        }
      }
    `,
  ],
})
export class PreloaderComponent {
  @Input() variant: 'page' | 'spinner' | 'skeleton' | 'dots' | 'bar' = 'spinner';

  visible = signal(true);
  fadeOut = signal(false);

  skeletonRows = Array.from({ length: 3 });

  hide() {
    this.fadeOut.set(true);
    setTimeout(() => this.visible.set(false), 400);
  }
}

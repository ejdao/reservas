import { Component } from '@angular/core';
import { FeatureCardsComponent } from './_feature-cards';
import { APP_INFO } from '@common/constants';

@Component({
  selector: 'app-hero-section',
  imports: [FeatureCardsComponent],
  template: `
    <div class="relative flex h-full flex-col justify-between overflow-hidden">
      <!-- Background image -->
      <div
        class="absolute inset-0 bg-cover bg-center"
        [style.backgroundImage]="'url(./assets/images/layouts/access-control-bg.jpg)'"
      ></div>
      <!-- Teal overlay -->
      <div class="custom-teal-overlay absolute inset-0 "></div>

      <!-- Content -->
      <div class="relative z-10 flex flex-1 flex-col justify-between p-8 lg:p-12">
        <!-- Top text -->
        <div class="max-w-xl">
          <h1 class="mb-4 text-3xl font-bold text-white lg:text-4xl text-balance">
            {{ app.company }}
          </h1>
          <p class="text-base leading-relaxed text-white/90 lg:text-lg">
            Una plataforma innovadora, de fácil uso, que ofrece funcionalidades y soluciones
            completas para realizar procesos complementarios en {{ app.company }}.
          </p>
        </div>

        <!-- Feature cards -->
        <div class="mt-auto">
          <app-feature-cards />
          <p class="mt-6 text-xs text-white/60">&copy; {{ app.year }} {{ app.company }}</p>
        </div>
      </div>
    </div>
  `,
})
export class HeroSectionComponent {
  readonly app = APP_INFO;
}

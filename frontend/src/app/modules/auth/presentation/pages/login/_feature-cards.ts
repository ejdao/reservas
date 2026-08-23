import { Component } from '@angular/core';

interface Feature {
  title: string;
  description: string;
  iconPath: string;
}

@Component({
  selector: 'app-feature-cards',
  template: `
    <div class="flex flex-col gap-3">
      @for (feature of features; track feature.title) {
        <div class="flex items-center gap-4 rounded-lg bg-white/15 px-5 py-4 backdrop-blur-md">
          <svg
            class="h-6 w-6 shrink-0 text-white"
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
            <path [attr.d]="feature.iconPath" />
            @if (feature.title === 'En la nube') {
              <path d="M13 11h7" />
            }
            @if (feature.title === 'Acceso universal') {
              <path d="M2 12h20" />
              <path
                d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
              />
            }
            @if (feature.title === 'Seguro y confiable') {
              <path d="m9 12 2 2 4-4" />
            }
          </svg>
          <div>
            <p class="text-sm font-semibold text-white">{{ feature.title }}</p>
            <p class="text-xs text-white/80">{{ feature.description }}</p>
          </div>
        </div>
      }
    </div>
  `,
})
export class FeatureCardsComponent {
  features: Feature[] = [
    {
      title: 'En la nube',
      description: 'Trabaje desde cualquier lugar donde exista una conexión a internet',
      iconPath: 'M17.5 19a4.5 4.5 0 0 0 0-9h-1.8A7 7 0 1 0 4 14.5',
    },
    {
      title: 'Acceso universal',
      description: 'Disponible 24/7 desde cualquier dispositivo',
      iconPath: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
    },
    {
      title: 'Seguro y confiable',
      description: 'Protección avanzada de datos',
      iconPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    },
  ];
}

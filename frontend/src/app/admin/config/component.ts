import { RouterModule } from '@angular/router';
import {
  ViewEncapsulation,
  EventEmitter,
  ElementRef,
  Component,
  Output,
  signal,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TopbarComponent } from './topbar/component';
import { SidebarComponent } from './sidebar/component';
import { DashboardConfig, NavModule } from './config';
import { LucideIconData } from 'lucide-angular';

@Component({
  selector: 'gcm-admin-layout',
  imports: [TopbarComponent, SidebarComponent, RouterModule],
  template: `
    <div class="wrapper">
      <gcm-sidebar
        [iconMap]="iconMap"
        [modules]="modules"
        [config]="config"
        [open]="sidebarOpen()"
        (closed)="closeSidebar()"
      />
      <gcm-topbar [config]="config" (menuClicked)="openSidebar()" (logout)="this.logout.emit()" />
      <main class="main">
        <ng-content select="[active-all-time]" />
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translate(-50%, 20px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }

    .animate-slide-up {
      animation: slide-up 0.3s ease-out;
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  @Input({ required: true }) config!: DashboardConfig;
  @Input({ required: true }) modules!: NavModule[];
  @Input({ required: true }) iconMap!: Record<string, LucideIconData>;

  @Output() logout = new EventEmitter<void>();

  @Input({ required: false }) sidebarOpen = signal(false);

  constructor(href: ElementRef<HTMLElement>) {
    href.nativeElement.classList.add('admin-layout');
  }

  openSidebar(): void {
    this.sidebarOpen.set(true);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}

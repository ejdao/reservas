import { Component, signal, computed, Input } from '@angular/core';
import { NgTemplateOutlet, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  ArrowRight,
  ChevronRight,
  Home,
  LucideIconData,
} from 'lucide-angular';
import { DashboardConfig, NavModule, NavSubmodule } from '../config';
import { ValidateAccessPipe } from '../functions';
import { NavIconComponent } from '../nav-icons';

type Level = 'modules' | 'submodules' | 'routes';

interface BreadcrumbItem {
  label: string;
  level: Level;
  moduleId?: string;
  submoduleId?: string;
}

interface CardItem {
  isSingleRoute: boolean;
  id: string;
  label: string;
  description?: string;
  icon: string;
  accent?: string;
  count?: number;
  href?: string;
  authorities?: string[];
  disableOnContexts?: string[];
  forceDisabledContent?: boolean;
}

@Component({
  selector: 'gcm-tasks-grid',
  imports: [
    NgTemplateOutlet,
    NgClass,
    RouterLink,
    LucideAngularModule,
    NavIconComponent,
    ValidateAccessPipe,
  ],
  templateUrl: './component.html',
  styleUrl: './component.scss',
})
export class TasksGridComponent {
  @Input({ required: true }) iconMap!: Record<string, LucideIconData>;
  @Input({ required: true }) config!: DashboardConfig;
  @Input({ required: true }) modules!: NavModule[];

  readonly icons = { ArrowRight, ChevronRight, Home };

  level = signal<Level>('modules');
  selectedModule = signal<NavModule | null>(null);
  selectedSubmodule = signal<NavSubmodule | null>(null);
  animClass = signal('slide-in');

  /* --- Computed: breadcrumbs --- */
  breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const crumbs: BreadcrumbItem[] = [{ label: 'Modulos', level: 'modules' }];
    const mod = this.selectedModule();
    if (mod) {
      crumbs.push({ label: mod.label, level: 'submodules', moduleId: mod.id });
    }
    const sub = this.selectedSubmodule();
    if (sub) {
      crumbs.push({ label: sub.label, level: 'routes', submoduleId: sub.id });
    }
    return crumbs;
  });

  /* --- Computed: current items --- */
  items = computed<CardItem[]>(() => {
    const lv = this.level();
    const mod = this.selectedModule();
    const sub = this.selectedSubmodule();

    if (lv === 'modules') {
      return this.modules.map((m) => ({
        isSingleRoute: m.isSingleRoute || false,
        ...m,
        count: m.submodules
          .filter((e) => !e.wasDisabled)
          .reduce((acc, s) => acc + s.routes.filter((r) => !r.wasDisabled).length, 0),
      }));
    }
    if (lv === 'submodules' && mod) {
      return mod.submodules.map((s) => ({
        isSingleRoute: false,
        ...s,
        count: s.routes.filter((r) => !r.wasDisabled).length,
      }));
    }
    if (lv === 'routes' && sub) {
      return sub.routes.map((r) => ({
        isSingleRoute: false,
        ...r,
        accent: sub.accent,
        href: r.href,
      }));
    }
    return [];
  });

  constructor(private _router: Router) {}

  sectionTitle = computed(() => {
    const lv = this.level();
    if (lv === 'modules') return 'Modulos del sistema';
    if (lv === 'submodules') return this.selectedModule()?.label ?? '';
    return this.selectedSubmodule()?.label ?? '';
  });

  /* --- Navigation methods --- */
  goToModules(): void {
    this.transition('back', () => {
      this.level.set('modules');
      this.selectedModule.set(null);
      this.selectedSubmodule.set(null);
    });
  }

  goToSubmodules(moduleId: string): void {
    const mod = this.modules.find((m) => m.id === moduleId);
    if (!mod) return;

    // Skip submodule level if only 1 submodule
    if (mod.submodules.length === 1) {
      this.transition('forward', () => {
        this.selectedModule.set(mod);
        this.selectedSubmodule.set(mod.submodules[0]);
        this.level.set('routes');
      });
      return;
    }

    this.transition('forward', () => {
      this.selectedModule.set(mod);
      this.selectedSubmodule.set(null);
      this.level.set('submodules');
    });
  }

  goToRoutes(submoduleId: string): void {
    const mod = this.selectedModule();
    if (!mod) return;
    const sub = mod.submodules.find((s) => s.id === submoduleId);
    if (!sub) return;

    this.transition('forward', () => {
      this.selectedSubmodule.set(sub);
      this.level.set('routes');
    });
  }

  goBack(): void {
    const lv = this.level();
    if (lv === 'routes') {
      const mod = this.selectedModule();
      if (mod && mod.submodules.length === 1) {
        this.goToModules();
        return;
      }
      this.transition('back', () => {
        this.level.set('submodules');
        this.selectedSubmodule.set(null);
      });
    } else {
      this.goToModules();
    }
  }

  onCardClick(item: CardItem): void {
    if (item.isSingleRoute) {
      this._router.navigate([item.href]);
    } else {
      const lv = this.level();
      if (lv === 'modules') {
        this.goToSubmodules(item.id);
      } else if (lv === 'submodules') {
        this.goToRoutes(item.id);
      }
    }
    // Routes with href are handled via routerLink in the template
  }

  onBreadcrumbClick(bc: BreadcrumbItem): void {
    if (bc.level === 'modules') {
      this.goToModules();
    } else if (bc.level === 'submodules') {
      const mod = this.selectedModule();
      if (mod && mod.submodules.length === 1) {
        this.goToModules();
      } else {
        this.transition('back', () => {
          this.level.set('submodules');
          this.selectedSubmodule.set(null);
        });
      }
    }
  }

  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /* --- Animation helper --- */
  private transition(dir: 'forward' | 'back', fn: () => void): void {
    this.animClass.set(dir === 'forward' ? 'slide-out-left' : 'slide-out-right');
    setTimeout(() => {
      fn();
      requestAnimationFrame(() => {
        this.animClass.set('slide-in');
      });
    }, 150);
  }
}

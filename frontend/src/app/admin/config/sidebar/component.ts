import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { ValidateAccessPipe } from '../functions';
import { DashboardConfig, NavModule } from '../config';
import { NavIconComponent } from '../nav-icons';

@Component({
  selector: 'gcm-sidebar',
  imports: [RouterLink, LucideAngularModule, NavIconComponent, ValidateAccessPipe],
  templateUrl: './component.html',
  styleUrl: './component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnChanges {
  @Input({ required: true }) modules!: NavModule[];
  @Input({ required: true }) config!: DashboardConfig;
  @Input({ required: true }) iconMap!: Record<string, LucideIconData>;
  @Input() open = false;

  @Output() closed = new EventEmitter<void>();

  expandedModule: string | null = null;
  expandedSubmodule: string | null = null;

  constructor(
    href: ElementRef<HTMLElement>,
    private _router: Router,
  ) {
    href.nativeElement.classList.add('admin-layout');
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.closed.emit();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      if (this.open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  toggleModule(mod: NavModule): void {
    if (mod.isSingleRoute) {
      this._router.navigate([mod.href]);
      this.closed.emit();
    }
    this.expandedModule = this.expandedModule === mod.id ? null : mod.id;
    this.expandedSubmodule = null;
  }

  toggleSubmodule(moduleId: string, subId: string): void {
    const key = `${moduleId}-${subId}`;
    this.expandedSubmodule = this.expandedSubmodule === key ? null : key;
  }

  isModuleOpen(id: string): boolean {
    return this.expandedModule === id;
  }

  isSubmoduleOpen(moduleId: string, subId: string): boolean {
    return this.expandedSubmodule === `${moduleId}-${subId}`;
  }

  onOverlayClick(): void {
    this.closed.emit();
  }

  onCloseClick(): void {
    this.closed.emit();
  }

  onRouteClick(event: Event): void {
    event.preventDefault();
    this.closed.emit();
  }
}

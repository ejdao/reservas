import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DashboardConfig } from '../config';
import {
  LucideAngularModule,
  Search,
  Bell,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  LayoutGrid,
  LogOutIcon,
  Activity,
} from 'lucide-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'gcm-topbar',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './component.html',
  styleUrl: './component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent implements OnInit, OnDestroy {
  @Input({ required: true }) config!: DashboardConfig;

  module = signal('Modulo');
  subModule = signal('SubModulo');
  route = signal('Ruta');

  showHeaderForRoutes = signal(false);

  @Output() menuClicked = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  readonly icons = {
    Search,
    Bell,
    Settings,
    LogOut,
    Menu,
    ChevronRight,
    LayoutGrid,
    LogOutIcon,
    Activity,
  };

  home = '';

  private _routerSubs!: Subscription;

  constructor(
    href: ElementRef<HTMLElement>,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
  ) {
    href.nativeElement.classList.add('admin-layout');
  }

  ngOnInit(): void {
    this.home = `${this.config.localhostUrl}${this.config.homeUrl ? `/${this.config.homeUrl}` : '/'}`;

    this._execute();

    this._routerSubs = this._router.events.subscribe(() => {
      this._execute();
    });
  }

  private _execute() {
    if (location.href === this.home) {
      this.showHeaderForRoutes.set(false);
    } else {
      this.showHeaderForRoutes.set(true);
    }
    if (this.showHeaderForRoutes()) {
      try {
        let count = 0;
        let current = this._activeRoute;

        while (current.firstChild) {
          current = current.firstChild;
        }

        if (!count) {
          const splitted = (current.snapshot.data['title'] as string).split('|');
          if (splitted[0]) this.module.set(splitted[0]);
          if (splitted[1]) this.subModule.set(splitted[1]);
          if (splitted[2]) this.route.set(splitted[2]);
          count++;
        }
      } catch (error) {}
    }
  }

  ngOnDestroy(): void {
    if (this._routerSubs) this._routerSubs.unsubscribe();
  }
}

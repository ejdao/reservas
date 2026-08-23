import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
  AfterViewInit,
  ElementRef,
  Component,
  OnDestroy,
  computed,
  OnInit,
  signal,
} from '@angular/core';
import { ICON_MAP } from '../../../../admin/lucide-icons';
import { NAVIGATION_CONFIG } from '../../../../navigation/config';
import { SessionStore } from '@stores/session';
import {
  getDisplayFirstName,
  TasksGridComponent,
  DashboardConfig,
  formatFullName,
  getInitials,
} from '../../../../admin/config';
import { APP_INFO } from '@common/constants';

@Component({
  selector: 'app-home-page',
  imports: [TasksGridComponent],
  templateUrl: './page.html',
  styleUrl: './page.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  config!: DashboardConfig;

  modules = NAVIGATION_CONFIG;

  iconMap = ICON_MAP;

  resourcesLoaded = signal(false);

  constructor(
    href: ElementRef<HTMLElement>,
    private _session: SessionStore,
  ) {
    href.nativeElement.classList.add('app-home-page');
  }

  ngAfterViewInit(): void {
    document.getElementsByTagName('main')[0].classList.add('home-main');
  }

  ngOnInit(): void {
    const session = this._session.snapshot();

    if (session.wasLoaded) {
      this.config = {
        localhostUrl: '',
        homeUrl: '',
        icon: 'assets/images/layouts/enterprise-icon',
        enterpriseName: APP_INFO.company,
        roleName: 'Usuario',
        contextCode: session.context.getCode(),
        contextForHumans: session.context.getForHumans(),
        authorities: session.authorities,
        userFullName: formatFullName(session.user.fullName),
        userFirstName: getDisplayFirstName(session.user.fullName),
        userInitials: getInitials(session.user.fullName),
      };
    }

    this.resourcesLoaded.set(true);
  }

  ngOnDestroy(): void {
    try {
      document.getElementsByTagName('main')[0].classList.remove('home-main');
    } catch (error) {}
  }

  greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos dias';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  });
}

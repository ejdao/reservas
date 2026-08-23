import { Router, RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { PagePreloaderComponent } from './preloaders/for-pages';
import { LOCAL_URLS } from '@common/constants';
import { SessionStore } from '@stores/session';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterModule, PagePreloaderComponent],
  template: `
    <app-page-preloader [startFadeOut]="sessionWasLoaded" />
    @if (sessionWasLoaded()) {
      <router-outlet />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  sessionWasLoaded = signal<boolean>(false);
  subs: Subscription;

  constructor(
    private _router: Router,
    private _session: SessionStore,
  ) {
    this.subs = this._router.events.subscribe(() => {
      if (location.href.includes(LOCAL_URLS.login)) this.sessionWasLoaded.set(true);
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      if (!location.href.includes(LOCAL_URLS.login)) {
        await this._session.autoInstance();
      }
    } finally {
      this.sessionWasLoaded.set(true);
    }

    setTimeout(() => {
      this.subs.unsubscribe();
    }, 5000);
  }
}

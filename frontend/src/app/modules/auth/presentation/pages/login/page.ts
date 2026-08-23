import { ChangeDetectionStrategy, ViewEncapsulation, Component } from '@angular/core';
import { LoginFormComponent } from './_login-form';
import { HeroSectionComponent } from './_hero-section';

@Component({
  selector: 'app-login-page',
  imports: [LoginFormComponent, HeroSectionComponent],
  templateUrl: './page.html',
  styleUrls: ['./page.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Page {
  public async ngOnInit(): Promise<void> {}
}

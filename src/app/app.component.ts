import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { TranslationService } from './modules/i18n';
// language list
import arLang from './modules/i18n/vocabs/ar.json';
import engLang from './modules/i18n/vocabs/en.json';
import { AppSettingsService } from './shared/services/appSettings/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { RoleService } from './shared/services/role/role.service';
import { ApiQueryService } from './shared/services/apiQuery/api-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public promptEvent: any;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: any) {
    e.preventDefault();
    this.promptEvent = e;
  }

  constructor(
    private translationService: TranslationService,
    private translateService: TranslateService,
    private settings: AppSettingsService,
    public role: RoleService,
  ) {}

  ngOnInit(): void {
    // register translations
    this.translationService.loadTranslations(arLang, engLang);
    // on lang change

    this.translateService.onLangChange.subscribe((res) => {
      this.settings.currentLang.next(res.lang);
    });

    this.settings.isLoading.subscribe((res: any) => {
      if (res.state === 'on') {
        this.blockUI.start(res.message);
      }

      if (res.state === 'off') {
        this.blockUI.stop();
      }
    });

    this.settings.isContentLoading.subscribe((res: any) => {
      if (res) return this.blockUI.start('');
      this.blockUI.stop();
    });

    if (this.role?.isGuard()) {
      this.settings.isShowToolbar.next(false);
    }

    this.settings.isShowToolbar.subscribe((res) => {
      if (res) return this.defaultToolbarHeight();
      return this.clearToolbarHeight();
    });
  }

  clearToolbarHeight() {
    document
      .querySelector('body')
      ?.style.setProperty('--kt-toolbar-height', '0px');
    document
      .querySelector('body')
      ?.style.setProperty('--kt-toolbar-height-tablet-and-mobile', '0px');
  }

  defaultToolbarHeight() {
    document
      .querySelector('body')
      ?.style.setProperty('--kt-toolbar-height', '55px');
    document
      .querySelector('body')
      ?.style.setProperty('--kt-toolbar-height-tablet-and-mobile', '55px');
  }

  public installPWA() {
    this.promptEvent.prompt();
  }

  public shouldInstall(): boolean {
    return !this.isRunningStandalone() && this.promptEvent;
  }

  public isRunningStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches;
  }
}

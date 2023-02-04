import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { RoleService } from 'src/app/shared/services/role/role.service';
import { TranslationService } from '../../../../../../modules/i18n';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  
  languages = [
    {
      lang: 'ar',
      name: this.translate.instant('arabic'),
      flag: './assets/media/flags/iraq.svg',
    },
    {
      lang: 'en',
      name: this.translate.instant('english'),
      flag: './assets/media/flags/united-states.svg',
    },
   
  ];

  language: LanguageFlag;
  user$:any;
  langs = this.languages;
  private unsubscribe: Subscription[] = [];


  constructor(
    private auth: AuthService,
    private translationService: TranslationService,
    public settings: AppSettingsService,
    public role:RoleService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.value;
    this.setLanguage(this.translationService.getSelectedLanguage());
  }
  getProfileImage(){
    let image = this.user$.photo_url
    if(!image) return false
    let url = `${this.settings.url}media/${image}`

    return url
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}


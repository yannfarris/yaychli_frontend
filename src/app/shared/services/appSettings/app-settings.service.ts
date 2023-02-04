import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BehaviorSubject, Subject } from 'rxjs';
import { TranslationService } from 'src/app/modules/i18n';
import { isDevMode } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
// "http://localhost:4011/"
export class AppSettingsService {
  url = environment.url
  apiUrl = `${this.url}v1`

  currentLang: BehaviorSubject<any> = new BehaviorSubject(this.translationService.getSelectedLanguage().toString())

  toolbarCreateSubject = new Subject()
  isLoading: BehaviorSubject<any> = new BehaviorSubject<any>(false)
  isContentLoading: BehaviorSubject<any> = new BehaviorSubject<any>(false)
  pageSettings: BehaviorSubject<any> = new BehaviorSubject<any>({})
  isShowToolbar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

  isMobile = this.deviceService.isMobile();

  tableAction = new Subject();

  constructor(
    private translationService: TranslationService,
    private translateService: TranslateService,
    private deviceService: DeviceDetectorService,
  ) {}


  getPageSettingsValue(showToolbar: boolean = true, pageType: string = '', showCreate: boolean = true, createText = 'general.create', isShowSearch = true, isShowAccountType = false, isShowAccountantType = false) {
    let settings = {
      showToolbar: showToolbar,
      showCreate: showCreate,
      pageType: pageType,
      createText: createText,
      isShowSearch: false,
      isShowAccountType: isShowAccountType,
      isShowAccountantType: isShowAccountantType,
    }

    return settings;
  }

  resetPageSettingsValues() {
    this.pageSettings.next(this.getPageSettingsValue())
  }

  toolbarCreate(type: string) {
    this.toolbarCreateSubject.next(type)
  }

  loadingInfo(state: string = 'on', message: string = '') {

    let info = {
      state: state,
      message: message != '' ? this.translateService.instant(message) : ''
    }
    return info
  }

}

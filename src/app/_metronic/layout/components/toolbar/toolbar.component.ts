import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { RoleService } from 'src/app/shared/services/role/role.service';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  @ViewChild('ktPageTitle', { static: true }) ktPageTitle: ElementRef;
  pageTitleAttributes: {
    [attrName: string]: string | boolean;
  };
  toolbarContainerCssClasses: string = '';
  pageTitleCssClasses: string = '';

  constructor(private role: RoleService ,private layout: LayoutService, public settings: AppSettingsService, public apiQuery: ApiQueryService) { }

  ngOnInit(): void {
    this.toolbarContainerCssClasses =
      this.layout.getStringCSSClasses('toolbarContainer');
    this.pageTitleCssClasses = this.layout.getStringCSSClasses('pageTitle');
    this.pageTitleAttributes = this.layout.getHTMLAttributes('pageTitle');

  }

  ngAfterViewInit() {
    if (this.ktPageTitle) {
      for (const key in this.pageTitleAttributes) {
        if (
          this.pageTitleAttributes.hasOwnProperty(key) &&
          this.ktPageTitle.nativeElement
        ) {
          this.ktPageTitle.nativeElement.attributes[key] =
            this.pageTitleAttributes[key];
        }
      }
    }
  }

  create(){
    this.settings.toolbarCreateSubject.next(true)
  }
  showSearch(){
    // this.apiQuery.isShowSearch.next(!this.apiQuery.isShowSearch.value)
  }
  isAllowed(){
    if(this.settings.pageSettings.value.pageType === 'trip' && !this.role.isAdmin()) return false;
    return true
  }


}

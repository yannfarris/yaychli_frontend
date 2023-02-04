import { Component, OnInit } from '@angular/core';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { RoleService } from 'src/app/shared/services/role/role.service';

@Component({
  selector: 'app-options-filter',
  templateUrl: './options-filter.component.html',
  styleUrls: ['./options-filter.component.scss']
})
export class OptionsFilterComponent implements OnInit {

  constructor(

    public settings: AppSettingsService,
    public apiQuery: ApiQueryService,
    public role: RoleService,

  ) { }

  ngOnInit(): void {
  
  }

  showSearch(){
    this.apiQuery.isShowSearch.next(!this.apiQuery.isShowSearch.value)
    if(this.apiQuery.isShowSearch.value === false) {
      this.apiQuery.resetApiKey()
      this.apiQuery.isReset.next(true)
    }
  }

  create(){
    this.settings.toolbarCreateSubject.next(true)
  }

  isShowSearch(){
    if(this.settings.pageSettings.value.pageType === 'trip') return false
    return true
  }

}

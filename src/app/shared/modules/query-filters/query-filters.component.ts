import { Component } from '@angular/core';
import { ApiQueryService } from '../../services/apiQuery/api-query.service';
import { AppSettingsService } from '../../services/appSettings/app-settings.service';
import { RoleService } from '../../services/role/role.service';

@Component({
  selector: 'app-query-filters',
  templateUrl: './query-filters.component.html',
  styleUrls: ['./query-filters.component.scss']
})
export class QueryFiltersComponent {

  constructor(private apiQuery: ApiQueryService, public settings: AppSettingsService, public role:RoleService) { }


 async reset(){

    await this.apiQuery.resetApiKey()
    this.apiQuery.isReset.next(true)

  }

  apply(){
    this.apiQuery.apply(true)
  }

}

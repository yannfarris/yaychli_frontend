import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { AuthService } from '../auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  constructor(

    public settings: AppSettingsService,
    public dialog: MatDialog,
    private auth: AuthService,
    private modal: ModalsService,
    private translate: TranslateService,
    private apiQuery: ApiQueryService,

  ) {}

  ngOnInit(): void {
    this.settings.pageSettings.next(this.settings.getPageSettingsValue(false, 'profile', true, 'general.create', true, true))


  }
}

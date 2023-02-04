import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  constructor(

    public settings: AppSettingsService,

  ) { }

  ngOnInit(): void {
    this.settings.isShowToolbar.next(false)

  }

  ngOnDestroy(): void {
    this.settings.isShowToolbar.next(true)
  }

}

import { Component, OnInit } from '@angular/core';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { RoleService } from 'src/app/shared/services/role/role.service';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';

  constructor(public role: RoleService ,private layout: LayoutService, public auth: AuthService, public settings: AppSettingsService) {}

  ngOnInit(): void {
    this.headerLeft = this.layout.getProp('header.left') as string;
  }

  getProfileImage(){

    let image = this.auth.currentUserSubject.value.photo_url
    if(!image) return false
    let url = `${this.settings.url}media/${image}`

    return url
  }
}

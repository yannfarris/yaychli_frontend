import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/api/user/user.service';
import { TranslationService } from 'src/app/modules/i18n';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { RoleService } from 'src/app/shared/services/role/role.service';

@Component({
  selector: 'app-profile-top-info',
  templateUrl: './profile-top-info.component.html',
  styleUrls: ['./profile-top-info.component.scss']
})
export class ProfileTopInfoComponent implements OnInit, OnDestroy {
  user$:any = {}
  private unsubscribe: Subscription[] = [];

  constructor(

    private auth: AuthService,
    private translationService: TranslationService,
    public settings: AppSettingsService,
    public role:RoleService,
    private translate: TranslateService,
    private user: UserService

  ) { }

  ngOnInit(): void {

   let currentUserSubject = this.auth.currentUserSubject.subscribe(res =>{
      if(!res) return;
      this.user$ = res;

    })

    this.unsubscribe.push(currentUserSubject);

  }

  getProfileImage(){
    let image = this.user$.photo_url
    if(!image) return false
    let url = `${this.settings.url}media/${image}`

    return url
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());

  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { take } from 'rxjs';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-dashboard-lite',
  templateUrl: './dashboard-lite.component.html',
  styleUrls: ['./dashboard-lite.component.scss']
})
export class DashboardLiteComponent implements OnInit, OnDestroy {
  schoolInfo:any = {}
  constructor(public auth: AuthService, private settings: AppSettingsService) { }
  ngOnInit(): void {
    this.settings.pageSettings.next(this.settings.getPageSettingsValue(false, 'dashboard'))
    this.settings.isShowToolbar.next(false)

  }

  getProfileImage(){
    let image = this.auth.currentUserSubject.value.school.logo
    if(!image) return false
    let url = `${this.settings.url}media/${image}`
    return url
  }
  openLink(url:string){
    window.open(url)
  }
  openNumber(number:string){
    window.open(`tel: ${number}`)
  }
  emailNumber(email:string){
    window.open(`mailto: ${email}`)
  }

  ngOnDestroy(): void {
    this.settings.isShowToolbar.next(true)
  }

}

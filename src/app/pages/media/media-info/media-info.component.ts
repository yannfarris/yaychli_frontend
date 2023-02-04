import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MediaService } from 'src/app/api/media/media.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-media-info',
  templateUrl: './media-info.component.html',
  styleUrls: ['./media-info.component.scss']
})
export class MediaInfoComponent implements OnInit, OnDestroy {
  mediaInfo: BehaviorSubject<any> = new BehaviorSubject('');
  private unsubscribe: Subscription[] = [];

  constructor(

    public settings: AppSettingsService,
    public media: MediaService,
    public auth: AuthService,
    public apiQuery: ApiQueryService

  ) { }

  ngOnInit(): void {
    this.getMediaInfo()

    this.media.isneMediaInfo.subscribe(res =>{
      if(!res) return;
      this.getMediaInfo()
    })
  }

  showSearch(){
    this.media.isShowSearch.next(!this.media.isShowSearch.value)
  }

  getMediaInfo(){

    let media = this.media.getMediaInfo().subscribe(res =>{
      if(!res) return; 
      this.mediaInfo.next(res)
    })

    this.unsubscribe.push(media);
    
  }

  changeType(type = ''){
    if(this.apiQuery.mediaType.value === type) return
    this.apiQuery.mediaType.next(type)
    this.apiQuery.apply()
  }

  ngOnDestroy(): void {
    this.media.isShowSearch.next(false)
    this.unsubscribe.forEach((sb) => sb.unsubscribe());

  }

}

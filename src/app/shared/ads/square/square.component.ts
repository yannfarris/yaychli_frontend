import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AdsService } from 'src/app/api/ads/ads.service';
import { ApiQueryService } from '../../services/apiQuery/api-query.service';
import { AppSettingsService } from '../../services/appSettings/app-settings.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit, OnDestroy {
  image: 'https://images.unsplash.com/photo-1657475903248-894ca1376f20?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80'

  private unsubscribe: Subscription[] = [];
  items: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(

    public settings: AppSettingsService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private apiQuery: ApiQueryService,
    private ads: AdsService,
    public auth: AuthService,

  ) { }

  ngOnInit(): void {
    this.getData()

  }
  
  async getData() {

    let data = this.ads.getAll().subscribe(async (res: any) => {
      if (!res) return;

      let item = res.content;
      if(!item) return

      let currentArr:any = [];
      let ItemLoop = await item.forEach((el: any) => {

        let image = el.media.id;
        let url = `${this.settings.url}media/${image}`
        let data = { path: url }
        currentArr.push(data)

      })

      this.items.next(currentArr);

    })

    this.unsubscribe.push(data);

  }


  getHeight(){
    if(this.settings.isMobile) return 200
    return 350
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}

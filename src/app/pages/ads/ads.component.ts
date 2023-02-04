import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SchoolService } from 'src/app/api/school/school.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { NewAdsComponent } from 'src/app/pages/ads/new-ads/new-ads.component';
import { AdsService } from 'src/app/api/ads/ads.service';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  items: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(

    public settings: AppSettingsService,
    public dialog: MatDialog,
    private auth: AuthService,
    private modal: ModalsService,
    private school: SchoolService,
    private translate: TranslateService,
    private apiQuery: ApiQueryService,
    private ads: AdsService

  ) { }

  ngOnInit(): void {

    this.getData()

    let isApply = this.apiQuery.isApply.subscribe(res => {
      if (!res) return;
      if (this.settings.pageSettings.value.pageType !== 'ads') return;
      this.getData()
    })

    this.unsubscribe.push(isApply);


    this.settings.pageSettings.next(this.settings.getPageSettingsValue(true, 'ads', true, 'general.create', false))

    let toolbar = this.settings.toolbarCreateSubject.subscribe(res => {

      if (!res) return;

      if (this.ads.adsCount >= 10) return this.modal.generalErrorMessageModal('general.max_ads');

      const dialogRef = this.dialog.open(NewAdsComponent, {

        disableClose: true,
        width: '90vw',
        maxWidth: '600px',

      });

    })

    this.unsubscribe.push(toolbar);

  }


  viewImage(item: any) {
    let image = item
    if(!image) return
    let url = `${this.settings.url}media/${image}`
    window.open(url, "_blank");

  }

  deactivate(id: any) {
    this.ads.changeState(id, 'active').subscribe(res => {

      if (!res) return;
      this.apiQuery.apply()
      this.modal.generalSuccessMessageModal('general.change_state')

    })
  }

  activate(id: any) {
    this.ads.changeState(id, 'inactive').subscribe(res => {

      if (!res) return;
      this.apiQuery.apply()
      this.modal.generalSuccessMessageModal('general.change_state')

    })

  }

  async delete(id:string) {
    let warn = await this.modal.generalWarningMessageModal('general.general_delete_warn', 'general.yes', 'general.no').then(res => res)
    if (!warn.isConfirmed) return;

    this.ads.delete(id).subscribe(res => {
      if (!res) return;
      this.apiQuery.apply()
      this.modal.generalSuccessMessageModal('general.delete_complet')
    })

  }

  async getData() {

    let data = this.ads.getAll().subscribe(async (res: any) => {
      if (!res) return;

      this.ads.adsCount = res.content.length;
      this.items.next(res.content);
      if (res.content.length <= 0) return this.apiQuery.resetPagination()
      this.apiQuery.totalPages.next(res.count - 1)

    })

    this.unsubscribe.push(data);

  }


  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this.apiQuery.resetApiKey(true)
  }


}

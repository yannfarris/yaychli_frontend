import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { PosService } from 'src/app/api/pos/pos.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  private unsubscribe: Subscription[] = [];
  items: BehaviorSubject<any> = new BehaviorSubject([]);
  
  sort = ['invoice_number' ,'total_price', 'quantity', 'createdAt'];

  rows = [
    this.translate.instant('pos.invoice_number'),
    this.translate.instant('pos.total_price_2') + ` - ${this.auth.currentUserSubject.value.school.currency.toUpperCase()}`,
    this.translate.instant('pos.quantity'),
    this.translate.instant('general.buy_date'),
    ''
  ]

  constructor(

    public settings: AppSettingsService,
    public dialog: MatDialog,
    private auth: AuthService,
    private modal: ModalsService,
    private translate: TranslateService,
    private apiQuery: ApiQueryService,
    private pos:PosService

  ) { }

  

  ngOnInit(): void {

    
    this.settings.pageSettings.next(this.settings.getPageSettingsValue(true, 'invoice', false, 'general.create', true, false, false))

    this.getData()

    let isApply = this.apiQuery.isApply.subscribe(res => {
      if (!res) return;
      if (this.settings.pageSettings.value.pageType !== 'invoice') return;
      this.getData()
    })

    this.unsubscribe.push(isApply);

    let tableAction = this.settings.tableAction.subscribe((res:any) => {
      if(!res) return;

      if(res.type === 'delete') return this.delete(res.id);
    })
    this.unsubscribe.push(tableAction);


  }

  delete(id:string){

      this.pos.deleteInvoice(id).subscribe(res =>{
        if(!res) return;
        this.apiQuery.apply()
        this.modal.generalSuccessMessageModal('general.delete_complet')
      })
  
  }

  async getData() {

    let data = this.pos.getAllInvoices().subscribe(async (res: any) => {

      if (!res) return;
      this.items.next(res.content)

      if (res.content.length <= 0) return this.apiQuery.resetPagination()

      this.apiQuery.totalPages.next(res.count - 1)
    })

    this.unsubscribe.push(data);

  }

  
}

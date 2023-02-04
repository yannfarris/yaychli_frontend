import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { PosService } from 'src/app/api/pos/pos.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { NewProductComponent } from 'src/app/pages/pos/new-product/new-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  private unsubscribe: Subscription[] = [];
  items: BehaviorSubject<any> = new BehaviorSubject([]);
  
  sort = ['name' ,'barcode', 'price', 'status', 'createdAt', 'note'];

  rows = [
    this.translate.instant('general.name'),
    this.translate.instant('pos.barcode'),
    this.translate.instant('pos.price') + ` - ${this.auth.currentUserSubject.value.school.currency.toUpperCase()}`,
    this.translate.instant('general.status'),
    this.translate.instant('general.created_at'),
    this.translate.instant('general.note'),
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

    this.settings.pageSettings.next(this.settings.getPageSettingsValue(true, 'pos', true, 'general.create', true, false, false))

    this.getData()

    let isApply = this.apiQuery.isApply.subscribe(res => {
      if (!res) return;
      if (this.settings.pageSettings.value.pageType !== 'pos') return;
      this.getData()
    })

    this.unsubscribe.push(isApply);


    let toolbarCreateSubject = this.settings.toolbarCreateSubject.subscribe(res => {
      if (!res) return;
      let school_id = this.auth.currentUserSubject.value.schoolId;

      const dialogRef = this.dialog.open(NewProductComponent, {

        disableClose: true,
        width: '90vw',
        maxWidth: '600px',

      }).afterClosed().pipe(take(1)).subscribe(product => {
        if(!product.id) return;
        this.getData()
      })

    })

    this.unsubscribe.push(toolbarCreateSubject);


    let tableAction = this.settings.tableAction.subscribe((res:any) => {
      if(!res) return;

      if(res.type === 'delete') return this.delete(res.id);
      if(res.type === 'active') return this.changeStatus(res.id, 'active');
      if(res.type === 'inactive') return this.changeStatus(res.id, 'inactive');
      if(res.type === 'edit') return this.edit(res.id);

    })
    this.unsubscribe.push(tableAction);

  }

  edit(item: any) {
    const dialogRef = this.dialog.open(NewProductComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',
      data: { item }

    }).afterClosed().pipe(take(1)).subscribe(res =>{
      if(!res) return;
      if(res.id !== 'done') return;
      this.apiQuery.apply()
      this.modal.generalSuccessMessageModal('general.update_done')
    })
  }

  delete(id:string){

      this.pos.deleteProduct(id).subscribe(res =>{
        if(!res) return;
        this.apiQuery.apply()
        this.modal.generalSuccessMessageModal('general.delete_complet')
      })
  
  }

   changeStatus(id: string, type: string) {
    this.pos.changeProductStatus(id, type).subscribe(res =>{
      if(!res) return;
      this.apiQuery.apply()
      this.modal.generalSuccessMessageModal('general.change_state')
    })
  }

  async getData() {

    let data = this.pos.getAllProduct().subscribe(async (res: any) => {

      if (!res) return;
      this.items.next(res.content)

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

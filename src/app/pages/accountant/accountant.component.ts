import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { UserService } from 'src/app/api/user/user.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { NewAccountantComponent } from 'src/app/pages/accountant/new-accountant/new-accountant.component';
import { AccountantService } from 'src/app/api/accountant/accountant.service';

@Component({
  selector: 'app-accountant',
  templateUrl: './accountant.component.html',
  styleUrls: ['./accountant.component.scss']
})
export class AccountantComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  items: BehaviorSubject<any> = new BehaviorSubject([]);

  sort = ['user.name','user.email','user.register_no', 'type', 'amount', 'createdAt', 'note'];

  rows = [
    this.translate.instant('general.name'),
    this.translate.instant('auth.email'),
    this.translate.instant('general.user_name'),
    this.translate.instant('accountant.type'),
    this.translate.instant('accountant.amount') + ` - ${String(this.auth.currentUserSubject.value.school.currency).toUpperCase()}`,
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
    private accountant: AccountantService,

  ) { }

  ngOnInit(): void {
    this.settings.pageSettings.next(this.settings.getPageSettingsValue(true, 'stud_accountant', true, 'general.create', true, false, true))
    this.getData()

    let isApply = this.apiQuery.isApply.subscribe(res => {
      if (!res) return;
      if (this.settings.pageSettings.value.pageType !== 'stud_accountant') return;
      this.getData()
    })

    this.unsubscribe.push(isApply);


    let toolbarCreateSubject = this.settings.toolbarCreateSubject.subscribe(res => {
      if (!res) return;

      const dialogRef = this.dialog.open(NewAccountantComponent, {

        disableClose: true,
        width: '90vw',
        maxWidth: '600px',

      }).afterClosed().pipe(take(1)).subscribe(data => {
        if(!data) return;
        this.getData()
      })


    })

    this.unsubscribe.push(toolbarCreateSubject);

    let tableAction = this.settings.tableAction.subscribe((res:any) => {
      if(!res) return;

      if(res.type === 'delete') return this.delete(res.id);

    })
    this.unsubscribe.push(tableAction);

  }

  delete(id: string) {
    this.accountant.delete(id).subscribe(res =>{
      if(!res) return;
      this.apiQuery.apply()
      this.modal.generalSuccessMessageModal('general.delete_complet')
    })
  }


  async getData() {

    let data = this.accountant.getAll('student').subscribe(async (res: any) => {

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


import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { BranchService } from 'src/app/api/branch/branch.service';
import { NewUserComponent } from './new-user/new-user.component';
import { UserService } from 'src/app/api/user/user.service';
import { RoleService } from 'src/app/shared/services/role/role.service';


@Component({
  selector: 'app-branches',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  
  private unsubscribe: Subscription[] = [];
  items: BehaviorSubject<any> = new BehaviorSubject([]);
  usersCount: BehaviorSubject<any> = new BehaviorSubject(0);

  constructor(
    public settings: AppSettingsService,
    public dialog: MatDialog,
    private auth: AuthService,
    private modal: ModalsService,
    private translate: TranslateService,
    public apiQuery: ApiQueryService,
    public user: UserService,
    public role: RoleService,

  ) { }

  ngOnInit(): void {

    this.settings.pageSettings.next(this.settings.getPageSettingsValue(true, 'user'))
    this.settings.isShowToolbar.next(false)
    this.getData()

    let isApply = this.apiQuery.isApply.subscribe(res => {
      if (!res) return;
      if (this.settings.pageSettings.value.pageType !== 'user') return;
      this.getData()
    })

    this.unsubscribe.push(isApply);

    let toolbarCreateSubject = this.settings.toolbarCreateSubject.subscribe(res => {

      if (!res) return;

      const dialogRef = this.dialog.open(NewUserComponent, {

        disableClose: true,
        width: '90vw',
        maxWidth: '600px',

      }).afterClosed().pipe(take(1)).subscribe((user: any) => {
        if (!user.id) return;
        this.apiQuery.apply()
      })


    })

    this.unsubscribe.push(toolbarCreateSubject);
  }

  convertNumbers(number: number) {
    return number.toLocaleString()
  }


  async getData() {

    let data = this.user.getAll().subscribe(async (res: any) => {
      if (!res) return;

      this.usersCount.next(res.usersCount)
      this.items.next(res.content)

      if (res.content.length <= 0) return this.apiQuery.resetPagination()

      this.apiQuery.totalPages.next(res.count - 1)
    })
    this.unsubscribe.push(data);

  }

  async delete(id: string) {
    
    let warn = await this.modal.generalWarningMessageModal('user_delete_warn').then(res => res)
    if (!warn.isConfirmed) return;

    this.user.delete(id).subscribe(res => {
      if (!res) return;
      this.apiQuery.apply()
      this.modal.generalSuccessMessageModal('delete_done')
    })
  }

  async changeState(id: string, state: string) {

    this.user.changeStatus(id, state).subscribe(res => {

      if (!res) return;
      this.apiQuery.apply()
      if(state === 'inactive') this.modal.generalSuccessMessageModal('deactivate_done')
      if(state === 'active') this.modal.generalSuccessMessageModal('activate_done')

    })
  }

  edit(item: any){
    const dialogRef = this.dialog.open(NewUserComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '95vh',
      data: {item}

    }).afterClosed().pipe(take(1)).subscribe(res => {
      if (!res) return;
      if (res.id !== 'done') return;
      this.apiQuery.apply()
      this.modal.generalSuccessMessageModal('edit_done')
    });
  }

  create(){
    
    const dialogRef = this.dialog.open(NewUserComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '95vh',

    }).afterClosed().pipe(take(1)).subscribe(res => {
      if (!res) return;
      if (res.id !== 'done') return;
      this.apiQuery.resetApiKey()
      this.modal.generalSuccessMessageModal('create_done')
    });

  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this.apiQuery.resetApiKey(true)
  }


}

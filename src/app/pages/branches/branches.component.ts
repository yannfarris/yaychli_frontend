import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { NewSchoolComponent } from 'src/app/pages/schools/new-school/new-school.component';
import { BranchService } from 'src/app/api/branch/branch.service';
import { NewComponent } from './new/new.component';


@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {

  
  private unsubscribe: Subscription[] = [];
  items: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(
    public settings: AppSettingsService,
    public dialog: MatDialog,
    private auth: AuthService,
    private modal: ModalsService,
    private translate: TranslateService,
    private apiQuery: ApiQueryService,
    public branch: BranchService

  ) { }

  ngOnInit(): void {

    this.settings.pageSettings.next(this.settings.getPageSettingsValue(false, 'branch'))
    this.settings.isShowToolbar.next(false)
    this.getData()

    let isApply = this.apiQuery.isApply.subscribe(res => {
      if (!res) return;
      if (this.settings.pageSettings.value.pageType !== 'branch') return;
      this.getData()
    })

    this.unsubscribe.push(isApply);

    let toolbarCreateSubject = this.settings.toolbarCreateSubject.subscribe(res => {

      if (!res) return;

      const dialogRef = this.dialog.open(NewSchoolComponent, {

        disableClose: true,
        width: '90vw',
        maxWidth: '600px',

      }).afterClosed().pipe(take(1)).subscribe((user: any) => {
        if (!user.id) return;
      })


    })

    this.unsubscribe.push(toolbarCreateSubject);
  }

  convertNumbers(number: number) {
    return number.toLocaleString()
  }


  async getData() {

    let data = this.branch.getAll().subscribe(async (res: any) => {
      if (!res) return;

      this.items.next(res.content)
    })
    this.unsubscribe.push(data);

  }

  async delete(id: string) {
    
    let warn = await this.modal.generalWarningMessageModal('branch_delete_warn').then(res => res)
    if (!warn.isConfirmed) return;

    this.branch.delete(id).subscribe(res => {
      if (!res) return;
      this.apiQuery.apply()
      this.modal.generalSuccessMessageModal('delete_done')
    })
  }

  async changeState(id: string, state: string) {
    
    if(state === 'inactive') {
      let warn = await this.modal.generalWarningMessageModal('branch_deactivate_warn').then(res => res)
      if (!warn.isConfirmed) return;
    }

    this.branch.changeStatus(id, state).subscribe(res => {

      if (!res) return;
      this.apiQuery.apply()
      if(state === 'inactive') this.modal.generalSuccessMessageModal('deactivate_done')
      if(state === 'active') this.modal.generalSuccessMessageModal('activate_done')

    })
  }

  edit(item: any){
    const dialogRef = this.dialog.open(NewComponent, {

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
    
    const dialogRef = this.dialog.open(NewComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '95vh',

    }).afterClosed().pipe(take(1)).subscribe(res => {
      if (!res) return;
      if (res.id !== 'done') return;
      this.modal.generalSuccessMessageModal('create_done')
    });

  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this.apiQuery.resetApiKey(true)
  }


}

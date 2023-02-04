
  import { Component, OnInit } from '@angular/core';
  import { MatDialog } from '@angular/material/dialog';
  import { TranslateService } from '@ngx-translate/core';
  import { BehaviorSubject, Subscription, take } from 'rxjs';
  import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
  import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
  import { AuthService } from 'src/app/shared/services/auth/auth.service';
  import { ModalsService } from 'src/app/shared/services/modals/modals.service';
  import { BranchService } from 'src/app/api/branch/branch.service';
  import { NewComponent } from './new/new.component';
  import { UserService } from 'src/app/api/user/user.service';
  import { RoleService } from 'src/app/shared/services/role/role.service';
import { BusService } from 'src/app/api/bus/bus.service';
  
  
  @Component({
    selector: 'app-branches',
    templateUrl: './bus.component.html',
    styleUrls: ['./bus.component.scss']
  })
  export class BusComponent implements OnInit {
  
    
    private unsubscribe: Subscription[] = [];
    items: BehaviorSubject<any> = new BehaviorSubject([]);
    dataCount: BehaviorSubject<any> = new BehaviorSubject(0);
  
    constructor(
      public settings: AppSettingsService,
      public dialog: MatDialog,
      private auth: AuthService,
      private modal: ModalsService,
      private translate: TranslateService,
      public apiQuery: ApiQueryService,
      public bus: BusService,
      public role: RoleService,
  
    ) { }
  
    ngOnInit(): void {
  
      if(this.role.isMegaAdmin()){
        this.settings.pageSettings.next(this.settings.getPageSettingsValue(true, 'bus', true));
      }else{
        this.settings.pageSettings.next(this.settings.getPageSettingsValue(true, 'bus', false));
      }

      this.settings.isShowToolbar.next(false)
      this.getData()
  
      let isApply = this.apiQuery.isApply.subscribe(res => {
        if (!res) return;
        if (this.settings.pageSettings.value.pageType !== 'bus') return;
        this.getData()
      })
  
      this.unsubscribe.push(isApply);
  
      let toolbarCreateSubject = this.settings.toolbarCreateSubject.subscribe(res => {
  
        if (!res) return;
  
        const dialogRef = this.dialog.open(NewComponent, {
  
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
  
      let data = this.bus.getAll().subscribe(async (res: any) => {
        if (!res) return;
  
        this.dataCount.next(res.dataCount)
        this.items.next(res.content)
  
        if (res.content.length <= 0) return this.apiQuery.resetPagination()
  
        this.apiQuery.totalPages.next(res.count - 1)
      })
      this.unsubscribe.push(data);
  
    }
  
    async delete(id: string) {
      
      let warn = await this.modal.generalWarningMessageModal('delete_warn').then(res => res)
      if (!warn.isConfirmed) return;
  
      this.bus.delete(id).subscribe(res => {
        if (!res) return;
        this.apiQuery.apply()
        this.modal.generalSuccessMessageModal('delete_done')
      })
    }
  
    async changeState(id: string, state: string) {
  
      this.bus.changeStatus(id, state).subscribe(res => {
        if (!res) return;
        this.apiQuery.apply()
        if(state === 'inactive') this.modal.generalSuccessMessageModal('deactivate_done')
        if(state === 'active') this.modal.generalSuccessMessageModal('activate_done')
  
      })
    }

    isServices(name: string, services: string){

      let servicesArr = JSON.parse(services)
      if(servicesArr.includes(name)) return true
      return false
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
        this.apiQuery.resetApiKey()
        this.modal.generalSuccessMessageModal('create_done')
      });
  
    }
  
    ngOnDestroy(): void {
      this.unsubscribe.forEach((sb) => sb.unsubscribe());
      this.apiQuery.resetApiKey(true)
    }
  
  
  }

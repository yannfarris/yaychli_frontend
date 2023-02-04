import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { NewComponent } from './new/new.component';
import { RoleService } from 'src/app/shared/services/role/role.service';
import { DriversService } from 'src/app/api/drivers/drivers.service';

@Component({
  selector: 'app-branches',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
})
export class DriverComponent implements OnInit {
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
    public driver: DriversService,
    public role: RoleService
  ) {}

  ngOnInit(): void {
    this.settings.pageSettings.next(
      this.settings.getPageSettingsValue(true, 'driver')
    );
    this.settings.isShowToolbar.next(false);
    this.getData();

    let isApply = this.apiQuery.isApply.subscribe((res) => {
      if (!res) return;
      if (this.settings.pageSettings.value.pageType !== 'driver') return;
      this.getData();
    });

    this.unsubscribe.push(isApply);

    let toolbarCreateSubject = this.settings.toolbarCreateSubject.subscribe(
      (res) => {
        if (!res) return;

        const dialogRef = this.dialog
          .open(NewComponent, {
            disableClose: true,
            width: '90vw',
            maxWidth: '600px',
          })
          .afterClosed()
          .pipe(take(1))
          .subscribe((user: any) => {
            if (!user.id) return;
            this.apiQuery.apply();
          });
      }
    );

    this.unsubscribe.push(toolbarCreateSubject);
  }

  convertNumbers(number: number) {
    return number.toLocaleString();
  }

  async getData() {
    let data = this.driver.getAll().subscribe(async (res: any) => {

      if (!res) return;

      this.dataCount.next(res.dataCount);
      this.items.next(res.content);

      if (res.content.length <= 0) return this.apiQuery.resetPagination();

      this.apiQuery.totalPages.next(res.count - 1);
    });
    this.unsubscribe.push(data);
  }

  async delete(id: string) {
    let warn = await this.modal
      .generalWarningMessageModal('delete_warn')
      .then((res) => res);
    if (!warn.isConfirmed) return;

    this.driver.delete(id).subscribe((res) => {
      if (!res) return;
      this.apiQuery.apply();
      this.modal.generalSuccessMessageModal('delete_done');
    });
  }

  async changeState(id: string, state: string) {
    this.driver.changeStatus(id, state).subscribe((res) => {
      if (!res) return;
      this.apiQuery.apply();
      if (state === 'inactive')
        this.modal.generalSuccessMessageModal('deactivate_done');
      if (state === 'active')
        this.modal.generalSuccessMessageModal('activate_done');
    });
  }

  edit(item: any) {
    const dialogRef = this.dialog
      .open(NewComponent, {
        disableClose: true,
        width: '90vw',
        maxWidth: '600px',
        maxHeight: '95vh',
        data: { item },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (!res) return;
        if (res.id !== 'done') return;
        this.apiQuery.apply();
        this.modal.generalSuccessMessageModal('edit_done');
      });
  }

  create() {
    const dialogRef = this.dialog
      .open(NewComponent, {
        disableClose: true,
        width: '90vw',
        maxWidth: '600px',
        maxHeight: '95vh',
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (!res) return;
        if (res.id !== 'done') return;
        this.apiQuery.resetApiKey();
        this.modal.generalSuccessMessageModal('create_done');
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this.apiQuery.resetApiKey(true);
  }
}

  import { Component, OnInit } from '@angular/core';
  import { MatDialog } from '@angular/material/dialog';
  import { TranslateService } from '@ngx-translate/core';
  import { BehaviorSubject, Subscription, take } from 'rxjs';
  import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
  import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
  import { AuthService } from 'src/app/shared/services/auth/auth.service';
  import { ModalsService } from 'src/app/shared/services/modals/modals.service';
  import { RoleService } from 'src/app/shared/services/role/role.service';
  import { DriversService } from 'src/app/api/drivers/drivers.service';
import { TripsService } from 'src/app/api/trips/trips.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateSeatComponent } from '../trips/update-seat/update-seat.component';
import moment from 'moment';
import { CustomerInfoComponent } from '../trips/customer-info/customer-info.component';

  @Component({
    selector: 'app-branches',
    templateUrl: './revs.component.html',
    styleUrls: ['./revs.component.scss'],
  })
  export class RevsComponent implements OnInit {
    private unsubscribe: Subscription[] = [];
    items: BehaviorSubject<any> = new BehaviorSubject([]);
    dataCount: BehaviorSubject<any> = new BehaviorSubject(0);
    tripId = ''
    constructor(
      public settings: AppSettingsService,
      public dialog: MatDialog,
      private auth: AuthService,
      private modal: ModalsService,
      private translate: TranslateService,
      public apiQuery: ApiQueryService,
      public trip: TripsService,
      public role: RoleService,
      private router: ActivatedRoute
    ) {}
  
    ngOnInit(): void {

      let queryParams = this.router.queryParams.subscribe((res:any) =>{
        if(!res.id) return;
        this.tripId = res.id
      })

      this.unsubscribe.push(queryParams);

      this.settings.pageSettings.next(
        this.settings.getPageSettingsValue(false, 'trip')
      );
      this.settings.isShowToolbar.next(false);
      this.getData();
  
      let isApply = this.apiQuery.isApply.subscribe((res) => {
        if (!res) return;
        if (this.settings.pageSettings.value.pageType !== 'trip') return;
        this.getData();
      });
  
      this.unsubscribe.push(isApply);
  
    }

    isGo(item: any) {
      let date = item.departure.toLocaleString('en-US', 'Asia/Istanbul');
  
      date = moment(date).format('MMM Do YY HH:mm a');
      let currentDate = moment().format('MMM Do YY HH:mm a');
  
      if (currentDate > date) return true;
      return false;
    }
  
    convertNumbers(number: number) {
      return number.toLocaleString();
    }
  
    async getData() {
      let data = this.trip.getRevs(this.tripId).subscribe(async (res: any) => {
  
        if (!res) return;
        
        this.dataCount.next(res.dataCount);
        this.items.next(res?.content[0]?.reservations || []);
        
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
  
      this.trip.deleteRev(id).subscribe((res) => {
        if (!res) return;
        this.apiQuery.apply();
        this.modal.generalSuccessMessageModal('delete_done');
      });

    }
  
    async changeState(id: string, state: string) {
      
      this.trip.changeRevStatus(id, state).subscribe((res) => {
        if (!res) return;
        this.apiQuery.apply();
        if (state === 'final')
          this.modal.generalSuccessMessageModal('change_done');
        if (state === 'temp')
          this.modal.generalSuccessMessageModal('change_done');
      });

    }
  
    edit(item: any) {
      const dialogRef = this.dialog
      .open(UpdateSeatComponent, {
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
        let seat = res.id[0]
        if (!seat) return;
        this.updateSeat(seat, item)
        // this.apiQuery.apply();
        // this.modal.generalSuccessMessageModal('edit_done');
      });
    }

    customerInfo(item: any){
      const dialogRef = this.dialog
      .open(CustomerInfoComponent, {
        disableClose: true,
        width: '90vw',
        maxWidth: '600px',
        maxHeight: '95vh',
        data: { item },
      })
    }
  
    updateSeat(seat: any, item:any = {}) {

      this.trip.changeSeat(item.id, seat).subscribe((res) => {
        if (!res) return;
        this.apiQuery.apply();
        this.modal.generalSuccessMessageModal('change_seat_done');
      });

    }
  
    ngOnDestroy(): void {
      this.unsubscribe.forEach((sb) => sb.unsubscribe());
      this.apiQuery.resetApiKey(true);
    }
  }
  
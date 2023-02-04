import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { NewComponent } from './new/new.component';
import { NewRevComponent } from './new-rev/new-rev.component';
import { RoleService } from 'src/app/shared/services/role/role.service';
import { DriversService } from 'src/app/api/drivers/drivers.service';
import { TripsService } from 'src/app/api/trips/trips.service';

import moment from 'moment';
import { Router } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';

@Component({
  selector: 'app-branches',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss'],
})
export class TripsComponent implements OnInit {
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
    public trips: TripsService,
    public role: RoleService,
    public router: Router
  ) {}

  ngOnInit(): void {
 
    if(this.role.isMegaAdmin()){
      this.settings.pageSettings.next(this.settings.getPageSettingsValue(true, 'trip', true));
    }else{
      this.settings.pageSettings.next(this.settings.getPageSettingsValue(true, 'trip', false));
    }

    this.settings.isShowToolbar.next(false);
    this.getData();

    let isApply = this.apiQuery.isApply.subscribe((res) => {
      if (!res) return;
      if (this.settings.pageSettings.value.pageType !== 'trip') return;
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
            maxWidth: '800px',
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


getStop(item: any):any{
  
    let stops = JSON.parse(item.stops);
    let currentStop = stops[0]

    for(let el of stops){
      let currentDate = moment(new Date())
      let stopDate = el.departure.toLocaleString('en-US', 'Asia/Istanbul');
      stopDate = moment(stopDate)

      if(stopDate.isBefore(currentDate)) {
         currentStop = el
      }
    }
    return currentStop;

  }

  getDate(date: any) {
    date = date.toLocaleString('en-US', 'Asia/Istanbul');
    let newDate = moment(date).format('MMM Do YY');
    return newDate;
  }

  getTime(date: any) {
    date = date.toLocaleString('en-US', 'Asia/Istanbul');
    let newDate = moment(date).format('hh:mm a');
    return newDate;
  }

  getDiff(from: any, to: any) {
    let duration = moment.duration(moment(to).diff(from));
    let min = duration.asHours();
    return Math.round(min);
  }

  convertNumbers(number: number) {
    return number.toLocaleString();
  }

  async getData() {
    let data = this.trips.getAll().subscribe(async (res: any) => {
      if (!res) return;

      this.dataCount.next(res.dataCount);

      let data = res.content.sort((a: any, b: any) => {
        let stop = this.getStop(a)
        let date = stop.departure.toLocaleString('en-US', 'Asia/Istanbul');
        
        date = moment(date)
        let currentDate = moment(new Date())

        if (date.isBefore(currentDate)) return 1;
        return -1;
      });

      this.items.next(data);

      if (res.content.length <= 0) return this.apiQuery.resetPagination();

      this.apiQuery.totalPages.next(res.count - 1);
    });
    this.unsubscribe.push(data);
  }
  async customerList(item: any){
    let list: any = []

    let data = await this.trips.customer(item.id).pipe(take(1)).subscribe(async (res: any) => {
      if (!res) return;

      const dialogRef = this.dialog.open(CustomerListComponent, {
        disableClose: true,
        width: '90vw',
        maxWidth: '600px',
        maxHeight: '95vh',
        data: { item, list: res },
      })

    })



  }
  async delete(id: string) {
    let warn = await this.modal
      .generalWarningMessageModal('delete_warn')
      .then((res) => res);
    if (!warn.isConfirmed) return;

    this.trips.delete(id).subscribe((res) => {
      if (!res) return;
      this.apiQuery.apply();
      this.modal.generalSuccessMessageModal('delete_done');
    });
  }

  async changeState(id: string, state: string) {
    this.trips.changeStatus(id, state).subscribe((res) => {
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

  newRev(item: any) {

    if(this.getRemaningSeats(item) <= 0 ) return

    let totalRev = item.bus.total_rev
    if(item.reservations.length > totalRev) return this.modal.generalErrorMessageModal('tota_rev_exc')
    
    const dialogRef = this.dialog
      .open(NewRevComponent, {
        disableClose: true,
        width: '90vw',
        maxWidth: '800px',
        maxHeight: '95vh',
        data: item
      })

      dialogRef.afterClosed().pipe( take(1) ).subscribe(res => {
        if(!res) return;
        this.apiQuery.apply()
      })
  }

  getRemaningSeats(item: any) {
    if (this.isGo(item)) return 0;
    let rev = item.reservations.length;
    let bus = item.bus.total_rev;
    let seats = Math.abs(bus - rev);
    return seats;
  }

    
  // let stops = JSON.parse(item.stops);
  // let currentStop = stops[0]

  // for(let el of stops){
  //   let currentDate = moment(new Date())
  //   let stopDate = el.departure.toLocaleString('en-US', 'Asia/Istanbul');
  //   stopDate = moment(stopDate)

  //   if(stopDate.isBefore(currentDate)) {
  //      currentStop = el
  //   }
  // }
  // return currentStop;
  isGo(item: any) {
    let stops = JSON.parse(item.stops);
    let currentStop = stops[stops.length - 1];

    let date = currentStop.departure.toLocaleString('en-US', 'Asia/Istanbul');

    date = moment(date).format('MMM Do YY HH:mm a');
    let currentDate = moment().format('MMM Do YY HH:mm a');

    if (currentDate > date) return true;
    return false;
  }

  isServices(name: string, services: string) {
    let servicesArr = JSON.parse(services);
    if (servicesArr.includes(name)) return true;
    return false;
  }


  revsList(item:any = ''){
    if(this.isGo(item))return
    this.router.navigateByUrl(`/revs?id=${item.id}`)
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this.apiQuery.resetApiKey(true);
  }
}

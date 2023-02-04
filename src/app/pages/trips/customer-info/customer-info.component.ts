  import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
  import { FormBuilder, Validators } from '@angular/forms';
  import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
  } from '@angular/material/dialog';
  import { Subscription, BehaviorSubject } from 'rxjs';
  import { BranchService } from 'src/app/api/branch/branch.service';
  import { DriversService } from 'src/app/api/drivers/drivers.service';
  import { UserService } from 'src/app/api/user/user.service';
  import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
  import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
  import { AuthService } from 'src/app/shared/services/auth/auth.service';
  import { ModalsService } from 'src/app/shared/services/modals/modals.service';
  import { RoleService } from 'src/app/shared/services/role/role.service';
  import { NewComponent as newBranch } from 'src/app/pages/branches/new/new.component';
  import { TripsService } from 'src/app/api/trips/trips.service';
  import moment from 'moment';
  import { Router } from '@angular/router';
  
  @Component({
    selector: 'app-customer-info',
    templateUrl: './customer-info.component.html',
    styleUrls: ['./customer-info.component.scss'],
  })
  export class CustomerInfoComponent implements OnInit, OnDestroy {
    isRtl: boolean = false;
    form: any;
    id: string;
    numberPattern = '^[0-9]+$';
    private unsubscribe: Subscription[] = [];
    isShowPassword = false;
    isHideBranches = false;
    branches: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  
    maxSeats = 0;
    total_rev = 0;
    seatsArr: number[] = [];
    seatOffset: number[] = [];
    seatOffset2: number[] = [];
    seatOffset3: number[] = [];
    selectedSeats: any = [];
    item:any = {}
    tripId = '';
  
    constructor(
      private dialogRef: MatDialogRef<CustomerInfoComponent>,
      private formBuilder: FormBuilder,
      public settings: AppSettingsService,
      private modal: ModalsService,
      public auth: AuthService,
      private branch: BranchService,
      private driver: DriversService,
      private trip: TripsService,
      private apiQuery: ApiQueryService,
      public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public role: RoleService,
      private router: Router
    ) {}
  
    ngOnInit() {
     
      this.tripId = this.data?.id;

      this.item = this.data.item
      console.log(this.item)
  
      if (this.data.item.trip.bus.seat_type == '1') {
        this.maxSeats = 38;
        this.seatOffset = [1, 4, 7, 10, 13, 17, 20, 23, 26, 29, 32];
        this.seatOffset2 = [16];
        this.seatOffset3 = [];
      }
      if (this.data.item.trip.bus.seat_type == '2') {
        this.maxSeats = 39;
        this.seatOffset = [1, 4, 7, 10, 13, 16, 21, 24, 27, 30, 33];
        this.seatOffset2 = [19, 20];
        this.seatOffset3 = [];
      }
      if (this.data.item.trip.bus.seat_type == '3') {
        this.maxSeats = 41;
        this.seatOffset = [1, 4, 7, 10, 13, 16, 20, 23, 26, 29, 32, 35];
        this.seatOffset2 = [19];
        this.seatOffset3 = [];
      }
      if (this.data.item.trip.bus.seat_type == '4') {
        this.maxSeats = 39;
        this.seatOffset = [1, 4, 7, 10, 13, 16, 21, 24, 27, 30, 33];
        this.seatOffset2 = [19, 20];
        this.seatOffset3 = [];
      }
      if (this.data.item.trip.bus.seat_type == '5') {
        this.maxSeats = 36;
        this.seatOffset = [1, 4, 7, 10, 13, 17, 20, 23, 26, 29, 34];
        this.seatOffset2 = [16];
        this.seatOffset3 = [32];
      }
  
      for (let i = 1; i <= this.maxSeats; i++) {
        this.seatsArr.push(i);
      }
  
      this.id = this.data?.item.trip?.id;
  
      if (this.settings.currentLang.value === 'ar') {
        this.isRtl = true;
      }
  
      let dialogRef = this.dialogRef.backdropClick().subscribe(() => {
        this.closeModal();
      });
  
      this.unsubscribe.push(dialogRef);
  
      this.form = this.formBuilder.group({
        id: [this.getValue('id')],
        phone: [this.getValue('phone', '')],
        email: [this.getValue('email', '')],
        address: [this.getValue('name', '')],
        type: [this.getValue('type', 'final')],
        // branch_id: [this.getValue('branch_id', ''), Validators.required],
        note: [this.getValue('note', '')],
      });
  
      if (this.role.isMegaAdmin()) this.getBranchs();
      if (!this.role.isMegaAdmin())
        this.form.get('branch_id').setValue(this.auth.currentUserValue.branch_id);
    }
  
    isTaken(seat: any) {
      let revs = this.data.item.trip.reservations;
      let find = revs.find((el: any) => el.seat_code == seat);
      if (find?.type == 'final') return true;
      return false;
    }
  
    isHalfTaken(seat: any) {
      let revs = this.data.item.trip.reservations;
      let find = revs.find((el: any) => el.seat_code == seat);
      if (find?.type == 'temp') return true;
      return false;
    }
  
    isSeatOffset3(seat: any) {
      if (this.seatOffset3.includes(seat)) return true;
      return false;
    }
    isSeatOffset2(seat: any) {
      if (this.seatOffset2.includes(seat)) return true;
      return false;
    }
  
    isSeatOffset(seat: any) {
      if (this.seatOffset.includes(seat)) return true;
      return false;
    }
  
    isSelected(seat: any) {
      if (this.selectedSeats.includes(seat)) return true;
      return false;
    }
  
    handleClick(seat: any) {
      let totalRev = this.data.item.trip.bus.total_rev;
      this.selectedSeats = [];
      this.selectedSeats.push(seat);
    }
  
    newBranch() {
      const dialogRef = this.dialog.open(newBranch, {
        disableClose: true,
        width: '90vw',
        maxWidth: '600px',
        maxHeight: '95vh',
      });
    }
  
    getValue(value: string, defaultValue: any = '') {
      if (this.data?.item?.hasOwnProperty(value)) return this.data.item[value];
      return defaultValue;
    }
  
    convertNumbers(number: number) {
      return number.toLocaleString();
    }
  
    getBranchs() {
      return;
      this.branch.getAllLite().subscribe(async (res: any) => {
        if (res.length <= 0) {
          let noBranches = await this.modal.generalWarningMessageModal(
            'no_branches',
            'general.yes',
            'general.no'
          );
  
          if (noBranches.isConfirmed) {
            this.newBranch();
            this.closeModal();
          }
  
          if (!noBranches.isConfirmed) this.closeModal();
        }
  
        if (!res) return;
  
        this.branches.next(res);
        this.form.get('branch_id').setValue(res[0].id);
      });
    }
  
    closeModal() {
      if (this.form.dirty) {
        this.modal
          .generalWarningMessageModal(
            'error.exit_before_safe',
            'general.yes',
            'general.no'
          )
          .then((result) => {
            if (result.isConfirmed) {
              this.finalModalClose();
              this.formReset();
            }
          });
      } else {
        this.finalModalClose();
        this.formReset();
      }
    }
  
    finalModalClose(id: string = '') {
      this.dialogRef.close({ id });
    }
  
    formReset() {
      this.form.reset();
    }
  
    isGo(item: any) {
      let date = item.departure.toLocaleString('en-US', 'Asia/Istanbul');
  
      date = moment(date).format('MMM Do YY HH:mm a');
      let currentDate = moment().format('MMM Do YY HH:mm a');
  
      if (currentDate > date) return true;
      return false;
    }
  
    async save() {
      if(this.isGo(this.data.item.trip)) return;
      if(this.selectedSeats.length < 0) this.finalModalClose();
      let selected = this.selectedSeats;
      this.finalModalClose(selected);
    }
  
    ngOnDestroy(): void {
      this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
  }
  
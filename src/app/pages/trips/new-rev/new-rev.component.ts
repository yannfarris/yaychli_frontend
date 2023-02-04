import { Component, OnDestroy, OnInit, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Subscription, BehaviorSubject, take } from 'rxjs';
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
import { InvoiceComponent } from '../invoice/invoice.component';
import { createPopper } from '@popperjs/core';

@Component({
  selector: 'app-new-rev',
  templateUrl: './new-rev.component.html',
  styleUrls: ['./new-rev.component.scss'],
})
export class NewRevComponent implements OnInit, OnDestroy, AfterViewInit {

  isRtl: boolean = false;
  form: any;
  id: string;
  numberPattern = '^[0-9]+$';
  private unsubscribe: Subscription[] = [];
  isShowPassword = false;
  isHideBranches = false;
  branches: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  rev_price: BehaviorSubject<any> = new BehaviorSubject<any>(this.data?.price);

  maxSeats = 0
  total_rev = 0
  seatsArr:number[] = []
  seatOffset: number[] = []
  seatOffset2: number[] = []
  seatOffset3: number[] = []
  selectedSeats: any = []
  stops: any = []
  tripId = ''


  constructor(
    private dialogRef: MatDialogRef<NewRevComponent>,
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
    public role: RoleService
  ) {}

  ngOnInit(): void {

    this.tripId = this.data?.id
    this.stops = JSON.parse(this.data?.stops)

    if(this.data.bus.seat_type == '1'){
      this.maxSeats = 38
      this.seatOffset = [1, 4, 7, 10, 13, 17, 20, 23, 26, 29, 32]
      this.seatOffset2 = [16]
      this.seatOffset3 = []

    }
    if(this.data.bus.seat_type == '2'){
      this.maxSeats = 39
      this.seatOffset = [1, 4, 7, 10, 13, 16, 21, 24, 27, 30, 33]
      this.seatOffset2 = [19, 20]
      this.seatOffset3 = []

    }
    if(this.data.bus.seat_type == '3'){
      this.maxSeats = 41
      this.seatOffset = [1, 4, 7, 10, 13, 16, 20, 23, 26, 29, 32, 35]
      this.seatOffset2 = [19]
      this.seatOffset3 = []

    }
    if(this.data.bus.seat_type == '4'){
      this.maxSeats = 39
      this.seatOffset = [1, 4, 7, 10, 13, 16, 21, 24, 27, 30, 33]
      this.seatOffset2 = [19, 20]
      this.seatOffset3 = []

    }
    if(this.data.bus.seat_type == '5'){
      this.maxSeats = 36
      this.seatOffset = [1, 4, 7, 10, 13, 17, 20, 23, 26, 29, 34]
      this.seatOffset2 = [16]
      this.seatOffset3 = [32]

    }

    for (let i = 1; i <= this.maxSeats; i++){
      this.seatsArr.push(i)
    }

    this.id = this.data?.item?.id;

    if (this.settings.currentLang.value === 'ar') {
      this.isRtl = true;
    }

    let dialogRef = this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });

    this.unsubscribe.push(dialogRef);

    this.form = this.formBuilder.group({
      id: [this.getValue('id')],
      gov_id: [this.getValue('name', ''), Validators.required],
      name: [this.getValue('name', ''), Validators.required],
      phone: [this.getValue('phone', '')],
      email: [this.getValue('email', '')],
      address: [this.getValue('name', '')],
      type: [this.getValue('type', 'final')],
      stop: [this.stops[0].id, Validators.required],
      rev_price: [this.getValue('rev_price', this.data?.price)],
      // branch_id: [this.getValue('branch_id', ''), Validators.required],
      note: [this.getValue('note', '')],
    });
    
    let rev_price = this.form.get('rev_price').valueChanges.subscribe((res:any) => {
      if(!res) return;
      this.rev_price.next(res);
    })

    this.unsubscribe.push(rev_price);

    if (this.role.isMegaAdmin()) this.getBranchs();
    if (!this.role.isMegaAdmin()) this.form.get('branch_id').setValue(this.auth.currentUserValue.branch_id);
  }

  isTaken(seat: any){
    let revs = this.data.reservations
    let find = revs.find((el: any) => el.seat_code == seat )
    if(find?.type == 'final') return true;
    return false;

  }

  isHalfTaken(seat: any){
    let revs = this.data.reservations
    let find = revs.find((el: any) => el.seat_code == seat )
    if(find?.type == 'temp') return true;
    return false;

  }

  isSeatOffset3(seat: any){
    if(this.seatOffset3.includes(seat)) return true
    return false
  }
  isSeatOffset2(seat: any){
    if(this.seatOffset2.includes(seat)) return true
    return false
  }

  isSeatOffset(seat: any){
    if(this.seatOffset.includes(seat)) return true
    return false
  }

  isSelected(seat: any){
    if(this.selectedSeats.includes(seat))  return true
    return false
  }

  handleClick(seat: any){

    let totalRev = this.data.bus.total_rev
    if(this.selectedSeats.length + 1 > totalRev) return this.modal.generalErrorMessageModal('tota_rev_exc')


    let index = this.selectedSeats.findIndex((res: any) => res === seat)
    if(index < 0) return this.selectedSeats.push(seat)
    this.selectedSeats.splice(index, 1); 

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
    return
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

  
  invoice(){

    const dialogRef = this.dialog.open(InvoiceComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '90vw',
      maxHeight: '95vh',
      data: {item: this.data, seats: this.selectedSeats, customerName: this.form.get('name').value},
    }).afterClosed().subscribe(res =>{
      if (!res) return;
      this.finalModalClose('done');
    })

    this.unsubscribe.push(dialogRef);
    
  }

  async save() {
    
    let totalRev = this.data.bus.total_rev
    if(this.selectedSeats.length <= 0) return;
    if(this.form.get('rev_price').value <= 0) return;
    if(this.selectedSeats.length  > totalRev) return this.modal.generalErrorMessageModal('tota_rev_exc')


    if (this.form.valid) {
      let fields = this.form.controls;
      let fieldsData: any = {};

      for (const field in fields) {
        fieldsData[field] =
          fields[field].value != '' ? fields[field].value : null;
      }
      
      fieldsData.selected = this.selectedSeats
      fieldsData.trip_id = this.tripId;
      let newData = this.trip.newRev(fieldsData).subscribe((res: any) => {
        if (!res) return;
        this.invoice()
        this.finalModalClose('done');
      });

      // this.unsubscribe.push(newData);
    } else {
      this.modal.generalErrorMessageModal();
    }
  }

  ngAfterViewInit(): void {
 
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

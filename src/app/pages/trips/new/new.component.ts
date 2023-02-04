import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BranchService } from 'src/app/api/branch/branch.service';
import { TripsService } from 'src/app/api/trips/trips.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';

import { DateAdapter } from '@angular/material/core';
import { RoleService } from 'src/app/shared/services/role/role.service';
import { BusService } from 'src/app/api/bus/bus.service';
import { NewComponent as newBranch } from 'src/app/pages/branches/new/new.component';
import { InvoiceComponent } from '../invoice/invoice.component';
import moment from 'moment';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-new-school',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit, OnDestroy {
  isRtl: boolean = false;
  form: any;
  id: string;
  numberPattern = '^[0-9]+$';
  private unsubscribe: Subscription[] = [];

  time = { hour: 13, minute: 30 };
  meridian = true;
  branches: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  buses: BehaviorSubject<any> = new BehaviorSubject<any>([]);


  city = [
    { trans: 'baghdad', name: 'baghdad' },
    { trans: 'kirkuk', name: 'kirkuk' },
    { trans: 'erbil', name: 'erbil' },
    { trans: 'ankara', name: 'ankara' },
    { trans: 'istanbul', name: 'istanbul' },
  ];

  stops: any = []


  constructor(
    private dialogRef: MatDialogRef<NewComponent>,
    private formBuilder: FormBuilder,
    public settings: AppSettingsService,
    private modal: ModalsService,
    public auth: AuthService,
    private trip: TripsService,
    private branch: BranchService,
    private bus: BusService,
    private apiQuery: ApiQueryService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<any>,
    public role: RoleService
  ) { }

  ngOnInit(): void {
    this.id = this.data?.item?.id;
    if(this.id) this.stops = JSON.parse(this.data?.item?.stops);
    if (this.settings.currentLang.value === 'ar') {
      this.isRtl = true;
      this.dateAdapter.setLocale('ar');
    }

    let dialogRef = this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });

    this.unsubscribe.push(dialogRef);

    this.form = this.formBuilder.group({
      id: [this.getValue('id')],

      from: [this.getValue('from', 'baghdad'), Validators.required],
      fromDate: [new Date(), Validators.required],
      fromTime: [this.getTime(), Validators.required],
      departure: [this.getValue('departure', this.getDeparture()), Validators.required],

      to: [this.getValue('to', 'ankara'), Validators.required],
      toDate: [new Date(), Validators.required],
      toTime: [this.getTime(), Validators.required],
      arrive: [this.getValue('arrive', this.getArrive()), Validators.required],

      gate: [this.getValue('gate', 1), Validators.required],
      price: [0],
      dub: [this.getValue('dub', 1), Validators.required],

      bus_id: [this.getValue('bus_id', ''), Validators.required],
      // branch_id: [this.getValue('branch_id', ''),  Validators.required],

      note: [this.getValue('note', '')],

    });
    

    let fromTime = this.form.get('fromTime').valueChanges.subscribe((res: any) => {
      let date = this.form.get('fromDate').value;
      if (!date) this.initFromDate();

      this.updateFromDate(date, res);
    });

    this.unsubscribe.push(fromTime);

    let fromDate = this.form.get('fromDate').valueChanges.subscribe((res: any) => {
      let date = res
      let time = this.form.get('fromTime').value;

      this.updateFromDate(date, time);
    });

    this.unsubscribe.push(fromDate);


    let toTime = this.form.get('toTime').valueChanges.subscribe((res: any) => {
      let date = this.form.get('toDate').value;
      if (!date) this.initFromDate();

      this.updateToDate(date, res);
    });

    this.unsubscribe.push(toTime);

    let toDate = this.form.get('toDate').valueChanges.subscribe((res: any) => {
      let date = res
      let time = this.form.get('toTime').value;

      this.updateToDate(date, time);
    });

    this.unsubscribe.push(toDate);



    if (this.role.isMegaAdmin()) this.getBranchs()
    // if(!this.role.isMegaAdmin()) this.form.get('branch_id').setValue(this.auth.currentUserValue.branch_id)
    this.getBus()

  }

  
drop(event: CdkDragDrop<any>) {
  moveItemInArray(this.stops, event.previousIndex, event.currentIndex);
}

  getTimeDate(date: any) {
    date = date.toLocaleString('en-US', 'Asia/Istanbul');
    let newDate = moment(date).format('hh:mm a');
    return newDate;
  }
  

  getRandom(length: number) {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
  }

  addStop() {
    const id = this.getRandom(10)
    this.stops.push(
      {
        id,
        from: this.form.get('from').value,
        departure: this.form.get('departure').value,
        to: this.form.get('to').value,
        arrive: this.form.get('arrive').value,
      })
  }

  removeStop(item: any) {
    let index = this.stops.findIndex((res: any) => res.id === item.id)
    this.stops.splice(index, 1)
  }

  getTime() {
    let date = new Date();
    return { hour: date.getHours(), minute: date.getMinutes() }
  }
  getDeparture() {
    let date = new Date()
    return date
  }

  getArrive() {
    let date = new Date()
    return date
  }

  updateFromDate(date: any, time: any) {
    let newDate = new Date(date)
    newDate.setHours(time.hour, time.minute, 0)

    this.form.get('departure').setValue(newDate);
  }

  updateToDate(date: any, time: any) {
    let newDate = new Date(date)
    newDate.setHours(time.hour, time.minute, 0)

    this.form.get('arrive').setValue(newDate);
  }


  initFromDate() {
    this.form.get('fromDate').setValue(new Date());
  }
  initToDate() {
    this.form.get('toDate').setValue(new Date());
  }

  getValue(value: string, defaultValue: any = '') {
    if (this.data?.item?.hasOwnProperty(value)) return this.data.item[value];
    return defaultValue;
  }


  newBranch() {

    const dialogRef = this.dialog.open(newBranch, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '95vh',

    })

  }

  getBranchs() {

    return

    this.branch.getAllLite().subscribe(async (res: any) => {

      if (res.length <= 0) {

        let noBranches = await this.modal.generalWarningMessageModal('no_branches', 'general.yes', 'general.no')

        if (noBranches.isConfirmed) {
          this.newBranch()
          this.closeModal()
        }

        if (!noBranches.isConfirmed) this.closeModal()


      }


      if (!res) return;

      this.branches.next(res)
      this.form.get('branch_id').setValue(res[0].id)
    });

  }

  getBus() {

    this.bus.getAllLite().subscribe(async (res: any) => {

      if (res.length <= 0) {

        let noData = this.modal.generalWarningMessageModal2('no_Bus')
        this.closeModal()
      }

      if (!res) return;

      this.buses.next(res)
      this.form.get('bus_id').setValue(res[0].id)
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
    // this.form.reset();
  }

  invoice() {

    const dialogRef = this.dialog.open(InvoiceComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '95vh',

    })
  }

  async save() {

    if(this.stops.length <= 0) return

    if (this.form.valid) {
      let fields = this.form.controls;
      let fieldsData: any = {};

      for (const field in fields) {
        fieldsData[field] =
          fields[field].value != '' ? fields[field].value : null;
      }
      fieldsData['stops'] = this.stops

      let newData = this.trip.new(fieldsData).subscribe((res: any) => {
        if (!res) return;
        this.modal.generalSuccessMessageModal('create_done');
        this.apiQuery.resetApiKey();
        this.formReset();
        this.finalModalClose(res.id);
      });

      this.unsubscribe.push(newData);
    } else {
      this.modal.generalErrorMessageModal();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

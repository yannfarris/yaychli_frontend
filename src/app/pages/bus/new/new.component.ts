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
  import { NewComponent as newDriver } from 'src/app/pages/driver/new/new.component';
import { BusService } from 'src/app/api/bus/bus.service';

import * as moment from 'moment';

  
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
    isShowPassword = false;
    isHideBranches = false;
    branches: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    drivers: BehaviorSubject<any> = new BehaviorSubject<any>([]);

    busType = this.bus.busType
  
    constructor(
      private dialogRef: MatDialogRef<NewComponent>,
      private formBuilder: FormBuilder,
      public settings: AppSettingsService,
      private modal: ModalsService,
      public auth: AuthService,
      private branch: BranchService,
      private driver: DriversService,
      private apiQuery: ApiQueryService,
      public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public role: RoleService,
      private bus: BusService,
    ) {}
  
    ngOnInit(): void {
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
        name: [this.getValue('name', ''), Validators.required],
        number: [this.getValue('number', ''), Validators.required],
        seat_type: [this.seat_type(this.getValue('seat_type', '')), Validators.required],
        services: [this.getValue('services', ['charge'])],
        total_rev: [this.getValue('total_rev', this.busType[0].total), Validators.required],
        // branch_id: [this.getValue('branch_id', ''), Validators.required],
        // driver_id: [this.getValue('driver_id', ''), Validators.required],
        note: [this.getValue('note', '')],
      });
  
      if(this.role.isMegaAdmin()) this.getBranchs()
      if(!this.role.isMegaAdmin()) this.form.get('branch_id').setValue(this.auth.currentUserValue.branch_id)
      this.getDrivers()
      if(this.id) this.form.get('services').setValue(JSON.parse(this.data.item.services))

      let total_rev = this.form.get('total_rev').valueChanges.subscribe((res:any) => {
        if(!res) return

        let selectedType = this.form.get('seat_type').value
        let index = this.busType.findIndex(obj => obj.type === selectedType)
        
        let current = +res
        let totalRev = +this.busType[index].total
        if(res > totalRev) this.form.get('total_rev').setValue(totalRev)
       
      })

      this.unsubscribe.push(total_rev);

      let seat_type = this.form.get('seat_type').valueChanges.subscribe((res:any) => {
        if(!res) return

        let selectedType = +res
        let index = this.busType.findIndex(obj => obj.type === selectedType)

        let totalRev = +this.busType[index].total

        this.form.get('total_rev').setValue(totalRev)
       
      })

      this.unsubscribe.push(seat_type);


    }

    seat_type(type: string){
      if(!type) return this.busType[0].type
      let selectedType = +type
      let index = this.busType.findIndex(obj => obj.type === selectedType)
      return this.busType[index].type
    }
  
    newBranch(){    
  
        const dialogRef = this.dialog.open(newBranch, {
    
          disableClose: true,
          width: '90vw',
          maxWidth: '600px',
          maxHeight: '95vh',
    
        })
    }
  
    newDriver(){    
  
        const dialogRef = this.dialog.open(newDriver, {
    
          disableClose: true,
          width: '90vw',
          maxWidth: '600px',
          maxHeight: '95vh',

        })
    }
  
    getValue(value: string, defaultValue: any = '') {
      if (this.data?.item?.hasOwnProperty(value)) return this.data.item[value];
      return defaultValue;
    }
  
   getBranchs() {

    return
  
      this.branch.getAllLite().subscribe(async (res:any) => {
  
        if(res.length <= 0){
          
          let noBranches = await this.modal.generalWarningMessageModal('no_branches', 'general.yes', 'general.no')
          
          if(noBranches.isConfirmed){
            this.newBranch()
            this.closeModal()
          }
  
          if(!noBranches.isConfirmed) this.closeModal()
  
        }
        
        if (!res) return;
  
        this.branches.next(res)
        this.form.get('branch_id').setValue(res[0].id)});
      
    }

   getDrivers() {

    return
  
      this.driver.getAllLite().subscribe(async (res:any) => {
  
        if(res.length <= 0){
          
          let nodata = await this.modal.generalWarningMessageModal('no_divers', 'general.yes', 'general.no')
          
          if(nodata.isConfirmed){
            this.newBranch()
            this.closeModal()
          }
  
          if(!nodata.isConfirmed) this.closeModal()
     
        }
        
        if (!res) return;
  
        this.drivers.next(res)
        this.form.get('driver_id').setValue(res[0].id)
      
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
  
    async save() {
      if (this.form.valid) {
        let fields = this.form.controls;
        let fieldsData: any = {};
  
        for (const field in fields) {
          fieldsData[field] =
            fields[field].value != '' ? fields[field].value : null;
        }

        let newData = this.bus.new(fieldsData).subscribe((res: any) => {
          if (!res) return;
          this.finalModalClose('done');
        });
  
        // this.unsubscribe.push(newData);
      } else {
        this.modal.generalErrorMessageModal();
      }
    }
  
    ngOnDestroy(): void {
      this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
  }
  
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AdsService } from 'src/app/api/ads/ads.service';
import { MediaService } from 'src/app/api/media/media.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { RoleService } from 'src/app/shared/services/role/role.service';

@Component({
  selector: 'app-new-ads',
  templateUrl: './new-ads.component.html',
  styleUrls: ['./new-ads.component.scss']
})
export class NewAdsComponent implements OnInit, OnDestroy {

  isRtl: boolean = false
  form: any;
  numberPattern = "^[0-9]+$";
  private unsubscribe: Subscription[] = [];

  schools: BehaviorSubject<any> = new BehaviorSubject<any>([])

  constructor(

    private dialogRef: MatDialogRef<NewAdsComponent>,
    private formBuilder: FormBuilder,
    public settings: AppSettingsService,
    private modal: ModalsService,
    public auth: AuthService,
    private apiQuery: ApiQueryService,
    public dialog: MatDialog,
    public role: RoleService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private media: MediaService,
    private ads: AdsService

  ) { }

  ngOnInit(): void {

    this.media.allowedType = 'image'
    this.media.maxFile = 1
    if (this.settings.currentLang.value === 'ar') {
      this.isRtl = true
    }

    let dialogRef = this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });

    this.unsubscribe.push(dialogRef);


    this.form = this.formBuilder.group({
      name: ['', Validators.required],

    });

  }

  closeModal() {

    if (this.form.dirty) {
      this.modal.generalWarningMessageModal('error.exit_before_safe', 'general.yes', 'general.no').then(result => {

        if (result.isConfirmed) {
          this.dialogRef.close();
          this.formReset()
        }

      })
    }
    else {

      this.dialogRef.close();
      this.formReset()

    }

  }

  formReset() {
    this.form.reset();

  }

  async save() {

    if (this.form.valid) {

      let fields = this.form.controls
      let fieldsData: any = {}

      for (const field in fields) {
        fieldsData[field] = fields[field].value != '' ? fields[field].value : null
      }

      if(this.media.files.length <= 0) return;

   
      let newData = this.media.new().subscribe((res:any) => {

        if (!res) return;
        if(res.isImage === false) return;

        if(res.mediaIdsArr ) fieldsData['media'] = res.mediaIdsArr 

        let addAd = this.ads.new(fieldsData).subscribe(adRes =>{
          if(!adRes) return;

          this.apiQuery.resetApiKey();
          this.formReset();
          this.modal.generalSuccessMessageModal('general.create_succes')
          this.dialogRef.close();

        })

      })

      // this.unsubscribe.push(newData);

    }

    else {
      this.modal.generalErrorMessageModal()
    }
  }


  ngOnDestroy(): void {
    this.apiQuery.resetSearch()
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }




}

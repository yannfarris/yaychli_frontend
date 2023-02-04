import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SchoolService } from 'src/app/api/school/school.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { GetBarcodeService } from 'src/app/shared/services/barcode/get-barcode.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { BarcodeScannerLivestreamOverlayComponent } from "ngx-barcode-scanner";
import { AttendanceService } from 'src/app/api/attendance/attendance.service';
import { PosService } from 'src/app/api/pos/pos.service';

@Component({
  selector: 'app-get-user-info',
  templateUrl: './get-user-info.component.html',
  styleUrls: ['./get-user-info.component.scss']
})
export class GetUserInfoComponent implements OnInit, OnDestroy {



  isRtl: boolean = false
  form: any;
  numberPattern = "^[0-9]+$";
  schoolId = "";
  type: string = 'in';
  isType: boolean = false;
  private unsubscribe: Subscription[] = [];
  image: string = "assets/media/general/qr-code-scan.png";
  isPulse = true

  @ViewChild(BarcodeScannerLivestreamOverlayComponent)
  barcodeScanner: BarcodeScannerLivestreamOverlayComponent;
  barcodeValue: any;
  isAdd = false
  @HostListener('window:keyup', ['$event']) barcodeEvent(event: any) {
    if (!event) return;
    let barcode = this.getBarcode.getBarcode(event)
    if (!barcode) return;
    this.new(barcode)
  }

  constructor(

    private dialogRef: MatDialogRef<GetUserInfoComponent>,
    private formBuilder: FormBuilder,
    public settings: AppSettingsService,
    private modal: ModalsService,
    public auth: AuthService,
    private school: SchoolService,
    private apiQuery: ApiQueryService,
    public dialog: MatDialog,
    private getBarcode: GetBarcodeService,
    private attendance: AttendanceService,
    private pos: PosService


  ) { }

  ngOnInit(): void {

    if (this.settings.currentLang.value === 'ar') {
      this.isRtl = true
    }

    let dialogRef = this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });

    this.unsubscribe.push(dialogRef);

  }

  new(barcode: string) {
    this.pos.getUserInfo(barcode).subscribe(res => {
      if(!res) return;
      this.finalModalClose(res)
    })
    
  }

  onValueChanges(result: any) {
    this.hideBarcodeCamera()
    this.barcodeValue = result.codeResult.code;
    this.new(this.barcodeValue)

  }

  showBarcodeCamera() {
    this.barcodeScanner.show()
  }

  hideBarcodeCamera() {
    this.barcodeScanner.hide()
  }

  onStarted() {
    
  }

  resetImage() {
    this.image = "assets/media/general/qr-code-scan.png"
  }

  resetPulse() {
    this.isPulse = !this.isPulse
  }

  changeType(type: string) {
    this.type = type;
    this.isType = true;
  }

  closeModal() {

    this.finalModalClose()

  }

  finalModalClose(user: any = {}) {
    this.dialogRef.close(user);
  }

  formReset() {
    this.form.reset();

  }

  ngOnDestroy(): void {
    if(this.isAdd) this.apiQuery.apply()
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}

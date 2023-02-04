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
import { BarcodeScannerLivestreamOverlayComponent, BarcodeScannerLivestreamComponent } from "ngx-barcode-scanner";
import { AttendanceService } from 'src/app/api/attendance/attendance.service';


@Component({
  selector: 'app-new-attendance',
  templateUrl: './new-attendance.component.html',
  styleUrls: ['./new-attendance.component.scss']
})
export class NewAttendanceComponent implements OnInit, OnDestroy {


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
    if (!this.isType) return;
    let barcode = this.getBarcode.getBarcode(event)
    if (!barcode) return;
    this.new(barcode)
  }

  constructor(

    private dialogRef: MatDialogRef<NewAttendanceComponent>,
    private formBuilder: FormBuilder,
    public settings: AppSettingsService,
    private modal: ModalsService,
    public auth: AuthService,
    private school: SchoolService,
    private apiQuery: ApiQueryService,
    public dialog: MatDialog,
    private getBarcode: GetBarcodeService,
    private attendance: AttendanceService


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
    let type = this.type;
    let data = { barcode, type }

    this.attendance.new(data).subscribe(res => {
      if(!res) return;
      this.isAdd = true;
      this.modal.generalSuccessMessageModal('general.add_succ');
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

  finalModalClose(id: string = '') {
    this.dialogRef.close({ id });
  }

  formReset() {
    this.form.reset();

  }

  ngOnDestroy(): void {
    if(this.isAdd) this.apiQuery.apply()
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}

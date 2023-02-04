import { Component, OnInit, Inject, ViewChild, ElementRef, AfterContentChecked, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, AfterViewInit {
  @ViewChild('printing') printing: ElementRef<HTMLButtonElement>;
  private unsubscribe: Subscription[] = [];
  stopId = this.data?.item?.reservations[0]?.stop_id
  stops = this.data?.item?.stops
  constructor(
    public settings: AppSettingsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<InvoiceComponent>,

  ) { }

  ngOnInit(): void {
    let dialogRef = this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });

    this.unsubscribe.push(dialogRef);

  }
  
  print(){
    
  }
  
  getStop(){

    let stops = JSON.parse(this.stops);
    let stop = stops.filter((el:any) => el.id !== this.stopId);
    return stop[0];
  }

  closeModal() {
    this.dialogRef.close();
  }

  ngAfterViewInit(): void {
    this.printing.nativeElement.click();
    this.closeModal()
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}

import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TripsService } from 'src/app/api/trips/trips.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  items: BehaviorSubject<any> = new BehaviorSubject([]);
  private unsubscribe: Subscription[] = [];
  @ViewChild('printing') printing: ElementRef<HTMLButtonElement>;

  constructor(

    @Inject(MAT_DIALOG_DATA) public data: any,
    public settings: AppSettingsService,
    private trips: TripsService,
    private dialogRef: MatDialogRef<CustomerListComponent>,
  ) { }


  async getData() {
  
  }

  ngOnInit(): void {
    this.getData()
    let dialogRef = this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });

    this.unsubscribe.push(dialogRef);
  }

  print(){

  }

  seats(item:any){
    let revs = item.reservations;
    let filter = revs.map((res:any) => res.seat_code)
    let list = filter.join(','); 
    return list
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

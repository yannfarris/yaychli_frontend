import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetBarcodeService {
  barcodeKey$: BehaviorSubject<string> = new BehaviorSubject('')
  barcodeKey = ''
  result = ''

  constructor() {}

  getBarcode(event: any) {
    if (!event) return;
    if (event.key === 'Control') return false; 
    if (event.key === 'Escape') return false;

    if (event.key !== 'Enter') {
       this.barcodeKey += event.key;
       return false
    }

    this.result = this.barcodeKey
    this.barcodeKey = ''

    return this.result

  }
}


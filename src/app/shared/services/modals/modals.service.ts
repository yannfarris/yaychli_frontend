import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ModalsService {
  closeAfterTime = 6000
  constructor(private translateService: TranslateService,) { }


  generalSuccessMessageModal(message: string = '', btn: string = 'general.continue', automaticClose: boolean = true) {

    return Swal.fire({
      text: this.translateService.instant(message),
      icon: "success",
      buttonsStyling: false,
      allowOutsideClick: true,
      backdrop: true,
      allowEscapeKey: true,
      confirmButtonText: this.translateService.instant(btn),
      customClass: {
        confirmButton: "btn btn-success"
      }
    });

  }

  generalWarningMessageModal(message: string = 'error.general', btn: string = 'general.continue', cancelButtonText: string = 'general.cancel') {

    return Swal.fire({
      text: this.translateService.instant(message),
      icon: "warning",
      buttonsStyling: false,
      showCancelButton: true,
      cancelButtonText: this.translateService.instant(cancelButtonText),
      confirmButtonText: this.translateService.instant(btn),
      customClass: {
        confirmButton: `btn mx-3 btn-primary`,
        cancelButton: 'btn btn-light-primary'
      }
    })

  }

  generalWarningMessageModal2(message: string = 'error.general', btn: string = 'general.continue', cancelButtonText: string = 'general.cancel', automaticClose: boolean = true) {

    return Swal.fire({
      text: this.translateService.instant(message),
      icon: "warning",
      buttonsStyling: false,
      showCancelButton: false,
      confirmButtonText: this.translateService.instant(btn),
      customClass: {
        confirmButton: "btn btn-primary mx-3",
      }
    })

  }
  generalErrorMessageModal(message: string = 'error.general', btn: string = 'general.continue', cancelButtonText: string = 'general.cancel', automaticClose: boolean = true) {

    return Swal.fire({
      text: this.translateService.instant(message),
      icon: "error",
      buttonsStyling: false,
      showCancelButton: false,
      confirmButtonText: this.translateService.instant(btn),
      customClass: {
        confirmButton: "btn btn-primary mx-3",
      }
    })

  }
  generalErrorMessagWithValue(message: string = 'error.general', value = '') {

    let values = JSON.parse(value)

    return Swal.fire({
      text: this.translateService.instant(message, ...values),
      icon: "error",
      buttonsStyling: false,
      showCancelButton: false,
      confirmButtonText: this.translateService.instant('general.continue'),
      customClass: {
        confirmButton: "btn btn-primary mx-3",
      }
    })

  }
}

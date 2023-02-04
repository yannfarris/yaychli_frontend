import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent {

  @Input() isModal = false
  @Input() message = ''
  @Input() image = ''

  constructor(private translate: TranslateService) { }

  getMessage(message: string) {
    return this.translate.instant(message)
  }

}

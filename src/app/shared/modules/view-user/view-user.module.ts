import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewUserComponent } from './view-user.component';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';



@NgModule({
  declarations: [
    ViewUserComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    InlineSVGModule
  ],
  exports:[
    ViewUserComponent
  ]
})
export class ViewUserModule { }

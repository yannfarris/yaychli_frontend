import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoDataRoutingModule } from './no-data-routing.module';
import { NoDataComponent } from './no-data.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    NoDataComponent
  ],
  imports: [
    CommonModule,
    NoDataRoutingModule,
    TranslateModule
  ],
  exports:[
    NoDataComponent
  ]
})
export class NoDataModule { }

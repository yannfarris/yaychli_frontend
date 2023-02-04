import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ViewMediaModule } from '../view-media/view-media.module';
import { ViewUserModule } from '../view-user/view-user.module';
import { ViewInvoiceModule } from '../view-invoice/view-invoice.module';


@NgModule({
  
  declarations: [
    TableComponent
  ],

  imports: [
    CommonModule,
    InlineSVGModule,
    TranslateModule,
    MatTooltipModule,
    ViewMediaModule,
    ViewUserModule,
    ViewInvoiceModule
  ],

  exports:[
    TableComponent
  ],

})

export class TableModule { }

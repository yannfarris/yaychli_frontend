import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewInvoiceRoutingModule } from './view-invoice-routing.module';
import { ViewInvoiceComponent } from './view-invoice.component';
import { MdModule } from '../md/md.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ViewInvoiceComponent
  ],
  imports: [
    CommonModule,
    ViewInvoiceRoutingModule,
    MdModule,
    TranslateModule
  ]
})
export class ViewInvoiceModule { }

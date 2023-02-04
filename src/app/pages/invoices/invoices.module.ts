import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesComponent } from './invoices.component';
import { BarcodeScannerLivestreamModule, BarcodeScannerLivestreamOverlayModule } from 'ngx-barcode-scanner';
import { NoDataModule } from 'src/app/shared/modules/no-data/no-data.module';
import { NgxContentLoadingModule } from 'ngx-content-loading';
import { PaginationModule } from 'src/app/shared/modules/pagination/pagination.module';
import { SearchModule } from 'src/app/shared/modules/search/search.module';
import { MdModule } from 'src/app/shared/modules/md/md.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'src/app/shared/modules/table/table.module';


@NgModule({
  declarations: [
    InvoicesComponent
  ],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    TranslateModule,
    InlineSVGModule,
    MdModule,
    SearchModule,
    PaginationModule,
    NgxContentLoadingModule,
    NoDataModule,
    BarcodeScannerLivestreamOverlayModule,
    BarcodeScannerLivestreamModule,
    TableModule
  ]
})
export class InvoicesModule { }

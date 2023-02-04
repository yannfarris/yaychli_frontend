import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosRoutingModule } from './pos-routing.module';
import { PosComponent } from './pos.component';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NewProductComponent } from './new-product/new-product.component';
import { MdModule } from 'src/app/shared/modules/md/md.module';
import { SearchModule } from 'src/app/shared/modules/search/search.module';
import { PaginationModule } from 'src/app/shared/modules/pagination/pagination.module';
import { NgxContentLoadingModule } from 'ngx-content-loading';
import { NoDataModule } from 'src/app/shared/modules/no-data/no-data.module';
import { GetUserInfoComponent } from './get-user-info/get-user-info.component';
import { BarcodeScannerLivestreamModule, BarcodeScannerLivestreamOverlayModule } from 'ngx-barcode-scanner';


@NgModule({
  declarations: [
    PosComponent,
    NewProductComponent,
    GetUserInfoComponent
  ],
  imports: [
    CommonModule,
    PosRoutingModule,
    TranslateModule,
    InlineSVGModule,
    MdModule,
    SearchModule,
    PaginationModule,
    NgxContentLoadingModule,
    NoDataModule,
    BarcodeScannerLivestreamOverlayModule,
    BarcodeScannerLivestreamModule,
  ]
})
export class PosModule { }

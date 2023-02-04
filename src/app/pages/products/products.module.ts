import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { TableModule } from 'src/app/shared/modules/table/table.module';
import { FieldSearchModule } from 'src/app/shared/modules/field-search/field-search.module';
import { SearchModule } from 'src/app/shared/modules/search/search.module';
import { PaginationModule } from 'src/app/shared/modules/pagination/pagination.module';
import { NoDataModule } from 'src/app/shared/modules/no-data/no-data.module';
import { NgxContentLoadingModule } from 'ngx-content-loading';
import { MdModule } from 'src/app/shared/modules/md/md.module';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { WidgetsModule } from 'src/app/_metronic/partials';


@NgModule({
  declarations: [
    ProductsComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    WidgetsModule,
    InlineSVGModule,
    TranslateModule,
    MdModule,
    NgxContentLoadingModule,
    NoDataModule,
    PaginationModule,
    SearchModule,
    FieldSearchModule,
    TableModule,
  ]
})
export class ProductsModule { }

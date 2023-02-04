import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountantRoutingModule } from './accountant-routing.module';
import { AccountantComponent } from './accountant.component';
import { NewAccountantComponent } from './new-accountant/new-accountant.component';
import { FieldSearchModule } from 'src/app/shared/modules/field-search/field-search.module';
import { SearchModule } from 'src/app/shared/modules/search/search.module';
import { PaginationModule } from 'src/app/shared/modules/pagination/pagination.module';
import { NoDataModule } from 'src/app/shared/modules/no-data/no-data.module';
import { NgxContentLoadingModule } from 'ngx-content-loading';
import { MdModule } from 'src/app/shared/modules/md/md.module';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { TableModule } from 'src/app/shared/modules/table/table.module';


@NgModule({
  declarations: [
    AccountantComponent,
    NewAccountantComponent
  ],
  imports: [
    CommonModule,
    AccountantRoutingModule,
    WidgetsModule,
    InlineSVGModule,
    TranslateModule,
    MdModule,
    NgxContentLoadingModule,
    NoDataModule,
    PaginationModule,
    SearchModule,
    FieldSearchModule,
    TableModule
  ]
})
export class AccountantModule { }

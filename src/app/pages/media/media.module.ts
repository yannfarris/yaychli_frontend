import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaRoutingModule } from './media-routing.module';
import { MediaComponent } from './media.component';
import { MediaInfoComponent } from './media-info/media-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { SearchModule } from 'src/app/shared/modules/search/search.module';
import { PaginationModule } from 'src/app/shared/modules/pagination/pagination.module';
import { TableViewComponent } from './table-view/table-view.component';
import { BoxComponent } from './box-view/box/box.component';
import { MatMenuModule } from '@angular/material/menu';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NoDataModule } from 'src/app/shared/modules/no-data/no-data.module';
import { NgxContentLoadingModule } from 'ngx-content-loading';

@NgModule({
  declarations: [
    MediaComponent,
    MediaInfoComponent,
    TableViewComponent,
    BoxComponent
  ],
  imports: [
    CommonModule,
    MediaRoutingModule,
    TranslateModule,
    SearchModule,
    PaginationModule,
    MatMenuModule,
    InlineSVGModule,
    NoDataModule,
    NgxContentLoadingModule
    
  ]
})
export class MediaModule { }

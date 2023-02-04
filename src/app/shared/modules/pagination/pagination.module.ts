import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationRoutingModule } from './pagination-routing.module';
import { PaginationComponent } from './pagination.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PaginationComponent
  ],
  imports: [
    CommonModule,
    PaginationRoutingModule,
    InlineSVGModule,
    MatMenuModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    PaginationComponent
  ]
})
export class PaginationModule { }

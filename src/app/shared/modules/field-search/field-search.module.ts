import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldSearchRoutingModule } from './field-search-routing.module';
import { FieldSearchComponent } from './field-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from 'src/app/modules/i18n';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    FieldSearchComponent
  ],
  imports: [
    CommonModule,
    FieldSearchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslationModule,
    InlineSVGModule
  ],
  exports:[
    FieldSearchComponent
  ]
})
export class FieldSearchModule { }

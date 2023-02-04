import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMediaComponent } from './view-media.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MatMenuModule } from '@angular/material/menu';



@NgModule({
  declarations: [
    ViewMediaComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatTooltipModule,
    InlineSVGModule,
    MatMenuModule
  ]
})
export class ViewMediaModule { }

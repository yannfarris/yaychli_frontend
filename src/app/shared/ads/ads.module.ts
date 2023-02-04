import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdsRoutingModule } from './ads-routing.module';
import { AdsComponent } from './ads.component';
import { SquareComponent } from './square/square.component';


@NgModule({
  declarations: [
    AdsComponent,
    SquareComponent
  ],
  imports: [
    CommonModule,
    // AdsRoutingModule
  ],
  exports: [
    SquareComponent
  ]
})
export class AdsModule { }

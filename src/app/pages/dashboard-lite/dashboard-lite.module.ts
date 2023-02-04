import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardLiteRoutingModule } from './dashboard-lite-routing.module';
import { DashboardLiteComponent } from './dashboard-lite.component';
import { MovingBusModule } from 'src/app/shared/modules/moving-bus/moving-bus.module';
import { TranslationModule } from 'src/app/modules/i18n';


@NgModule({
  declarations: [
    DashboardLiteComponent
  ],
  imports: [
    CommonModule,
    DashboardLiteRoutingModule,
    MovingBusModule,
    TranslationModule
  ]
})
export class DashboardLiteModule { }

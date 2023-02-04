import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovingBusComponent } from './moving-bus.component';



@NgModule({
  declarations: [
    MovingBusComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    MovingBusComponent
  ]
})
export class MovingBusModule { }

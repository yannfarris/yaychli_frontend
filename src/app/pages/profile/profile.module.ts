import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ProfileTopInfoComponent } from './profile-top-info/profile-top-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileInfoComponent } from './profile-info/profile-info.component';


@NgModule({
  declarations: [
    ProfileComponent,
    ProfileTopInfoComponent,
    ProfileInfoComponent,
    
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    TranslateModule
  ]
})
export class ProfileModule { }

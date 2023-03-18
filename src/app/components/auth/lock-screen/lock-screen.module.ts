import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LockScreenComponent } from './lock-screen.component';
import { LockScreenRoutingModule } from './lock-screen-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  imports: [
    CommonModule,
    LockScreenRoutingModule,
    SharedModule,
    MatProgressSpinnerModule
  ],
  declarations: [LockScreenComponent],

})
export class LockScreenModule { }

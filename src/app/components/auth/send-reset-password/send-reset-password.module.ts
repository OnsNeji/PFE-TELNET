import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendResetPasswordComponent } from './send-reset-password.component';
import { SendResetPasswordRoutingModule } from './send-reset-password-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { BotDetectCaptchaModule } from 'angular-captcha';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    SendResetPasswordRoutingModule,
    BotDetectCaptchaModule
  ],
  providers: [
  ],
  declarations: [SendResetPasswordComponent]
})
export class SendResetPasswordModule { }

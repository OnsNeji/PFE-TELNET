import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ChangePasswordModule } from './change-password/change-password.module';
import { ResetPasswordModule } from './reset-password/resetPassword.module';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    FormsModule,
    ChangePasswordModule,
    ResetPasswordModule
  ]
})
export class AuthModule { }

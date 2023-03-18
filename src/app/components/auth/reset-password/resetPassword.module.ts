import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ResetPasswordRoutingModule } from './resetPassword-routing.module';
import { ResetPasswordComponent } from './reset-password.component';
import { FormsModule } from '../../../../../node_modules/@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ResetPasswordRoutingModule,
        SharedModule,
        FormsModule
    ],
    declarations: [
        ResetPasswordComponent
    ],
})
export class ResetPasswordModule { }

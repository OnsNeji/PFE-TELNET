import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, MaterialModule } from '../../../shared/shared.module';
import { ChangePasswordComponent } from './change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [
        ChangePasswordComponent
    ],
    exports: [
        ChangePasswordComponent
    ],
    entryComponents: [
        ChangePasswordComponent
    ]
})
export class ChangePasswordModule { }

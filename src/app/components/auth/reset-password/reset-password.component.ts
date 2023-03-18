import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators, ValidatorFn, ValidationErrors } from '../../../../../node_modules/@angular/forms';
import { AuthenticationService, NotificationService } from '../../../services/shared';
import { UserIdentifiers } from 'app/models/shared';
import { ResetPassword } from 'app/models/shared/reset-password.model';
import { ValidateAllFormFields } from 'app/helpers/validationForm';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: []
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      MotDePasse: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required)
    }, {
      validators: this.ConfirmPasswordValidator("MotDePasse", "confirmPassword")
    });
    this.route.queryParams.subscribe(val => {
      this.emailToReset = val['email'];
      let uriToken = val['code']
      this.emailToken = uriToken.replace(/ /g, '+');
      console.log(this.emailToken);
      console.log(this.emailToReset);
    })
  }

  reset() {
    if (this.resetPasswordForm.valid) {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.MotDePasse;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;
      console.log(this.resetPasswordObj);
      this.authService.resetPassword(this.resetPasswordObj).subscribe(() => {
        this.router.navigate(['/auth/login']);
      }, error => {
        this.notificationService.danger('Reset password failed.');
      });
    } else {
      this.notificationService.danger('Verify your password confirmation.');
    }
  }

  ConfirmPasswordValidator(controlName: string, matchControlName: string): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const passwordControl = formGroup.controls[controlName];
      const confirmPasswordControl = formGroup.controls[matchControlName];
      if (confirmPasswordControl.errors && confirmPasswordControl.errors['confirmPasswordValidator']) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({
          confirmPasswordValidator: true
        });
        return { confirmPasswordValidator: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }
}
  // resetPassword() {
  //   if (this.newPassword !== null && this.passwordStrength) {
  //     if (this.newPassword === this.newPasswordConfirmed) {
  //       this.userIdentifiers.newPassword = this.newPassword;
  //       this.userIdentifiers.newPasswordConfirmed = this.newPasswordConfirmed;
  //       this.authService.resetPassword(this.userIdentifiers).subscribe(
  //         (response) => {
  //           if (response === 'succeeded') {
  //             this.notificationService.success('Your password is reseted successfully.');
  //             this.router.navigate(['/auth/login']);
  //           } else {
  //             this.notificationService.danger('Reset password failed. Check if new and old password are different.');
  //           }
  //         },
  //         () => {
  //           this.notificationService.danger('Reset password failed.');
  //         }
  //       );
  //     } else {
  //       this.notificationService.danger('Verify your password confirmation.');
  //     }
  //   } else {
  //     this.notificationService.danger('Please fill a strong new password.');
  //   }
  // }


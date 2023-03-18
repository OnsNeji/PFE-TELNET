import { OnInit, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserProfile, UserIdentifiers } from 'app/models/shared';
import { ChangerPassword } from 'app/models/shared/changer-password.model';
import { AuthenticationService, NotificationService } from 'app/services/shared';

@Component({
    selector: 'app-change-password-component',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

    hideCurrentPassword = true;
    hideNewPassword = true;
    hideNewPasswordConfirmed = true;
    userIdentifiers: UserIdentifiers;
    password: string;
    newPassword: string;
    newPasswordConfirmed: string;
    barLabel = 'New Password Strength:';
    passwordStrength = false;
    userProfile: UserProfile;

    id: number;
    changerPasswordForm!: FormGroup;
    changerPasswordObj = new ChangerPassword();
    private jwtHelper = new JwtHelperService();

    constructor(private dialogRef: MatDialogRef<ChangePasswordComponent>,
        private authentication: AuthenticationService,
        private notificationService: NotificationService,
        private fb: FormBuilder) {
    }

    ngOnInit() {

          this.changerPasswordForm = new FormGroup({
            PasswordActuel: new FormControl(null, Validators.required),
            NouveauPassword: new FormControl(null, Validators.required),
            ConfirmerNouveauPassword: new FormControl(null, Validators.required),
          }, {
            validators: this.ConfirmPasswordValidator("NouveauPassword", "ConfirmerNouveauPassword")
          });

          const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.id = decodedToken.nameid;
    }
    }

    // changePassword() {
    //     this.userProfile = this.authentication.getProfile();
    //     this.userIdentifiers.identifier = this.userProfile.currentUser.id.toString();
    //     this.userIdentifiers.password = this.password;
    //     this.userIdentifiers.newPassword = this.newPassword;
    //     this.userIdentifiers.newPasswordConfirmed = this.newPasswordConfirmed;
    //     if (this.validPasswords()) {
    //         this.authentication.changePassword(this.userIdentifiers).subscribe(
    //             (data) => {
    //                 if (data === 'succeeded') {
    //                     this.notificationService.success('Your password is updated successfully');
    //                     this.dialogRef.close();
    //                 } else {
    //                     this.notificationService.danger('Verify your old password');
    //                 }
    //             }
    //         );
    //     }
    // }

    changerPassword() {
        console.log(this.changerPasswordForm.valid);
        if (this.changerPasswordForm.valid) {
          this.changerPasswordObj.MotDePasseActuel = this.changerPasswordForm.value.PasswordActuel;
          this.changerPasswordObj.NouveauMotDePasse = this.changerPasswordForm.value.NouveauPassword;
          this.changerPasswordObj.ConfirmerNouveauMotDePasse = this.changerPasswordForm.value.ConfirmerNouveauPassword;
          
          // appel de l'API pour changer le mot de passe ici
          this.authentication.changerPassword(this.id, this.changerPasswordObj).subscribe(() => {
            this.dialogRef.close();
            this.notificationService.success('Your password has been successfully changed.');
          }, error => {
            this.notificationService.danger('Password change failed.');
          });
        } else {
          this.notificationService.danger('Verify your password confirmation.');
        }
      }
    

    getPasswordStrength(passwordStrength: boolean) {
        this.passwordStrength = passwordStrength;
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
      

    // validPasswords(): boolean {
    //     if (this.userIdentifiers.password === undefined || this.userIdentifiers.newPassword === undefined
    //         || this.userIdentifiers.newPasswordConfirmed === undefined) {
    //         this.notificationService.danger('Please fill all required fields');
    //         return false;
    //     }
    //     if (!this.passwordStrength) {
    //         this.notificationService.danger('Please fill a strength new password');
    //         return false;
    //     }
    //     if (this.userIdentifiers.password === this.userIdentifiers.newPassword) {
    //         this.notificationService.danger('Current and new passwords must be different');
    //         return false;
    //     }
    //     if (this.userIdentifiers.newPassword !== this.userIdentifiers.newPasswordConfirmed) {
    //         this.notificationService.danger('Verify your confirm password');
    //         return false;
    //     }
    //     return true;
    // }

    cancel() {
        this.dialogRef.close();
    }

}


import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserProfile, UserIdentifiers } from 'app/models/shared';
import { ChangerPassword } from 'app/models/shared/changer-password.model';
import { AuthenticationService, NotificationService } from 'app/services/shared';
import { UserService } from 'app/services/shared/user.service';
import { SHA256 } from 'crypto-js';
import { ResetPassword } from 'app/models/shared/reset-password.model';

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
    newPassword: string;
    newPasswordConfirmed: string;
    barLabel = 'New Password Strength:';
    passwordStrength = false;
    userProfile: UserProfile;
    [x: string]: any;
    @ViewChild('passwordActuel') passwordActuel: ElementRef;
    id: number;
  userPassword: string = '';
    changerPasswordForm!: FormGroup;
    changerPasswordObj = new ChangerPassword();
    private jwtHelper = new JwtHelperService();
    

    constructor(private dialogRef: MatDialogRef<ChangePasswordComponent>,
                private authService: AuthenticationService,
                private notificationService: NotificationService,
                private fb: FormBuilder, 
                private userService: UserService,) {
    }

    ngOnInit() {

          this.changerPasswordForm = new FormGroup({
            PasswordActuel: new FormControl(null, Validators.required),
            NouveauMotDePasse: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')]),
            ConfirmerNouveauMotDePasse: new FormControl(null, Validators.required),
          }, {
            validators: this.ConfirmPasswordValidator("NouveauMotDePasse", "ConfirmerNouveauMotDePasse")
          });

          const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.id = decodedToken.nameid;
    }
    this.userService.getUser(this.id).subscribe(data => {
      this.user = data;
      this.userPassword = this.user.motDePasse;
      console.log(this.userPassword)
    });
    }

    changerPassword() {
      const password = this.passwordActuel.nativeElement.value;
    if (password == '') {
      this.notificationService.danger('Mot de passe Actuel est nécessaire');
    }

    const hashedPassword = SHA256(password).toString();
    if (hashedPassword == this.userPassword) {
      if (this.changerPasswordForm.valid) {
        this.changerPasswordObj.MotDePasseActuel = hashedPassword;
        this.changerPasswordObj.NouveauMotDePasse = this.changerPasswordForm.value.NouveauMotDePasse;
        this.changerPasswordObj.ConfirmerNouveauMotDePasse = this.changerPasswordForm.value.ConfirmerNouveauMotDePasse;
        console.log(this.changerPasswordObj);
        
        this.authService.changerPassword(this.id, this.changerPasswordObj).subscribe(() => {
          this.dialogRef.close();
          this.notificationService.success('Your password has been successfully changed.');
        }, error => {
          this.notificationService.danger('Password change failed.');
        });
      } else {
        this.notificationService.danger('Verify your new password.');
      }
      }else{
        this.notificationService.danger('Mot de passe Actuel invalid');
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


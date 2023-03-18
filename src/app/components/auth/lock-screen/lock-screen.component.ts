import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AdminComponent } from 'app/layout/admin/admin.component';
import { AuthenticationService } from 'app/services/shared';
import { CookieService } from 'ngx-cookie-service';
import { PasswordStrengthBarComponent } from 'app/shared/password-strength-bar/password-strength-bar.component';


@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss'],
})

export class LockScreenComponent implements OnInit {
  [x: string]: any;
  @ViewChild('password') password: ElementRef;
  wrongPassword = false;
  isLoading = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthenticationService,
    private cookieService: CookieService,
    public dialogRef: MatDialogRef<AdminComponent>,
  ) { }

  ngOnInit() {
    document.querySelector('body').setAttribute('themebg-pattern', 'theme1');
  }

  backToLogin() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    this.dialogRef.close();
  }
  unlock() {
    /*this.isLoading = true;
    const userLogin = JSON.parse(localStorage.getItem('currentUser')).userNumber;
    const password = this.password.nativeElement.value;
    const score = PasswordStrengthBarComponent.measureStrength(password);
    this.authService.login(userLogin, password)
      .subscribe(
        data => {
          this.isLoading = false;
          if (data && this.authService.isAuthenticated()) {
            sessionStorage.removeItem('DialogExpirationSessionOpened');
            this.dialogRef.close();
          } else {
            this.wrongPassword = true;
          }
        },
        () => {
          this.isLoading = false;
          this.wrongPassword = true;
        }
      );*/
  }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AdminComponent } from 'app/layout/admin/admin.component';
import { AuthenticationService, NotificationService } from 'app/services/shared';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from 'app/services/shared/user.service';


@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss'],
})

export class LockScreenComponent implements OnInit {
  [x: string]: any;
  @ViewChild('password') password: ElementRef;
  wrongPassword = false;
  private jwtHelper = new JwtHelperService();
  id: string = '';
  userPassword: string = '';

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthenticationService,
    private userService: UserService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<AdminComponent>,
  ) { }

  ngOnInit() {
    document.querySelector('body').setAttribute('themebg-pattern', 'theme1');
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.id = decodedToken.nameid;
    }
    this.userService.getUser(parseInt(this.id)).subscribe(data => {
      this.user = data;
      this.userPassword = this.user.motDePasse;
    });
  }

  backToLogin() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    this.dialogRef.close();
  }

  unlock() {
    const password = this.password.nativeElement.value;
    if (password == '') {
      this.notificationService.danger('Unlock screen failed');
    }
    if (password == this.userPassword) {
      sessionStorage.removeItem('DialogExpirationSessionOpened');
      this.dialogRef.close();
      this.notificationService.success('Screen unlocked successfully');
    } else {
      this.notificationService.danger('Unlock screen failed');
    }
  }
}

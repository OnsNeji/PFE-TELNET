import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService, NotificationService } from 'app/services/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'environments/environment';
import { CaptchaComponent } from 'angular-captcha';
import { PasswordStrengthBarComponent } from 'app/shared/password-strength-bar/password-strength-bar.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserStoreService } from 'app/services/shared/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  idlestart = false;
  public commitTime: string;
  failedLogin = false;
  failedCaptcha = false;
  @ViewChild(CaptchaComponent, { static: true }) captchaComponent: CaptchaComponent;
  errorMessages: string;

  recaptchaSended = false;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    private notificationService: NotificationService,
    private userStore: UserStoreService
  ) {
    this.commitTime = environment.commitTime;
  }
  userLogin = '';
  userPassword = '';
  returnUrl: string;
  isLoading = false;
  ngOnInit() {
    this.loginForm = this.fb.group({
      Matricule: ['', Validators.required],
      MotDePasse: ['', Validators.required]
    })
  }


  login() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value)
      this.authenticationService.login(this.loginForm.value)
        .subscribe({
          next: (res) => {
            //alert(res.message)
            this.loginForm.reset();
            this.authenticationService.storeToken(res.token);
            const tokenPayload = this.authenticationService.decodedToken();
            this.userStore.setRoleFromStore(tokenPayload.role);
            this.router.navigateByUrl('/dashboard');
          },
          error: (err) => {
            this.notificationService.danger('User not found.');
          }
        })
    } else {
      this.notificationService.danger('Invalid form !');
    }
  }


  getOptionalParameters(Url: string) {
    const queryParams = {};
    let param: any;
    let value: any;
    const route = Url.substr(0, Url.indexOf(';'));
    let parameters = Url.substr(Url.indexOf(';') + 1, Url.length - Url.indexOf(';') - 1);
    while (parameters.indexOf(';') > -1) {
      param = parameters.substr(0, parameters.indexOf('='));
      value = parameters.substr(parameters.indexOf('=') + 1, parameters.indexOf(';') - parameters.indexOf('=') - 1);
      queryParams[param] = value;
      parameters = parameters.substr(parameters.indexOf(';') + 1, parameters.length - parameters.indexOf(';') - 1);
    }
    param = parameters.substr(0, parameters.indexOf('='));
    value = parameters.substr(parameters.indexOf('=') + 1, parameters.length - parameters.indexOf('=') - 1);
    queryParams[param] = value;

    this.router.navigate([route], { queryParams });
  }
}

import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService, NotificationService } from 'app/services/shared';
import { CaptchaComponent } from 'angular-captcha';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-send-reset-password',
  templateUrl: './send-reset-password.component.html',
  styleUrls: []
})
export class SendResetPasswordComponent implements OnInit {
  @ViewChild('email') email: ElementRef;
  @ViewChild(CaptchaComponent, {static: true}) captchaComponent: CaptchaComponent;
  errorMessages: string;

  recaptchaSended = false;
  emailSended = false;
  failedCaptcha = false;
  failedEmail = false;
  public resetPasswordEmail!: string;
  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    document.querySelector('body').setAttribute('themebg-pattern', 'theme1');
    // this.captchaComponent.captchaEndpoint = environment.apiUrl + environment.captchaEndpointUrl;
  }

  // validateCaptcha(): void {
  //   const email = this.email.nativeElement.value;
  //   if (email !== '') {
  //     const userEnteredCaptchaCode = this.captchaComponent.userEnteredCaptchaCode;
  //     const captchaId = this.captchaComponent.captchaId;

  //     const postData = {
  //       userEnteredCaptchaCode: userEnteredCaptchaCode,
  //       captchaId: captchaId
  //     };

  //     this.authenticationService.validateCaptcha(postData)
  //       .subscribe(
  //         response => {
  //           if (response === 'false') {
  //             this.failedCaptcha = true;
  //             this.failedEmail = false;
  //             this.captchaComponent.reloadImage();
  //           } else {
  //             this.sendResetPassword();
  //             this.failedCaptcha = false;
  //           }
  //         },
  //         error => {
  //           this.failedCaptcha = true;
  //         });
  //   } else {
  //     this.failedEmail = true;
  //     this.failedCaptcha = false;
  //   }
  // }

  confirmToSend() {
    console.log(this.resetPasswordEmail)
    this.authenticationService.sendResetPasswordLink(this.resetPasswordEmail)
      .subscribe({
        next: (res) => {
          this.resetPasswordEmail = "";
          const buttonRef = document.getElementById("closeBtn");
          buttonRef?.click();
          this.notificationService.success('Your request is sent successfully. You will recieve an email in short time.');
        },
        error: (err) => {
          this.notificationService.danger('Your request failed. Please check your email address or contact your administrator.');
        }
      })
  }

  // sendResetPassword() {
  //   const email = this.email.nativeElement.value;
  //   this.authenticationService.sendResetPassword(email).subscribe(
  //     (data) => {
  //       if (data !== null || data !== undefined) {
  //         if (data === 'succeded') {
  //           this.emailSended = true;
  //           this.notificationService.success(
  //             'Your request is sent successfully. You will recieve an email in short time.');
  //         } else {
  //           this.notificationService.danger('Your request failed. Please check your email address or contact your administrator.');
  //         }
  //       }
  //     });
  // }
}

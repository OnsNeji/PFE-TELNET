import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from '../services/shared';

@Injectable()
export class AuthGuardLogin implements CanActivate {
    returnUrl: string;
    constructor(
        private router: Router,
        private cookieService: CookieService,
        private authenticationService: AuthenticationService

    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // user is logged in
        if (this.authenticationService.isAuthenticated()) {
            this.router.navigate(['/dashboard']);
        }
        return true;
    }
}

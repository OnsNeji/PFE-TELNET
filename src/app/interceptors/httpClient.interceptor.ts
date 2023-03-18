import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs/index';
import { AuthenticationService } from 'app/services/shared';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let clonedrequest: HttpRequest<any>;
        if (this.authenticationService.isAuthenticatedButTokenExpired()) {
            return observableThrowError('Your session has expired. Please log in again.');
        }

        if (this.authenticationService.isAuthenticated()) {
            if (request.url.indexOf('i18n') >= 0) {
                // get translation files from localUrl
                clonedrequest = request.clone({
                    url: environment.localUrl + request.url
                });
            } else {
                // add access token and usernumber to request's header
                let clonedheaders = request.headers.set('Authorization', 'Bearer ' + this.authenticationService.getProfile().access_token);
                clonedheaders = clonedheaders.append('tt-usernumber', this.authenticationService.getProfile().currentUser.tel);
                clonedrequest = request.clone({
                    url: environment.apiUrl + request.url,
                    headers: clonedheaders
                });
            }
        } else {
            clonedrequest = request.clone({
                url: environment.apiUrl + request.url
            });
        }
        return next.handle(clonedrequest);
    }
}

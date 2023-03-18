
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs/index';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError(
                    error => {
                        const errMsg = (error.body) ? error.message :
                            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
                        return observableThrowError(errMsg);
                    }
                )
            );
    }
}

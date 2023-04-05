import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators';
import {
    EntityParameter, OracleDbType, Direction, Body, UserProfile, UserIdentifiers, Message
} from 'app/models/shared';
import { CoreDataService } from './core-data.service';
import { EntityParameterService, } from './entity-parameter.service';
import { JwtHelper } from 'app/helpers';
import { environment } from 'environments/environment';
import { ResetPassword } from 'app/models/shared/reset-password.model';
import { ChangerPassword } from 'app/models/shared/changer-password.model';

@Injectable()
export class AuthenticationService {
    private headers: HttpHeaders;
    private jwtHelper: JwtHelper = new JwtHelper();
    private baseUrl: string = "Login/";

    constructor(
        public coreDataService: CoreDataService,
        private httpClient: HttpClient,
        private cookieService: CookieService,
        private entityParameterService: EntityParameterService
    ) {
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    }

    // login(userLogin: string, userPassword: string, score: number): Observable<any> {
    //     const entityParameters = new Array<EntityParameter>();
    //     this.entityParameterService.AddEntityParameter(entityParameters,
    //         'userLogin', userLogin, OracleDbType.Varchar2, Direction.Input);
    //     this.entityParameterService.AddEntityParameter(entityParameters,
    //         'userPassword', userPassword, OracleDbType.Varchar2, Direction.Input);

    //     const body = new Body();
    //     body.storedProcedureName = 'SITT.GetAuthenticatedUser';
    //     body.entitiesParameters = new Array(entityParameters);
    //     body.cursorName = 'curs';

    //     return null;
    //     // return this.httpClient.post('/Login/Authenticate', JSON.stringify(body), { headers: this.headers })
    //     //     .pipe(map((data) => {
    //     //         // login successful if there's a jwt token in the response
    //     //         const profile: UserProfile = new UserProfile;
    //     //         profile.access_token = data['access_token'];
    //     //         profile.currentUser = data['currentUser'][0];
    //     //         if (!(environment.activitiesStrengthCheck.trim().split(',').includes(profile.currentUser.activityId.toString())) &&
    //     //             (environment.activitiesStrengthCheck.trim().toUpperCase() !== 'ALL') || (score >= environment.minStrengthScore)) {
    //     //             profile.currentUser.rolesId = data['currentUser'][0]['rolesId'].split(',');
    //     //             profile.currentUser.functionsId = data['currentUser'][0]['functionsId'].split(',');
    //     //             this.cookieService.set('passwordStrength', 'Strong');
    //     //         } else {
    //     //             this.cookieService.set('passwordStrength', 'Week');
    //     //             profile.currentUser.rolesId = [];
    //     //             profile.currentUser.functionsId = [];
    //     //         }
    //     //         if (profile && profile.access_token) {
    //     //             this.setProfile(profile);
    //     //             return profile;
    //     //         }
    //     //         return profile;
    //     //     }));
    // }

    login(utilisateurObj: any) {
        return this.httpClient.post<any>(`${this.baseUrl}authenticate`, utilisateurObj);
    }

    logout() {
        localStorage.clear();
        this.cookieService.delete('userLogin');
        this.cookieService.delete('passwordStrength');
        this.resetProfile();
    }

    sendResetPasswordLink(email: string){
        return this.httpClient.post<any>(`${this.baseUrl}send-reset-email/${email}`, {});
      }

      resetPassword(resetPasswordObj: ResetPassword){
        return this.httpClient.post<any>(`${this.baseUrl}reset-password`, resetPasswordObj);
      }

      changerPassword(id: number, changerPasswordObj: ChangerPassword){
        return this.httpClient.post(`${this.baseUrl}changerPassword/${id}`, changerPasswordObj);
        }

        isLoggedIn(): boolean{
            return !!localStorage.getItem('token')
          }
    

    // sendResetPassword(email: string) {
    //     const message: Message = new Message();
    //     message.from = 'AdminMail';
    //     message.to = email;
    //     message.subject = 'Reset Password';
    //     message.body = 'Core.ResetPassword';
    //     return this.httpClient.post('/Login/SendResetPassword', JSON.stringify(message),
    //         { headers: this.headers, responseType: 'text' });
    // }

    // resetPassword(userIdentifiers: UserIdentifiers) {
    //     return this.httpClient.post('/Login/ResetPassword', JSON.stringify(userIdentifiers),
    //         { headers: this.headers, responseType: 'text' });
    // }

    // changePassword(userIdentifiers: UserIdentifiers) {
    //     return this.httpClient.post('/Login/ChangePassword', JSON.stringify(userIdentifiers),
    //         { headers: this.headers, responseType: 'text' });
    // }

    isAuthenticated() {
        const profile = this.getProfile();
        const validToken = profile.access_token !== '' && profile.access_token != null;
        const isTokenExpired = this.isTokenExpired(profile);
        return validToken && !isTokenExpired;
    }

    isAuthenticatedButTokenExpired() {
        const profile = this.getProfile();
        const validToken = profile.access_token !== '' && profile.access_token != null;
        const isTokenExpired = this.isTokenExpired(profile);
        return validToken && isTokenExpired;
    }

    isTokenExpired(profile: UserProfile) {
        const expiration = new Date(profile.expires_in);
        return expiration < new Date();
    }

    setProfile(profile: UserProfile) {
        if (profile && profile.access_token && (profile.access_token !== '')) {
            const expires_in = this.jwtHelper.getTokenExpirationDate(profile.access_token).toString();
            localStorage.setItem('access_token', profile.access_token);
            localStorage.setItem('expires_in', expires_in);
            localStorage.setItem('currentUser', JSON.stringify(profile.currentUser));
        }
    }

    getProfile(): UserProfile {
        const accessToken = localStorage.getItem('access_token');
        const userProfile: UserProfile = new UserProfile();
        if (accessToken) {
            userProfile.access_token = accessToken;
            userProfile.expires_in = localStorage.getItem('expires_in');
            if ((userProfile.currentUser === null) || (userProfile.currentUser === undefined)) {
                userProfile.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            }
        }
        return userProfile;
    }

    resetProfile() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_in');
        localStorage.removeItem('currentUser');
        sessionStorage.clear();
    }

    validateCaptcha(data: Object): Observable<any> {
        return this.httpClient.post('/Login/Captcha', data, { headers: this.headers, responseType: 'text' });
    }

    storeToken(tokenValue: string) {
        localStorage.setItem('token', tokenValue)
    }

    getToken() {
        return localStorage.getItem('token')
    }
}

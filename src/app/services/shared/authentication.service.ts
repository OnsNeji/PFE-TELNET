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
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthenticationService {
    private headers: HttpHeaders;
    private jwtHelper: JwtHelper = new JwtHelper();
    private baseUrl: string = "Login/";
    private userPayload: any;

    constructor(
        public coreDataService: CoreDataService,
        private httpClient: HttpClient,
        private cookieService: CookieService,
        private entityParameterService: EntityParameterService
    ) {
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
        this.userPayload = this.decodedToken();
    }

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

    decodedToken(){
        const jwtHelper = new JwtHelperService();
        const token = this.getToken()!;
        return jwtHelper.decodeToken(token)
    }

    getRoleFromToken(){
        if(this.userPayload)
        return this.userPayload.role;
    }
}

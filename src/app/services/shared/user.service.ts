import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = 'Login/';

  constructor(private http: HttpClient) { }

  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getProfile/${id}`);
  }

  editUser(id: number, user: any) {
    return this.http.put(`${this.apiUrl}editProfile/${id}`, user);
  }
}

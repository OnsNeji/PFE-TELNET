import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private baseUrl: string = "";
  
  constructor(private http: HttpClient) { }
  
  DeleteConnection(signalrId: string): Observable<void> {
    const url = `${this.baseUrl}Connection/logout`;

    return this.http.delete<void>(url, { params: { signalrId } });
  }
}

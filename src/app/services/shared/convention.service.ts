import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Convention } from 'app/models/shared/convention.model';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConventionService {

  private baseUrl: string = "";
  public conventionRequest = new Subject<any>();
  public totalConventions: number;
  
  constructor(private http: HttpClient) { }

  GetConventions():Observable<Convention[]>{
    return this.http.get<Convention[]>(`${this.baseUrl}Convention`);
  }
  GetConvention(id: number):Observable<Convention>{
    return this.http.get<Convention>(`${this.baseUrl}Convention/${id}`);
  }
  AddConvention(convention:Convention): Observable<Convention> {
    const url = `${this.baseUrl}Convention`;
    const conventionData = { ...convention, userAjout: convention.userAjout };
    return this.http.post<Convention>(url, conventionData);
  }
  UpdateConvention(id: number, convention:Convention): Observable<any> {
    const url = `${this.baseUrl}Convention/${id}`;
    const conventionData = { ...convention, id: id,}; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, conventionData);
}
  DeleteConvention(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}Convention/${id}`);
  }

  getTotalConventions(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}Convention/stats/total`);
  }

  getMonthlyStatistics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}Convention/stats/monthly`);
  }

  getLastConvention(): Observable<Convention> {
    return this.http.get<Convention>(`${this.baseUrl}Convention/stats/last`);
  }

  getConventionDurations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}Convention/stats/durations`);
  }

}

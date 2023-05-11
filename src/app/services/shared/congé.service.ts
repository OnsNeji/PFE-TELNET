import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Congé } from 'app/models/shared/congé.model';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CongéService {

  private baseUrl: string = "";
  public congéRequest = new Subject<any>();
  
  constructor(private http: HttpClient) { }

  GetCongés(): Observable<Congé[]> {
    return this.http.get<Congé[]>(`${this.baseUrl}Congé`);
  }

  GetCongé(id: number): Observable<Congé> {
    return this.http.get<Congé>(`${this.baseUrl}Congé/${id}`);
  }

  GetCongésByUtilisateur(id: number): Observable<Congé[]> {
    const url = `${this.baseUrl}Congé/CongéParUtilisateur/${id}`;
    return this.http.get<Congé[]>(url);
  }

  AddCongé(congé:Congé): Observable<Congé> {
    const url = `${this.baseUrl}Congé`;
    const date = new Date(); 
    const congéData = { ...congé, utilisateurId: congé.utilisateurId, date };
    return this.http.post<Congé>(url, congéData);
  }

  UpdateCongé(id: number, congé: Congé): Observable<any> {
    const url = `${this.baseUrl}Congé/${id}`;
    const congéData = { ...congé, id: id,}; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, congéData);
  }

  RejectCongé(id: number): Observable<any> {
    const url = `${this.baseUrl}Congé/${id}/reject`;
    return this.http.put(url, null);
  }

  DeleteCongé(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}Congé/${id}`);
  }

  getTotalCongés(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}Congé/stats/count`);
  }

  getCongésStatus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}Congé/stats/status`);
  }

  getCongésByType(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}Congé/stats/type`);
  }

}

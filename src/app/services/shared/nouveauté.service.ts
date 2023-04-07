import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Nouveauté } from 'app/models/shared/nouveauté.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NouveautéService {

  private baseUrl: string = "";
  public nouveautéRequest = new Subject<any>();
  
  constructor(private http: HttpClient) { }

  GetNouveautés(): Observable<Nouveauté[]> {
    return this.http.get<Nouveauté[]>(`${this.baseUrl}Nouveauté`);;
  }

  GetNouveauté(id: number): Observable<Nouveauté> {
    return this.http.get<Nouveauté>(`${this.baseUrl}Nouveauté/${id}`);
  }

  getLatestNouveautés(): Observable<Nouveauté[]> {
    return this.http.get<Nouveauté[]>(`${this.baseUrl}Nouveauté/latest`);
  }

  AddNouveauté(nouveaute:Nouveauté): Observable<Nouveauté> {
    const url = `${this.baseUrl}Nouveauté`;
    const datePublication = new Date(); 
    const nouveauteData = { ...nouveaute, userAjout: nouveaute.userAjout, datePublication };
    return this.http.post<Nouveauté>(url, nouveauteData);
  }
  UpdateNouveauté(id: number, nouveaute: Nouveauté): Observable<any> {
    const url = `${this.baseUrl}Nouveauté/${id}`;
    const nouveauteData = { ...nouveaute, id: id,}; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, nouveauteData);
  }

  DeleteNouveauté(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}Nouveauté/${id}`);
  }
}

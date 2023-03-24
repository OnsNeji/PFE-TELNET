import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployéMois } from 'app/models/shared/employeMois.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeMoisService {

  private baseUrl: string = "";
  public userRequest = new Subject<any>();

  constructor(private http: HttpClient) { }

  GetEmployesMois():Observable<EmployéMois[]>{
    return this.http.get<EmployéMois[]>(`${this.baseUrl}EmployéMois`);
  }
  GetEmployeMois(id: number):Observable<EmployéMois>{
    return this.http.get<EmployéMois>(`${this.baseUrl}EmployéMois/${id}`);
  }
  AddEmployeMois(empMois:EmployéMois): Observable<EmployéMois> {
    const url = `${this.baseUrl}EmployéMois`;
    const userData = { ...empMois, userAjout: empMois.userAjout };
    return this.http.post<EmployéMois>(url, userData);
  }
  UpdateEmployeMois(id: number, empMois:EmployéMois): Observable<any> {
    const url = `${this.baseUrl}EmployéMois/${id}`;
    const userData = { ...empMois, id: id,}; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, userData);
}
  DeleteEmployeMois(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}EmployéMois/${id}`);
  }


  GetUtilisateurs():Observable<Utilisateur[]>{
    return this.http.get<Utilisateur[]>(`${this.baseUrl}Utilisateur`);
  }
  GetUtilisateur(id: number):Observable<Utilisateur>{
    return this.http.get<Utilisateur>(`${this.baseUrl}Utilisateur/${id}`);
  }

}

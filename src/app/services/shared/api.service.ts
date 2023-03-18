import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Departement } from 'app/models/shared/departement.model';
import { Poste } from 'app/models/shared/poste.model';
import { Site } from 'app/models/shared/site.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: string = "";
  public siteRequest = new Subject<any>();

  constructor(private http: HttpClient) { }

  GetDepartements():Observable<Departement[]>{
    return this.http.get<Departement[]>(`${this.baseUrl}Département`);
  }
  GetDepartement(id: number):Observable<Departement>{
    return this.http.get<Departement>(`${this.baseUrl}Département/${id}`);
  }
  AddDepartement(dep:Departement): Observable<Departement> {
    return this.http.post<Departement>(`${this.baseUrl}Département`, dep);
  }
  // UpdateDepartement(dep:Departement): Observable<void> {
  //   return this.http.put<void>(`${this.baseUrl}Département/${dep.id}`, dep);
  // }
  UpdateDepartement(id: number, dep:Departement): Observable<any> {
    const url = `${this.baseUrl}Département/${id}`;
    const depData = { ...dep, id: id }; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, depData);
  }
  DeleteDepartement(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}Département/${id}`);
  }


  GetSites():Observable<Site[]>{
    return this.http.get<Site[]>(`${this.baseUrl}Site`);
  }
  GetSite(id: number):Observable<Site>{
    return this.http.get<Site>(`${this.baseUrl}Site/${id}`);
  }
  AddSite(site:Site): Observable<Site> {
    return this.http.post<Site>(`${this.baseUrl}Site`, site);
  }
  // UpdateSite(site:Site): Observable<Site> {
  //   return this.http.put<Site>(`${this.baseUrl}Site/${site.id}`, site);
  // }
  UpdateSite(id: number, site:Site): Observable<any> {
    const url = `${this.baseUrl}Site/${id}`;
    const siteData = { ...site, id: id }; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, siteData);
  }
  DeleteSite(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}Site/${id}`);
  }


  GetPostes():Observable<Poste[]>{
    return this.http.get<Poste[]>(`${this.baseUrl}Poste`);
  }
  GetPoste(id: number):Observable<Poste>{
    return this.http.get<Poste>(`${this.baseUrl}Poste/${id}`);
  }
  AddPoste(poste:Poste): Observable<Poste> {
    return this.http.post<Poste>(`${this.baseUrl}Poste`, poste);
  }
  // UpdatePoste(id: number, poste: Poste): Observable<any> {
  //   return this.http.put<any>(`${this.baseUrl}Poste/${id}`, poste);
  // }
  UpdatePoste(id: number, poste:Poste): Observable<any> {
    const url = `${this.baseUrl}Poste/${id}`;
    const postData = { ...poste, id: id }; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, postData);
  }

  DeletePoste(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}Poste/${id}`);
  }

  GetUtilisateurs():Observable<Utilisateur[]>{
    return this.http.get<Utilisateur[]>(`${this.baseUrl}Utilisateur`);
  }
  GetUtilisateur(id: number):Observable<Utilisateur>{
    return this.http.get<Utilisateur>(`${this.baseUrl}Utilisateur/${id}`);
  }
  AddUtilisateur(utilisateur:Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.baseUrl}Utilisateur`, utilisateur);
  }
  // UpdateUtilisateur(utilisateur:Utilisateur): Observable<Utilisateur> {
  //   return this.http.put<Utilisateur>(`${this.baseUrl}Utilisateur/${utilisateur.id}`,utilisateur);
  // }

  UpdateUtilisateur(id: number, utilisateur:Utilisateur): Observable<any> {
    const url = `${this.baseUrl}Utilisateur/${id}`;
    const userData = { ...utilisateur, id: id }; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, userData);
}
  DeleteUtilisateur(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}Utilisateur/${id}`);
  }
}

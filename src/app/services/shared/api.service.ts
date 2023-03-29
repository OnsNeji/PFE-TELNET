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
    const url = `${this.baseUrl}Département`;
    const depData = { ...dep, userAjout: dep.userAjout };
    return this.http.post<Departement>(url, depData);
  }
  UpdateDepartement(id: number, dep:Departement): Observable<any> {
    const url = `${this.baseUrl}Département/${id}`;
    const depData = { ...dep, id: id, userModif: dep.userModif }; // inclure l'ID dans le corps de la requête
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
    const url = `${this.baseUrl}Site`;
    const siteData = { ...site, userAjout: site.userAjout };
    return this.http.post<Site>(url, siteData);
  }
  UpdateSite(id: number, site:Site): Observable<any> {
    const url = `${this.baseUrl}Site/${id}`;
    const siteData = { ...site, id: id, userModif: site.userModif }; // inclure l'ID dans le corps de la requête
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
    const url = `${this.baseUrl}Poste`;
    const dateAjout = new Date(); 
    const postData = { ...poste, userAjout: poste.userAjout, dateAjout };
    return this.http.post<Poste>(url, postData);
  }
  UpdatePoste(id: number, poste:Poste): Observable<any> {
    const url = `${this.baseUrl}Poste/${id}`;
    const postData = { ...poste, id: id, userModif: poste.userModif, dateModif: new Date()  }; // inclure l'ID dans le corps de la requête
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
  getLatestUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.baseUrl}Utilisateur/latest`);
  }
  AddUtilisateur(utilisateur:Utilisateur): Observable<Utilisateur> {
    const url = `${this.baseUrl}Utilisateur`;
    const userData = { ...utilisateur, userAjout: utilisateur.userAjout };
    return this.http.post<Utilisateur>(url, userData);
  }
  UpdateUtilisateur(id: number, utilisateur:Utilisateur): Observable<any> {
    const url = `${this.baseUrl}Utilisateur/${id}`;
    const userData = { ...utilisateur, id: id, userModif: utilisateur.userModif }; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, userData);
}
  DeleteUtilisateur(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}Utilisateur/${id}`);
  }
}

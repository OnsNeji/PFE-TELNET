import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Projet } from 'app/models/shared/projet.model';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {

  private baseUrl: string = "";
  public projetRequest = new Subject<any>();
  
  constructor(private http: HttpClient) { }

  GetProjets(): Observable<Projet[]> {
    return this.http.get<Projet[]>(`${this.baseUrl}Projet`);;
  }

  GetProjet(id: number): Observable<Projet> {
    return this.http.get<Projet>(`${this.baseUrl}Projet/${id}`);
  }

  AddProjet(projet:Projet): Observable<Projet> {
    const url = `${this.baseUrl}Projet`;
    const projetData = { ...projet, userAjout: projet.userAjout };
    return this.http.post<Projet>(url, projetData);
  }
  UpdateProjet(id: number, projet: Projet): Observable<any> {
    const url = `${this.baseUrl}Projet/${id}`;
    const projetData = { ...projet, id: id,}; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, projetData);
  }

  DeleteProjet(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}Projet/${id}`);
  }
}

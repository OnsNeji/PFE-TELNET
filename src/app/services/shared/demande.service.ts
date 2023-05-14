import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Demande } from 'app/models/shared/demande.model';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  private baseUrl: string = "";
  public demandeRequest = new Subject<any>();
  
  constructor(private http: HttpClient) { }

  GetDemandes(): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.baseUrl}Demande`);
  }

  GetDemandesAdmin(): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.baseUrl}Demande/admin`);
  }

  GetDemande(id: number): Observable<Demande> {
    return this.http.get<Demande>(`${this.baseUrl}Demande/${id}`);
  }

  GetDemandesByUtilisateur(id: number): Observable<Demande[]> {
    const url = `${this.baseUrl}Demande/DemandeParUtilisateur/${id}`;
    return this.http.get<Demande[]>(url);
  }

  AddDemande(demande:Demande): Observable<Demande> {
    const url = `${this.baseUrl}Demande`;
    const date = new Date(); 
    const demandeData = { ...demande, utilisateurId: demande.utilisateurId, date, adminId: null };
    return this.http.post<Demande>(url, demandeData);
  }

  CreateDemande(id: number): Observable<any> {
    const url = `${this.baseUrl}Demande/new/${id}`;
    return this.http.post(url, {});
  }

  PrisEnCharge(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}Demande/pris/${id}`, {});
  }

  UpdateDemande(id: number, demande: Demande): Observable<any> {
    const url = `${this.baseUrl}Demande/${id}`;
    const demandeData = { ...demande, id: id,}; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, demandeData);
  }

  RejectDemande(id: number): Observable<any> {
    const url = `${this.baseUrl}Demande/${id}/reject`;
    return this.http.put(url, null);
  }

  DeleteDemande(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}Demande/${id}`);
  }

  getTotalDemandes(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}Demande/stats/count`);
  }

  getDemandesStatus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}Demande/stats/status`);
  }

  getDemandesByTitre(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}Demande/stats/titre`);
  }
}

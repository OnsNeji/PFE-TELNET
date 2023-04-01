import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Evenement } from 'app/models/shared/evenement.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {

  private baseUrl: string = "";
  public eventRequest = new Subject<any>();
  
  constructor(private http: HttpClient) { }

  GetEvenements():Observable<Evenement[]>{
    return this.http.get<Evenement[]>(`${this.baseUrl}Evenement`);
  }
  GetEvenement(id: number):Observable<Evenement>{
    return this.http.get<Evenement>(`${this.baseUrl}Evenement/${id}`);
  }
  // AddEvenement(event:Evenement): Observable<Evenement> {
  //   const url = `${this.baseUrl}Evenement`;
  //   const eventData = { ...event, userAjout: event.userAjout };
  //   return this.http.post<Evenement>(url, eventData);
  // }

  AddEvenement(evenement: Evenement, mediaEvents: FileList): Observable<Evenement> {
    const url = `${this.baseUrl}Evenement`;
    const formData = new FormData();
    for (let i = 0; i < mediaEvents.length; i++) {
      formData.append('mediaEvents', mediaEvents[i], mediaEvents[i].name);
    }
    formData.append('titre', evenement.titre);
    formData.append('description', evenement.description);
    formData.append('dateEvent', evenement.dateEvent.toISOString());
    formData.append('userAjout', evenement.userAjout);
    return this.http.post<Evenement>(url, formData);
  }
  
  UpdateEvenement(id: number, event:Evenement): Observable<any> {
    const url = `${this.baseUrl}Evenement/${id}`;
    const eventData = { ...event, id: id,}; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, eventData);
}
  DeleteEvenement(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}Evenement/${id}`);
  }

}

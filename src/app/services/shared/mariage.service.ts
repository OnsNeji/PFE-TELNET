import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mariage } from 'app/models/shared/mariage.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MariageService {

  private baseUrl: string = "";
  public mariageRequest = new Subject<any>();
  
  constructor(private http: HttpClient) { }

  GetMariages(): Observable<Mariage[]> {
    return this.http.get<Mariage[]>(`${this.baseUrl}Mariage`);;
  }

  GetMariage(id: number): Observable<Mariage> {
    return this.http.get<Mariage>(`${this.baseUrl}Mariage/${id}`);
  }

  AddMariage(mariage:Mariage): Observable<Mariage> {
    const url = `${this.baseUrl}Mariage`;
    const datePublication = new Date(); 
    const mariageData = { ...mariage, userAjout: mariage.userAjout, datePublication  };
    return this.http.post<Mariage>(url, mariageData);
  }
  UpdateMariage(id: number, mariage: Mariage): Observable<any> {
    const url = `${this.baseUrl}Mariage/${id}`;
    const mariageData = { ...mariage, id: id,}; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, mariageData);
  }
  DeleteMariage(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}Mariage/${id}`);
  }
}

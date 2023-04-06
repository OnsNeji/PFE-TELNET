import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MariageNaissance } from 'app/models/shared/mariageNaissance.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MariageNaissanceService {

  private baseUrl: string = "";
  public MNRequest = new Subject<any>();
  
  constructor(private http: HttpClient) { }

  GetMariageNaissances(): Observable<MariageNaissance[]> {
    return this.http.get<MariageNaissance[]>(`${this.baseUrl}MariageNaissance`);;
  }

  GetMariageNaissance(id: number): Observable<MariageNaissance> {
    return this.http.get<MariageNaissance>(`${this.baseUrl}MariageNaissance/${id}`);
  }

  AddMariageNaissance(MarNaiss:MariageNaissance): Observable<MariageNaissance> {
    const url = `${this.baseUrl}MariageNaissance`;
    const MarNaissData = { ...MarNaiss, userAjout: MarNaiss.userAjout  };
    return this.http.post<MariageNaissance>(url, MarNaissData);
  }
  UpdateMariageNaissance(id: number, MarNaiss: MariageNaissance): Observable<any> {
    const url = `${this.baseUrl}MariageNaissance/${id}`;
    const MarNaissData = { ...MarNaiss, id: id,}; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, MarNaissData);
  }
  DeleteMariageNaissance(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}MariageNaissance/${id}`);
  }

}

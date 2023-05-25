import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Catégorie } from 'app/models/shared/catégorie.model';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  private baseUrl: string = "";
  public categorieRequest = new Subject<any>();
  
  constructor(private http: HttpClient) { }

  GetCatégories():Observable<Catégorie[]>{
    return this.http.get<Catégorie[]>(`${this.baseUrl}Catégorie`);
  }
  GetCatégorie(id: number):Observable<Catégorie>{
    return this.http.get<Catégorie>(`${this.baseUrl}Catégorie/${id}`);
  }
  AddCatégorie(dep:Catégorie): Observable<Catégorie> {
    const url = `${this.baseUrl}Catégorie`;
    const depData = { ...dep };
    return this.http.post<Catégorie>(url, depData);
  }
  UpdateCatégorie(id: number, dep:Catégorie): Observable<any> {
    const url = `${this.baseUrl}Catégorie/${id}`;
    const depData = { ...dep, id: id }; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, depData);
  }
  DeleteCatégorie(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}Catégorie/${id}`);
  }

}

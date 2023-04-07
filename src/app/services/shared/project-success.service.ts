import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectSuccess } from 'app/models/shared/projectSuccess.model';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectSuccessService {

  private baseUrl: string = "";
  public PSRequest = new Subject<any>();
  
  constructor(private http: HttpClient) { }

  GetProjectSuccesses(): Observable<ProjectSuccess[]> {
    return this.http.get<ProjectSuccess[]>(`${this.baseUrl}ProjectSuccess`);;
  }

  GetProjectSuccess(id: number): Observable<ProjectSuccess> {
    return this.http.get<ProjectSuccess>(`${this.baseUrl}ProjectSuccess/${id}`);
  }

  AddProjectSuccess(projectSuccess:ProjectSuccess): Observable<ProjectSuccess> {
    const url = `${this.baseUrl}ProjectSuccess`;
    const projectSuccessData = { ...projectSuccess, userAjout: projectSuccess.userAjout };
    return this.http.post<ProjectSuccess>(url, projectSuccessData);
  }
  UpdateProjectSuccess(id: number, projectSuccess: ProjectSuccess): Observable<any> {
    const url = `${this.baseUrl}ProjectSuccess/${id}`;
    const projectSuccessData = { ...projectSuccess, id: id,}; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, projectSuccessData);
  }

  DeleteProjectSuccess(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}ProjectSuccess/${id}`);
  }
}

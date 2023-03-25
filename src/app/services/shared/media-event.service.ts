import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MediaEvent } from 'app/models/shared/mediaEvent.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaEventService {

  private baseUrl: string = "";
  public mediaEventRequest = new Subject<any>();
  
  constructor(private http: HttpClient) { }

  GetMediaEvents():Observable<MediaEvent[]>{
    return this.http.get<MediaEvent[]>(`${this.baseUrl}MédiaEvent`);
  }
  GetMediaEvent(id: number):Observable<MediaEvent>{
    return this.http.get<MediaEvent>(`${this.baseUrl}MédiaEvent/${id}`);
  }
  AddMediaEvent(event:MediaEvent): Observable<MediaEvent> {
    const url = `${this.baseUrl}MédiaEvent`;
    const eventData = { ...event };
    return this.http.post<MediaEvent>(url, eventData);
  }
  UpdateMediaEvent(id: number, event:MediaEvent): Observable<any> {
    const url = `${this.baseUrl}MédiaEvent/${id}`;
    const eventData = { ...event, id: id,}; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, eventData);
}
  DeleteMediaEvent(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}MédiaEvent/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Message } from 'app/models/shared/Messages.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private baseUrl: string = "";
  public messageRequest = new Subject<any>();
  
  constructor(private http: HttpClient) { }

  GetMessages():Observable<Message[]>{
    return this.http.get<Message[]>(`${this.baseUrl}Message`);
  }
  GetMessage(id: number):Observable<Message>{
    return this.http.get<Message>(`${this.baseUrl}Message/${id}`);
  }
  getMessagesByConversationId(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}Message/conversations/${conversationId}/messages`);
  }
  AddMessage(message:Message): Observable<Message> {
    const url = `${this.baseUrl}Message`;
    const messageData = { ...message };
    return this.http.post<Message>(url, messageData);
  }
  UpdateMessage(id: number, message:Message): Observable<any> {
    const url = `${this.baseUrl}Message/${id}`;
    const messageData = { ...message, id: id,}; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, messageData);
}
  DeleteMessage(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}Message/${id}`);
  }
}

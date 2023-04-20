import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Conversation } from 'app/models/shared/Conversation.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private baseUrl: string = "";
  public conversationRequest = new Subject<any>();
  
  constructor(private http: HttpClient) { }

    GetConversations():Observable<Conversation[]>{
    return this.http.get<Conversation[]>(`${this.baseUrl}Conversation`);
  }
  GetConversation(id: number):Observable<Conversation>{
    return this.http.get<Conversation>(`${this.baseUrl}Conversation/${id}`);
  }
  getConversationsByUser(userId: number): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.baseUrl}Conversation/?userId=${userId}`);
  }
  
  AddConversation(conversation:Conversation): Observable<Conversation> {
    const url = `${this.baseUrl}Conversation`;
    const conversationData = { ...conversation };
    return this.http.post<Conversation>(url, conversationData);
  }
  UpdateConversation(id: number, conversation:Conversation): Observable<any> {
    const url = `${this.baseUrl}Conversation/${id}`;
    const conversationData = { ...conversation, id: id,}; // inclure l'ID dans le corps de la requête
    return this.http.put<any>(url, conversationData);
}
  DeleteConversation(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}Conversation/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, from } from 'rxjs';


const CHAT_URL = "ws://echo.websocket.org/";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private hubConnection: HubConnection;

  constructor() { 
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:4200/chatHub')
      .withAutomaticReconnect()
      .build();
  }

  public startConnection(): Observable<void> {
    return from(this.hubConnection.start());
  }

  public sendMessage(user: string, message: string): Observable<void> {
    return from(this.hubConnection.invoke('SendMessage', user, message));
  }

  public receiveMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
        observer.next({ user: user, message: message });
      });
    });
  }
}

import { Injectable } from '@angular/core';
import { Message } from 'app/models/shared/Messages.model';
import { Subject } from 'rxjs';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection: HubConnection;
  messages: string[] = [];
  private messageSubject: Subject<Message> = new Subject<Message>();

  constructor() { }

  public startConnection = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:4200/chat')
      .build();

    this.hubConnection.start().then(() => {
      console.log('Connexion SignalR établie');
    }).catch(err => {
      console.log('Erreur de connexion SignalR : ' + err);
    });

    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      this.messageSubject.next(message);
    });
  }

  public addMessageListener = () => {
    this.hubConnection.on('ReceiveMessage', (conversationId: number, senderId: number, message: string) => {
      this.messages.push(`${senderId}: ${message}`);
    });
  }
  
  sendMessage(conversationId: number, senderId: number, message: string) {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.send('SendMessage', conversationId, senderId, message);
    } else {
      this.hubConnection.start().then(() => {
        this.hubConnection.send('SendMessage', conversationId, senderId, message);
      });
    }
  }
  


  get messageObservable(): Subject<Message> {
    return this.messageSubject;
  }
 
}

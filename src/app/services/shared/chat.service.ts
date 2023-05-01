import { Injectable } from '@angular/core';
import { Observable, Subject, from } from 'rxjs';
import * as signalR from '@aspnet/signalr';
import { Router } from '@angular/router';


export class User {
  public id: string;
  public nom: string;
  public prenom: string
  public signalrId: string
  public msgs: Array<Message>;
}

export class Message {
  constructor(
    public content: string,
    public mine: boolean
  ) {}
}



@Injectable({
  providedIn: 'root'
})
export class ChatService {

    constructor(public router: Router ){}

    hubConnection:signalR.HubConnection;
    personName: string;
    userData: User;

    ssSubj = new Subject<any>();
    ssObs(): Observable<any> {
        return this.ssSubj.asObservable();
    }

    startConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44355/chatHub', {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
      })
      .build();

      this.hubConnection
      .start()
      .then(() => {
          this.ssSubj.next({type: "HubConnStarted"});
      })
      .catch(err => console.log('Error while starting connection'));

  }

  public addAuthMeListener = () => {
    this.hubConnection.on("authMeResponseSuccess", (newUser: User) => {
      console.log(newUser);
    });
    this.hubConnection.on("authMeResponseFail", () => {
      console.log("Authentification failed");
    });
  }

  public addUserOnListener = (callback: (newUser: User) => void) => {
    this.hubConnection.on("userOn", callback);
  }

  public addUserOffListener = (callback: (userId: string) => void) => {
    this.hubConnection.on("userOff", callback);
  }

  public getOnlineUsers = (): Promise<Array<User>> => {
    return this.hubConnection.invoke("GetOnlineUsers");
  }

}

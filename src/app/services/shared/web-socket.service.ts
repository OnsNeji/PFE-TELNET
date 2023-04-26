import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket: WebSocket;

  constructor() { 
    this.socket = new WebSocket("ws://localhost:4200/ws");
    this.socket.onopen = function(event) {
      console.log("WebSocket is open now.");
    };
    this.socket.onclose = function(event) {
      console.log("WebSocket is closed now.");
    };
  }

  sendData(data) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(data);
    } else {
      console.log("La connexion WebSocket n'est pas établie");
      // La connexion WebSocket n'est pas établie
      // Traitez l'erreur ici
    }
  }
}

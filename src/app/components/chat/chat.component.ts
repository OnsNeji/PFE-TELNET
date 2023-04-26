import { Component, OnInit } from '@angular/core';
import { ChatService } from 'app/services/shared/chat.service';
import { WebSocketService } from 'app/services/shared/web-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  user: string;
  message: string;
  messages: { user: string, message: string }[] = [];

  constructor(private chatService: ChatService,
              private webSocketService: WebSocketService) { }
    
  public sendMessage(): void {
    this.chatService.sendMessage(this.user, this.message).subscribe(() => {
      this.message = '';
    });
    this.webSocketService.sendData("Hello, World!");
  }

  ngOnInit(): void {
    this.chatService.startConnection().subscribe(() => {
      console.log('Connection started');
    });

    this.chatService.receiveMessage().subscribe((message: { user: string, message: string }) => {
      this.messages.push(message);
    });
  }

}

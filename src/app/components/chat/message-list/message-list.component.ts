import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'app/models/shared/Messages.model';
import { MessageService } from 'app/services/shared/message.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {

  messages: Message[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessages();

    // appel périodique toutes les 5 secondes
    setInterval(() => {
      this.loadMessages();
    }, 5000);
  }


  loadMessages() {
    this.messageService.GetMessages().subscribe(messages => {
      this.messages = messages;
    });
  }
}

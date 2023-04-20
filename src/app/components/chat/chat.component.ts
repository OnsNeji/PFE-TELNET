import { Component, OnInit } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import { Conversation } from 'app/models/shared/Conversation.model';
import { Message } from 'app/models/shared/Messages.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { ApiService } from 'app/services/shared/api.service';
import { ConversationService } from 'app/services/shared/conversation.service';
import { MessageService } from 'app/services/shared/message.service';
import { SignalRService } from 'app/services/shared/signal-r.service';
import * as signalR from '@microsoft/signalr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  userList: Utilisateur[];
  selectedUser: Utilisateur;
  conversationList: Conversation[];
  selectedConversation: Conversation;
  messageList: Message[];
  messages: string[] = [];
  message: string; 
  conversationId: number;
  senderId: number;

  constructor(
    private userService: ApiService,
    private conversationService: ConversationService,
    private messageService: MessageService,
    private chatService: SignalRService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.chatService.startConnection();
    this.chatService.addMessageListener();
    this.conversationId = +this.route.snapshot.paramMap.get('id');
    this.senderId = +localStorage.getItem('userId');

    this.chatService.messageObservable.subscribe((message: Message) => {
      if (message.conversationId === this.conversationId) {
        this.messages.push(message.message);
      }
    });
    this.loadUserList();
    this.loadConversationList();
  }
  
  sendMessage() {
    if (this.message) {
      this.chatService.sendMessage(this.conversationId, this.senderId, this.message);
      this.message = '';
    }
  }

  loadUserList() {
    this.userService.GetUtilisateurs().subscribe(users => {
      this.userList = users;
    });
  }

  loadConversationList() {
    this.conversationService.GetConversations().subscribe(conversations => {
      this.conversationList = conversations;
    });
  }

  onUserSelect(user: Utilisateur) {
    this.selectedUser = user;
    this.selectedConversation = null;
    this.messageList = null;
  }

  onConversationSelect(conversation: Conversation) {
    this.selectedConversation = conversation;
    this.loadMessageList();
  }

  loadMessageList() {
    this.messageService.getMessagesByConversationId(this.selectedConversation.id).subscribe(messages => {
      this.messageList = messages;
    });
  }

  onSendMessage(messageText: string) {
    if (this.selectedConversation) {
      const newMessage = new Message();
      newMessage.message = messageText;
      newMessage.senderId = this.selectedUser.id;
      newMessage.conversationId = this.selectedConversation.id;
      this.messageService.AddMessage(newMessage).subscribe(() => {
        this.loadMessageList();
      });
    }
  }

}

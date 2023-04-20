import { Component, Input, OnInit } from '@angular/core';
import { Conversation } from 'app/models/shared/Conversation.model';
import { Message } from 'app/models/shared/Messages.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { ApiService } from 'app/services/shared/api.service';
import { ConversationService } from 'app/services/shared/conversation.service';
import { MessageService } from 'app/services/shared/message.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {

  selectedUser: Utilisateur;
  conversations: Conversation[];
  selectedConversation: Conversation;
  messages: Message[];

  constructor(
    private conversationService: ConversationService,
    private messageService: MessageService,
    private userService: ApiService
  ) { }

  ngOnInit(): void {
    this.getConversations();
  }

  getConversations(): void {
    this.conversationService.GetConversations()
      .subscribe(conversations => this.conversations = conversations);
  }

  onSelectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    this.messageService.getMessagesByConversationId(this.selectedConversation.id)
      .subscribe(messages => this.messages = messages);
  }

  sendMessage(messageText: string): void {
    const message: Message = {
      id: 0,
      conversationId: this.selectedConversation.id,
      senderId: this.userService.currentUser.id,
      // recipientId: this.selectedConversation.participants.find(id => id !== this.userService.currentUser.id),
      message: messageText,
      date: new Date(),
      sender: [],
      conversation: []
    };
    this.messageService.AddMessage(message)
      .subscribe(message => this.messages.push(message));
  }

}

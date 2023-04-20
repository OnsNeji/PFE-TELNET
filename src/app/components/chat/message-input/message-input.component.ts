import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent {

  @Output() sendMessage = new EventEmitter<string>();
  messageText: string = '';

  constructor() { }

  onSendClick() {
    if (this.messageText !== '') {
      this.sendMessage.emit(this.messageText);
      this.messageText = '';
    }
  }

}

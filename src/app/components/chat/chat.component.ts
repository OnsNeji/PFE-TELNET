import { Component, OnDestroy, OnInit } from '@angular/core';
import { Connection } from 'app/models/shared/Connection.model';
import { ChatService, User, Message } from 'app/services/shared/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  //vars
  //4Tutorial
  users: Array<User> = [];
  selectedUser: User;

  //5Tutorial
  msg: string;

  constructor(public chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.startConnection();
  this.getOnlineUsersInv();
  // this.getOnlineUsersLis();
  this.userOnLis();
  this.userOffLis();
    this.logOutLis();
    this.sendMsgLis();

    if (this.chatService.hubConnection) 
      this.chatService.hubConnection.on("HubConnStarted", () => {
        this.getOnlineUsersInv();
    });
    else {
      this.chatService.ssSubj.subscribe((obj: any) => {
        if (obj.type == "HubConnStarted") {
          this.getOnlineUsersInv();
        }
      });
    }
  }
  logOut(): void {
    this.chatService.hubConnection.invoke("logOut", this.chatService.userData.id)
    .catch(err => console.error(err));
  }
  logOutLis(): void {
    this.chatService.hubConnection.on("logoutResponse", () => {
      localStorage.removeItem("personId");
      location.reload();
      // this.signalrService.hubConnection.stop();
    });
  }

  // //4Tutorial
  userOnLis(): void {
    this.chatService.hubConnection.on("userOn", (newUser: User) => {
      this.users.push(newUser);
    });
  }
  
  userOffLis(): void {
    this.chatService.hubConnection.on("userOff", (utilisateurId: string) => {
      this.users = this.users.filter(u => u.id !== utilisateurId);
    });
  }

   //4Tutorial
   getOnlineUsersInv(): void {
    this.chatService.getOnlineUsers()
      .then((onlineUsers: Array<User>) => {
        this.users = [...onlineUsers];
        console.log(this.users);
      })
      .catch(err => console.error());
  }
  
  // private getOnlineUsersLis(): void {
  //   this.chatService.hubConnection.on("GetOnlineUsersResponse", (onlineUsers: Array<User>) => {
  //     this.users = [...onlineUsers];

  //   });
  // }



  //5Tutorial
  sendMsgInv(): void {
    if (this.msg?.trim() === "" || this.msg == null) return;

    this.chatService.hubConnection.invoke("sendMsg", this.selectedUser.signalrId, this.msg)
    .catch(err => console.error(err));

    if (this.selectedUser.msgs == null) this.selectedUser.msgs = [];
    this.selectedUser.msgs.push(new Message(this.msg, true));
    this.msg = "";
  }

  private sendMsgLis(): void {
    this.chatService.hubConnection.on("sendMsgResponse", (signalrId: string, msg: string) => {
      let receiver = this.users.find(u => u.signalrId === signalrId);
      if (receiver.msgs == null) receiver.msgs = [];
      receiver.msgs.push(new Message(msg, false));
    });
  }
}

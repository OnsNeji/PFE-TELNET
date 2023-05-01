import { Injectable } from '@angular/core';
import { ChatService, User } from './chat.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public signalrService: ChatService,
    public router: Router
  ) {
      //3Tutorial
      let tempPersonId = localStorage.getItem("utilisateurId");
      if (tempPersonId) {
        if (this.signalrService.hubConnection) {
          this.signalrService.hubConnection.onclose(() => {
              console.log("SignalR connection closed");
          });
          this.signalrService.hubConnection.on("HubConnStarted", () => {
              console.log("SignalR connection started");
              this.reauthMeListener();
              this.reauthMe(tempPersonId);
          });
      } else {
          this.signalrService.ssObs().subscribe((obj: any) => {
              if (obj.type == "HubConnStarted") {
                  console.log("SignalR connection started");
                  this.reauthMeListener();
                  this.reauthMe(tempPersonId);
              }
          });
      }
      }
  }

  public isAuthenticated: boolean = false;


    //2Tutorial
    async authMe(person: string, pass: string) {
      let personInfo = {userName: person, password: pass};

      await this.signalrService.hubConnection.invoke("authMe", personInfo)
      // .then(() => this.signalrService.toastr.info("Loging in attempt..."))
      .catch(err => console.error(err));
    }

        //3Tutorial
        authMeListenerSuccess() {
          this.signalrService.hubConnection.on("authMeResponseSuccess", (user: User) => {
            //4Tutorial
            console.log(user);
            this.signalrService.userData = {...user};
            localStorage.setItem("personId", user.id);
            this.isAuthenticated = true;
            this.signalrService.router.navigateByUrl("/dashboard");
          });
        }
    
        //2Tutorial
        authMeListenerFail() {
          this.signalrService.hubConnection.on("authMeResponseFail", () => {
          });
        }
    
    
        //3Tutorial
        async reauthMe(personId: string) {
          await this.signalrService.hubConnection.invoke("reauthMe", personId)
          // .then(() => this.signalrService.toastr.info("Loging in attempt..."))
          .catch(err => console.error(err));
        }

        reauthMeListener() {
          this.signalrService.hubConnection.on("reauthMeResponse", (user: User) => {
            //4Tutorial
            console.log(user);
            this.signalrService.userData = {...user}
            this.isAuthenticated = true;
            // this.signalrService.toastr.success("Re-authenticated!");
            if (this.signalrService.router.url == "/login") this.signalrService.router.navigateByUrl("/dashboard");
          });
        }

}

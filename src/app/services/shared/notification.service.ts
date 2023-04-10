import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Notification } from 'app/models/shared/Notification.model';
import { Observable } from 'rxjs';

@Injectable()
export class NotificationService {

  private baseUrl: string = "";

  constructor(private servicePNotify: NotificationsService, private http: HttpClient) { }
  public options: any = {
    position: ['bottom', 'right'],
  };

  public info(mssg: any) {
    this.addNotify(mssg, NotificationType.Info, 'Info');
  }

  public success(mssg: any) {
    this.addNotify(mssg, NotificationType.Success, 'Success');
  }

  public warning(mssg: any) {
    this.addNotify(mssg, NotificationType.Warn, 'Warning');
  }

  public danger(mssg: any) {
    this.addNotify(mssg, NotificationType.Error, 'Error');
  }

  addNotify(mssg: any, type, title) {
    this.servicePNotify.remove();
    this.options = {
      position: ['bottom', 'right'],
      maxStack: 8,
      timeOut: 15000,
      showProgressBar: false,
      pauseOnHover: true,
      lastOnBottom: true,
      clickToClose: true,
      preventDuplicates: false,
      preventLastDuplicates: false,
      animate: 'fromRight'
    };
    this.servicePNotify.create(title, mssg, type, this.options);
  }

  GetNotifications():Observable<Notification[]>{
    return this.http.get<Notification[]>(`${this.baseUrl}Notification`);
  }

  GetTodayNotificationsCount():Observable<number[]>{
    return this.http.get<number[]>(`${this.baseUrl}Notification/todayCount`);
  }
}

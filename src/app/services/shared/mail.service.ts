import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CoreDataService } from './core-data.service';
import { DateTimeService } from './date-time.service';
import { User, MessageParameter, Message, Activities } from 'app/models/shared';
import { WorkFromHomeRequest, WorkHomeRequestStatus } from 'app/models/human-resources/work-from-home';
import { WorkFromHomeService } from '../human-resources/work-from-home';

@Injectable()
export class MailService {

    private headers: HttpHeaders;
    constructor(
        private httpClient: HttpClient,
        private coreDataService: CoreDataService,
        private dateTimeService: DateTimeService,
        private workFromHomeService: WorkFromHomeService
    ) {
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    }

    send(message: Message) {
        return this.httpClient.post('/Mail/Send', JSON.stringify(message), { headers: this.headers, responseType: 'text' });
    }

    workFromHomeRequestDeleted(workFromHomeRequest: WorkFromHomeRequest) {
        const currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
        let workFromHomeLink = window.location.href;
        if (workFromHomeLink.indexOf(';') > -1) {
            workFromHomeLink = workFromHomeLink.slice(0, workFromHomeLink.indexOf(';') + 1);
        }
        this.workFromHomeService.getUser(workFromHomeRequest.userId).subscribe(
            workFromHomeUser => {
                const workFromHomeResource = Object.assign(new User, workFromHomeUser[0]);
                this.workFromHomeService.getReportingsTo(workFromHomeRequest.userId).subscribe(
                    reportingsTo => {
                        const reportingsToUsers = [];
                        reportingsTo.forEach(user => {
                            reportingsToUsers.push(Object.assign(new User(), user));
                        });
                        const message: Message = new Message();
                        message.subject = 'Work From Home Request Deleted';
                        message.from = currentUser.email;
                        message.to = workFromHomeResource.email + ',' + reportingsToUsers.map(user => user.email).join(',') + ',' + 'GroupHumanResources';
                        message.to = workFromHomeRequest.state === WorkHomeRequestStatus.Approved ?
                            message.to + ',' + 'GroupSupport' : message.to;
                        message.cc = currentUser.email;
                        message.body = 'HumanResources.WorkFromHomeRequestDeleted';
                        message.messageParameters = new Array<MessageParameter>();
                        message.messageParameters.push(new MessageParameter('UserName', currentUser.prenom));
                        message.messageParameters.push(new MessageParameter('UserFullName', workFromHomeRequest.userFullName));
                        message.messageParameters.push(new MessageParameter('StartDate',
                            this.dateTimeService.getShortFormat(workFromHomeRequest.startDate)));
                        message.messageParameters.push(new MessageParameter('EndDate',
                            this.dateTimeService.getShortFormat(workFromHomeRequest.endDate)));
                        message.messageParameters.push(new MessageParameter('DayNumber', workFromHomeRequest.dayNumber.toString()));
                        message.messageParameters.push(new MessageParameter('HalfDay', workFromHomeRequest.halfDay));
                        message.messageParameters.push(new MessageParameter('WorkFromHomeLink', workFromHomeLink));
                        this.send(message).subscribe();
                    });
            });
    }

    workFromHomeRequestRejected(workFromHomeRequest: WorkFromHomeRequest) {
        const currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
        let workFromHomeLink = window.location.href;
        if (workFromHomeLink.indexOf(';') > -1) {
            workFromHomeLink = workFromHomeLink.slice(0, workFromHomeLink.indexOf(';') + 1);
        }
        this.workFromHomeService.getUser(workFromHomeRequest.userId).subscribe(
            workFromHomeUser => {
                const workFromHomeResource = Object.assign(new User, workFromHomeUser[0]);
                this.workFromHomeService.getReportingsTo(workFromHomeRequest.userId).subscribe(
                    reportingsTo => {
                        const reportingsToUsers = [];
                        reportingsTo.forEach(user => {
                            reportingsToUsers.push(Object.assign(new User(), user));
                        });
                        const message: Message = new Message();
                        message.subject = 'Work From Home Request Rejected';
                        message.from = currentUser.email;
                        message.to = workFromHomeResource.email + ',' + reportingsToUsers.map(user => user.email).join(',') + ',' + 'GroupHumanResources';
                        message.to = workFromHomeRequest.state !== WorkHomeRequestStatus.InProgress ?
                            message.to + ',' + 'GroupSupport' : message.to;
                        message.cc = currentUser.email;
                        message.body = 'HumanResources.WorkFromHomeRequestRejected';
                        message.messageParameters = new Array<MessageParameter>();
                        message.messageParameters.push(new MessageParameter('UserName', currentUser.prenom));
                        message.messageParameters.push(new MessageParameter('UserFullName', workFromHomeRequest.userFullName));
                        message.messageParameters.push(new MessageParameter('StartDate',
                            this.dateTimeService.getShortFormat(workFromHomeRequest.startDate)));
                        message.messageParameters.push(new MessageParameter('EndDate',
                            this.dateTimeService.getShortFormat(workFromHomeRequest.endDate)));
                        message.messageParameters.push(new MessageParameter('DayNumber', workFromHomeRequest.dayNumber.toString()));
                        message.messageParameters.push(new MessageParameter('HalfDay', workFromHomeRequest.halfDay));
                        message.messageParameters.push(new MessageParameter('WorkFromHomeLink', workFromHomeLink));
                        this.send(message).subscribe();
                    });
            });
    }

    workFromHomeRequestApproved(workFromHomeRequest: WorkFromHomeRequest) {
        const currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
        let workFromHomeLink = window.location.href;
        if (workFromHomeLink.indexOf(';') > -1) {
            workFromHomeLink = workFromHomeLink.slice(0, workFromHomeLink.indexOf(';') + 1);
        }
        this.workFromHomeService.getUser(workFromHomeRequest.userId).subscribe(
            workFromHomeUser => {
                const workFromHomeResource = Object.assign(new User, workFromHomeUser[0]);
                this.workFromHomeService.getReportingsTo(workFromHomeRequest.userId).subscribe(
                    reportingsTo => {
                        const reportingsToUsers = [];
                        reportingsTo.forEach(user => {
                            reportingsToUsers.push(Object.assign(new User(), user));
                        });
                        const message: Message = new Message();
                        message.subject = 'Work From Home Request Approved';
                        message.from = currentUser.email;
                        message.to = workFromHomeResource.email + ',' + reportingsToUsers.map(user => user.email).join(',') + ',' + 'GroupSupport' + ',' + 'GroupHumanResources';
                        message.cc = currentUser.email;
                        message.body = 'HumanResources.WorkFromHomeRequestApproved';
                        message.messageParameters = new Array<MessageParameter>();
                        message.messageParameters.push(new MessageParameter('UserName', currentUser.prenom));
                        message.messageParameters.push(new MessageParameter('UserFullName', workFromHomeRequest.userFullName));
                        message.messageParameters.push(new MessageParameter('StartDate',
                            this.dateTimeService.getShortFormat(workFromHomeRequest.startDate)));
                        message.messageParameters.push(new MessageParameter('EndDate',
                            this.dateTimeService.getShortFormat(workFromHomeRequest.endDate)));
                        message.messageParameters.push(new MessageParameter('DayNumber', workFromHomeRequest.dayNumber.toString()));
                        message.messageParameters.push(new MessageParameter('HalfDay', workFromHomeRequest.halfDay));
                        message.messageParameters.push(new MessageParameter('WorkFromHomeLink', workFromHomeLink));
                        this.send(message).subscribe();
                    });
            });
    }

    workFromHomeRequestModified(workFromHomeRequest: WorkFromHomeRequest, initialWorkFromHomeRequest: WorkFromHomeRequest) {
        const currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
        let workFromHomeLink = window.location.href;
        if (workFromHomeLink.indexOf(';') > -1) {
            workFromHomeLink = workFromHomeLink.slice(0, workFromHomeLink.indexOf(';') + 1);
        }
        this.workFromHomeService.getUser(workFromHomeRequest.userId).subscribe(
            workFromHomeUser => {
                const workFromHomeResource = Object.assign(new User, workFromHomeUser[0]);
                this.workFromHomeService.getReportingsTo(workFromHomeRequest.userId).subscribe(
                    reportingsTo => {
                        const reportingsToUsers = [];
                        reportingsTo.forEach(user => {
                            reportingsToUsers.push(Object.assign(new User(), user));
                        });
                        const message: Message = new Message();
                        message.subject = 'Work From Home Request Modified';
                        message.from = currentUser.email;
                        message.to = workFromHomeResource.email + ',' + reportingsToUsers.map(user => user.email).join(',') + ',' + 'GroupHumanResources';
                        message.body = 'HumanResources.WorkFromHomeRequestModified';
                        message.messageParameters = new Array<MessageParameter>();
                        message.messageParameters.push(new MessageParameter('UserName', currentUser.prenom));
                        message.messageParameters.push(new MessageParameter('UserFullName', workFromHomeRequest.userFullName));
                        message.messageParameters.push(new MessageParameter('InitialStartDate',
                            this.dateTimeService.getShortFormat(initialWorkFromHomeRequest.startDate)));
                        message.messageParameters.push(new MessageParameter('NewStartDate',
                            this.dateTimeService.getShortFormat(workFromHomeRequest.startDate)));
                        message.messageParameters.push(new MessageParameter('InitialEndDate',
                            this.dateTimeService.getShortFormat(initialWorkFromHomeRequest.endDate)));
                        message.messageParameters.push(new MessageParameter('NewEndDate',
                            this.dateTimeService.getShortFormat(workFromHomeRequest.endDate)));
                        message.messageParameters.push(new MessageParameter('InitialDayNumber',
                            initialWorkFromHomeRequest.dayNumber.toString()));
                        message.messageParameters.push(new MessageParameter('NewDayNumber', workFromHomeRequest.dayNumber.toString()));
                        message.messageParameters.push(new MessageParameter('InitialHalfDay', initialWorkFromHomeRequest.halfDay));
                        message.messageParameters.push(new MessageParameter('NewHalfDay', workFromHomeRequest.halfDay));
                        message.messageParameters.push(new MessageParameter('WorkFromHomeLink', workFromHomeLink));
                        this.send(message).subscribe();
                    });
            });
    }

    workFromHomeRequestAdded(workFromHomeRequest: WorkFromHomeRequest) {
        const currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
        this.workFromHomeService.getUser(workFromHomeRequest.userId).subscribe(
            workFromHomeUser => {
                const workFromHomeResource = Object.assign(new User, workFromHomeUser[0]);
                let workFromHomeLink = window.location.href;
                if (workFromHomeLink.indexOf(';') > -1) {
                    workFromHomeLink = workFromHomeLink.slice(0, workFromHomeLink.indexOf(';') + 1);
                }
                this.workFromHomeService.getReportingsTo(workFromHomeRequest.userId).subscribe(
                    reportingsTo => {
                        const reportingsToUsers = [];
                        reportingsTo.forEach(user => {
                            reportingsToUsers.push(Object.assign(new User(), user));
                        });
                        const message: Message = new Message();
                        message.subject = 'Work From Home Request Added';
                        message.from = currentUser.email;
                        message.to = workFromHomeResource.email + ',' + reportingsToUsers.map(user => user.email).join(',') + ',' + 'GroupHumanResources';
                        message.body = 'HumanResources.WorkFromHomeRequestAdded';
                        message.messageParameters = new Array<MessageParameter>();
                        message.messageParameters.push(new MessageParameter('UserName', currentUser.prenom));
                        message.messageParameters.push(new MessageParameter('UserFullName', workFromHomeRequest.userFullName));
                        message.messageParameters.push(new MessageParameter('StartDate',
                            this.dateTimeService.getShortFormat(workFromHomeRequest.startDate)));
                        message.messageParameters.push(new MessageParameter('EndDate',
                            this.dateTimeService.getShortFormat(workFromHomeRequest.endDate)));
                        message.messageParameters.push(new MessageParameter('DayNumber', workFromHomeRequest.dayNumber.toString()));
                        message.messageParameters.push(new MessageParameter('HalfDay', workFromHomeRequest.halfDay));
                        message.messageParameters.push(new MessageParameter('WorkFromHomeLink', workFromHomeLink));
                        this.send(message).subscribe();
                    });
            });
    }
}


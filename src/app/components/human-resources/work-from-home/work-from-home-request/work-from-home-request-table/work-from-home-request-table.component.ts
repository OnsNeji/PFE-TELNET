
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs/index';
import { DateTimeService, MailService, NotificationService, SearchFilterService } from 'app/services/shared';
import { WorkFromHomeRequest, WorkHomeRequestStatus, WorkHomeRequestStatusLabel } from 'app/models/human-resources/work-from-home';
import { Groups, User } from 'app/models/shared';
import swal from 'sweetalert2';
import { WorkFromHomeService } from 'app/services/human-resources/work-from-home';
import { EditWorkFromHomeRequestComponent } from '../edit-work-from-home-request/edit-work-from-home-request.component';


@Component({
  selector: 'app-work-from-home-request-table',
  templateUrl: './work-from-home-request-table.component.html',
  styleUrls: ['./work-from-home-request-table.component.scss']
})
export class WorkFromHomeRequestTableComponent implements OnInit, OnDestroy {

  @Input() workFromHomeRequests: WorkFromHomeRequest[];
  displayedColumns = ['userNumber', 'userFullName', 'activityName', 'startDate', 'endDate', 'dayNumber',
    'halfDay', 'state', 'buttons'];
  dataSource = new MatTableDataSource();
  currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
  forbiddenRejectValidate = true;
  listView = false;
  selectedWorkHomeRequestId: number;
  subscription: Subscription;
  displayAddRequestComponentdialogRef: MatDialogRef<EditWorkFromHomeRequestComponent>;

  constructor(private notificationService: NotificationService,
    public dialog: MatDialog,
    private searchFilterService: SearchFilterService,
    private workFromHomeService: WorkFromHomeService,
    private mailService: MailService,
    private dateTimeService: DateTimeService) { }

  ngOnInit() {
    // this.forbiddenRejectValidate = this.currentUser.groupId !== Groups.SuperAdmin && !this.currentUser.hasSubordinates;
    if (this.workFromHomeRequests.length !== 0) {
      this.listView = true;
    }
    this.selectedWorkHomeRequestId = 0;
    this.dataSource = new MatTableDataSource(this.workFromHomeRequests);
    this.subscription = this.searchFilterService.resultChanged
      .subscribe(
        () => {
          this.dataSource = new MatTableDataSource(this.searchFilterService.showingDataLastFilter);
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSortData(sort) {
    this.workFromHomeService.sortWorkFromHomeRequest.next(sort);
  }

  isMyWorkFromHomeRequestApprovedAndRejected(workFromHomeRequest) {
    return workFromHomeRequest.userId === this.currentUser.id &&
      (workFromHomeRequest.state === WorkHomeRequestStatus.Approved || workFromHomeRequest.state === WorkHomeRequestStatus.Rejected);
  }

  isApproved(workFromHomeRequest) {
    return workFromHomeRequest.state === WorkHomeRequestStatus.Approved;
  }

  isRejected(workFromHomeRequest) {
    return workFromHomeRequest.state === WorkHomeRequestStatus.Rejected;
  }

  isInProgress(workFromHomeRequest) {
    return workFromHomeRequest.state === WorkHomeRequestStatus.InProgress;
  }

  isMyWorkFromHomeRequestInProgress(workFromHomeRequest) {
    return workFromHomeRequest.userId === this.currentUser.id &&
      (workFromHomeRequest.state === WorkHomeRequestStatus.InProgress);
  }

  getworkFromHomeLabel(state) {
    switch (state) {
      case WorkHomeRequestStatus.InProgress:
        return WorkHomeRequestStatusLabel.InProgress;
      case WorkHomeRequestStatus.Approved:
        return WorkHomeRequestStatusLabel.Approved;
      case WorkHomeRequestStatus.Rejected:
        return WorkHomeRequestStatusLabel.Rejected;
      default:
        return '';
    }
  }

  openEditRequestDialog(workFromHomeRequest: WorkFromHomeRequest) {
    const config: MatDialogConfig = {
      disableClose: false,
      hasBackdrop: true,
      width: '500px',
      height: '350px',
      data: {
        workFromHomeRequestId: workFromHomeRequest.workHomeRequestId,
        isEdit: true,
      }
    };
    this.displayAddRequestComponentdialogRef = this.dialog.open(EditWorkFromHomeRequestComponent, config);
  }

  deleteWorkFromHomeRequest(workFromHomeRequest: WorkFromHomeRequest) {
    swal.fire({
      text: `Are you sure to delete this Work From Home ${this.getworkFromHomeLabel(workFromHomeRequest.state)} Request for ${workFromHomeRequest.userFullName} from ${this.dateTimeService.getShortFormat(workFromHomeRequest.startDate)} to ${this.dateTimeService.getShortFormat(workFromHomeRequest.endDate)} ?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.workFromHomeService.deleteWorkFromHomeRequest(workFromHomeRequest.workHomeRequestId, this.currentUser.id)
          .subscribe(
            data => {
              if (data !== 0) {
                this.notificationService.success('This Work From Home Request is deleted');
                this.workFromHomeService.refreshWorkFomHomeRequest.next();
                if (workFromHomeRequest.state === WorkHomeRequestStatus.Approved) {
                  this.mailService.workFromHomeRequestDeleted(workFromHomeRequest);
                }
              } else {
                this.workFromHomeService.refreshWorkFomHomeRequest.next();
                this.notificationService.danger('Delete Work From Home Request failed');
              }
            },
            () => {
              this.notificationService.danger('Delete Work From Home Request failed');
              this.workFromHomeService.refreshWorkFomHomeRequest.next();
            }
          );
      }
    });
  }
  rejectWorkFromHomeRequest(workFromHomeRequest: WorkFromHomeRequest) {
    swal.fire({
      text: `Are you sure to reject this Work From Home ${this.getworkFromHomeLabel(workFromHomeRequest.state)} Request for ${workFromHomeRequest.userFullName} from ${this.dateTimeService.getShortFormat(workFromHomeRequest.startDate)} to ${this.dateTimeService.getShortFormat(workFromHomeRequest.endDate)} ?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'No',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.workFromHomeService.updateStatusWorkFromHomeRequest(workFromHomeRequest, WorkHomeRequestStatus.Rejected)
          .subscribe(
            data => {
              if (data !== 0) {
                this.notificationService.success('This Work From Home Request is rejected');
                this.workFromHomeService.refreshWorkFomHomeRequest.next();
                this.mailService.workFromHomeRequestRejected(workFromHomeRequest);
              } else {
                this.workFromHomeService.refreshWorkFomHomeRequest.next();
                this.notificationService.danger('Reject Work From Home Request failed');
                this.workFromHomeService.refreshWorkFomHomeRequest.next();
              }
            },
            () => {
              this.notificationService.danger('Reject Work From Home Request failed');
              this.workFromHomeService.refreshWorkFomHomeRequest.next();
            }
          );
      }
    });
  }

  approveWorkFromHomeRequest(workFromHomeRequest: WorkFromHomeRequest) {
    this.workFromHomeService.updateStatusWorkFromHomeRequest(workFromHomeRequest, WorkHomeRequestStatus.Approved)
      .subscribe(
        data => {
          if (data !== 0) {
            this.notificationService.success('This Work From Home Request is approved');
            this.workFromHomeService.refreshWorkFomHomeRequest.next();
            this.mailService.workFromHomeRequestApproved(workFromHomeRequest);
          } else {
            this.workFromHomeService.refreshWorkFomHomeRequest.next();
            this.notificationService.danger('Approve Work From Home Request failed');
            this.workFromHomeService.refreshWorkFomHomeRequest.next();
          }
        },
        () => {
          this.notificationService.danger('Approve Work From Home Request failed');
          this.workFromHomeService.refreshWorkFomHomeRequest.next();
        }
      );
  }
}






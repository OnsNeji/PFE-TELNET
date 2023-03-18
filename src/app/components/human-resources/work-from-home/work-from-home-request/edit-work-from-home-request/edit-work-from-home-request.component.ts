import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WorkFromHomeRequest, HalfDay } from 'app/models/human-resources/work-from-home';
import { Groups, Identifier, User } from 'app/models/shared';
import { WorkFromHomeService } from 'app/services/human-resources/work-from-home';
import { FormControl, NgForm } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/operators';
import { DateTimeService, MailService, NotificationService } from 'app/services/shared';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-edit-work-from-home-request',
  templateUrl: './edit-work-from-home-request.component.html',
  styleUrls: ['./edit-work-from-home-request.component.scss']
})
export class EditWorkFromHomeRequestComponent implements OnInit {

  initialWorkFromHomeRequest: WorkFromHomeRequest = new WorkFromHomeRequest();
  currentUser: User = JSON.parse(localStorage.getItem('currentUser'));

  @ViewChild('workFromHomeRequestForm', { static: true }) workFromHomeRequestForm: NgForm;
  public resourceFilterCtrl: FormControl = new FormControl();
  public filteredResources: ReplaySubject<Identifier[]> = new ReplaySubject<Identifier[]>(1);
  workFromHomeRequest: WorkFromHomeRequest;
  public isHalfDayChecked: boolean;
  halefDayItems = Object.values(HalfDay).map(key => HalfDay[key]);
  selectedHalefDayItem: HalfDay = this.halefDayItems[0];
  resourcesIdentifiers: Identifier[];
  dateTimeService: DateTimeService;
  modelTitel: string;
  errorMessage: string;
  forbiddenResources = true;
  private _onDestroy = new Subject<void>();
  isEdit = false;
  workFromHomeRequestId: number;
  constructor(
    private workFromHomeService: WorkFromHomeService,
    private notificationService: NotificationService,
    private mailService: MailService,
    public datepipe: DatePipe,
    private dialogRef: MatDialogRef<EditWorkFromHomeRequestComponent>,
    @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.workFromHomeRequestId = this.data.workFromHomeRequestId;

    // if (this.isSuperAdmin()) {
    //   this.getResources();
    // } else {
    //   this.getReporters();
    // }
    this.resourceFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterIdentifiers(this.resourcesIdentifiers, this.filteredResources, this.resourceFilterCtrl);
      });

    // this.forbiddenResources = this.currentUser.groupId !== Groups.SuperAdmin && !this.currentUser.hasSubordinates;

    if (this.data) {
      this.workFromHomeRequest = new WorkFromHomeRequest();
      this.isEdit = this.data.isEdit;
      if (this.isEdit) {
        this.modelTitel = 'Edit Work From Home Request';
        this.getWorkFromHomeRequestInProgress();
      } else {
        this.modelTitel = 'Add Work From Home Request';
        this.workFromHomeRequest.userId = this.currentUser.id;
      }
    }
  }
  getWorkFromHomeRequestInProgress() {
    if (this.workFromHomeRequestId) {
      this.workFromHomeService.getWorkHomeRequestInProgress(this.workFromHomeRequestId)
        .subscribe(
          data => {
            if (data.length !== 0) {
              this.workFromHomeRequest = Object.assign(new WorkFromHomeRequest, data[0]);
              this.workFromHomeRequest.startDate = new Date(this.workFromHomeRequest.startDate);
              this.workFromHomeRequest.endDate = new Date(this.workFromHomeRequest.endDate);
              this.initialWorkFromHomeRequest = Object.assign(new WorkFromHomeRequest, data[0]);
              this.initialWorkFromHomeRequest.startDate = new Date(this.initialWorkFromHomeRequest.startDate);
              this.initialWorkFromHomeRequest.endDate = new Date(this.initialWorkFromHomeRequest.endDate);
              if (this.workFromHomeRequest.halfDay !== null) {
                this.isHalfDayChecked = true;
              }
            } else {
              this.close();
              this.workFromHomeService.refreshWorkFomHomeRequest.next();
              this.notificationService.danger('This Work From Home Request does not yet exist or not in progress');
            }
          }
        );
    }

  }
  OnChangeHalfDay() {
    if (!this.isHalfDayChecked) {
      this.workFromHomeRequest.halfDay = null;
    } else {
      this.workFromHomeRequest.endDate = this.workFromHomeRequest.startDate;
    }
  }
  getResources() {
    this.workFromHomeService.getResources()
      .subscribe(
        resources => {
          if (resources != null) {
            this.resourcesIdentifiers = resources;
            this.filteredResources.next(this.resourcesIdentifiers.slice());
          }
        }
      );
  }
  getReporters() {
    const userId = this.currentUser.id;
    this.workFromHomeService.getReporters(userId)
      .subscribe(
        reporters => {
          if (reporters != null) {
            this.resourcesIdentifiers = reporters;
            this.filteredResources.next(this.resourcesIdentifiers.slice());
          }
        }
      );
  }

  // isSuperAdmin(): boolean {
  //   return this.currentUser.groupId === Groups.SuperAdmin;
  // }
  private filterIdentifiers(Identifiers: Identifier[], filtredIdentifier: ReplaySubject<Identifier[]>, IdentifierFormCtrl:
    FormControl) {
    if (!Identifiers) {
      return;
    }
    let search = IdentifierFormCtrl.value;
    if (!search) {
      filtredIdentifier.next(Identifiers.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    filtredIdentifier.next(
      Identifiers.filter(identifier => identifier.description.toLowerCase().indexOf(search) > -1)
    );
  }

  close() {
    this.dialogRef.close();
  }

  cancel() {
    this.close();
  }

  dateOnly(event): boolean {
    return this.dateTimeService.dateOnly(event);
  }

  onChangingDate() {
    if (this.isHalfDayChecked) {
      this.workFromHomeRequest.endDate = this.workFromHomeRequest.startDate;
    } else {
      if (!this.workFromHomeRequest.endDate || this.workFromHomeRequest.startDate > this.workFromHomeRequest.endDate) {
        this.workFromHomeRequest.endDate = this.workFromHomeRequest.startDate;
      }
    }
  }
  formControl() {
    this.errorMessage = '';
    let isValid = true;
    if (this.workFromHomeRequest.startDate > this.workFromHomeRequest.endDate) {
      this.errorMessage = 'End Date must be greater than Start Date.';
      isValid = false;
    }
    if (this.isHalfDayChecked && (this.workFromHomeRequest.halfDay === '' || this.workFromHomeRequest.halfDay === null)) {
      this.errorMessage = 'Day Time is required';
      isValid = false;
    }
    return isValid;
  }

  save() {
    if (this.workFromHomeRequestForm.valid) {
      if (this.formControl()) {

        this.prepareWorkFromHomeRequest(this.workFromHomeRequest);
        this.workFromHomeService.IsDateExistOrInProgressWorkHome(this.workFromHomeRequest.workHomeRequestId
          , this.workFromHomeRequest.userId, this.workFromHomeRequest.startDate, this.workFromHomeRequest.endDate).subscribe(
            data => {
              switch (data) {
                case 0: {
                  this.workFromHomeService.insertOrUpdateWorkFromHomeRequest(this.workFromHomeRequest).subscribe(
                    () => {
                      this.notifications();
                      this.close();
                      this.workFromHomeService.refreshWorkFomHomeRequest.next();
                    }
                  );
                  break;
                }
                case 1: {
                  this.close();
                  this.workFromHomeService.refreshWorkFomHomeRequest.next();
                  this.notificationService.danger('This Work From Home Request does not yet exist or not in progress');
                  break;
                }
                case 2: {
                  this.notificationService.danger('This person has a work from home request at this date.');
                  break;
                }
              }
            }
          );

      } else {
        this.notificationService.danger(this.errorMessage);
      }
    } else {
      this.notificationService.danger('Please fill all required fields');
    }
  }
  notifications() {
    if (this.isEdit) {
      const workFromHomeRequestModification = this.checkModification(this.initialWorkFromHomeRequest
        , this.workFromHomeRequest);
      if (workFromHomeRequestModification) {
        this.notificationService.success('This Work From Home Request is modified successfully');
        this.mailService.workFromHomeRequestModified(this.workFromHomeRequest,
          this.initialWorkFromHomeRequest);
      }
    } else {
      this.notificationService.success('This Work From Home Request is added successfully');
      this.mailService.workFromHomeRequestAdded(this.workFromHomeRequest);
    }

  }
  prepareWorkFromHomeRequest(workFromHomeRequest: WorkFromHomeRequest) {
    if (workFromHomeRequest.workHomeRequestId === 0) {
      workFromHomeRequest.state = 1;
    }
    workFromHomeRequest.motive = '';
    workFromHomeRequest.userFullName = this.resourcesIdentifiers.find(resource =>
      resource.id === workFromHomeRequest.userId).description;
    workFromHomeRequest.dayNumber = this.calculateBetweenDates();
  }

  calculateBetweenDates() {
    let dayNumber = 0;
    if (this.isHalfDayChecked) {
      dayNumber = 0.5;
    } else {
      const date1 = new Date(this.workFromHomeRequest.startDate);
      const date2 = new Date(this.workFromHomeRequest.endDate);
      const Difference_In_Time = date2.getTime() - date1.getTime();
      dayNumber = Difference_In_Time / (1000 * 3600 * 24) + 1;
    }
    console.log(dayNumber);
    return dayNumber;
  }

  checkModification(oldWorkFromHomeRequest: WorkFromHomeRequest, newWorkFromHomeRequest: WorkFromHomeRequest): boolean {
    let modification = false;
    if ((oldWorkFromHomeRequest.startDate !== newWorkFromHomeRequest.startDate)
      || (oldWorkFromHomeRequest.endDate !== newWorkFromHomeRequest.endDate)
      || (oldWorkFromHomeRequest.halfDay !== newWorkFromHomeRequest.halfDay)
      || (oldWorkFromHomeRequest.dayNumber !== newWorkFromHomeRequest.dayNumber)) {
      modification = true;
    }
    return modification;
  }

}

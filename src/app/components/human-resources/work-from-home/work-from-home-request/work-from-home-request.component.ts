import { Component, OnInit, ViewEncapsulation, OnDestroy, Injector } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs/index';
import { Groups, Identifier, User } from 'app/models/shared';
import { DateTimeService, ExcelService, NotificationService, SearchFilterService, SortService } from 'app/services/shared';
import { PaginatorPipe } from 'app/pipes/shared';
import { WorkFromHomeRequest, WorkFromHomeSearch, WorkHomeRequestStatus, WorkHomeRequestStatusLabel } from 'app/models/human-resources/work-from-home';
import { WorkFromHomeService } from 'app/services/human-resources/work-from-home';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { EditWorkFromHomeRequestComponent } from './edit-work-from-home-request/edit-work-from-home-request.component';
import * as moment from 'moment';

@Component({
  selector: 'app-work-from-home',
  templateUrl: './work-from-home-request.component.html',
  styleUrls: ['./work-from-home-request.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkFromHomeRequestComponent implements OnInit, OnDestroy {
  currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
  paginatorPipe: PaginatorPipe;
  dropdownSettings = {};
  dropdownSettingsStatus = {};
  resourceName: string;
  activitiesIdentifiers: Identifier[] = [];
  selectedActivitiesIds: string;
  selectedActivitiesIdentifiers: Identifier[] = [];
  statusIdentifiers: Identifier[] = [];
  selectedStatusesIdentifiers: Identifier[] = [];
  selectedStatusesIds: string;

  fromDate: Date;
  toDate: Date;
  workFromHomeRequests: WorkFromHomeRequest[] = [];
  lengthWorkFromHomeRequests: number;
  listView: boolean;
  emptyResult: boolean;
  isLoading = false;

  subscription: Subscription;
  refreshSubscription: Subscription;
  destroyed = new Subject();
  forbiddenActivityResource = true;
  onlyMySubordinates = true;

  dialog: MatDialog;
  displayAddRequestComponentdialogRef: MatDialogRef<EditWorkFromHomeRequestComponent>;
  workFromHomeService: WorkFromHomeService;
  searchFilterService: SearchFilterService;
  sortService: SortService;
  notificationService: NotificationService;
  dateTimeService: DateTimeService;
  excelService: ExcelService;
  router: Router;

  constructor(injector: Injector) {
    this.workFromHomeService = injector.get<WorkFromHomeService>(WorkFromHomeService);
    this.searchFilterService = injector.get<SearchFilterService>(SearchFilterService);
    this.sortService = injector.get<SortService>(SortService);
    this.dateTimeService = injector.get<DateTimeService>(DateTimeService);
    this.excelService = injector.get<ExcelService>(ExcelService);
    this.router = injector.get<Router>(Router);
    this.paginatorPipe = new PaginatorPipe(this.searchFilterService);
    this.dialog = injector.get<MatDialog>(MatDialog);
  }

  ngOnInit() {
    this.listView = false;
    this.emptyResult = false;
    this.searchFilterService.pageIndex = 0;
    this.searchFilterService.pageSize = 24;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'description',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
      maxHeight: 150,
      placeholder: 'criteria',
      searchPlaceholderText: 'Search...'
    };
    this.dropdownSettingsStatus = {
      singleSelection: false,
      idField: 'id',
      textField: 'description',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: false,
      maxHeight: 150,
      placeholder: 'criteria',
      searchPlaceholderText: 'Search...'
    };
    // this.forbiddenActivityResource = this.currentUser.groupId !== Groups.SuperAdmin && !this.currentUser.hasSubordinates;
    // if (this.isSuperAdmin() && this.currentUser.hasSubordinates === false) {
    //   this.onlyMySubordinates = false;
    // }
    this.getActivities();
    this.getStatus();
    this.getPersistedFilter();
    this.subscription = this.workFromHomeService.sortWorkFromHomeRequest.subscribe(
      (event) => {
        this.onSortData(event);
      }
    );
    this.refreshSubscription = this.workFromHomeService.refreshWorkFomHomeRequest.subscribe(
      () => {
        this.getPersistedFilter();
        this.getWorkFromHomeRequests();
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getActivities() {
    this.workFromHomeService.getActivities()
      .subscribe(
        data => {
          if (data != null) {
            this.activitiesIdentifiers = data;
          }
        },
      );
  }
  getStatus() {
    this.workFromHomeService.getStatus()
      .subscribe(
        data => {
          if (data != null) {
            this.statusIdentifiers = data;
          }
        },
      );
  }

  filterWorkFromHomeRequest() {
    this.searchFilterService.pageIndex = 0;
    this.persistFilter();
    this.getWorkFromHomeRequests();
  }

  onResetAllFilters() {
    sessionStorage.removeItem('workFromHomeSearch');
    const date = new Date();
    this.fromDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    this.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.resourceName = '';
    this.selectedStatusesIdentifiers = [];
    this.selectedActivitiesIdentifiers = [];
  }

  dateOnly(event): boolean {
    return this.dateTimeService.dateOnly(event);
  }

  onSortData(sort: MatSort) {
    if (sort.active && sort.direction !== '') {
      if (this.workFromHomeRequests !== undefined) {
        this.workFromHomeRequests.sort((a: WorkFromHomeRequest, b: WorkFromHomeRequest) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'userNumber':
              return this.sortService.compare(a.userNumber, b.userNumber, isAsc, false);
            case 'userFullName':
              return this.sortService.compare(a.userFullName, b.userFullName, isAsc, false);
            case 'activityName':
              return this.sortService.compare(a.activityName, b.activityName, isAsc, false);
            case 'startDate':
              return this.sortService.compare(a.startDate, b.startDate, isAsc, false);
            case 'endDate':
              return this.sortService.compare(a.endDate, b.endDate, isAsc, false);
            case 'state':
              return this.sortService.compare(a.state, b.state, isAsc, false);
            case 'halfDay':
              return this.sortService.compare(a.halfDay, b.halfDay, isAsc, false);
            default:
              return 0;
          }
        });
      }
    }
    this.paginatorPipe.transform(this.workFromHomeRequests, this.searchFilterService.pageIndex, this.searchFilterService.pageSize);
  }

  // isSuperAdmin(): boolean {
  //   return this.currentUser.groupId === Groups.SuperAdmin;
  // }

  openEditRequestDialog() {
    const config: MatDialogConfig = {
      disableClose: false,
      hasBackdrop: true,
      width: '500px',
      height: '350px',
      data: {
        isEdit: false,
      }
    };
    this.displayAddRequestComponentdialogRef = this.dialog.open(EditWorkFromHomeRequestComponent, config);
  }

  onClickingEnter(event) {
    if (event.key === 'Enter') {
      this.filterWorkFromHomeRequest();
    }
  }

  persistFilter() {
    const workFromHomeSearch = new WorkFromHomeSearch();
    workFromHomeSearch.periodFrom = this.fromDate;
    workFromHomeSearch.periodTo = this.toDate;
    workFromHomeSearch.mines = this.onlyMySubordinates;
    workFromHomeSearch.resourceName = this.resourceName;
    workFromHomeSearch.selectedStatusesIdentifiers = this.selectedStatusesIdentifiers;
    workFromHomeSearch.selectedActivitiesIdentifiers = this.selectedActivitiesIdentifiers;
    sessionStorage.setItem('workFromHomeSearch', JSON.stringify(workFromHomeSearch));
  }

  getPersistedFilter() {
    const workFromHomeSearch = JSON.parse(sessionStorage.getItem('workFromHomeSearch'));
    if (workFromHomeSearch !== null) {
      if (workFromHomeSearch.periodFrom != null) {
        this.fromDate = workFromHomeSearch.periodFrom;
      }
      if (workFromHomeSearch.periodTo != null) {
        this.toDate = workFromHomeSearch.periodTo;
      }
      this.onlyMySubordinates = workFromHomeSearch.mines;
      this.resourceName = workFromHomeSearch.resourceName;
      this.selectedStatusesIdentifiers = workFromHomeSearch.selectedStatusesIdentifiers;
      this.selectedActivitiesIdentifiers = workFromHomeSearch.selectedActivitiesIdentifiers;
    } else {
      const date = new Date();
      this.fromDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      this.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
  }

  getWorkFromHomeRequests() {
    this.isLoading = true;
    let userId: number;
    if ( this.onlyMySubordinates === false) {
      userId = 214; // User Id Top Hierarchy (MFR)
    } else {
      userId = this.currentUser.id;
    }
    // if (this.isSuperAdmin() && this.onlyMySubordinates === false) {
    //   userId = 214; // User Id Top Hierarchy (MFR)
    // } else {
    //   userId = this.currentUser.id;
    // }
    this.selectedActivitiesIds = this.selectedActivitiesIdentifiers.map(activity => activity.id).join(',');
    this.selectedStatusesIds = this.selectedStatusesIdentifiers.map(state => state.id).join(',');
    this.workFromHomeService.getWorkFromHomeRequests(userId, this.fromDate, this.toDate, this.resourceName, this.selectedActivitiesIds,
      this.selectedStatusesIds).subscribe(
        data => {
          if (!(data === null || data === undefined)) {
            this.workFromHomeRequests = data;
            this.lengthWorkFromHomeRequests = this.workFromHomeRequests.length;
            if (data.length !== 0) {
              this.listView = true;
            } else {
              this.listView = false;
            }
          }
          this.isLoading = false;
        }
      );
  }

  exportToExcel() {
    if (this.workFromHomeRequests !== undefined && this.workFromHomeRequests.length !== 0) {
      const header: any[] = [
        { header: 'Matricule', key: 'userNumber', width: 10 },
        { header: 'Resource', key: 'userFullName', width: 30 },
        { header: 'Activity', key: 'activityName', width: 10 },
        { header: 'Start Date', key: 'startDate', width: 15 },
        { header: 'End Date', key: 'endDate', width: 15 },
        { header: 'Days', key: 'dayNumber', width: 15 },
        { header: 'Day Time', key: 'halfDay', width: 15 },
        { header: 'Status', key: 'state', width: 15 }
      ];

      const rows = [];
      const merges: string[] = [];
      const styles = [];

      styles.push(
        { cell: 'A1', font: { bold: true } },
        { cell: 'B1', font: { bold: true } },
        { cell: 'C1', font: { bold: true } },
        { cell: 'D1', font: { bold: true } },
        { cell: 'E1', font: { bold: true } },
        { cell: 'F1', font: { bold: true } },
        { cell: 'G1', font: { bold: true } },
        { cell: 'H1', font: { bold: true } }
      );

      this.workFromHomeRequests.forEach(workFromHomeRequest => {
        const row = [];
        row.push(workFromHomeRequest.userNumber);
        row.push(workFromHomeRequest.userFullName);
        row.push(workFromHomeRequest.activityName);
        row.push(this.getShortFormatWithDay(workFromHomeRequest.startDate));
        row.push(this.getShortFormatWithDay(workFromHomeRequest.endDate));
        row.push(workFromHomeRequest.dayNumber);
        row.push(workFromHomeRequest.halfDay);
        row.push(this.getworkFromHomeLabel(workFromHomeRequest.state));
        rows.push(row);
      });

      this.excelService.generateExcel(header, rows, merges, styles, 'Work_From_Home_Requests');
    }
  }

  getShortFormatWithDay(date: Date): string {
    if (this.dateTimeService.isNullDate(date)) {
      return '';
    } else {
      const d = moment(date).locale('ang');
      return d.format('ddd') + ' ' + d.format('L');
    }
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
}


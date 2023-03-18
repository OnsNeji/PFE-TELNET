import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs/index';
import { takeUntil } from 'rxjs/operators';
import { Reference, ReferenceSearch } from 'app/models/project-management/project';
import { Identifier } from 'app/models/shared';
import { ReferenceService } from 'app/services/project-management/project';
import { NotificationService, SearchFilterService, DateTimeService, SortService } from 'app/services/shared';
import { PaginatorPipe } from 'app/pipes/shared';


@Component({
  selector: 'app-references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReferencesComponent implements OnInit, OnDestroy {
  paginatorPipe = new PaginatorPipe(this.searchFilterService);
  statusesIdentifiers: Identifier[] = [];
  selectedStatusesIdentifiers: Identifier[] = [];
  selectedStatusesIds: string;
  typesIdentifiers: Identifier[] = [];
  selectedTypesIdentifiers: Identifier[] = [];
  activitiesIdentifiers: Identifier[] = [];
  selectedActivitiesIds: string;
  selectedActivitiesIdentifiers: Identifier[] = [];
  selectedTypesIds: string;
  referenceCode = '';
  title = '';
  dropdownSettings = {};
  dropdownStatusSettings = {};
  lengthReferences: number;
  references: Reference[] = [];
  listView = false;
  periodFrom: Date;
  periodTo: Date;
  subscription: Subscription;
  refreshSubscription: Subscription;
  isLoading: boolean;
  destroyed = new Subject();
  constructor(
    private notificationService: NotificationService,
    private dateTimeService: DateTimeService,
    public sortService: SortService,
    public referenceService: ReferenceService,
    private router: Router,
    public searchFilterService: SearchFilterService) { }

  ngOnInit() {
    this.getStatuses();
    this.getTypes();
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
    this.dropdownStatusSettings = {
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
    this.subscription = this.referenceService.sortReferences.subscribe(
      (event) => {
        this.onSortData(event);
      }
    );
    this.periodTo = this.dateTimeService.today();
    this.periodFrom = this.dateTimeService.getFirstDayFromPreviousMonth();

    const referenceSearch = JSON.parse(sessionStorage.getItem('referenceSearch'));
    if (referenceSearch !== null) {
      this.title = referenceSearch.title;
      this.referenceCode = referenceSearch.referenceCode;
      this.selectedStatusesIdentifiers = referenceSearch.selectedStatusesIdentifiers;
      this.selectedStatusesIds = this.selectedStatusesIdentifiers.map(state => state.id).join(',');
      this.selectedTypesIdentifiers = referenceSearch.selectedTypesIdentifiers;
      this.selectedTypesIds = this.selectedTypesIdentifiers.map(customer => customer.id).join(',');
      this.selectedActivitiesIdentifiers = referenceSearch.selectedActivitiesIdentifiers;
      this.selectedActivitiesIds = this.selectedActivitiesIdentifiers.map(activity => activity.id).join(',');
      if (referenceSearch.periodFrom != null) {
        this.periodFrom = referenceSearch.periodFrom;
      }
      if (referenceSearch.periodTo != null) {
        this.periodTo = referenceSearch.periodTo;
      }
    }
    this.refreshSubscription = this.referenceService.savedReference.pipe(takeUntil(this.destroyed)).subscribe(
      data => {
        if (data && data.getPrevious === true) {
          this.searchButton();
          this.searchFilterService.pageSize = data.pageSize;
          this.searchFilterService.pageIndex = data.pageIndex;
          this.destroyed.next();
          this.referenceService.savedReference.next();
        }
      }
    );

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.refreshSubscription.unsubscribe();
    this.searchFilterService.showingDataLastFilter = [];
  }

  onResetAllFilters() {
    this.onResetTitle();
    this.onResetReference();
    this.onResetStatus();
    this.onResetType();
    this.onResetStartDateRange();
    this.onResetEndDateRange();
    this.onResetActivity();
  }

  getStatuses() {
    this.referenceService.getDocumentStates()
      .subscribe(
        data => {
          if (data != null) {
            this.statusesIdentifiers = data;
            if ((this.selectedStatusesIds !== null && this.selectedStatusesIds !== undefined)) {
              this.selectedStatusesIds = this.statusesIdentifiers.map(status => status.id).join(',');
            }
          }
        },
      );
  }

  getTypes() {
    this.referenceService.getTypesDocuments()
      .subscribe(
        data => {
          if (data != null) {
            this.typesIdentifiers = data;
            if (!(this.selectedTypesIds === null || this.selectedTypesIds === undefined)) {
              this.selectedTypesIds = this.typesIdentifiers.map(status => status.id).join(',');
            }
          }
        },
      );
  }

  onResetTitle() {
    this.title = undefined;
  }

  onResetActivity() {
    const selectedActivities: Identifier[] = [];
    selectedActivities.push(this.activitiesIdentifiers.find(activity => activity.id === JSON.parse(
      localStorage.getItem('currentUser')).activityId));
    this.selectedActivitiesIdentifiers = selectedActivities;
    sessionStorage.removeItem('referenceSearch');
  }

  onResetReference() {
    this.referenceCode = undefined;
  }

  onResetStatus() {
    this.selectedStatusesIdentifiers = [];
  }

  onResetType() {
    this.selectedTypesIdentifiers = [];
  }

  onResetStartDateRange() {
    this.periodFrom = this.dateTimeService.getFirstDayFromPreviousMonth();
  }

  onResetEndDateRange() {
    this.periodTo = this.dateTimeService.today();
  }

  searchButton() {
    if (this.periodFrom !== null && this.periodTo !== null) {
      this.searchFilterService.pageIndex = 0;
      this.selectedStatusesIds = this.selectedStatusesIdentifiers.map(state => state.id).join(',');
      this.selectedTypesIds = this.selectedTypesIdentifiers.map(type => type.id).join(',');
      this.selectedActivitiesIds = this.selectedActivitiesIdentifiers.map(activity => activity.id).join(',');

      const referenceSearch = new ReferenceSearch();
      referenceSearch.title = this.title;
      referenceSearch.referenceCode = this.referenceCode;
      referenceSearch.selectedStatusesIdentifiers = this.selectedStatusesIdentifiers;
      referenceSearch.selectedTypesIdentifiers = this.selectedTypesIdentifiers;
      referenceSearch.selectedActivitiesIdentifiers = this.selectedActivitiesIdentifiers;
      referenceSearch.periodFrom = this.periodFrom;
      referenceSearch.periodTo = this.periodTo;
      sessionStorage.setItem('referenceSearch', JSON.stringify(referenceSearch));

      this.isLoading = true;
      this.referenceService.getReferencesProjects(this.title, this.referenceCode,
        this.selectedStatusesIds, this.selectedTypesIds, this.selectedActivitiesIds,
        this.periodFrom, this.periodTo).subscribe(
          data => {
            this.isLoading = false;
            this.references = data;
            this.lengthReferences = this.references.length;
            if (data.length !== 0) {
              this.listView = true;
            } else {
              this.listView = false;
            }
          });
    } else {
      this.notificationService.danger('Please fill dates fields');
    }
  }

  onClickingEnter(event) {
    if (event.key === 'Enter') {
      this.searchButton();
    }
  }

  dateOnly(event): boolean {
    return this.dateTimeService.dateOnly(event);
  }

  onSortData(sort: MatSort) {
    if (sort.active && sort.direction !== '') {
      if (this.references !== undefined) {
        this.references.sort((a: Reference, b: Reference) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'referenceCode':
              return this.sortService.compare(a.referenceCode, b.referenceCode, isAsc, false);
            case 'title':
              return this.sortService.compare(a.title, b.title, isAsc, false);
            case 'edition':
              return this.sortService.compare(a.edition, b.edition, isAsc, true);
            case 'creationDate':
              return this.sortService.compare(a.creationDate, b.creationDate, isAsc, false);
            case 'state':
              return this.sortService.compare(a.state, b.state, isAsc, false);
            case 'type':
              return this.sortService.compare(a.type, b.type, isAsc, false);
            default:
              return 0;
          }
        });
      }
    }
    this.paginatorPipe.transform(this.references, this.searchFilterService.pageIndex, this.searchFilterService.pageSize);
  }

  AddReference() {
    this.router.navigate(['/project-management/project/add-reference']);
    if (this.lengthReferences !== undefined && this.lengthReferences !== 0) {
      this.referenceService.savedReference.next({
        'getPrevious': false, 'pageIndex': this.searchFilterService.pageIndex,
        'pageSize': this.searchFilterService.pageSize
      });
    }
  }
}

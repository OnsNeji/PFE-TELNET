import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, ReplaySubject, Subscription } from 'rxjs/index';
import { takeUntil } from 'rxjs/operators';
import { Reference } from 'app/models/project-management/project';
import { Identifier, User } from 'app/models/shared';
import { ReferenceService } from 'app/services/project-management/project';
import { NotificationService, DateTimeService } from 'app/services/shared';

@Component({
  selector: 'app-edit-reference',
  templateUrl: './edit-reference.component.html',
  styleUrls: ['./edit-reference.component.scss']
})
export class EditReferenceComponent implements OnInit, OnDestroy {
  activitiesIdentifiers: Identifier[];
  documentTypesIdentifiers: Identifier[];
  documentStatesIdentifiers: Identifier[];
  documentConfidentialitiesIdentifiers: any[];
  projectsAbrreviation: any[];
  projectAbrreviation: string;
  confidentialityCode: string;
  currentUser: User;
  reference = new Reference();
  disableGenerator = true;
  subscription: Subscription = new Subscription();
  isSameActivity = true;

  constructor(
    private notificationService: NotificationService,
    private referenceService: ReferenceService,
    private _avRoute: ActivatedRoute,
    private router: Router,
    private dateTimeService: DateTimeService

  ) { }

  public filteredDocumentTypes: ReplaySubject<Identifier[]> = new ReplaySubject<Identifier[]>(1);
  public documentTypeFilterCtrl: FormControl = new FormControl();
  public filteredAbbreviations: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public abbrivationFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();
  previousState = {
    getPrevious: false,
    pageIndex: null,
    pageSize: null,
  };
  @ViewChild('referenceForm', {static: true}) referenceForm: NgForm;
  ngOnInit() {
    if (this.reference.referenceId !== 0) {
      this.isSameActivity = this.reference.activityId === JSON.parse(localStorage.getItem('currentUser')).activityId;
    } else {
      this.disableGenerator = false;
    }
    this._avRoute.params.subscribe(param => {
      if (param.referenceId !== undefined && param.referenceId !== null) {
        this.getReferenceProject(+param.referenceId);
      }
    });
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.reference.creationDate = this.dateTimeService.today();
    this.getDocumentTypes();
    this.getStates();
    this.getConfidentialities();
    this.abbrivationFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAbbreviations();
      });
    this.documentTypeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDocumentTypes();
      });
    this.subscription.add(this.referenceService.savedReference.subscribe(
      (data) => {
        if (data) {
          this.previousState = data;
        }
      }
    ));
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  getDocumentTypes() {
    this.referenceService.getTypesDocuments()
      .subscribe(
        data => {
          if (data != null) {
            this.documentTypesIdentifiers = data;
            this.filteredDocumentTypes.next(this.documentTypesIdentifiers.slice());
          }
        },
      );
  }
  getStates() {
    this.referenceService.getDocumentStates()
      .subscribe(
        data => {
          if (data != null) {
            this.documentStatesIdentifiers = data;
          }
        },
      );
  }
  getConfidentialities() {
    this.referenceService.GetDocumentConfidentialities()
      .subscribe(
        data => {
          if (data != null) {
            this.documentConfidentialitiesIdentifiers = data;
          }
        },
      );
  }
  getProjectAbbreviationByActivity(activityId: number) {
    this.referenceService.getActivityAbbriviations(activityId)
      .subscribe(
        data => {
          if (data != null) {
            this.projectsAbrreviation = data;
            this.filteredAbbreviations.next(this.projectsAbrreviation.slice());
          }
        },
      );
  }
  getReferenceProject(referenceId: number) {
    this.disableGenerator = true;
    this.referenceService.getReferenceProject(referenceId).subscribe(
      data => {
        this.reference = Object.assign(new Reference, data[0]);
        this.isSameActivity = this.reference.activityId === JSON.parse(localStorage.getItem('currentUser')).activityId;
        const splittedReferenceParts = this.getReferenceParts(this.reference.referenceCode);
        this.projectAbrreviation = splittedReferenceParts[2];
        this.confidentialityCode = splittedReferenceParts[4].split(' ')[1];
      }
    );
  }
  onActivtyChange(activityId: number) {
    this.getProjectAbbreviationByActivity(activityId);
  }

  buildReferenceToSave(activityCode: string): Reference {
    const referenceToSave = new Reference();
    referenceToSave.referenceId = this.reference.referenceId;
    referenceToSave.referenceCode = this.reference.referenceCode;
    referenceToSave.title = this.reference.title;
    referenceToSave.edition = this.reference.edition;
    referenceToSave.creationDate = this.reference.creationDate;
    referenceToSave.stateId = this.reference.stateId;
    referenceToSave.note = this.reference.note;
    referenceToSave.archiving = this.reference.archiving;
    referenceToSave.userId = this.reference.userId;
    referenceToSave.activityId = this.reference.activityId;
    referenceToSave.typeId = this.reference.typeId;

    if (this.reference.referenceId === 0) {
      // if new reference build new reference code
      const typeAbbreviation = this.documentTypesIdentifiers.filter(document =>
        document.id === this.reference.typeId)[0].description.split('/')[0];
      const creationYear = new Date(this.reference.creationDate).getFullYear().toString().substring(2);
      // expression ***** will be replaced by incremented counter in the stored procedure
      referenceToSave.referenceCode = typeAbbreviation + '.' + activityCode + '.' +
        this.projectAbrreviation.toUpperCase() + '.*****.' + creationYear + ' ' + this.confidentialityCode;
    }
    return referenceToSave;
  }

  getLabelSubmit(): string {
    return this.disableGenerator ? 'Save' : 'Generate & Save';
  }

  saveReference() {
    if (this.referenceForm.valid) {
      this.referenceService.getActivityCode(this.reference.activityId).subscribe(data => {
        const activityCode = (data.length !== 0) ? data[0].activityCode : 'TXA';
        this.reference.userId = +this.currentUser.id;
        this.reference.edition = +this.reference.edition.toString().replace(',', '.');
        const referenceToSave = this.buildReferenceToSave(activityCode);
        this.referenceService.saveReferenceGenerator(referenceToSave).subscribe(
          (referenceId) => {
            this.notificationService.success('Reference saved successfully');
            if (this.reference.referenceId === 0) {
              this.getReferenceProject(+referenceId);
            } else {
              this.close();
            }
          });
      });
    } else {
      this.notificationService.danger('Please fill all required fields');
    }
  }

  close() {
    if (this.previousState.pageIndex != null) {
      this.previousState.getPrevious = true;
      this.referenceService.savedReference.next(this.previousState);
    }
    this.router.navigate(['/project-management/project/references']);
  }

  private filterAbbreviations() {
    if (!this.projectsAbrreviation) {
      return;
    }
    let search = this.abbrivationFilterCtrl.value;
    if (!search) {
      this.filteredAbbreviations.next(this.projectsAbrreviation.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAbbreviations.next(
      this.projectsAbrreviation.filter(abbriviation => abbriviation.value.toLowerCase().indexOf(search) > -1)
    );
  }
  private filterDocumentTypes() {
    if (!this.documentTypesIdentifiers) {
      return;
    }
    let search = this.documentTypeFilterCtrl.value;
    if (!search) {
      this.filteredDocumentTypes.next(this.documentTypesIdentifiers.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredDocumentTypes.next(
      this.documentTypesIdentifiers.filter(documentType => documentType.description.toLowerCase().indexOf(search) > -1)
    );
  }
  private getReferenceParts(reference: string): string[] {
    const referenceElements = reference.split('.');
    const referenceElementsNumber = referenceElements.length;
    let referenceParts: string[] = [];
    if (referenceElementsNumber > 5) {
      let position = 1;
      let part = '';
      referenceElements.forEach(element => {
        if (part === '') {
          part += element;
        } else {
          part += '.' + element;
        }
        if (position < 3 || position >= referenceElementsNumber - 2) {
          referenceParts.push(part);
          part = '';
        }
        position++;
      });
    } else {
      referenceParts = referenceElements;
    }
    return referenceParts;
  }
}

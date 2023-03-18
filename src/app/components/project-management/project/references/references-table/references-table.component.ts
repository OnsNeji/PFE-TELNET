import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/index';
import { Reference } from 'app/models/project-management/project';
import { ReferenceService } from 'app/services/project-management/project';
import { SearchFilterService } from 'app/services/shared';

@Component({
  selector: 'app-references-table',
  templateUrl: './references-table.component.html',
  styleUrls: ['./references-table.component.scss']
})
export class ReferencesTableComponent implements OnInit, OnDestroy {
  @Input() references: Reference[];
  displayedColumns = ['referenceCode', 'title', 'edition', 'creationDate',
    'state', 'type', 'buttons'];
  dataSource = new MatTableDataSource();
  listView = false;
  subscription: Subscription;
  constructor(private searchFilterService: SearchFilterService,
    public referenceService: ReferenceService,
    private router: Router, private route: ActivatedRoute
  ) { }

  ngOnInit() {
    if (this.references.length !== 0) {
      this.listView = true;
    }
    this.dataSource = new MatTableDataSource(this.references);
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
    this.referenceService.sortReferences.next(sort);
  }

  navigateToEdit(reference: Reference) {
    this.router.navigate(['/project-management/project/edit-reference/' + reference.referenceId.toString()]);
    this.referenceService.savedReference.next({
      'getPrevious': false, 'pageIndex': this.searchFilterService.pageIndex,
      'pageSize': this.searchFilterService.pageSize
    });
  }

  isEditable(reference: Reference) {
    return reference.activityId === JSON.parse(localStorage.getItem('currentUser')).activityId;
  }
}

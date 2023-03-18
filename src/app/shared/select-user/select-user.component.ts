import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Subject, ReplaySubject } from 'rxjs/index';
import { take, takeUntil } from 'rxjs/operators';
import { User, Identifier, Activities } from 'app/models/shared';
import { CoreDataService } from 'app/services/shared';

@Component({
  selector: 'app-select-employee',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.scss']
})
export class SelectUserComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('userSelect', { static: true }) userSelect: MatSelect;
  public userFilterCtrl: FormControl = new FormControl();
  public filteredUsersIdentifiers: ReplaySubject<Identifier[]> = new ReplaySubject<Identifier[]>(1);
  private _onDestroy = new Subject<void>();
  public currentUser: User;
  public currentUserExit: boolean;
  usersIdentifiers: Identifier[];
  @Output() userChange = new EventEmitter<Identifier>();
  selectedUserIdentifier: Identifier;
  mine = true;
  constructor(
    private coreDataService: CoreDataService
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.selectedUserIdentifier = new Identifier();
    this.selectedUserIdentifier.id = +this.currentUser.id;
    this.selectedUserIdentifier.description = this.currentUser.nom + ' ' +
      this.currentUser.prenom + ' (' + this.currentUser.tel + ')';

    // if (this.currentUser.activityId === Activities.Administration) {
    //   this.getActiveUsers();
    // } else {
    //   this.getReporters();
    // }

    this.userFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUsers();
      });
  }

  getActiveUsers() {
    this.coreDataService.getActiveUsers().subscribe(
      data => {
        if (data != null) {
          this.usersIdentifiers = data;
          if (this.usersIdentifiers && this.usersIdentifiers.length > 0) {
            this.currentUserExit = this.usersIdentifiers.find(identifier => identifier.id === this.currentUser.id) !== undefined;
            this.selectedUserIdentifier = this.usersIdentifiers.find(identifier => identifier.id === this.currentUser.id);
          }
          this.filteredUsersIdentifiers.next(this.usersIdentifiers.slice());
        }
      },
    );
  }

  getReporters() {
    const currentUser = Object.assign(new User, JSON.parse(localStorage.getItem('currentUser')));
    this.coreDataService.getReporters(currentUser.userId)
      .subscribe(
        data => {
          this.usersIdentifiers = data;
          this.usersIdentifiers.unshift(this.selectedUserIdentifier);
          this.usersIdentifiers.sort((a, b) => a.description.localeCompare(b.description));
          if (this.usersIdentifiers && this.usersIdentifiers.length > 0) {
            this.currentUserExit = this.usersIdentifiers.find(identifier => identifier.id === this.currentUser.id) !== undefined;
          }
          this.filteredUsersIdentifiers.next(this.usersIdentifiers.slice());
        }
      );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  private setInitialValue() {
    this.filteredUsersIdentifiers
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.userSelect.compareWith = (a: Identifier, b: Identifier) => (a && b && a.id === b.id);
      });
  }

  private filterUsers() {
    if (!this.usersIdentifiers) {
      return;
    }
    let search = this.userFilterCtrl.value;
    if (!search) {
      this.filteredUsersIdentifiers.next(this.usersIdentifiers.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredUsersIdentifiers.next(
      this.usersIdentifiers.filter(user => user.description.toLowerCase().indexOf(search) > -1)
    );
  }

  onUserSelectEvent() {
    this.userChange.emit(this.selectedUserIdentifier);
  }

  getPreviousUser() {
    if (this.usersIdentifiers !== undefined) {
      const currentIndex = this.usersIdentifiers.indexOf(this.selectedUserIdentifier);
      const newIndex = currentIndex === 0 ? this.usersIdentifiers.length - 1 : currentIndex - 1;
      this.selectedUserIdentifier = this.usersIdentifiers[newIndex];
      this.userChange.emit(this.selectedUserIdentifier);
    }
  }

  getUsers() {
    this.mine = true;
    this.selectedUserIdentifier = this.usersIdentifiers.find(identifier => identifier.id === this.currentUser.id);
    this.userChange.emit(this.selectedUserIdentifier);
    // if (this.currentUser.activityId === Activities.Administration) {
    //   this.getActiveUsers();
    // } else {
    //   this.getReporters();
    // }
  }

  getNextUser() {
    if (this.usersIdentifiers !== undefined) {
      const currentIndex = this.usersIdentifiers.indexOf(this.selectedUserIdentifier);
      const newIndex = currentIndex === this.usersIdentifiers.length - 1 ? 0 : currentIndex + 1;
      this.selectedUserIdentifier = this.usersIdentifiers[newIndex];
      this.userChange.emit(this.selectedUserIdentifier);
    }
  }

  isCurrentUser() {
    return (this.currentUserExit && this.currentUser.id !== this.selectedUserIdentifier.id);
  }
}

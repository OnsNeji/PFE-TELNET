import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployéMois } from 'app/models/shared/employeMois.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { DateTimeService, NotificationService } from 'app/services/shared';
import { EmployeMoisService } from 'app/services/shared/employe-mois.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import swal from 'sweetalert2';
import { DialogDescComponent } from './dialog-desc/dialog-desc.component';
import { DialogEmployeMoisComponent } from './dialog-employe-mois/dialog-employe-mois.component';

@Component({
  selector: 'app-employe-mois',
  templateUrl: './employe-mois.component.html',
  styleUrls: ['./employe-mois.component.scss']
})
export class EmployeMoisComponent implements OnInit {

  constructor(private service: EmployeMoisService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog, private notificationService: NotificationService, private dateTimeService: DateTimeService,){}

  ListeEmployes!: EmployéMois[];
  employeMois: EmployéMois = new EmployéMois();
  utilisateurs! : Utilisateur[];
  displayedColumns: string[] = ['image', 'utilisateurId', 'description', 'date', 'userAjout', 'action'];
  dataSource!: MatTableDataSource<EmployéMois>;
  lengthEmployes: number;
  isLoading: boolean;
  date= new Date();
  description='';
  utilisateurId=0;
  selectedUser: Utilisateur;
  public userFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getEmployesMois();
    this.getUsers();
    this.onResetAllFilters();

    this.userFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterUsers();
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogEmployeMoisComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === "ajouter"){
        this.getEmployesMois();
      }
    });
  }

  filterUsers() {
    let search = this.userFilterCtrl.value;
    if (!search) {
      this.utilisateurs = this.utilisateurs.slice();
      return;
    } else {
      search = search.toLowerCase();
    }
    this.utilisateurs = this.utilisateurs.filter(user => 
      user.nom.toLowerCase().indexOf(search) > -1 || user.prenom.toLowerCase().indexOf(search) > -1);
  }

  getEmployesMois(){
    this.service.GetEmployesMois().subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{

      }
    })
  }

  deleteEmployeMois(id: number): void {
    swal.fire({
      text: `Are you sure to delete this Employee ?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.service.DeleteEmployeMois(id)
          .subscribe(()=>
            {
              this.getEmployesMois();
              this.notificationService.success('Employé du Mois deleted successfully');
              window.location.reload();
            },
            () => {
              this.notificationService.danger('Delete Employé du Mois failed');
            }
          );
      }
    });
  }

  onSortData(sort) {
    this.service.userRequest.next(sort);
  }

  getUsers(): void {
    this.service.GetUtilisateurs().subscribe(users => {
      this.utilisateurs = users;
    });
  }

  getUserNom(id: number): string {
    const user = this.utilisateurs.find(s => s.id === id);
    return user ? (user.nom + ' ' + user.prenom) : '';
  }

  openDescriptionDialog(employeMois: any): void {
    const dialogRef = this.dialog.open(DialogDescComponent, {
      width: '500px',
      data: { description: employeMois.description },
    });
  }

  updateEmployeMois(row: any) {
    this.dialog.open(DialogEmployeMoisComponent, {
      data: row,
    }).afterClosed().subscribe(result=>{
      if(result === "modifier"){
        this.getEmployesMois();
      }
    })
    }

    dateOnly(event): boolean {
      return this.dateTimeService.dateOnly(event);
    }

    onClickingEnter(event) {
      if (event.key === 'Enter') {
        this.onSearchClick();
      }
    }

    onSearchClick() {
      const filterDate = document.getElementById('date') as HTMLInputElement;

      const filterDateValue = filterDate.value.trim().toLowerCase();
      const filterUserValue = this.selectedUser ? (this.selectedUser.nom + ' ' + this.selectedUser.prenom).toLowerCase() : '';
  
      if (filterUserValue !== '') {
        this.dataSource.filterPredicate = (data: EmployéMois, filter: string) =>
          this.getUserNom(data.utilisateurId).toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        this.dataSource.filter = filterUserValue;
      }else if (filterDateValue !== '') {
        this.dataSource.filterPredicate = (data: EmployéMois, filter: string) => {
          const formattedDate = new Date(data.date).toLocaleDateString(); // format the date as a string
          return formattedDate.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        };
      this.dataSource.filter = filterDateValue;
      }
    }

    onResetAllFilters() {
      this.employeMois.date = null; 
      this.selectedUser = null; 
      this.getEmployesMois();
      this.onSearchClick(); // lancement d'une nouvelle recherche
    }
  
}
